import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/domains/accounts/api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { AccountErrorMessages } from '@/domains/accounts/api/error-messages';

export const useDeleteAccount = (onDeleteSuccess?: Function) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onDeleteSuccess?.();
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: AccountErrorMessages.ACCOUNT_DELETION_FAILED,
      });
    },
  });
};
