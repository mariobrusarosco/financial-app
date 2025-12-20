import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Surface } from '@/domains/global/components/surface';
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Badge } from '@/domains/ui-system/components/badge';
import { UnifiedTransactionItem } from '@/domains/transactions/components/unified-transaction-item';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import { useCreateTransaction } from '@/domains/transactions/hooks/use-create-transaction';
import {
  useBulkDeleteTransactions,
  useDeleteTransaction,
} from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { AccountTransactionFilters } from './account-transaction-filters';
import { CreditCard, Loader2, Trash2, CheckSquare, Square, Plus } from 'lucide-react';
import type {
  T_TransactionType,
  I_AccountTransactionsParams,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import { useUpdateTransaction } from '../hooks/use-update-transaction';

interface AccountTransactionsListProps {
  accountId: string;
}

export const AccountTransactionsList = ({ accountId }: AccountTransactionsListProps) => {
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { mutate: createTransaction } = useCreateTransaction();
  const { mutate: bulkDeleteTransactions, isPending: isBulkDeleting } = useBulkDeleteTransactions();
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: updateTransaction } = useUpdateTransaction();

  const {
    data: response,
    isLoading,
    isError,
    isPlaceholderData,
  } = useAccountTransactionsPaginated(accountId, params, true); // Include credit cards by default

  const transactions = response?.data || [];
  const meta = response?.meta;

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
    setParams(prev => ({ ...prev, page }));
  };

  const handleEdit = (transaction: I_TransactionResponse) => {
    setEditingId(transaction.id);
  };

  const handleSave = (updatedTransaction: I_TransactionResponse) => {
    updateTransaction(updatedTransaction);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (transaction: I_TransactionResponse) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(String(transaction.id));
    }
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

  const isAllSelected = selectedIds.size === transactions.length && transactions.length > 0;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < transactions.length;

  return (
    <Surface data-ui="account-transactions-list" className="w-full flex-1">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Account Transactions
              {isPlaceholderData && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              {meta
                ? `${meta.total} transactions found`
                : 'Account and credit card transactions for this account'}
              {isPlaceholderData && (
                <span className="text-xs text-muted-foreground ml-2">(Loading new data...)</span>
              )}
            </CardDescription>
          </div>
          <Link search={{ drawer: 'transaction-create' }}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        <AccountTransactionFilters params={params} onParamsChange={setParams} />

        {/* Pagination - Moved to top */}
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
              onPageChange={handlePageChange}
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
          {transactions && transactions.length > 0 ? (
            <>
              {/* Select All Header */}
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
                  isEditing={editingId === transaction.id}
                  isSelected={selectedIds.has(transaction.id)}
                  onSelectionChange={selected => handleSelectTransaction(transaction.id, selected)}
                  showCheckbox={true}
                  onTriggerEditMode={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              ))}
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
      </div>
    </Surface>
  );
};
