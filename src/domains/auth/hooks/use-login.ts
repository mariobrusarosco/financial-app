import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '../api';
import { GET_CURRENT_USER_QUERY_KEY } from '../api/keys';
import { AuthStorage } from '../utils/auth-storage';
import { toast } from 'sonner';
import type { I_LoginRequest, I_AuthResponse } from '../types/auth.types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<I_AuthResponse, Error, I_LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data, variables) => {
      AuthStorage.setTokens(data.tokens, variables.rememberMe);
      AuthStorage.setUser(data.user);

      queryClient.setQueryData(GET_CURRENT_USER_QUERY_KEY(), data.user);

      toast.success(`Welcome back, ${data.user.full_name}!`);

      void navigate({ to: '/dashboard' });
    },
    onError: error => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};
