import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function CheckoutSuccess() {
    return (
        <div className="success-page-content">
            <div className="flex flex-col items-center px-6 py-6 bg-grey-900 text-center max-w-2xl mx-auto">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
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
            </div>
        </div>
    );
}