import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useCheckPurchase = (courseTitle: string) => {
  const { user } = useAuth();
  const [hasBought, setHasBought] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user?.profile?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://5obqo07nr8.execute-api.eu-west-1.amazonaws.com/Prod/?email=${user.profile.email}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Origin': window.location.origin,
            },
            mode: 'cors',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch purchase data');
        }

        const data = await response.json();
        setHasBought(Array.isArray(data) && data.includes(courseTitle));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error checking purchase');
        console.error('Error checking purchase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchase();
  }, [user, courseTitle]);

  return { hasBought, isLoading, error };
}; 