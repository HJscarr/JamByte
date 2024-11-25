'use client'

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false });

export const HeroVideo: React.FC = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    crossOrigin: 'use-credentials',
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: "/img/HeroThumbnail.webp",
    sources: [{
      src: `https://homepage.jambyte.io/Homepage.m3u8`, 
      type: 'application/vnd.apple.mpegurl',
      withCredentials: true
    }],
    html5: {
      hls: {
        overrideNative: true
      }
    }
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });

    // Prevent auto-play
    player.on('loadstart', () => {
      player.pause();
    });

    // Add a click event listener to the play button
    const playButton = player.el().querySelector('.vjs-big-play-button');
    if (playButton) {
      playButton.addEventListener('click', () => {
        player.play();
      });
    }
  };
  
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        (playerRef.current as any).dispose();
      }
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-900 w-full px-6 md:w-11/12 sm:px-20 mt-32 md:mt-0 h-auto md:h-screen">
      <div className="flex-1 p-1 w-full md:w-1/2 md:mr-12" style={{ aspectRatio: '16 / 9' }}>
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
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