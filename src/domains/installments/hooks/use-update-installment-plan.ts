import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import type { I_InstallmentPlanUpdatePayload } from '@/domains/installments/types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useUpdateInstallmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: I_InstallmentPlanUpdatePayload }) =>
      installmentsApi.updatePlan(id, payload),
    onSuccess: updatedPlan => {
      queryClient.setQueryData(INSTALLMENTS_QUERY_KEYS.planDetail(updatedPlan.id), updatedPlan);
      void queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
      toast.success('Installment plan updated');
    },
    onError: error => {
      handleErrorWithToast(error, { userMessage: 'Failed to update installment plan.' });
    },
  });
};
