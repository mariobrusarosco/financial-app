import { useMutation } from '@tanstack/react-query';
import { I_Account } from '@/domains/accounts/typing/types-and-interfaces';
import { accountsApi } from '@/domains/accounts/api';

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (account: I_Account) => accountsApi.createAccount(account),
  });
};
