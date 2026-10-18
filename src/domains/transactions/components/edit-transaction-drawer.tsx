import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import type * as React from 'react';
import { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, ReceiptText, Save, X } from 'lucide-react';
import { getTransactionById } from '@/domains/transactions/api/transactions.api';
import { TransactionForm } from '@/domains/transactions/components/transaction-form';
import { useAdjacentTransactions } from '@/domains/transactions/hooks/use-adjacent-transactions';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';
import type {
  I_TransactionPayload,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { DrawerDescription, DrawerTitle } from '@/domains/ui-system/components/drawer';
import { cn } from '@/domains/ui-system';
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
      <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
        <EditTransactionHeader description="Loading transaction details..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !transaction) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
        <EditTransactionHeader
          description={
            isError
              ? `Failed to load transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
              : 'Transaction not found'
          }
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
      </div>
    );
  }

  // Success state - render the edit form
  return (
    <div
      className="p-4 md:p-6 space-y-5 h-full overflow-y-auto max-w-3xl mx-auto"
      data-ui="edit-transaction-drawer"
    >
      <EditTransactionHeader
        description={
          position
            ? `${position} of ${total} in this list`
            : 'Make changes to your transaction details'
        }
        className="sticky top-0 z-10 bg-background -mt-4 pt-4 md:-mt-6 md:pt-6"
      >
        <div className="flex items-center gap-2">
          {position && (
            <div className="flex items-center rounded-lg border border-border/80 bg-card">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  previousId && requestExit({ type: 'navigate', transactionId: previousId })
                }
                disabled={!previousId || isSaving}
                aria-label="Previous transaction"
                title="Previous transaction"
                className="h-8 w-8 p-0 rounded-r-none"
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
                className="h-8 w-8 p-0 rounded-l-none"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => requestExit({ type: 'close' })}
            className="rounded-lg h-8 px-3 gap-1.5 font-medium border-border/80 text-foreground hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            size="sm"
            onClick={() => {
              afterSaveTargetRef.current = { type: 'close' };
            }}
            disabled={!isDirty || isSaving}
            className="rounded-lg h-8 px-3.5 gap-1.5 font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </EditTransactionHeader>
      <div className="flex flex-col h-full">
        <TransactionForm
          // Remount per transaction so prev/next navigation starts from fresh form state
          key={transaction.id}
          initialValues={transaction}
          onSubmit={handleSave}
          isEditMode={true}
          onCancel={handleClose}
          onDirtyChange={setIsDirty}
        />
      </div>

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
    </div>
  );
};

const EditTransactionHeader = ({
  description,
  className,
  children,
}: {
  description: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-3 pb-3 border-b border-border/70',
      className
    )}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
        <ReceiptText className="h-4 w-4 text-foreground" />
      </div>
      <div className="min-w-0">
        <DrawerTitle className="text-base font-semibold text-foreground leading-tight">
          Edit Transaction
        </DrawerTitle>
        <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
          {description}
        </DrawerDescription>
      </div>
    </div>
    {children}
  </div>
);
