import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

export const useFetchMuxToken = () => {
  const { user } = useAuth();

  const fetchMuxToken = useCallback(async (playbackId: string) => {
    if (!user?.profile.email) {
      console.error("No user email available");
      return null;
    }

    try {
      const userPool = new CognitoUserPool({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
      });

      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        throw new Error('User not authenticated');
      }

      const session = await new Promise<CognitoUserSession>((resolve, reject) => {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
          if (err) reject(err);
          else resolve(session);
        });
      });

      const token = session.getIdToken().getJwtToken();

      const response = await fetch(
        `https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-mux-token?email=${encodeURIComponent(user.profile.email)}&playback_id=${playbackId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Origin': window.location.origin,
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Mux token');
      }
      
      const { token: muxToken } = await response.json();
      return muxToken;
    } catch (error) {
      console.error("Error fetching Mux token:", error);
      return null;
    }
  }, [user?.profile.email]);

  return { fetchMuxToken };
}; 