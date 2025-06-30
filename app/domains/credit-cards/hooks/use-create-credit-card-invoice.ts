import { useMutation } from '@tanstack/react-query';
import { I_CreditCardInvoiceRequest } from '@/domains/credit-cards/types/types-and-interfaces';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';

export const useCreateCreditCardInvoice = () => {
  const mutation = useMutation({
    mutationFn: async (data: I_CreditCardInvoiceRequest) => {
      return await creditCardApi.createCreditCardInvoice(data);
    },
    onSuccess: data => {
      console.log('Invoice created successfully:', data);
    },
    onError: error => {
      console.error('Failed to create invoice:', error.message);
    },
  });

  return {
    mutation,
  };
};
