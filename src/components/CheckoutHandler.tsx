'use client'

import React from 'react';
import getStripe from '@/lib/GetStripe';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useUser } from '@/context/UserContext';

interface CheckoutHandlerProps {
    priceID: string;
    successUrl: string;
    cancelUrl: string;
}

const CheckoutHandler: React.FC<CheckoutHandlerProps> = ({ priceID, successUrl, cancelUrl }) => {
    const { user } = useUser();

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

        if (user && user.attributes && user.attributes.email) {
            config.customerEmail = user.attributes.email;
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
            type="button"
            onClick={handleCheckout}
            className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 sm:px-10 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Buy&nbsp;now
            <ShoppingCartIcon className="ml-2 h-5 w-5 text-white" />
        </button>
    );
};

export default CheckoutHandler;