import { useState, useEffect } from 'react';

export const useEducationalAid = () => {
  const [totalSold, setTotalSold] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/educational-aid');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.text();
        const sold = parseInt(data, 10);
        setTotalSold(sold);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const progress = totalSold !== null ? (totalSold % 100) : 0;
  const coursesUntilNextGift = totalSold !== null ? (100 - progress) : 0;

  return { progress, coursesUntilNextGift, loading, error };
}; 