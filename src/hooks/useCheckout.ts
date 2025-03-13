import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import getStripe from './useStripe';

interface CheckoutConfig {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
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

      const config: any = {
        lineItems: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        successUrl,
        cancelUrl,
      };

      if (user?.profile?.email) {
        config.customerEmail = user.profile.email;
      }

      const response = await fetch('https://6hustu0f4i.execute-api.eu-west-1.amazonaws.com/prod', {
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

      const session = await response.json();
      localStorage.setItem('checkoutSuccess', 'true');
      
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
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