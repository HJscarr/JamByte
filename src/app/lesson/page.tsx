'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import ChatBot from '../../components/ChatBot';
import LessonDesc from '../../components/LessonDesc';
import Feedback from '../../components/Feedback';
import LessonList from '../../components/LessonList';
import { Bars3Icon } from '@heroicons/react/20/solid';

import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoPlayer from '../../components/VideoPlayer';

import { useCookiesContext } from '../../context/CookiesContext';
import { useUser } from '../../context/UserContext';
import { ProgressData } from '../../data/progress';
import EndOfSeriesModal from '../../components/EndOfSeriesModal';

const lesson: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cookiesSet] = useCookiesContext();
  const { user } = useUser();
  const currentLesson = lessons[currentIndex] || {};
  const playerRef = useRef(null);
  const [progressData, setProgressData] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState<number | NodeJS.Timeout | null>(null);
  const [showEndOfSeriesModal, setShowEndOfSeriesModal] = useState(false);

  const fetchLessons = async (): Promise<any[]> => {
    try {
      const response = await fetch('https://i6qq5oz60f.execute-api.eu-west-1.amazonaws.com/default/PiSpy-Video-Metadata-Retrieval');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }
  };

  const preprocessProgress = (data: ProgressData[]): number[]  => {
    const processedData: number[] = [];

    for (let item of data) {
      processedData[item.video_index] = item.progress;
    }

    return processedData;
  };

  const fetchUserProgress = async (userEmail: string, courseName: string) => {
    try {
      const response = await fetch(`https://mclqp4wgh8.execute-api.eu-west-1.amazonaws.com/Prod?email=${userEmail}&course=${courseName}`);
      const data = await response.json();
      setProgressData(preprocessProgress(data));
      console.log(data);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  useEffect(() => {
    const retrieveLessons = async () => {
      const fetchedLessons = await fetchLessons();
      setLessons(fetchedLessons);
      setIsDataLoaded(true);
    };

    retrieveLessons();
  }, []);

  useEffect(() => {
    if (user && user.attributes.email) {
      fetchUserProgress(user.attributes.email, "Pi-Guard");
    }
  }, [user]);

  const videoJsOptions = useMemo(() => {
    return currentLesson.video ? {
      autoplay: true,
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2],
      responsive: true,
      fluid: true,
      preload: 'auto',
      sources: [{
        src: currentLesson.video,
        type: 'video/mp4'
      }]
    } : {};
  }, [currentLesson.video]);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on('ended', () => {
      autoAdvanceToNextVideo();
    });

    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const goToNextVideo = () => {
    if (countdownInterval !== null) {
      clearInterval(countdownInterval);
    }
    setCountdown(-1);

    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEndOfSeriesModal(true);
    }
  }

  const autoAdvanceToNextVideo = () => {
    if (currentIndex >= lessons.length - 1) {
      setShowEndOfSeriesModal(true); 
      return;
    }
  
    let counter = 8;
    setCountdown(counter);
  
    const countdownInterval = setInterval(() => {
      counter--;
      setCountdown(counter);
  
      if (counter <= 0) {
        clearInterval(countdownInterval);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setCountdown(-1);
      }
    }, 1000);
    setCountdownInterval(countdownInterval);
  };

  const goToPreviousVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const setSelectedLesson = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const [open, setOpen] = useState(false);
  const toggleLessonList = () => setOpen(!open);

  return (
    <div>
      <LessonList open={open} setOpen={setOpen} lessons={lessons} setSelectedLesson={setSelectedLesson} currentIndex={currentIndex} progress={progressData} />
      <div className="container mx-auto flex mb-10 relative w-9/12 sm:w-3/5 mt-[-45px]">
        <button onClick={toggleLessonList} className="absolute top-8 left-0 flex text-xl items-center text-white font-bold z-10 py-2 px-4 rounded">
          <span className="mr-2">lesson List</span> 
          <Bars3Icon className="h-6 w-6 text-secondary inline"/>
        </button>
        
        <div className="ml-auto pt-20 w-full h-3/5 flex flex-col items-center justify-between relative">
          {isDataLoaded && cookiesSet ? (
            <>
              <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} user={user} course_name="Pi-Guard" video_index={currentIndex} video_len={currentLesson.length} />
              {countdown > 0 && (
                <div className="absolute z-30 flex flex-col items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-lg p-4">
                  <button onClick={goToNextVideo} className="focus:outline-none">
                    <svg viewBox="0 0 100 100" className="w-20 h-20">
                      <path
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="5"
                        strokeDasharray="251.2"
                        strokeDashoffset={`${251.2 - (countdown / 8) * 251.2}`}
                        d="M50 10
                          a 40 40 0 0 1 0 80
                          a 40 40 0 0 1 0 -80"
                      />
                      <polygon points="40,30 40,70 70,50" fill="white"/>
                    </svg>
                  </button>
                  <div className="text-white text-xl mt-2">
                    {`Next video starts in: ${countdown}`}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-rotate rounded-full h-32 w-32 border-t-2 border-b-2 border-solid border-secondary"></div>
                <p className="text-white mt-4">Please log in to view video</p>
            </div>
          )}
          <div className="flex flex-col lg:flex-row justify-between w-full items-center"> 
            <div className="text-center sm:text-left w-full sm:w-auto">
                <h1 className="text-2xl font-bold text-white pb-2 mt-8 whitespace-nowrap">{currentLesson.title}</h1>
                <span>
                  <h1 className="text-l font-bold text-white whitespace-nowrap">
                    <span>Pi-Guard - A </span>  
                    <span className="bg-gradient-to-r from-secondary to-red-400 inline-block text-transparent bg-clip-text">JamByte</span>  
                    <span> Course </span>  
                  </h1>
                </span>
            </div>

          <div className="flex flex-row justify-center items-center w-full pt-6">
            {currentIndex > 0 && (
              <button className="text-white px-5 sm:px-6 py-2 sm:text-sm sm:py-3 rounded bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500" onClick={goToPreviousVideo}>👈&nbsp;Prev</button>
            )}
            {currentIndex < lessons.length - 1 && (
              <button className="text-white px-5 sm:px-6 py-2 sm:text-sm sm:py-3 rounded bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 ml-4" onClick={goToNextVideo}>Next&nbsp;👉</button>
            )}
          </div>

          <div className="flex justify-center items-center w-1/3 pt-4">
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white px-5 sm:px-6 py-2 sm:py-3 sm:text-sm rounded" onClick={() => setAIAssistantOpen(!isAIAssistantOpen)}>AI&nbsp;Assistant&nbsp;✨</button>
          </div>
        </div>
      </div>
      </div>

      <div className='container mx-auto flex w-9/12 sm:w-3/5 flex-col'>
        <div className='w-full'>
            <Feedback currentVideoName={currentLesson.title} currentVideoNumber={currentLesson.number} />
        </div>

        <div className="text-base text-gray-400 text-left mt-8">
            <LessonDesc key={currentLesson.title} {...currentLesson} />
        </div>

        <div className='text-base text-gray-400 text-left'></div>
        </div>
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAIAssistantOpen ? '' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-transparent p-5 mx-auto my-0 w-9/12 h-5/6">
            <div className="relative z-10 bg-gray-900 shadow-lg rounded-lg w-full h-full">
              <button className="absolute top-0 right-0 mt-[-12px] mr-[-12px] bg-red-500 px-4 py-2 rounded-full text-white" onClick={() => setAIAssistantOpen(false)}>
                &times;
              </button>
              <ChatBot />
            </div>
          </div>
        </div>
    <EndOfSeriesModal isOpen={showEndOfSeriesModal} onClose={() => setShowEndOfSeriesModal(false)} />
  </div>
);
}

export default lesson;
