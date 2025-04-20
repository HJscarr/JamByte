'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from '../../components/CourseCard';
import { courses } from '../../data/courses';
import useFadeInOnScroll from '@/hooks/useFadeInOnScroll';
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const CourseWrapper: React.FC<{ course: any, index: number }> = ({ course, index }) => {
  const ref = React.useRef(null);
  const isVisible = useFadeInOnScroll(ref);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20%)',
        transition: 'opacity 1s ease-out, transform 1s ease-out'
      }}
      className="w-full"
    >
      <CourseCard {...course} />
    </div>
  );
}

export default function CoursesPage() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      const threshold = 100;
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
      setIsAtBottom(scrolledToBottom);
    };

    // Check initial position
    checkScrollPosition();
    // Add scroll event listener
    window.addEventListener("scroll", checkScrollPosition);
    // Cleanup
    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll to Top/Bottom Button */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        {!isAtBottom ? (
          <button
            onClick={scrollToBottom}
            className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce"
            aria-label="Scroll to bottom"
          >
            <ChevronDownIcon className="h-6 w-6 text-white" />
          </button>
        ) : (
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center h-8 w-8 bg-white bg-opacity-50 rounded-full animate-bounce"
            aria-label="Scroll to top"
          >
            <ChevronDownIcon className="h-6 w-6 text-white transform rotate-180" />
          </button>
        )}
      </div>

      <div className="container mx-auto p-8 sm:px-56">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <CourseWrapper key={course.title || index} course={course} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}