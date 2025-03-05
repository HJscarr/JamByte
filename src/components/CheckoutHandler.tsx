'use client'

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import getStripe from '@/hooks/useStripe';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface CheckoutHandlerProps {
    priceID: string;
    successUrl: string;
    cancelUrl: string;
}

const CheckoutHandler: React.FC<CheckoutHandlerProps> = ({ priceID, successUrl, cancelUrl }) => {
    const { user } = useAuth();

    const handleCheckout = async () => {
        const stripe = await getStripe();

        if (!stripe) {
            console.error('Stripe failed to load');
            return;
        }

        const config: any = {
            lineItems: [
                {
                    price: priceID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            successUrl: successUrl,
            cancelUrl: cancelUrl,
        };

        if (user?.profile?.email) {
            config.customerEmail = user.profile.email;
        }

        try {
            const response = await fetch('https://6hustu0f4i.execute-api.eu-west-1.amazonaws.com/prod', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
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
                console.warn(result.error.message);
            } else {
                console.log('Checkout successful!')
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-4 sm:px-5 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-15"
        >
            Buy Now
            <span className="ml-1 h-5 w-5 flex-shrink-0">
                <ShoppingCartIcon className="text-white" />
            </span>
        </button>
    );
};

export default CheckoutHandler;