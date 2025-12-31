import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/route';
import {
  DrawerClose,
  DrawerFooter,
} from '@/domains/ui-system/components/drawer';
import { Button } from '@/domains/ui-system/components/button';
import { EditTransaction } from './edit-transaction';
import { useUpdateTransaction } from '../hooks/use-update-transaction';
import { getTransactionById } from '../api/transactions.api';
import type { I_TransactionResponse } from '../types/types-and-interfaces';
import { Loader2, X, Save } from 'lucide-react';
import { DrawerHeader } from '@/domains/global/components/drawer-header';

export const EditTransactionDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { transactionId } = Route.useSearch();
  const params = useParams({ strict: false });
  const accountId = (params as any).slug;

  // Cache-first approach: Try to find transaction in ANY paginated cache for this account
  // Note: We use getQueriesData (plural) because the cache key includes params
  const cachedTransactionData = queryClient.getQueriesData<{
    data: I_TransactionResponse[];
  }>({
    queryKey: ['account-transactions-paginated', accountId],
  });

  // Find the transaction in any of the cached queries
  const cachedTransaction = cachedTransactionData
    .flatMap(([, data]) => data?.data ?? [])
    .find(tx => tx.id === transactionId);

  // Fetch transaction if not in cache
  const {
    data: transaction,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId!),
    enabled: !cachedTransaction && !!transactionId,
    initialData: cachedTransaction,
    staleTime: 30 * 1000,
  });

  const { mutate: updateTransaction } = useUpdateTransaction(() => {
    handleClose();
  });

  const handleClose = () =>
    navigate({ search: prev => ({ ...prev, drawer: undefined, transactionId: undefined }) });

  const handleSave = (updates: Partial<I_TransactionResponse>) => {
    if (transactionId) {
      updateTransaction({ id: transactionId, updates });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <DrawerHeader
          title="Edit Transaction"
          description="Loading transaction details..."
          icon={Save}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>

      </>
    );
  }

  // Error state
  if (isError || !transaction) {
    return (
      <>
        <DrawerHeader
          title="Edit Transaction"
          description={isError
            ? `Failed to load transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
            : 'Transaction not found'}
          icon={Save}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {isError
                ? 'Unable to load this transaction.'
                : 'This transaction could not be found.'}
            </p>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Success state - render the edit form
  return (
    <>
      <DrawerHeader
        title="Edit Transaction"
        description="Make changes to your transaction details"
        icon={Save}
      />
      <div className="px-4 pb-4">
        <EditTransaction transaction={transaction} onSave={handleSave} onCancel={handleClose} />
      </div>
      <DrawerFooter>
        <Button type="submit" form="edit-transaction-form">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <DrawerClose asChild>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
};
