import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '../api';
import { AuthStorage } from '../utils/auth-storage';
import { TokenManager } from '../utils/token-manager';
import { toast } from 'sonner';
import { clearObservabilityUser } from '@/config/observability';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      AuthStorage.clearAuth();
      TokenManager.clearTokenRefreshTimer();

      queryClient.clear();
      clearObservabilityUser();

      toast.success('You have been logged out successfully');

      void navigate({ to: '/login' });
    },
    onError: () => {
      AuthStorage.clearAuth();
      TokenManager.clearTokenRefreshTimer();
      queryClient.clear();
      clearObservabilityUser();

      void navigate({ to: '/login' });
    },
  });
};
