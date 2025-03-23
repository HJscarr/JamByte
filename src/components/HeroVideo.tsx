'use client'

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false });

export const HeroVideo: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-900 w-full px-6 md:w-11/12 sm:px-20 mt-36 md:mt-0 h-auto md:h-screen">
      <div className="flex-1 w-full md:w-1/2 md:mr-12" style={{ aspectRatio: '16 / 9', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
        <MuxPlayer
          streamType="on-demand"
          playbackId="KJJLyIgjLB7E3lgisx8sVVDmGkkJw2grKUQ1Enxhtd8"
          poster="/img/HeroThumbnail.webp"
          autoPlay={false}
          primaryColor="#FFFFFF"
          secondaryColor="#000000"
          style={{
            height: '100%',
            width: '100%',
            maxWidth: '100%',
          }}
        />
      </div>
      
      <div className="flex-1 pt-2 flex flex-col justify-start w-full md:w-1/2 mt-2 md:mt-8">
        <div className="text-center md:text-left md:ml-6">
          <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-secondary to-red-400 text-transparent bg-clip-text">Discover programming</h2>
          <p className="text-4xl tracking-tight font-bold md:mb-4 pt-2 mb-2 w-full mx-auto md:mx-0 md:text-left">
            <span className="text-white">Exciting technology courses 💻</span>
          </p>
          <div className="text-lg text-white md:mb-2 pt-2 w-4/5 mx-auto md:mx-0 md:text-left">
            <p className="mb-2">Our courses consist of a box of high-quality electronics and a set of expertly crafted video tutorials.</p>
            <p>Created by programmers at Amazon, suitable for beginners.</p>
          </div>
        </div>
        
        <div className="flex justify-center md:justify-start mt-2 space-x-[-12px] md:space-x-4">
          <Image src="/img/logos/PythonLogoLarge.webp" alt="Python Logo" width={160} height={160} className="w-28 h-28 md:w-40 md:h-40 object-contain" />
          <Image src="/img/logos/RPiLogoLarge.webp" alt="Raspberry Pi Logo" width={160} height={160} className="w-28 h-28 md:w-40 md:h-40 object-contain" />
          <Image src="/img/logos/BashLogoLarge.webp" alt="BASH Logo" width={160} height={160} className="w-28 h-28 md:w-40 md:h-40 object-contain" />
        </div>
      </div>
    </div>
  );
}

export default HeroVideo;