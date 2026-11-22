import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountsApi } from '@/domains/accounts/api';
import type { I_AccountUpdatePayload } from '@/domains/accounts/types/types-and-interfaces';
import { ApiError, handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { AccountErrorMessages } from '@/domains/accounts/api/error-messages';

interface UpdateAccountVariables {
  accountId: string;
  payload: I_AccountUpdatePayload;
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, payload }: UpdateAccountVariables) =>
      accountsApi.updateAccount(accountId, payload),
    onSuccess: () => {
      toast.success('Account updated');
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: error => {
      // A 409 (name already in use) carries its own message; keep the generic one for the rest
      const isConflict = error instanceof ApiError && error.status === 409;
      handleErrorWithToast(
        error,
        isConflict ? undefined : { userMessage: AccountErrorMessages.ACCOUNT_UPDATE_FAILED }
      );
    },
  });
};
