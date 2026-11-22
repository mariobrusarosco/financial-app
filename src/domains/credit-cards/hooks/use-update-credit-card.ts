import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { GET_CREDIT_CARD_QUERY_KEY } from '@/domains/credit-cards/api/keys';
import type { I_CreditCardUpdatePayload } from '@/domains/credit-cards/types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

interface UpdateCreditCardVariables {
  creditCardId: string;
  payload: I_CreditCardUpdatePayload;
}

export const useUpdateCreditCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creditCardId, payload }: UpdateCreditCardVariables) =>
      creditCardApi.updateCreditCard(creditCardId, payload),
    onSuccess: (_card, { creditCardId }) => {
      toast.success('Credit card updated');
      void queryClient.invalidateQueries({ queryKey: GET_CREDIT_CARD_QUERY_KEY(creditCardId) });
      // Card lists are cached under ['credit_cards', ...] (account list and form selectors)
      void queryClient.invalidateQueries({ queryKey: ['credit_cards'] });
    },
    // No fixed message: a 409 carries the API's own "already exists" text
    onError: error => handleErrorWithToast(error),
  });
};
