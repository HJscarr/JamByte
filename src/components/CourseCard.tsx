'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RocketLaunchIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useCheckPurchase } from '@/hooks/useCheckPurchase';
import CheckoutButton from './CheckoutButton';
import StockChecker from './StockChecker';

interface CourseProps {
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  details?: string;
  showActions?: boolean;
  priceID?: string;
  stockID?: string;
  status?: string;
  author?: string;
  duration?: string;
}

const CourseCard: React.FC<CourseProps> = ({ 
  title, 
  imageUrl, 
  details, 
  showActions = true, 
  priceID, 
  stockID, 
  status 
}) => {
  const router = useRouter();
  const { user, modalState, setModalState } = useAuth();
  const [successUrl, setSuccessUrl] = useState<string>('');
  const { hasBought } = useCheckPurchase(title);

  useEffect(() => {
    setSuccessUrl(`${window.location.origin}/checkout-success`);
  }, []);

  const handleBuyClick = () => {
    if (!user) {
      setModalState(prev => ({ ...prev, showLoginModal: true }));
      return;
    }
  };

  const getCourseRoute = (courseTitle: string) => {
    return `/courses/${courseTitle.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleCourseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(getCourseRoute(title));
  };

  return (
    <div 
      className="relative flex flex-col border border-gray-600 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full max-w-md mx-auto transform hover:scale-105 cursor-pointer"
      onClick={handleCourseClick}
    >
      <div className="relative flex flex-col items-center p-2 h-full">
        <div className="pt-4 w-full">
          <Image 
            src={imageUrl} 
            alt={title} 
            width={500} 
            height={300} 
            className="w-full rounded-md mb-4" 
          />
        </div>

        <div className="text-center mb-4">
          {showActions ? (
            <span className="text-2xl font-bold text-white hover:text-secondary">
              {title}
            </span>
          ) : (
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          )}
          <p className="mt-2 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">
            A JamByte Course
          </p>
        </div>

        {details && (
          <p className="text-gray-300 text-sm mb-6 text-center px-4 sm:px-12">
            {details}
          </p>
        )}

        <div className="relative w-full mt-auto space-y-4 px-12 sm:px-16">
          {showActions ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(getCourseRoute(title));
              }} 
              className="w-full flex items-center justify-center rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 py-3 text-base font-medium text-white transition-all duration-300"
            >
              Learn more
              <RocketLaunchIcon className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 py-3 text-base font-medium text-white transition-all duration-300"
            >
              Get Notified
              <BellIcon className="ml-2 h-5 w-5" />
            </button>
          )}

          <div className="text-center text-white pb-2">
            {showActions && status === 'Available' && stockID && (
              <StockChecker title={title} />
            )}
          </div>

          {priceID && !hasBought && (
            <CheckoutButton
              priceId={priceID}
              successUrl={successUrl}
              cancelUrl={`${window.location.origin}/Pi-Guard`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;