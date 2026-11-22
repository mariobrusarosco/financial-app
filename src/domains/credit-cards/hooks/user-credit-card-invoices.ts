import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { GET_CREDIT_CARD_INVOICES_QUERY_KEY } from '@/domains/credit-cards/api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useCreditCardInvoices = (creditCardId: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: GET_CREDIT_CARD_INVOICES_QUERY_KEY(creditCardId),
    queryFn: () => creditCardApi.getCreditCardInvoices(creditCardId),
    enabled: !!creditCardId,
  });
  const update = useMutation({
    mutationFn: ({ invoiceId, month }: { invoiceId: string; month: string }) =>
      creditCardApi.updateInvoiceCompetence(creditCardId, invoiceId, `${month}-01`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: GET_CREDIT_CARD_INVOICES_QUERY_KEY(creditCardId),
      });
      void queryClient.invalidateQueries({ queryKey: ['credit-card-transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['cashflow-summary'] });
    },
    onError: error =>
      handleErrorWithToast(error, { userMessage: 'Could not update the invoice reporting month.' }),
  });
  return { query, actions: { updateCompetence: update.mutate, isUpdating: update.isPending } };
};
