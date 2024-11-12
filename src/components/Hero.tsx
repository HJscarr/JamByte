'use client'

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { RocketLaunchIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useCookiesContext } from '@/context/CookiesContext';
import dynamic from 'next/dynamic';

// Dynamically import illustrations with no SSR
const HeroIllustration = dynamic(() => import('./HeroIllustration/HeroIllustration'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 w-full h-[600px] flex items-center justify-center">
      <div className="text-gray-400">Loading illustration...</div>
    </div>
  ),
});

const MobileHeroIllustration = dynamic(() => import('./HeroIllustration/MobileHeroIllustration'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 w-full h-[400px] flex items-center justify-center">
      <div className="text-gray-400">Loading illustration...</div>
    </div>
  ),
});

interface TypingAnimationProps {
  messages: string[];
  articles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
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

const Hero: React.FC = () => {
  const [cookiesSet] = useCookiesContext();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setMounted(true);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const illustrationContentDesktop = (
    <div className="container mx-auto text-center pt-14 relative z-10 p-2 flex flex-col justify-center h-full">
      <div className="w-11/12 md:w-full mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="text-white">BECOME </span>
          <TypingAnimation 
            messages={['INVENTOR', 'CREATOR', 'PROGRAMMER']}
            articles={['AN', 'A', 'A']}
          />
        </h1>

        <p className="text-xl md:text-lg mb-8">
          <span className="text-white">Technology education through building exciting electronic devices.</span>        
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
          {cookiesSet && (
            <Link href="/lesson" className={`${isMobile ? 'text-sm px-2 py-2' : 'text-base md:px-4 md:py-3'} bg-gradient-to-r rounded from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 flex items-center justify-center w-full md:w-auto whitespace-nowrap`}>
              Start Learning
              <span className="icon-wrapper ml-2" style={{ display: 'inline-block', width: '24px', height: '24px' }}>
                <RocketLaunchIcon className={`${isMobile ? 'h-4 w-4' : 'sm:h-5 sm:w-5'} text-white`} />
              </span>
            </Link>
          )}
          <Link href="/courses" className={`${isMobile ? 'text-sm px-2 py-2' : 'text-base md:px-4 md:py-3'} bg-gradient-to-r rounded from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 flex items-center justify-center w-full md:w-auto whitespace-nowrap`}>
            Browse Courses
            <span className="icon-wrapper ml-2" style={{ display: 'inline-block', width: '24px', height: '24px' }}>
              <ArrowTopRightOnSquareIcon className={`${isMobile ? 'h-4 w-4' : 'sm:h-5 sm:w-5'} text-white`} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white w-full flex flex-col items-center justify-center">
      <div className="w-full lg:w-5/7 mt-0 md:mt-[-120px] pb-20 flex items-center justify-center">
        <Suspense fallback={
          <div className="animate-pulse bg-gray-800 w-full h-[600px] flex items-center justify-center">
            <div className="text-gray-400">Loading illustration...</div>
          </div>
        }>
          {isMobile ? (
            <div className="w-full mt-[-140px]"> {/* Added margin-top for mobile only */}
              <MobileHeroIllustration />
            </div>
          ) : (
            <HeroIllustration>
              {illustrationContentDesktop}
            </HeroIllustration>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Hero;