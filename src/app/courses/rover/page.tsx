'use client';

import { courses } from '@/data/courses';
import Image from 'next/image';

export default function RoverPage() {
  const course = courses.find(c => c.title === "Rover");
  
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-white mb-8">Course in construction 👷</h1>
      <div className="w-full max-w-md mb-8">
        <Image 
          src={course?.imageUrl || "/img/Rover/Rover.webp"}
          alt="Rover course"
          width={500}
          height={300}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
} 