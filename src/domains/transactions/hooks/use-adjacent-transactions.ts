import { useQueryClient } from '@tanstack/react-query';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

/**
 * Finds the transactions before/after `transactionId` in the list the user is currently looking at.
 * The list screen stays mounted under the drawer, so its query is the "active" paginated query
 * containing this transaction — which keeps the order consistent with the user's filters and sort.
 */
export const useAdjacentTransactions = (
  accountId: string | undefined,
  transactionId: string | undefined
) => {
  const queryClient = useQueryClient();

  const transactions =
    queryClient
      .getQueryCache()
      .findAll({ queryKey: ['account-transactions-paginated', accountId], type: 'active' })
      .map(query => query.state.data as { data?: I_TransactionResponse[] } | undefined)
      .find(data => data?.data?.some(tx => tx.id === transactionId))?.data ?? [];

  const index = transactions.findIndex(tx => tx.id === transactionId);

  if (!accountId || index === -1) {
    return { position: undefined, total: 0, previousId: undefined, nextId: undefined };
  }

  return {
    position: index + 1,
    total: transactions.length,
    previousId: transactions[index - 1]?.id,
    nextId: transactions[index + 1]?.id,
  };
};
