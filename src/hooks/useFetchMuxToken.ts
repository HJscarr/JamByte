import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useFetchMuxToken = () => {
  const { user } = useAuth();

  const fetchMuxToken = useCallback(async (playbackId: string) => {
    if (!user?.profile.email) {
      console.error("No user email available");
      return null;
    }

    try {
      const response = await fetch(
        `https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-mux-token?email=${encodeURIComponent(user.profile.email)}&playback_id=${playbackId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Mux token');
      }
      
      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error("Error fetching Mux token:", error);
      return null;
    }
  }, [user?.profile.email]);

  return { fetchMuxToken };
}; 