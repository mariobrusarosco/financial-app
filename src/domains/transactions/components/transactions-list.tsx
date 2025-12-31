import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/route';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';
import { Button } from '@/domains/ui-system/components/button';
import { Badge } from '@/domains/ui-system/components/badge';
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
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { useUpdateTransaction } from '../hooks/use-update-transaction';
import { PageHeader } from '@/domains/global/components';

interface TransactionsListProps {
  transactions: I_TransactionResponse[];
  meta?: {
    page: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_previous: boolean;
  };
  isPlaceholderData: boolean;
  onPageChange: (page: number) => void;
}

export const TransactionsList = ({
  transactions,
  meta,
  isPlaceholderData,
  onPageChange,
}: TransactionsListProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const navigate = useNavigate();
  const { drawer } = Route.useSearch();

  const handleEdit = (transaction: I_TransactionResponse) => {
    navigate({ search: prev => ({ ...prev, drawer: 'transaction-edit', transactionId: transaction.id }) });
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

  const isAllSelected = selectedIds.size === transactions.length && transactions.length > 0;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < transactions.length;

  return (
    <div data-ui="transactions-main-screen" className="py-4 space-y-5 rounded-3xl">
      <PageHeader title="Transaction History" icon={ArrowRightLeft} showAddButton={false} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {meta
              ? `${meta.total} transactions found`
              : 'A complete record of all your financial transactions'}
            {isPlaceholderData && <Loader2 className="inline-block h-3 w-3 ml-2 animate-spin" />}
          </p>

          <div className="flex items-center gap-2">
            <Link search={{ drawer: 'category-manager' }}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings2 className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>

            <Link search={{ drawer: 'transaction-create' }}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>

        {/* Pagination - At the top */}
        {meta && meta.total > meta.per_page && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
                {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} transactions
                {isPlaceholderData && <span className="text-xs ml-2">(Previous data shown)</span>}
              </span>
            </div>
            <Pagination
              currentPage={meta.page}
              totalPages={Math.ceil(meta.total / meta.per_page)}
              hasNext={meta.has_next && !isPlaceholderData}
              hasPrevious={meta.has_previous && !isPlaceholderData}
              onPageChange={onPageChange}
              className={isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}
            />
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {selectedIds.size} selected
              </Badge>
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

        <div className={`space-y-2 ${isPlaceholderData ? 'opacity-50 transition-opacity' : ''}`}>
          <>
            <div className="flex items-center gap-3 p-2 border-b">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              <span className="text-xs text-muted-foreground">
                {transactions.length} transactions
              </span>
            </div>

            {transactions.map(transaction => (
              <UnifiedTransactionItem
                key={transaction.id}
                transaction={transaction}
                mode="default"
                onTriggerEditMode={() => handleEdit(transaction)}
                isSelected={selectedIds.has(transaction.id)}
                onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
                showCheckbox={true}
                onDelete={handleDelete}
              />
            ))}
          </>
        </div>
      </div>

      {drawer === 'transaction-edit' && <GlobalDrawer drawerType={drawer} />}
    </div>
  );
};
