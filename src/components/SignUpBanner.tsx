'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon } from '@heroicons/react/20/solid';

const SignUpBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { user, modalState, setModalState } = useAuth();

    useEffect(() => {
        setIsMounted(true);
        setIsVisible(true);
    }, []);

    const handleRegisterClick = () => {
        if (!user) {
            setModalState(prev => ({ ...prev, showLoginModal: !prev.showLoginModal }));
        }
    };

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    if (!isMounted || !isVisible || user) {
        return null;
    }

    return (
        <div className="fixed bottom-0 inset-x-0 bg-gray-50 px-4 py-2 sm:px-6 sm:py-2.5 z-50 flex items-center justify-between shadow-md w-full">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-x-2 truncate flex-grow justify-start sm:justify-center">
                    <p className="text-xs sm:text-sm leading-6 text-gray-900 whitespace-nowrap overflow-visible sm:overflow-hidden sm:text-center sm:max-w-md">
                        <span className="block sm:hidden">
                            <strong className="font-semibold">JamByte.io - </strong> <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">£20 off </span>  your first order!
                        </span>
                        <span className="hidden sm:block">
                            <strong className="font-semibold">JamByte.io - </strong>
                            Sign up to get a <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">£20 off discount</span> on your first order!
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-x-2 flex-shrink-0">
                    <button
                        onClick={handleRegisterClick}
                        className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                        Register <span aria-hidden="true">🚀</span>
                    </button>
                    <button type="button" className="-m-2 p-2 focus-visible:outline-offset-[-4px]" onClick={handleCloseClick}>
                        <span className="sr-only">Dismiss</span>
                        <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpBanner;