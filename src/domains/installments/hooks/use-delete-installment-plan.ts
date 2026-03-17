import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useDeleteInstallmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => installmentsApi.deletePlan(id),
    onSuccess: () => {
      toast.success('Installment plan deleted successfully!');
      void queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
    },
    onError: error => {
      handleErrorWithToast(error, { userMessage: 'Failed to delete installment plan.' });
    },
  });
};
