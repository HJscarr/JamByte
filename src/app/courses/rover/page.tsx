'use client';

import { courses } from '@/data/courses';
import Image from 'next/image';
import GradientButton from '@/components/GradientButton';
import { useWaitlistRegistration } from '@/hooks/useWaitlistRegistration';

export default function RoverPage() {
  const course = courses.find(c => c.title === "Rover");
  const { registered, handleRegistration, user } = useWaitlistRegistration("Rover");
  
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-white mb-2">Course in construction 👷</h1>
      <p className="text-lg text-gray-200 mb-3 mt-3">{course?.details}</p>
      <p className="text-lg text-gray-200 mb-6">Register below to be the first to know when Rover is released!</p>
      <div className="w-full max-w-4xl mb-8">
        <Image 
          src={course?.imageUrl || "/img/Rover/Rover.webp"}
          alt="Rover course"
          width={500}
          height={300}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full max-w-4xl mb-8">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-auto rounded-lg shadow-lg"
        >
          <source src="/img/Rover/rover.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      {registered && user ? (
        <GradientButton className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800">
          <span className="flex items-center gap-2">
            Successfully Registered
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        </GradientButton>
      ) : (
        <GradientButton onClick={handleRegistration}>
          <span className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Join Waitlist
          </span>
        </GradientButton>
      )}
    </div>
  );
}