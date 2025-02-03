import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export const useHasBought = (productName: string) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['hasBought', user?.profile.email, productName],
    queryFn: async () => {
      if (!isAuthenticated || !user?.profile.email) return false;

      const response = await fetch(
        `https://5obqo07nr8.execute-api.eu-west-1.amazonaws.com/Prod/?email=${user.profile.email}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch purchase status");
      
      const data = await response.json();
      return Array.isArray(data) && data.includes(productName);
    },
    enabled: !!isAuthenticated && !!user?.profile.email,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}; 