import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { UnifiedTransactionItem } from '@/domains/transactions/components/transaction/unified-transaction-item';
import { Loader2, History } from 'lucide-react';
import { CardDescription } from '@/domains/ui-system/components/card';

interface SubscriptionPaymentHistoryProps {
  subscriptionId: string;
}

export const SubscriptionPaymentHistory = ({ subscriptionId }: SubscriptionPaymentHistoryProps) => {
  const { data, isLoading, isError } = useAllTransactions({
    subscription_id: subscriptionId,
    sort_by: 'date',
    sort_order: 'desc',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive text-sm">Failed to load payment history</p>
      </div>
    );
  }

  const transactions = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold">Payment History</h3>
      </div>
      
      {transactions.length === 0 ? (
        <CardDescription className="py-4 text-center border rounded-lg border-dashed">
          No payments recorded yet for this subscription.
        </CardDescription>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <UnifiedTransactionItem
              key={transaction.id}
              transaction={transaction}
              mode="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
};
