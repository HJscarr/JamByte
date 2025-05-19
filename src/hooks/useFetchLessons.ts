import { useState, useEffect } from 'react';

export interface Lesson {
  title: string;
  number: number;
  description: string;
  length: number;
  feedback: string;
  muxid: string;
  private: boolean;
}

export const useFetchLessons = (courseId: string) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-course-metadata?courseId=${courseId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching lessons');
        console.error('Error fetching lessons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  return { lessons, isLoading, error };
}; 