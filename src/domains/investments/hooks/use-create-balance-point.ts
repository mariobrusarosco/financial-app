import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { investmentsApi } from '../api/investments.api';
import { ACCOUNT_MONTHLY_BALANCE_SUMMARIES_QUERY_KEY } from './use-monthly-balance-summaries';
import type { I_CreateBalancePointRequest } from '../types/types-and-interfaces';

export const useCreateBalancePoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentsApi.upsertBalancePoint,
    onSuccess: (data, variables) => {
      toast.success('Balance point saved successfully!');

      // Refresh this account's monthly summaries for every year: the balance
      // can be in any year, not only the current one.
      void queryClient.invalidateQueries({
        queryKey: ACCOUNT_MONTHLY_BALANCE_SUMMARIES_QUERY_KEY(variables.account_id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save balance point');
    },
  });
};
