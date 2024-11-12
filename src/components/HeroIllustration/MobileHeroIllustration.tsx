'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RocketLaunchIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useCookiesContext } from '@/context/CookiesContext';
import LazyPlaceholder from '@/components/LazyPlaceholder';

interface TypingAnimationProps {
  messages: string[];
  articles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
}

interface MobileHeroIllustrationProps {
  onLoad?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  messages,
  articles,
  typingSpeed = 150,
  deletingSpeed = 75,
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === messages[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 750);
    } else if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }

    const timeoutId = setTimeout(() => {
      setSubIndex((prevSubIndex) => prevSubIndex + (reverse ? -1 : 1));
    }, reverse ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [subIndex, index, reverse, messages, typingSpeed, deletingSpeed]);

  return (
    <>
      <span className="text-white">{articles[index]} </span>
      <span className="bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">
        {messages[index].substring(0, subIndex)}
        <span className="opacity-50">|</span>
      </span>
    </>
  );
};

const MobileHeroIllustration: React.FC<MobileHeroIllustrationProps> = ({ onLoad }) => {
  const [cookiesSet] = useCookiesContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      onLoad?.();
    }
  }, [imageLoaded, onLoad]);

  return (
    <div className="relative w-full sm:min-h-[400px] md:hidden">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LazyPlaceholder />
        </div>
      )}
      
      <div className="relative w-full h-[800px] mt-32 sm:h-[400px]">
        <Image
          src="/img/MobileIllustration.webp"  // Changed from /assets/img to /img
          alt="Mobile Illustration"
          fill
          priority
          sizes="(max-width: 768px) 100vw"
          style={{ 
            objectFit: 'contain',
            objectPosition: 'center'
          }}
          onLoadingComplete={() => setImageLoaded(true)}
          onError={() => {
            console.error('Failed to load image');
            setImageError(true);
          }}
          className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <div className="absolute inset-0 mt-8 flex flex-col justify-center items-center px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          <span className="text-white">BECOME </span>
          <TypingAnimation 
            messages={['INVENTOR', 'CREATOR', 'PROGRAMMER']}
            articles={['AN', 'A', 'A']}
          />
        </h1>
        <p className="text-sm sm:text-base mb-6 w-3/4 text-center text-white">
          Technology education through building exciting electronic devices.
        </p>
        <div className="flex flex-col space-y-3 w-2/4 max-w-xs">
          {cookiesSet && (
            <Link 
              href="/lesson" 
              className="text-sm px-4 py-3 bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 rounded-md flex items-center justify-center transition-colors duration-300"
            >
              Start Learning
              <RocketLaunchIcon className="h-5 w-5 ml-2 text-white flex-shrink-0" />
            </Link>
          )}
          <Link 
            href="/courses" 
            className="text-sm px-4 py-3 bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 rounded-md flex items-center justify-center transition-colors duration-300"
          >
            Browse Courses
            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 text-white flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroIllustration;