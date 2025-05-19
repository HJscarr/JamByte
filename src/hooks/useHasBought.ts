import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

export const useHasBought = (productName: string) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['hasBought', user?.profile.email, productName],
    queryFn: async () => {
      if (!isAuthenticated || !user?.profile.email) return false;

      // Get Cognito session and token
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
        `https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-users-courses?email=${encodeURIComponent(user.profile.email)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
            'Authorization': `Bearer ${token}`,
          },
          mode: 'cors',
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication required");
        }
        throw new Error("Failed to fetch purchase status");
      }
      
      const data = await response.json();
      return Array.isArray(data) && data.includes(productName);
    },
    enabled: !!isAuthenticated && !!user?.profile.email,
    staleTime: Infinity,
    retry: 1,
  });
}; 