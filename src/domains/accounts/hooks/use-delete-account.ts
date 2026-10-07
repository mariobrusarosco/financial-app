import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { AccountErrorMessages } from '@/domains/accounts/api/error-messages';
import { toast } from 'sonner';

export const useDeleteAccount = (onDeleteSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.deleteAccount(id),
    onSuccess: () => {
      toast.success('Account deleted successfully!');
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onDeleteSuccess?.();
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: AccountErrorMessages.ACCOUNT_DELETION_FAILED,
      });
    },
  });
};
