import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { TransactionRow } from '@/domains/transactions/components/transaction/transaction-row';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { BulkTransactionActions } from '@/domains/transactions/components/bulk-transaction-actions';
import { useBulkDeleteTransactions } from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { CheckSquare, Square, Plus } from 'lucide-react';
import type {
  I_TransactionResponse,
  I_AccountTransactionsParams,
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
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();
  // Derived state
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

  const confirmBulkDelete = () => {
    bulkDeleteTransactions(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setIsBulkDeleteDialogOpen(false);
      },
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
        <BulkTransactionActions
          transactionIds={Array.from(selectedIds)}
          isDeleting={isBulkDeleting}
          onClearSelection={() => setSelectedIds(new Set())}
          onDeleteSelected={handleDeleteSelected}
        />
      )}

      <ul className="grid flex-1 gap-2 overflow-hidden">
        {transactions.map(transaction => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            isSelected={selectedIds.has(transaction.id)}
            onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
          />
        ))}
      </ul>

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
