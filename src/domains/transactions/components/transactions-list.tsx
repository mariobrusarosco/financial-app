import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { UnifiedTransactionItem } from '@/domains/transactions/components/transaction/unified-transaction-item';
import { Pagination } from '@/domains/ui-system/components/pagination';
import {
  useBulkDeleteTransactions,
  useDeleteTransaction,
} from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { Loader2, Trash2, CheckSquare, Square, Plus } from 'lucide-react';
import type {
  I_TransactionResponse,
  I_AccountTransactionsParams,
} from '@/domains/transactions/types/types-and-interfaces';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

interface TransactionsListProps {
  transactions: I_TransactionResponse[];
  meta?: {
    page: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_previous: boolean;
  };
  onParamsChange: (params: I_AccountTransactionsParams) => void;
}

export const TransactionsList = ({ transactions, meta, onParamsChange }: TransactionsListProps) => {
  // Hooks
  const { openTransactionCreate } = useGlobalUIState();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [transactionToDelete, setTransactionToDelete] = useState<I_TransactionResponse | null>(
    null
  );
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: updateTransaction, isPending: isUpdatingTransaction } = useUpdateTransaction({});
  // Derived state
  const handleToggleIgnoreTransaction = (transaction: I_TransactionResponse) => {
    updateTransaction({
      id: transaction.id,
      updates: { ignored: !transaction.ignored },
    });
  };
  const isAllSelected = selectedIds.size === transactions.length && transactions.length > 0;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < transactions.length;
  // Hanlders and callbacks
  const handlePageChange = (newPage: number) => {
    onParamsChange({ page: newPage });
  };
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

  const handleDelete = (transaction: I_TransactionResponse) => {
    setTransactionToDelete(transaction);
  };

  const confirmBulkDelete = () => {
    bulkDeleteTransactions(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setIsBulkDeleteDialogOpen(false);
      },
    });
  };

  const confirmSingleDelete = () => {
    if (!transactionToDelete) return;
    deleteTransaction(String(transactionToDelete.id), {
      onSuccess: () => setTransactionToDelete(null),
    });
  };

  return (
    <div data-ui="transactions-main-list" className="flex flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="my-2 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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

        <Button size="sm" onClick={openTransactionCreate} aria-label="Add transaction">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {meta && meta.total > meta.per_page && (
        <div className="flex gap-2 pb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
              {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total}
              {/* {isPlaceholderData && <span className="text-xs ml-2">(Previous data shown)</span>} */}
            </span>
          </div>
          <Pagination
            currentPage={meta.page}
            totalPages={Math.ceil(meta.total / meta.per_page)}
            hasNext={meta.has_next}
            hasPrevious={meta.has_previous}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div
          data-ui="transactions-main-screen-bulk-actions"
          className="flex flex-col gap-3 rounded-xl border border-brand/15 bg-accent/45 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
              {selectedIds.size} selected
            </span>
            <span className="text-sm text-muted-foreground">
              {selectedIds.size === 1 ? 'transaction' : 'transactions'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isBulkDeleting}
              className="text-destructive hover:bg-destructive/10"
            >
              {isBulkDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </Button>
          </div>
        </div>
      )}

      <ul className="grid flex-1 gap-2 overflow-hidden">
        {transactions.map(transaction => (
          <UnifiedTransactionItem
            key={transaction.id}
            transaction={transaction}
            isPending={isUpdatingTransaction}
            onIgnoreTransaction={() => handleToggleIgnoreTransaction(transaction)}
            showCheckbox={true}
            // mode="default"
            // onTriggerEditMode={() => handleEdit(transaction)}
            isSelected={selectedIds.has(transaction.id)}
            onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      <Dialog
        open={Boolean(transactionToDelete)}
        onOpenChange={open => !open && setTransactionToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction?</DialogTitle>
            <DialogDescription>
              {transactionToDelete?.description ?? 'This transaction'} will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmSingleDelete}>
              Delete transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};
