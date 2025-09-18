import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '../api';
import { GET_CURRENT_USER_QUERY_KEY } from '../api/keys';
import { AuthStorage } from '../utils/auth-storage';
import { toast } from 'sonner';
import type { I_SignupRequest, I_AuthResponse } from '../types/auth.types';

export const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<I_AuthResponse, Error, I_SignupRequest>({
    mutationFn: authApi.signup,
    onSuccess: data => {
      AuthStorage.setTokens(data.tokens, true);
      AuthStorage.setUser(data.user);

      queryClient.setQueryData(GET_CURRENT_USER_QUERY_KEY(), data.user);

      toast.success(`Welcome to Better Call Buffet, ${data.user.name}!`);

      void navigate({ to: '/dashboard' });
    },
    onError: () => {
      toast.error('Signup failed. Please try again.');
    },
  });
};
