import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';

export function useUser() {
  // let isAuthenticated = false;
  const { data: user, isLoading: isCheckingUser } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });
  //by checking the user data returned we can make a quick boolean that can be used
  return {
    user,
    isCheckingUser,
    isAuthenticated:
      (user?.role === 'authenticated' && !user?.is_anonymous) ?? false,
    isAnonymous: user?.is_anonymous ?? false,
  };
}
