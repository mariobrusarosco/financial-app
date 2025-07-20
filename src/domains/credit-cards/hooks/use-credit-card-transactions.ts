import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';

export const GET_CREDIT_CARD_TRANSACTIONS_QUERY_KEY = (creditCardId: string) => [
  'credit-card-transactions',
  creditCardId,
];

export const useCreditCardTransactions = (creditCardId: string) => {
  return useQuery({
    queryKey: GET_CREDIT_CARD_TRANSACTIONS_QUERY_KEY(creditCardId),
    queryFn: () => creditCardApi.getCreditCardTransactions(creditCardId),
    enabled: !!creditCardId,
  });
};
