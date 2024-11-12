'use client';

import React from 'react';
import CourseCard from '../../components/CourseCard';
import { courses } from '../../data/courses';
import useFadeInOnScroll from '../../components/useFadeInOnScroll';

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
    >
      <CourseCard {...course} />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto p-8 sm:px-24 grid gap-16">
      {courses.map((course, index) => (
        <CourseWrapper key={course.title || index} course={course} index={index} />
      ))}
    </div>
  );
}