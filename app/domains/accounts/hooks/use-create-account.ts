import { useMutation } from '@tanstack/react-query';
import { I_CreateAccountForm } from '@/domains/accounts/typing/types-and-interfaces';
import { accountsApi } from '@/domains/accounts/api';

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (account: I_CreateAccountForm) => accountsApi.createAccount(account),
  });
};
