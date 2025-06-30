import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';

const GET_ALL_CREDIT_CARDS_QUERY_KEY = () => ['credit_cards', 'all'];

const useCreditCards = (accountId: string | undefined) => {
  return useQuery({
    queryKey: GET_ALL_CREDIT_CARDS_QUERY_KEY(),
    queryFn: () => creditCardApi.getAllCreditCards(accountId),
    enabled: !!accountId,
  });
};

export { useCreditCards };
