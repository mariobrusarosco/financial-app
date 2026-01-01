import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { installmentsApi } from '../api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '../api/keys';
import type {
  I_CreateInstallmentPlanRequest,
  I_InstallmentPlansParams,
} from '../types/types-and-interfaces';
import { toast } from 'sonner';

export const useInstallmentPlans = (params?: I_InstallmentPlansParams) => {
  return useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planList(params as any),
    queryFn: () => installmentsApi.getPlans(params),
  });
};

export const useInstallmentPlan = (id: string | undefined) => {
  return useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planDetail(id),
    queryFn: () => installmentsApi.getPlan(id),
    enabled: !!id,
  });
};

export const useCreateInstallmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: I_CreateInstallmentPlanRequest) => installmentsApi.createPlan(data),
    onSuccess: () => {
      toast.success('Installment plan created successfully!');
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
    },
    onError: (error: any) => {
      toast.error('Failed to create installment plan.', {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useDeleteInstallmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => installmentsApi.deletePlan(id),
    onSuccess: () => {
      toast.success('Installment plan deleted successfully!');
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
    },
    onError: (error: any) => {
      toast.error('Failed to delete installment plan.', {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useLinkInstallmentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      installmentId,
      transactionId,
    }: {
      installmentId: string;
      transactionId: string;
    }) => installmentsApi.linkTransaction(installmentId, { transaction_id: transactionId }),
    onSuccess: (_, variables) => {
      toast.success('Transaction linked to installment!');
      // Invalidate the specific plan detail to refresh installment status
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
      // Also invalidate transactions list as the transaction now has installment info
      queryClient.invalidateQueries({ queryKey: ['all-transactions'] });
    },
    onError: (error: any) => {
      toast.error('Failed to link transaction.', {
        description: error.response?.data?.message || error.message,
      });
    },
  });
};
