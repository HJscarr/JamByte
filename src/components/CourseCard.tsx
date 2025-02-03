'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, RocketLaunchIcon, BellIcon } from '@heroicons/react/24/outline';
import getStripe from '@/lib/GetStripe';
import { useAuth } from '@/context/AuthContext';
import CheckoutHandler from './CheckoutHandler';
import StockChecker from './StockChecker';

interface CourseProps {
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl: string;
  details?: string;
  showActions?: boolean;
  productID?: string;
  status?: string;
}

const CourseCard: React.FC<CourseProps> = ({ 
  title, 
  description, 
  imageUrl, 
  mobileImageUrl, 
  details, 
  showActions = true, 
  productID, 
  status 
}) => {
  const { user, modalState, setModalState } = useAuth();
  const [hasBought, setHasBought] = useState<boolean>(false);
  const [successUrl, setSuccessUrl] = useState<string>('');

  useEffect(() => {
    setSuccessUrl(`${window.location.origin}/checkout-success`);
  }, []);

  useEffect(() => {
    if (user && user.profile.email) {
      fetch(
        `https://5obqo07nr8.execute-api.eu-west-1.amazonaws.com/Prod/?email=${user.profile.email}`
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch");
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.includes(title)) {
            setHasBought(true);
            console.log("Course already bought!");
          }
        })
        .catch((error) => {
          console.error("Error fetching course data:", error);
        });
    }
  }, [user]);

  const handleCheckout = async () => {
    const stripe = await getStripe();

    if (!stripe) {
      return;
    }

    const config: any = {
      lineItems: [
        {
          price: productID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl,
      cancelUrl: `${window.location.origin}/Pi-Guard`,
    };

    if (user && user.profile.email) {
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
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handleBuyClick = () => {
    if (!user) {
      setModalState(prev => ({ ...prev, showLoginModal: true }));
      return;
    }
    handleCheckout();
  };

  const getCourseRoute = (courseTitle: string) => {
    switch (courseTitle) {
      case "Pi-Guard":
        return "/Pi-Guard";
      case "Rover":
        return "/Rover";
      case "Link":
        return "/Link";
      default:
        return "/courses";
    }
  };

  return (
    <div 
      className="relative flex flex-col border border-gray-600 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full max-w-md mx-auto transform hover:scale-105 cursor-pointer"
      onClick={() => window.location.href = getCourseRoute(title)}
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
            {description}
          </p>
        </div>

        {details && (
          <p className="text-gray-300 text-sm mb-6 text-center px-4 sm:px-12">
            {details}
          </p>
        )}

        <div className="relative w-full mt-auto space-y-4 px-12 sm:px-16">
          {showActions ? (
            <>
              {hasBought ? (
                <Link href="/lesson" className="block w-full">
                  <button 
                    onClick={(e) => e.stopPropagation()} 
                    className="w-full flex items-center justify-center rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-white transition-all duration-300 whitespace-nowrap"
                  >
                    Start Learning
                    <RocketLaunchIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  </button>
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyClick();
                  }}
                  className="w-full flex items-center justify-center rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 py-3 text-base font-medium text-white transition-all duration-300"
                >
                  Buy now
                  <ShoppingCartIcon className="ml-2 h-5 w-5" />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center rounded-md bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 py-3 text-base font-medium text-white transition-all duration-300"
            >
              Get Notified
              <BellIcon className="ml-2 h-5 w-5" />
            </button>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = getCourseRoute(title);
            }} 
            className="w-full rounded-md border border-transparent px-6 py-3 text-base font-medium text-white hover:text-secondary transition-colors duration-300"
          >
            Learn more
          </button>

          <div className="text-center text-white pb-2">
            {showActions && status === 'Available' && productID && (
              <StockChecker productId={productID} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;