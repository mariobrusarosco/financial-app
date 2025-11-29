import { useState } from 'react';
import { Surface } from '@/domains/global/components/surface';
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { TransactionCard } from '@/domains/transactions/components/transaction-card';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { useCreditCardTransactions } from '@/domains/credit-cards/hooks/use-credit-card-transactions';
import { CreditCardTransactionFilters } from './credit-card-transaction-filters';
import { useDeleteTransaction } from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { CreditCard, Loader2 } from 'lucide-react';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import type { I_CreditCardTransactionsParams } from '@/domains/credit-cards/types/types-and-interfaces';

interface CreditCardTransactionsListProps {
  creditCardId: string;
}

export const CreditCardTransactionsList = ({ creditCardId }: CreditCardTransactionsListProps) => {
  const [params, setParams] = useState<I_CreditCardTransactionsParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const {
    data: response,
    isLoading,
    isError,
    isPlaceholderData,
    isPreviousData,
  } = useCreditCardTransactions(creditCardId, params);

  const { mutate: deleteTransaction } = useDeleteTransaction();

  const transactions = response?.data || [];
  const meta = response?.meta;

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  // Show loading state only on initial load, not when using placeholder data
  if (isLoading && !isPlaceholderData) {
    return (
      <Surface data-ui="credit-card-transactions-list" className="w-full flex-1">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions on this credit card</CardDescription>
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
      <Surface data-ui="credit-card-transactions-list" className="w-full flex-1">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions on this credit card</CardDescription>
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

  return (
    <Surface data-ui="credit-card-transactions-list" className="w-full flex-1">
      <div className="space-y-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            Transactions
            {isPlaceholderData && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription>
            {meta ? `${meta.total} transactions found` : 'Recent transactions on this credit card'}
            {isPlaceholderData && (
              <span className="text-xs text-muted-foreground ml-2">(Loading new data...)</span>
            )}
          </CardDescription>
        </div>

        <CreditCardTransactionFilters params={params} onParamsChange={setParams} />

        <div className={`space-y-2 ${isPlaceholderData ? 'opacity-50 transition-opacity' : ''}`}>
          {transactions && transactions.length > 0 ? (
            <>
              {transactions.map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  id={transaction.id}
                  description={transaction.description}
                  category={transaction.category}
                  amount={transaction.amount.toString()}
                  date={transaction.date}
                  movementType={transaction.movement_type as T_TransactionType}
                  isPaid={transaction.is_paid}
                  creditCardId={creditCardId}
                  onDelete={handleDelete}
                />
              ))}

              {meta && meta.total > meta.per_page && (
                <div className="pt-4">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={Math.ceil(meta.total / meta.per_page)}
                    hasNext={meta.has_next && !isPlaceholderData} // Disable navigation while loading
                    hasPrevious={meta.has_previous && !isPlaceholderData}
                    onPageChange={handlePageChange}
                    className={isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}
                  />

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(meta.page - 1) * meta.per_page + 1} to{' '}
                      {Math.min(meta.page * meta.per_page, meta.total)} of {meta.total} transactions
                      {isPlaceholderData && (
                        <span className="text-xs ml-2">(Previous data shown)</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
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
                    params[key as keyof I_CreditCardTransactionsParams]
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
                    params[key as keyof I_CreditCardTransactionsParams]
                )
                  ? 'Try adjusting your filters to see more results'
                  : 'Transactions will appear here once you start using this credit card'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Surface>
  );
};
