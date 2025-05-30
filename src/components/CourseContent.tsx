'use client'

import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import dynamicImport from 'next/dynamic';
import { courses } from '@/data/courses';
import CourseCard from './CourseCard';

const Features = dynamicImport(() => import('@/components/Features'), { ssr: false });
const Prerequisites = dynamicImport(() => import('@/components/Prerequisites'), { ssr: false });
const BoxAndDesc = dynamicImport(() => import('@/components/BoxAndDesc'), { ssr: false });
const Outcomes = dynamicImport(() => import('@/components/Outcomes'), { ssr: false });

interface CourseContentProps {
  courseSlug: string;
}

export default function CourseContent({ courseSlug }: CourseContentProps) {
  console.log('CourseContent rendering with slug:', courseSlug); // Debug log
  
  const course = courses.find(c => 
    c.title.toLowerCase().replace(/\s+/g, '-') === courseSlug
  );

  if (!course) {
    return (
      <div className="text-white">
        <h1 className="text-4xl font-bold mb-4">Course not found: {courseSlug}</h1>
      </div>
    );
  }

  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkIfAtBottom = () => {
    const threshold = 100;
    if (typeof window !== 'undefined') {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', checkIfAtBottom);
      return () => window.removeEventListener('scroll', checkIfAtBottom);
    }
  }, []);

  return (
    <div className="bg-gray-900 px-6 sm:px-13">
      {/* Arrow Icon */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-50">
        {!isAtBottom ? (
          // Scroll to Bottom Button
          <div onClick={scrollToBottom} className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce">
            <ChevronDownIcon className="h-6 w-6 text-white" />
          </div>
        ) : (
          // Scroll to Top Button
          <div onClick={scrollToTop} className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce">
            <ChevronDownIcon className="h-6 w-6 text-white transform rotate-180" />
          </div>
        )}
      </div>

      <CourseCard {...course} mobileImageUrl={course.imageUrl} />
      <Outcomes />
      <Features />
      <Prerequisites />

      {/* Call-to-Action Section */}
      <div className="bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl leading-9 font-extrabold text-white sm:text-4xl sm:leading-10">
            Ready to start your journey?
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-200">
            Unlock your potential with {course.title} today!
          </p>
          <button
            onClick={scrollToTop}
            className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:w-auto"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
} 