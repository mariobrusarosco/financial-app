import { Fragment } from 'react';
import { Surface } from '@/domains/global/components/surface';
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { TransactionCard } from '@/domains/transactions/components/transaction-card';
import { useCreditCardTransactionsInfinite } from '@/domains/credit-cards/hooks/use-credit-card-transactions';
import { CreditCardTransactionFilters } from './credit-card-transaction-filters';
import { useDeleteTransaction } from '@/domains/transactions/hooks/use-bulk-delete-transactions';
import { CreditCard, Loader2, ChevronDown } from 'lucide-react';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import type { I_CreditCardTransactionsParams } from '@/domains/credit-cards/types/types-and-interfaces';

interface CreditCardTransactionsInfiniteProps {
  creditCardId: string;
  filters?: Omit<I_CreditCardTransactionsParams, 'page'>;
  onFiltersChange?: (filters: Omit<I_CreditCardTransactionsParams, 'page'>) => void;
}

export const CreditCardTransactionsInfinite = ({
  creditCardId,
  filters = {},
  onFiltersChange,
}: CreditCardTransactionsInfiniteProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    error,
  } = useCreditCardTransactionsInfinite(creditCardId, filters);

  const { mutate: deleteTransaction } = useDeleteTransaction();

  const handleFiltersChange = (newFilters: I_CreditCardTransactionsParams) => {
    // Remove page from filters since infinite query manages pagination
    const { page, ...filtersWithoutPage } = newFilters;
    onFiltersChange?.(filtersWithoutPage);
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction(transactionId);
  };

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <Surface data-ui="credit-card-transactions-infinite" className="w-full flex-1">
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
      <Surface data-ui="credit-card-transactions-infinite" className="w-full flex-1">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Recent transactions on this credit card</CardDescription>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load transactions: {error?.message}</p>
        </div>
      </Surface>
    );
  }

  // Flatten all pages of transactions
  const allTransactions = data?.pages.flatMap(page => page.data) || [];
  const totalCount = data?.pages[0]?.meta.total || 0;

  return (
    <Surface data-ui="credit-card-transactions-infinite" className="w-full flex-1">
      <div className="space-y-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            Transactions (Infinite Scroll)
            {(isFetchingNextPage || isFetchingPreviousPage) && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription>
            {totalCount > 0
              ? `${allTransactions.length} of ${totalCount} transactions loaded`
              : 'Recent transactions on this credit card'}
          </CardDescription>
        </div>

        <CreditCardTransactionFilters
          params={{ ...filters, page: 1, per_page: 20 }} // Add required props
          onParamsChange={handleFiltersChange}
        />

        <div className="space-y-4">
          {/* Load Previous Button */}
          {hasPreviousPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchPreviousPage()}
                disabled={isFetchingPreviousPage}
                className="flex items-center gap-2"
              >
                {isFetchingPreviousPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading previous...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 rotate-180" />
                    Load previous transactions
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-2">
            {allTransactions.length > 0 ? (
              data?.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page.data.map(transaction => (
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
                </Fragment>
              ))
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {Object.keys(filters).length > 0
                    ? 'No transactions match your filters'
                    : 'No transactions yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters to see more results'
                    : 'Transactions will appear here once you start using this credit card'}
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load more transactions
                  </>
                )}
              </Button>
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && allTransactions.length > 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                You've reached the end of the list • {allTransactions.length} transactions total
              </p>
            </div>
          )}
        </div>
      </div>
    </Surface>
  );
};
