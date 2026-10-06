import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { UnifiedTransactionItem } from '@/domains/transactions/components/transaction/unified-transaction-item';
import { Pagination } from '@/domains/ui-system/components/pagination';
import {
  useBulkDeleteTransactions,
  useDeleteTransaction,
} from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import {
  Loader2,
  Trash2,
  CheckSquare,
  Square,
  Plus,
  Settings2,
  ArrowRightLeft,
} from 'lucide-react';
import type {
  I_TransactionResponse,
  I_AccountTransactionsParams,
} from '@/domains/transactions/types/types-and-interfaces';
import { PageHeader } from '@/domains/global/components';
import { useUpdateTransaction } from '@/domains/transactions/hooks/use-update-transaction';
import { useQueryClient } from '@tanstack/react-query';
import { GET_ALL_TRANSACTIONS_QUERY_KEY } from '@/domains/transactions/api/keys';

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
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: updateTransaction, isPending: isUpdatingTransaction } = useUpdateTransaction({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GET_ALL_TRANSACTIONS_QUERY_KEY(),
      });
    },
  });
  const navigate = useNavigate();

  // Derived state
  const handleToggleIgnoreTransaction = (id: string, currIgnoreValue: boolean) => {
    updateTransaction({ id, updates: { ignored: !currIgnoreValue } });
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

    if (
      window.confirm(`Are you sure you want to delete ${selectedIds.size} selected transactions?`)
    ) {
      bulkDeleteTransactions(Array.from(selectedIds), {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
      });
    }
  };

  const handleDelete = (transaction: I_TransactionResponse) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(String(transaction.id));
    }
  };

  return (
    <div data-ui="transactions-main-list" className="rounded-3xl flex flex-col gap-2 flex-1">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors my-4"
        >
          {isAllSelected ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : isPartiallySelected ? (
            <div className="h-4 w-4 border-2 border-primary rounded bg-primary/20 flex items-center justify-center">
              <div className="h-2 w-2 bg-primary rounded-sm" />
            </div>
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
        </button>

        <Link search={{ drawer: 'transaction-create' }}>
          <Button size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* <Link search={{ drawer: 'category-manager' }}>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Settings2 className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </Link> */}

      {meta && meta.total > meta.per_page && (
        <div className="flex gap-2 pb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-sea-blue">
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
          className="flex items-center justify-between p-3 my bg-muted/50 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <div variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {selectedIds.size} selected
            </div>
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

      <div className="max-w-[650px] overflow-hidden gap-1 flex-1">
        {transactions.map(transaction => (
          <UnifiedTransactionItem
            key={transaction.id}
            transaction={transaction}
            isPending={isUpdatingTransaction}
            onIgnoreTransaction={() =>
              handleToggleIgnoreTransaction(transaction.id, transaction.ignored)
            }
            showCheckbox={true}
            // mode="default"
            // onTriggerEditMode={() => handleEdit(transaction)}
            isSelected={selectedIds.has(transaction.id)}
            onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
