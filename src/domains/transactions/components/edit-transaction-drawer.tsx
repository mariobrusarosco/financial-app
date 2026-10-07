import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Loader2, Save, X } from 'lucide-react';
import { getTransactionById } from '@/domains/transactions/api/transactions.api';
import { TransactionForm } from '@/domains/transactions/components/transaction-form';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';
import type {
  I_TransactionPayload,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Button } from '@/domains/ui-system/components/button';
import { DrawerClose } from '@/domains/ui-system/components/drawer';
import { Route } from '@/routes/(auth)/route';

export const EditTransactionDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { transactionId } = Route.useSearch();
  const params = useParams({ strict: false });
  const accountId = 'slug' in params && typeof params.slug === 'string' ? params.slug : undefined;

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

  const handleClose = () => {
    void navigate({
      search: prev => ({ ...prev, drawer: undefined, transactionId: undefined }),
    });
  };

  const { mutate: updateTransaction } = useUpdateTransaction({
    onSuccess: handleClose,
  });

  const handleSave = (payload: I_TransactionPayload) => {
    if (transactionId) {
      updateTransaction({
        id: transactionId,
        updates: payload as unknown as Partial<I_TransactionResponse>,
      });
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
          description={
            isError
              ? `Failed to load transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
              : 'Transaction not found'
          }
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
    <div className="p-2 md:p-6 space-y-6 h-full overflow-y-auto" data-ui="edit-transaction-drawer">
      <div className="flex items-center justify-between">
        <DrawerHeader
          title="Edit Transaction"
          description="Make changes to your transaction details"
          icon={Save}
        />
        <div className="flex items-center gap-2 pr-4">
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DrawerClose>
          <Button type="submit" form="transaction-form">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6 h-full p-4">
        <TransactionForm
          initialValues={transaction}
          onSubmit={handleSave}
          isEditMode={true}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};
