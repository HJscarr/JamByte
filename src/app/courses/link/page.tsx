'use client';

import { courses } from '@/data/courses';
import Image from 'next/image';
import GradientButton from '@/components/GradientButton';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function LinkPage() {
  const course = courses.find(c => c.title === "Link");
  const { user, setModalState } = useAuth();
  const [registered, setRegistered] = useState(false);
  
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-white mb-2">Course in construction 👷</h1>
      <p className="text-lg text-gray-200 mb-6">Register below to be the first to know when Link is released!</p>
      <div className="w-full max-w-4xl mb-8">
        <Image 
          src={course?.imageUrl || "/img/Link/Link.webp"}
          alt="Link course"
          width={1000}
          height={600}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      {registered && user ? (
        <GradientButton className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800">
          <span className="flex items-center gap-2">
            Successfully Registered
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        </GradientButton>
      ) : (
        <GradientButton
          onClick={() => {
            if (!user) {
              setModalState(prev => ({ ...prev, showLoginModal: true, loginModalTitle: 'Sign In/Up to Join the Waitlist' }));
            } else {
              setRegistered(true);
            }
          }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Join Waitlist
          </span>
        </GradientButton>
      )}
    </div>
  );
} 