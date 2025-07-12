import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { useQuery } from '@tanstack/react-query';
import { GET_CREDIT_CARD_QUERY_KEY } from '@/domains/credit-cards/api/keys';

export const useCreditCard = (creditCardId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: GET_CREDIT_CARD_QUERY_KEY(creditCardId),
    queryFn: () => creditCardApi.getCreditCard(creditCardId),
    enabled: !!creditCardId,
  });

  return { data, isLoading, error };
};
