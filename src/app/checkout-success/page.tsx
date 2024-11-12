'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function CheckoutSuccess() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Simulatin§    dvasvg a delay to check for a condition or fetch data
        const timer = setTimeout(() => {
            const success = localStorage.getItem('checkoutSuccess') === 'true';
            if (success) {
                setShowSuccess(true);
                localStorage.removeItem('checkoutSuccess'); // Clear immediately after confirming
            } else {
                router.push('/'); // Redirect if not successful
            }
        }, 500); // Adjust delay as needed

        return () => clearTimeout(timer); // Cleanup timeout
    }, [router]);

    const handleGoHome = () => {
        router.push('/'); // Navigate to the home page
    };

    if (!showSuccess) {
        return null; // or a loader, whatever suits your UX
    }

    return (
        <div className="success-page-content">
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-grey-900 text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
                <h1 className="mt-2 text-2xl font-semibold text-white">Checkout Successful!</h1>
                <p className="mt-1 text-lg text-white">
                    Thank you for your purchase. A confirmation email has been sent to your email address.
                </p>
                <p className="mt-1 text-lg text-white">
                    You can now view the premium content and you will receive shipping email once your box of electronics is on its way.
                </p>
                <p className="mt-6 text-lg text-white">
                    Note: If you completed checkout as a guest, please check your email to complete your sign-up process!
                </p>
                <button
                    onClick={handleGoHome}
                    className="flex mt-6 items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-4 sm:px-5 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-15"
                >
                    Go to Home Page
                </button>                
            </div>
        </div>
    );
}