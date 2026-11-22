import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ArrowRightLeft, ChevronDown, ChevronUp, Loader2, Save } from 'lucide-react';
import { getTransactionById } from '@/domains/transactions/api/transactions.api';
import { TransactionForm } from '@/domains/transactions/components/transaction-form';
import { useAdjacentTransactions } from '@/domains/transactions/hooks/use-adjacent-transactions';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';
import type {
  I_TransactionPayload,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { Route } from '@/routes/(auth)/route';

type T_ExitTarget = { type: 'close' } | { type: 'navigate'; transactionId: string };

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

  const { position, total, previousId, nextId } = useAdjacentTransactions(accountId, transactionId);

  const [isDirty, setIsDirty] = useState(false);
  // Where to go once the user resolves the unsaved-changes dialog
  const [pendingExit, setPendingExit] = useState<T_ExitTarget | null>(null);
  // Where to go after a successful save (defaults to closing the drawer)
  const afterSaveTargetRef = useRef<T_ExitTarget>({ type: 'close' });

  const handleClose = () => {
    void navigate({
      search: prev => ({ ...prev, drawer: undefined, transactionId: undefined }),
    });
  };

  const goTo = (target: T_ExitTarget) => {
    if (target.type === 'close') {
      handleClose();
      return;
    }
    void navigate({
      to: '.',
      search: prev => ({ ...prev, transactionId: target.transactionId }),
      replace: true,
    });
  };

  const requestExit = (target: T_ExitTarget) => {
    if (isDirty) {
      setPendingExit(target);
      return;
    }
    goTo(target);
  };

  const handleSaveAndContinue = () => {
    if (!pendingExit) return;
    afterSaveTargetRef.current = pendingExit;
    setPendingExit(null);
    (document.getElementById('transaction-form') as HTMLFormElement | null)?.requestSubmit();
  };

  const handleDiscard = () => {
    if (!pendingExit) return;
    setPendingExit(null);
    goTo(pendingExit);
  };

  const { mutate: updateTransaction, isPending: isSaving } = useUpdateTransaction({
    onSuccess: () => goTo(afterSaveTargetRef.current),
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
      <DrawerLayout data-ui="edit-transaction-drawer">
        <DrawerLayoutHeader
          icon={ArrowRightLeft}
          title="Edit transaction"
          description="Loading transaction details…"
        />
        <DrawerLayoutBody className="grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  // Error state
  if (isError || !transaction) {
    return (
      <DrawerLayout data-ui="edit-transaction-drawer">
        <DrawerLayoutHeader
          icon={ArrowRightLeft}
          title="Edit transaction"
          description={
            isError
              ? `Failed to load transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
              : 'Transaction not found'
          }
        />
        <DrawerLayoutBody>
          <p className="text-sm text-muted-foreground">
            {isError ? 'Unable to load this transaction.' : 'This transaction could not be found.'}
          </p>
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  // Success state - render the edit form
  return (
    <DrawerLayout data-ui="edit-transaction-drawer">
      <DrawerLayoutHeader
        icon={ArrowRightLeft}
        title="Edit transaction"
        description={
          position
            ? `${position} of ${total} in this list`
            : 'Make changes to your transaction details'
        }
        onClose={() => requestExit({ type: 'close' })}
        actions={
          position && (
            <div className="flex items-center rounded-lg border border-border bg-card">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  previousId && requestExit({ type: 'navigate', transactionId: previousId })
                }
                disabled={!previousId || isSaving}
                aria-label="Previous transaction"
                title="Previous transaction"
                className="h-8 w-8 rounded-r-none p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => nextId && requestExit({ type: 'navigate', transactionId: nextId })}
                disabled={!nextId || isSaving}
                aria-label="Next transaction"
                title="Next transaction"
                className="h-8 w-8 rounded-l-none p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )
        }
      />
      <DrawerLayoutBody>
        <TransactionForm
          // Remount per transaction so prev/next navigation starts from fresh form state
          key={transaction.id}
          initialValues={transaction}
          onSubmit={handleSave}
          isEditMode={true}
          onCancel={handleClose}
          onDirtyChange={setIsDirty}
        />
      </DrawerLayoutBody>
      <DrawerLayoutFooter>
        <Button type="button" variant="ghost" onClick={() => requestExit({ type: 'close' })}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="transaction-form"
          onClick={() => {
            afterSaveTargetRef.current = { type: 'close' };
          }}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </DrawerLayoutFooter>

      <Dialog open={pendingExit !== null} onOpenChange={open => !open && setPendingExit(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes to this transaction. Save them before leaving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingExit(null)}>
              Keep editing
            </Button>
            <Button variant="outline" onClick={handleDiscard} className="text-destructive">
              Discard
            </Button>
            <Button
              onClick={handleSaveAndContinue}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {pendingExit?.type === 'navigate' ? 'Save and continue' : 'Save and close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DrawerLayout>
  );
};
