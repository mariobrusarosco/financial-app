import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { GET_CURRENT_USER_QUERY_KEY } from '../api/keys';
import { AuthStorage } from '../utils/auth-storage';
import { TokenManager } from '../utils/token-manager';
import type { I_User } from '../types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<I_User | null>({
    queryKey: GET_CURRENT_USER_QUERY_KEY(),
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const isAuthenticated = !!user && TokenManager.hasValidToken();

  const refreshAuth = async () => {
    await queryClient.invalidateQueries({
      queryKey: GET_CURRENT_USER_QUERY_KEY(),
    });
  };

  const clearAuth = () => {
    AuthStorage.clearAuth();
    queryClient.setQueryData(GET_CURRENT_USER_QUERY_KEY(), null);
    queryClient.clear();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    refreshAuth,
    clearAuth,
  };
};
