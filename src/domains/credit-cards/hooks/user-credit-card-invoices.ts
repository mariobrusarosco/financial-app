import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '../api/credit-cards.api';
import { GET_CREDIT_CARD_INVOICES_QUERY_KEY } from '../api/keys';

export const useCreditCardInvoices = (creditCardId: string) => {
  return useQuery({
    queryKey: GET_CREDIT_CARD_INVOICES_QUERY_KEY(creditCardId),
    queryFn: () => creditCardApi.getCreditCardInvoices(creditCardId),
    enabled: !!creditCardId,
  });
};
