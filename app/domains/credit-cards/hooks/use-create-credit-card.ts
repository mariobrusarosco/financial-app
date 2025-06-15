import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { I_CreateCreditCardRequest } from '@/domains/credit-cards/types/types-and-interfaces';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';

export const useCreateCreditCard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: I_CreateCreditCardRequest) => {
      const response = await creditCardApi.createCreditCard(data);
      return response;
    },
    onSuccess: (data, variables) => {
      console.log('Credit card created successfully:', data);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['accounts', variables.account_id, 'credit-cards'],
      });

      // Navigate back to the account's credit card page
      navigate({
        to: '/accounts/$slug/credit-card',
        params: { slug: variables.account_id },
      });
    },
    onError: error => {
      console.error('Failed to create credit card:', error.message);
    },
  });

  return {
    mutation,
    createCreditCard: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
