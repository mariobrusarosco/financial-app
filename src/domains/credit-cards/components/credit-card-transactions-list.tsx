import { Surface } from '@/domains/global/components/surface';
import { CardTitle, CardDescription } from '@/domains/ui-system/components/card';
import { TransactionCard } from '@/domains/transactions/components/transaction-card';
import { useCreditCardTransactions } from '@/domains/credit-cards/hooks/use-credit-card-transactions';
import { CreditCard, Loader2 } from 'lucide-react';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';

interface CreditCardTransactionsListProps {
  creditCardId: string;
}

export const CreditCardTransactionsList = ({ creditCardId }: CreditCardTransactionsListProps) => {
  const { data: transactions, isLoading, isError } = useCreditCardTransactions(creditCardId);

  if (isLoading) {
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

  return (
    <Surface data-ui="credit-card-transactions-list" className="w-full flex-1">
      <div>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Recent transactions on this credit card</CardDescription>
      </div>

      <div className="space-y-2">
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
              />
            ))}
            {transactions.length >= 10 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Showing recent {transactions.length} transactions
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground mb-4">
              Transactions will appear here once you start using this credit card
            </p>
          </div>
        )}
      </div>
    </Surface>
  );
};
