import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { captureEvent } from '@/lib/posthog';

let stripePromise: Promise<Stripe | null>;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const apiKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (typeof apiKey !== 'string') {
      throw new Error("Stripe API key is not correctly configured");
    }

    stripePromise = loadStripe(apiKey);
  }
  return stripePromise;
};

interface CheckoutConfig {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface CheckoutResponse {
  sessionId?: string;
  error?: string;
}

export const useCheckout = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async ({ priceId, successUrl, cancelUrl }: CheckoutConfig) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Track checkout initiation
      captureEvent('checkout_initiated', {
        priceId,
        userId: user?.profile?.sub,
        course: priceId.includes('rover') ? 'Rover' : 
               priceId.includes('lens') ? 'Lens' : 
               priceId.includes('link') ? 'Link' : 'Unknown'
      });

      const config = {
        lineItems: [
          {
            price: priceId
          }
        ],
        successUrl,
        cancelUrl,
        // Include user information if available
        email: user?.profile?.email,
        firstName: user?.profile?.given_name,
        lastName: user?.profile?.family_name,
        phone: user?.profile?.phone
      };

      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CheckoutResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.sessionId) {
        throw new Error('No session ID received from server');
      }

      localStorage.setItem('checkoutSuccess', 'true');
      
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error during checkout';
      setError(errorMessage);
      console.error('Error during checkout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCheckout, isLoading, error };
}; 