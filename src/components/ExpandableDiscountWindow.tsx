import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ExpandableWindow: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, setModalState } = useUser();

    const toggleWindow = () => {
        setIsOpen(!isOpen);
    };

    const handleTryNowClick = () => {
        if (!user) {
            setModalState(prev => ({ ...prev, showLoginModal: !prev.showLoginModal }));
        }
        setIsOpen(false);
    };

    const buttonClass = "flex items-center justify-center flex-none text-sm font-semibold text-white shadow-sm bg-gradient-to-r px-6 py-3 rounded mr-4 from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"

    return (
        <div className="fixed bottom-4 right-4">
            {!isOpen && (
                <button
                    className={buttonClass}
                    onClick={toggleWindow}
                >
                    Get Discount! 🎁
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 max-h-96 mt-2 rounded shadow-lg overflow-hidden">
                    <div className="bg-secondary text-white p-4 flex justify-between items-center">
                        <h2 className="text-lg">JamByte</h2>
                        <button onClick={toggleWindow} className="text-white text-2xl">
                            &#x2212;
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <p className="mb-4">
                            Sign up with us to get a <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">£20 off discount</span> on your first order!
                        </p>
                        <button
                            className={buttonClass}
                            onClick={handleTryNowClick}
                        >
                            Try Now!
                            <span className="ml-1 h-5 w-5 flex-shrink-0">
                                <UserCircleIcon className="text-white" />
                            </span>
                        </button>
                        {/* If an user is already signed in */}
                        {user && <span className="ml-2 text-sm text-gray-600">Check your email inbox for <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">promo code</span>!</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpandableWindow;
