import { useState } from 'react';
import { Surface } from '@/domains/global/components/surface';
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { TransactionRow } from '@/domains/transactions/components/transaction/transaction-row';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { useBulkDeleteTransactions } from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { AccountTransactionFilters } from '@/domains/transactions/components/account-transaction-filters';
import { BulkTransactionActions } from '@/domains/transactions/components/bulk-transaction-actions';
import { CreditCard, Loader2, CheckSquare, Square } from 'lucide-react';
import type {
  I_AccountTransactionsParams,
  I_TransactionsResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';

interface AccountTransactionsListProps {
  params: I_AccountTransactionsParams;
  onParamsChange: (params: I_AccountTransactionsParams) => void;
  showMovementTypeFilter?: boolean;
  query: {
    data?: I_TransactionsResponse;
    isLoading: boolean;
    isError: boolean;
    isPlaceholderData: boolean;
  };
}

export const AccountTransactionsList = ({
  params,
  onParamsChange,
  showMovementTypeFilter = true,
  query,
}: AccountTransactionsListProps) => {
  const { data: response, isLoading, isError, isPlaceholderData } = query;
  const transactions = response?.data || [];
  const meta = response?.meta;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();

  // Show loading state only on initial load, not when using placeholder data
  if (isLoading && !isPlaceholderData) {
    return (
      <Surface data-ui="account-transactions-list" className="w-full flex-1">
        <div>
          <CardTitle>Account Transactions</CardTitle>
          <CardDescription>Account and credit card transactions for this account</CardDescription>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading transactions...</span>
        </div>
      </Surface>
    );
  }

  if (isError) {
    return (
      <Surface data-ui="account-transactions-list" className="w-full flex-1">
        <div>
          <CardTitle>Account Transactions</CardTitle>
          <CardDescription>Account and credit card transactions for this account</CardDescription>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load transactions</p>
        </div>
      </Surface>
    );
  }

  const handlePageChange = (page: number) => {
    onParamsChange({ ...params, page });
  };

  // Selection handlers
  const handleSelectTransaction = (transactionId: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === transactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions.map(t => t.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    bulkDeleteTransactions(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setIsBulkDeleteDialogOpen(false);
      },
    });
  };

  const isAllSelected = selectedIds.size === transactions.length && transactions.length > 0;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < transactions.length;

  return (
    <section
      data-ui="account-transactions-list"
      className="flex min-w-0 flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Account Transactions</h2>
            {isPlaceholderData && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {meta
              ? `${meta.total} transactions found`
              : 'Account and credit card transactions for this account'}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Loading new data...)</span>
            )}
          </div>
        </div>
      </div>

      <AccountTransactionFilters
        params={params}
        onParamsChange={onParamsChange}
        showMovementTypeFilter={showMovementTypeFilter}
      />

      {selectedIds.size > 0 && (
        <BulkTransactionActions
          transactionIds={Array.from(selectedIds)}
          isDeleting={isBulkDeleting}
          onClearSelection={() => setSelectedIds(new Set())}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      <div className={`space-y-2 ${isPlaceholderData ? 'opacity-50 transition-opacity' : ''}`}>
        {transactions && transactions.length > 0 ? (
          <>
            <div className="flex items-center gap-3 border-b border-border/70 p-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4 text-brand" />
                ) : isPartiallySelected ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded border-2 border-brand bg-brand/15">
                    <div className="h-2 w-2 rounded-sm bg-brand" />
                  </div>
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
              </button>
              <span className="text-xs text-muted-foreground">
                {transactions.length} transactions
              </span>
            </div>

            <ul data-ui="account-transactions-list-items" className="grid gap-2">
              {transactions.map(transaction => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedIds.has(transaction.id)}
                  onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
                />
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {Object.keys(params).some(
                key =>
                  key !== 'page' &&
                  key !== 'per_page' &&
                  key !== 'sort_by' &&
                  key !== 'sort_order' &&
                  params[key as keyof I_AccountTransactionsParams]
              )
                ? 'No transactions match your filters'
                : 'No transactions yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {Object.keys(params).some(
                key =>
                  key !== 'page' &&
                  key !== 'per_page' &&
                  key !== 'sort_by' &&
                  key !== 'sort_order' &&
                  params[key as keyof I_AccountTransactionsParams]
              )
                ? 'Try adjusting your filters to see more results'
                : 'Transactions will appear here once you start using this account'}
            </p>
          </div>
        )}
      </div>

      {meta && meta.total > meta.per_page && (
        <div
          data-ui="account-transactions-list-pagination"
          className="sticky bottom-0 z-10 mt-3 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} transactions
              {isPlaceholderData && <span className="text-xs ml-2">(Previous data shown)</span>}
            </span>
          </div>
          <div className={isPlaceholderData ? 'pointer-events-none opacity-50' : ''}>
            <Pagination
              currentPage={meta.page}
              totalPages={Math.ceil(meta.total / meta.per_page)}
              hasNext={meta.has_next && !isPlaceholderData}
              hasPrevious={meta.has_previous && !isPlaceholderData}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} transactions?</DialogTitle>
            <DialogDescription>
              The selected transactions will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmBulkDelete} disabled={isBulkDeleting}>
              {isBulkDeleting ? 'Deleting…' : 'Delete transactions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
