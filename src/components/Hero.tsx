'use client'

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { RocketLaunchIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from 'lottie-react';
import desktopAnimation from '@/images/lottie/Desktop-Hero.lottie';
import mobileAnimation from '@/images/lottie/Mobile-Hero.lottie';
import { useHasBought } from '@/hooks/useHasBought';

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
      <span className="text-white">{articles[index]}&nbsp;</span>
      <span className="bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">
        {messages[index].substring(0, subIndex)}
        <span className="opacity-50">|</span>
      </span>
    </>
  );
};

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: hasBought = false } = useHasBought('Pi-Guard');

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

  const heroContent = (
    <div className="container mx-auto text-center p-2 flex flex-col justify-start">
      <div className="w-11/12 md:w-3/4 lg:w-2/3 mx-auto">
        <h1 className="text-4xl lg:text-4xl 2xl:text-5xl font-bold mb-2">
          <div className="hidden md:flex items-center justify-center">
            <span className="text-white">WHAT WILL</span>
            <span className="text-white mx-[2px]">YOU</span>
            <TypingAnimation 
              messages={['BUILD?', 'CREATE?', 'ENGINEER?']}
              articles={['', '', '']}
            />
          </div>
          <div className="flex md:hidden flex-col items-center justify-center gap-0">
            <span className="text-white block mb-0">WHAT WILL</span>
            <div className="flex items-center justify-center">
              <span className="text-white mr-[2px]">YOU</span>
              <TypingAnimation 
                messages={['BUILD?', 'CREATE?', 'ENGINEER?']}
                articles={['', '', '']}
              />
            </div>
          </div>
        </h1>

        <p className="text-xl md:text-xl 2xl:text-2xl mb-6 max-w-sm mx-auto leading-tight">
          <span className="text-white">Technology education through building exciting electronic devices.</span>        
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center mb-8 md:mb-0">
          {hasBought ? (
            <Link href="/courses/pi-guard/lesson" className={`${isMobile ? 'text-sm px-2 py-2' : 'text-base md:px-4 md:py-3'} bg-gradient-to-r rounded from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 flex items-center justify-center w-full md:w-auto whitespace-nowrap`}>
              Start Learning
              <span className="icon-wrapper ml-2" style={{ display: 'inline-block', width: '24px', height: '24px' }}>
                <RocketLaunchIcon className={`${isMobile ? 'h-4 w-4' : 'sm:h-5 sm:w-5'} text-white`} />
              </span>
            </Link>
          ) : (
            <Link href="/courses" className={`${isMobile ? 'text-sm px-2 py-2' : 'text-base md:px-4 md:py-3'} bg-gradient-to-r rounded from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 flex items-center justify-center w-full md:w-auto whitespace-nowrap`}>
              Browse Courses
              <span className="icon-wrapper ml-2" style={{ display: 'inline-block', width: '24px', height: '24px' }}>
                <ArrowTopRightOnSquareIcon className={`${isMobile ? 'h-4 w-4' : 'sm:h-5 sm:w-5'} text-white`} />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white w-full flex flex-col items-center justify-start h-[calc(100vh-4rem)]">
      <div className="w-full lg:w-5/6 relative flex items-start justify-center h-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {isMobile ? (
            <DotLottieReact
              src={mobileAnimation}
              loop
              autoplay
              className="w-full h-full scale-[0.95] mt-32"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <DotLottieReact
                src={desktopAnimation}
                loop
                autoplay
                className="w-[120%] h-[120%] -translate-y-[3%] translate-x-[1.8%] 2xl:scale-75 2xl:-translate-y-[25%]"
              />
            </div>
          )}
        </div>
        <div className="relative z-[1] w-full -mt-2 md:mt-16 2xl:mt-32">
          {heroContent}
        </div>
      </div>
    </div>
  );
};

export default Hero;