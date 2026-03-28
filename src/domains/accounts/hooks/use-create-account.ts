import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import * as Sentry from '@sentry/react';
import { toast } from 'sonner';
import { I_CreateAccountForm } from '@/domains/accounts/types/types-and-interfaces';
import { accountsApi } from '@/domains/accounts/api';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { GET_ALL_ACCOUNTS_QUERY_KEY } from '@/domains/accounts/api/keys';
import { AccountErrorMessages } from '@/domains/accounts/api/error-messages';

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['create-account'],
    mutationFn: (account: I_CreateAccountForm) => accountsApi.createAccount(account),
    onSuccess: newAccount => {
      toast.success('Account created successfully!', {
        description: `${newAccount.name} is ready to use`,
        duration: 4000,
      });

      void queryClient.invalidateQueries({
        queryKey: GET_ALL_ACCOUNTS_QUERY_KEY(),
      });

      // Close the drawer by clearing search params, then navigate to the account
      void navigate({
        to: '/accounts/$slug',
        params: { slug: newAccount.id },
      });
    },
    onError: error => {
      const errorInfo = handleErrorWithToast(error, {
        userMessage: AccountErrorMessages.ACCOUNT_CREATION_FAILED,
      });

      Sentry.captureException(error, {
        extra: {
          errorInfo,
        },
      });
    },
  });
};
