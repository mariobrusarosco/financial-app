import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { installmentsApi } from '@/domains/installments/api/installments.api';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

interface I_LinkInstallmentTransactionVariables {
  installmentId: string;
  transactionId: string;
}

export const useLinkInstallmentTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ installmentId, transactionId }: I_LinkInstallmentTransactionVariables) =>
      installmentsApi.linkTransaction(installmentId, { transaction_id: transactionId }),
    onSuccess: () => {
      toast.success('Transaction linked to installment!');
      void queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEYS.plans() });
      void queryClient.invalidateQueries({ queryKey: ['all-transactions'] });
    },
    onError: error => {
      handleErrorWithToast(error, { userMessage: 'Failed to link transaction.' });
    },
  });
};
