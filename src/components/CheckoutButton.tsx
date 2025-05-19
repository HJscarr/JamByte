'use client'

import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCheckout } from '@/hooks/useCheckout';

interface CheckoutButtonProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  className?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ 
  priceId, 
  successUrl, 
  cancelUrl,
  className = "flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-4 sm:px-5 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-15"
}) => {
  const { handleCheckout, isLoading, error } = useCheckout();

  const handleClick = () => {
    handleCheckout({
      priceId,
      successUrl,
      cancelUrl,
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Processing...' : 'Buy Now'}
      <span className="ml-1 h-5 w-5 flex-shrink-0">
        <ShoppingCartIcon className="text-white" />
      </span>
    </button>
  );
};

export default CheckoutButton; 