'use client'

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ChatBot from '@/components/ChatBot';
import LessonDesc from '@/components/LessonDesc';
import Feedback from '@/components/Feedback';
import LessonList from '@/components/LessonList';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { useAuth } from '@/context/AuthContext';
import EndOfSeriesModal from '@/components/EndOfSeriesModal';
import { useFetchLessons } from '@/hooks/useFetchLessons';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false });

const Lesson: React.FC = () => {
  const { lessons, isLoading: isLessonsLoading, error: lessonsError } = useFetchLessons('pi-guard');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const currentLesson = lessons[currentIndex] || {};
  const [countdown, setCountdown] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState<number | NodeJS.Timeout | null>(null);
  const [showEndOfSeriesModal, setShowEndOfSeriesModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [privateVideoTokens, setPrivateVideoTokens] = useState<Record<string, string>>({});
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const fetchPrivateVideoToken = async (playbackId: string) => {
    if (!user?.profile.email) {
      console.error("No user email available");
      return null;
    }

    try {
      const response = await fetch(
        `https://cfwu42mnu0.execute-api.eu-west-1.amazonaws.com/production?email=${encodeURIComponent(user.profile.email)}&playback_id=${playbackId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Mux token');
      }
      
      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error("Error fetching Mux token:", error);
      return null;
    }
  };

  const fetchThumbnail = async (lesson: any) => {
    if (!lesson?.muxid) return null;

    if (lesson.private) {
      const token = privateVideoTokens[lesson.muxid];
      if (!token) return null;
      return `https://image.mux.com/${lesson.muxid}/thumbnail.png?token=${token}&width=640&height=360&time=3`;
    }

    return `https://image.mux.com/${lesson.muxid}/thumbnail.png?width=640&height=360&time=3`;
  };

  const fetchAllPrivateTokens = async (lessons: any[]) => {
    const privateVideos = lessons.filter(lesson => lesson.private);
    const tokens: Record<string, string> = {};
    const thumbnailUrls: Record<string, string> = {};

    for (const lesson of privateVideos) {
      const token = await fetchPrivateVideoToken(lesson.muxid);
      if (token) {
        tokens[lesson.muxid] = token;
        const thumbnail = await fetchThumbnail({ ...lesson, private: true });
        if (thumbnail) {
          thumbnailUrls[lesson.muxid] = thumbnail;
        }
      }
    }

    // Fetch thumbnails for public videos
    const publicVideos = lessons.filter(lesson => !lesson.private);
    for (const lesson of publicVideos) {
      const thumbnail = await fetchThumbnail(lesson);
      if (thumbnail) {
        thumbnailUrls[lesson.muxid] = thumbnail;
      }
    }

    setPrivateVideoTokens(tokens);
    setThumbnails(thumbnailUrls);
  };

  const getVideoUrl = (lesson: any) => {
    if (!lesson?.muxid) return null;

    if (lesson.private && privateVideoTokens[lesson.muxid]) {
      return `https://stream.mux.com/${lesson.muxid}.m3u8?token=${privateVideoTokens[lesson.muxid]}`;
    }
    
    return `https://stream.mux.com/${lesson.muxid}.m3u8`;
  };

  const autoAdvanceToNextVideo = () => {
    if (currentIndex >= lessons.length - 1) {
      setShowEndOfSeriesModal(true);
      return;
    }

    let counter = 8;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);

      if (counter <= 0) {
        clearInterval(interval);
        setCurrentIndex(prev => prev + 1);
        setCountdown(-1);
      }
    }, 1000);
    setCountdownInterval(interval);
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
  };

  const goToPreviousVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleLessonList = () => setOpen(!open);

  const setSelectedLesson = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Initialize private video tokens and thumbnails
  useEffect(() => {
    if (!isLessonsLoading && lessons.length > 0) {
      fetchAllPrivateTokens(lessons);
      setIsDataLoaded(true);
    }
  }, [isLessonsLoading, lessons, user]);

  const videoUrl = getVideoUrl(currentLesson);

  if (lessonsError) {
    return <div className="text-red-500">Error loading lessons: {lessonsError}</div>;
  }

  if (isLessonsLoading) {
    return <div>Loading lessons...</div>;
  }

  return (
    <div>
      <LessonList 
        open={open} 
        setOpen={setOpen} 
        lessons={lessons} 
        setSelectedLesson={setSelectedLesson} 
        currentIndex={currentIndex} 
        thumbnails={thumbnails}
      />
      
      <div className="container mx-auto flex mb-10 relative w-9/12 sm:w-3/5 mt-[-45px]">
        <button 
          onClick={toggleLessonList} 
          className="absolute top-8 left-0 flex text-xl items-center text-white font-bold z-10 py-2 px-4 rounded"
        >
          <span className="mr-2">Lesson List</span>
          <Bars3Icon className="h-6 w-6 text-secondary inline"/>
        </button>

        <div className="ml-auto pt-20 w-full h-3/5 flex flex-col items-center justify-between relative">
          {isDataLoaded ? (
            <>
              <div className="w-full" style={{ aspectRatio: '16/9' }}>
                {currentLesson?.muxid && (
                  <>
                    {!videoUrl ? (
                      <img 
                        src={thumbnails[currentLesson.muxid]} 
                        alt={currentLesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MuxPlayer
                        streamType="on-demand"
                        playbackId={!currentLesson.private ? currentLesson.muxid : undefined}
                        src={currentLesson.private ? videoUrl : undefined}
                        autoPlay={false}
                        onEnded={autoAdvanceToNextVideo}
                        primaryColor="#FFFFFF"
                        secondaryColor="#000000"
                        poster={thumbnails[currentLesson.muxid]}
                        style={{
                          height: '100%',
                          width: '100%',
                          maxWidth: '100%',
                        }}
                      />
                    )}
                  </>
                )}
              </div>
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
                        d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
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

          <div className="flex flex-row justify-between w-full items-center">
            <div className="text-left w-1/3">
              <h1 className="text-2xl font-bold text-white pb-2 mt-8 whitespace-nowrap">
                {currentLesson.title}
              </h1>
              <span>
                <h1 className="text-l font-bold text-white whitespace-nowrap">
                  <span>Pi-Guard - A </span>
                  <span className="bg-gradient-to-r from-secondary to-red-400 inline-block text-transparent bg-clip-text">JamByte</span>
                  <span> Course </span>
                </h1>
              </span>
            </div>

            <div className="flex items-center justify-center space-x-4 w-1/3">
              <button 
                className="text-white px-4 py-2 rounded bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500" 
                onClick={goToPreviousVideo}
              >
                👈&nbsp;Prev
              </button>
              <button 
                className="text-white px-4 py-2 rounded bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500" 
                onClick={goToNextVideo}
              >
                Next&nbsp;👉
              </button>
            </div>

            <div className="flex justify-end w-1/3">
              <button 
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white px-5 sm:px-6 py-2 sm:py-3 sm:text-sm rounded" 
                onClick={() => setAIAssistantOpen(!isAIAssistantOpen)}
              >
                AI&nbsp;Assistant&nbsp;✨
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto flex w-9/12 sm:w-3/5 flex-col'>
        <div className="text-base text-gray-400 text-left mt-8">
          <LessonDesc key={currentLesson.title} {...currentLesson} />
        </div>

        <div className='w-full mt-8'>
          <Feedback 
            currentVideoName={currentLesson.title} 
            currentVideoNumber={currentLesson.number?.toString() || ''} 
          />
        </div>

        <div className='text-base text-gray-400 text-left'></div>
      </div>

      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAIAssistantOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="bg-transparent p-5 mx-auto my-0 w-9/12 h-5/6">
          <div className="relative z-10 bg-gray-900 shadow-lg rounded-lg w-full h-full">
            <button 
              className="absolute top-0 right-0 mt-[-12px] mr-[-12px] bg-red-500 px-4 py-2 rounded-full text-white" 
              onClick={() => setAIAssistantOpen(false)}
            >
              &times;
            </button>
            <ChatBot 
              isOpen={isAIAssistantOpen}
              onClose={() => setAIAssistantOpen(false)}
              currentLesson={currentLesson}
            />
          </div>
        </div>
      </div>

      <EndOfSeriesModal 
        isOpen={showEndOfSeriesModal} 
        onClose={() => setShowEndOfSeriesModal(false)} 
      />
    </div>
  );
};

export default Lesson; 