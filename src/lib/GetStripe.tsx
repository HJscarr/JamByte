import { loadStripe, Stripe } from '@stripe/stripe-js';

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

export default getStripe;