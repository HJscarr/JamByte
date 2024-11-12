'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import getStripe from '@/lib/GetStripe';
import { useUser } from '@/context/UserContext';
import { useCookiesContext } from '@/context/CookiesContext';
import CheckoutHandler from './CheckoutHandler';
import StockChecker from './StockChecker';
import { AmplifyUser, UserAttributes } from '../data/user';

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

const CourseCard: React.FC<CourseProps> = ({ title, description, imageUrl, mobileImageUrl, details, showActions=false, productID, status }) => {
  const { user, setUser } = useUser();
  const [hasBought, setHasBought] = useState<boolean>(false);
  const [cookiesSet] = useCookiesContext();
  const [successUrl, setSuccessUrl] = useState<string>('');
  const [cancelUrl, setCancelUrl] = useState<string>('');

  useEffect(() => {
    setSuccessUrl(`${window.location.origin}/checkout-success`);
    setCancelUrl(`${window.location.origin}/Pi-Guard`);
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      
      const attributes: UserAttributes = {
        username: currentUser.username,
        email: userAttributes.email || '',
        firstName: userAttributes.given_name || ''
      };

      const amplifyUser: AmplifyUser = { attributes };
      
      setUser(amplifyUser);
      console.log("User attributes are fetched");
    } catch (error) {
      console.error("User is not signed in", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user?.attributes?.email) {
      fetch(`https://5obqo07nr8.execute-api.eu-west-1.amazonaws.com/Prod/?email=${user.attributes.email}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.includes(title)) {
            setHasBought(true);
            console.log("Course already bought!")
          }
        })
        .catch(error => {
          console.error('Error fetching course data:', error);
        });
    }
  }, [user, title]);

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
      cancelUrl,
    };

    if (user?.attributes?.email) {
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
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <>
      <div className="hidden sm:block relative flex flex-col p-4 border border-gray-600 rounded-md shadow-sm hover:shadow-lg transition flex-grow sm:h-500 h-96"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: '95% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {showActions &&
          <Link href="/Pi-Guard" className="absolute inset-0" style={{
            background: 'transparent',
            zIndex: 0,
          }} onClick={(e) => e.stopPropagation()}></Link>
        } 
        <div className="relative text-center">
          {showActions ? (
            <Link href="/Pi-Guard" className="pt-12 text-xl sm:text-3xl font-bold text-white block">{title}</Link>
          ) : (
            <div className="pt-12 text-xl sm:text-3xl font-bold text-white">{title}</div>
          )}
          <p className="mt-1 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">{description}</p>
          {details && (
            <p className="mt-1 text-gray-300 sm:mb-16 md:mb-24 text-xs sm:text-base w-full sm:w-2/5  mx-auto" style={{ whiteSpace: 'pre-line' }}>
              {details}
            </p>
          )}
        </div>
        {showActions && (
          <div className="px-2 sm:p-4 mt-auto z-15">
            <div className="relative flex justify-center mt-12 mb-2">
              {
                hasBought || cookiesSet ? (
                  <Link href="/lesson">
                    <button
                      className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 sm:px-10 py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-15"
                    >
                      Start&nbsp;Learning
                      <RocketLaunchIcon className="ml-2 h-5 w-5 text-white" />
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 sm:px-10 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-15"
                  >
                    Buy&nbsp;now
                    <ShoppingCartIcon className="ml-2 h-5 w-5 text-white" />
                  </button>
                )
              }
            </div>
            <div className="flex justify-center">
              <Link href='/Pi-Guard'>
                <button
                  type="button"
                  className="flex items-right justify-center rounded-md border border-transparent px-8 sm:px-16 py-2 sm:py-3 text-sm sm:text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 z-10"
                >
                  Learn more
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              {status === 'Available' && productID && (
                <div className="px-8 sm:px-16 text-sm sm:text-base font-medium text-white">
                  <StockChecker productId={productID} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="sm:hidden relative flex flex-col border border-gray-600 rounded-md shadow-sm hover:shadow-lg transition flex-grow h-500">
        <div className="absolute z-0 mt-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12">
          <div className="relative z-10 text-center">
            <Link href="/Pi-Guard" className="text-xl sm:text-3xl font-bold text-white">{title}</Link>
            <p className="bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">{description}</p>
            <p className="text-gray-300 text-xs sm:text-base">
            <br />Create a home security device that records
              <br />audio and video when motion is detected!
            </p>
          </div>
          <Link href="/Pi-Guard">
            <Image src={mobileImageUrl} alt="Pi-Guard" width={500} height={300} className="w-full mx-auto my-4" style={{ maxWidth: '100%', height: 'auto' }} />
          </Link>
          <div className="px-2 sm:p-4 mt-auto">
            <div className="flex justify-center mt-4 mb-2">
              {
                hasBought || cookiesSet ? (
                  <Link href="/lesson">
                    <button
                      className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 px-6 py-3 whitespace-nowrap text-sm sm:text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Start&nbsp;Learning
                      <RocketLaunchIcon className="ml-2 h-5 w-5 text-white" />
                    </button>
                  </Link>
                ) : (
                  <CheckoutHandler
                    priceID="price_1OkwbGGAlR94zWojhzJ8TgdB"
                    successUrl={successUrl}
                    cancelUrl={cancelUrl}
                  />
                )
              }
            </div>
            <div className="flex justify-center">
              <Link href='/Pi-Guard'>
                <button
                  type="button"
                  className="flex items-right justify-center rounded-md border border-transparent px-8 sm:px-16 py-2 sm:py-3 text-sm sm:text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Learn more
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;