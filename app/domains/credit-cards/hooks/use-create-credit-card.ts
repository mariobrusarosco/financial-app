import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { I_CreateCreditCardRequest } from '@/domains/credit-cards/types/types-and-interfaces';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { GET_ALL_CREDIT_CARDS_QUERY_KEY } from '@/domains/accounts/api/keys';

export const useCreateCreditCard = ({ accountId }: { accountId: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: I_CreateCreditCardRequest) => {
      const response = await creditCardApi.createCreditCard(data);
      return response;
    },
    onSuccess: data => {
      console.log('Credit card created successfully:', data);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: GET_ALL_CREDIT_CARDS_QUERY_KEY(accountId),
      });

      // Navigate back to the account's credit card page
      navigate({
        to: '/accounts/$slug/credit-card',
        params: { slug: accountId },
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
