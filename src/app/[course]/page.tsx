import { courses } from '@/data/courses';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CourseContent from '@/components/CourseContent';

export const runtime = 'edge';

interface CoursePageProps {
  params: {
    course: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = courses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === params.course);
  
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
    };
  }

  return {
    title: `${course.title} - JamByte`,
    description: course.details,
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = courses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === params.course);
  
  if (!course) {
    notFound();
  }

  if (course.status !== "Available") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-900 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Coming Soon!
          </h2>
          <p className="mt-2 text-gray-300">
            We are working on this project. Check back soon!
          </p>
          <p className="text-gray-400">
            {course.details}
          </p>
        </div>
      </div>
    );
  }

  return <CourseContent course={course} courseSlug={params.course} />;
} 