import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import type { I_CreateInstallmentPlanRequest } from '@/domains/installments/types/types-and-interfaces';

export const useCreateInstallmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: I_CreateInstallmentPlanRequest) => installmentsApi.createPlan(data),
    onSuccess: () => {
      toast.success('Installment plan created successfully!');
      void queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
    },
    onError: error => {
      handleErrorWithToast(error, { userMessage: 'Failed to create installment plan.' });
    },
  });
};
