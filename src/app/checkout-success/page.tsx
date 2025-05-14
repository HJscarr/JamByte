'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useEducationalAid } from '@/hooks/useEducationalAid';

export default function CheckoutSuccess() {
    const { progress, coursesUntilNextGift, loading, error } = useEducationalAid();

    return (
        <div className="success-page-content">
            <div className="flex flex-col items-center px-6 py-6 bg-grey-900 text-center max-w-2xl mx-auto">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mt-12" />
                <h1 className="mt-4 text-2xl font-semibold text-white">Checkout Successful!</h1>

                <p className="mt-8 text-lg text-white">
                    Thank you for your purchase. A confirmation email has been sent to your email address.
                </p>
                <p className="mt-8 text-lg text-white">
                    You can now view the premium course content and you will receive shipping email once your box of electronics is on its way.
                </p>
                <p className="mt-8 text-lg text-white">
                    Note: If you completed checkout as a guest, please check your email to complete your sign-up process!
                </p>

                <h2 className="text-base mt-36 font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">Educational Aid</h2>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    Courses that bring everyone up to speed
                </p>
                <p className="mt-6 text-md sm:text-lg leading-8 text-gray-200">
                    For every 100 courses sold, one will be gifted to an upskilling charity. Thank you for your support!
                </p>
                {/* Progress Bar Section */}
                <div className="mt-12 w-full max-w-md">
                    <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden group">
                        <div 
                            className="absolute h-full bg-gradient-to-r from-secondary to-red-400 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                        <div className="absolute inset-0 transform translate-x-full group-hover:-translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-shine" />
                    </div>
                    <p className="mt-4 text-md sm:text-lg text-gray-200">
                        {loading ? (
                            'Loading...'
                        ) : error ? (
                            'Unable to load progress'
                        ) : (
                            `${coursesUntilNextGift} courses away from the next gift 🎁`
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}