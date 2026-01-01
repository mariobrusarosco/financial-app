import { useQuery } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { GET_ALL_CREDIT_CARDS_QUERY_KEY } from '@/domains/credit-cards/api/keys';


const useCreditCards = (accountId: string | undefined) => {
  return useQuery({
    queryKey: GET_ALL_CREDIT_CARDS_QUERY_KEY(accountId),
    queryFn: () => creditCardApi.getAllCreditCards(accountId),
  });
};

export { useCreditCards };
