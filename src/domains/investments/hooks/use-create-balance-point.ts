import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { investmentsApi } from '../api/investments.api';
import { MONTHLY_BALANCE_SUMMARIES_QUERY_KEY } from './use-monthly-balance-summaries';
import type { I_CreateBalancePointRequest } from '../types/types-and-interfaces';

export const useCreateBalancePoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: investmentsApi.upsertBalancePoint,
    onSuccess: (data, variables) => {
      toast.success('Balance point saved successfully!');
      
      // Invalidate monthly summaries to refresh the data
      queryClient.invalidateQueries({
        queryKey: MONTHLY_BALANCE_SUMMARIES_QUERY_KEY({
          account_id: variables.account_id,
          year: new Date().getFullYear(),
          months: 12,
        }),
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save balance point');
    },
  });
};