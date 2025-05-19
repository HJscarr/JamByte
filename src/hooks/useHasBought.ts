import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export const useHasBought = (productName: string) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['hasBought', user?.profile.email, productName],
    queryFn: async () => {
      if (!isAuthenticated || !user?.profile.email) return false;

      const response = await fetch(
        `https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/get-users-courses?email=${encodeURIComponent(user.profile.email)}`,
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
        throw new Error("Failed to fetch purchase status");
      }
      
      const data = await response.json();
      return Array.isArray(data) && data.includes(productName);
    },
    enabled: !!isAuthenticated && !!user?.profile.email,
    staleTime: Infinity,
  });
}; 