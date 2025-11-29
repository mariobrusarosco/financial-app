import { Card, CardContent, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAccountRecentTransactions } from '@/domains/transactions/hooks/use-account-transactions';
import { UnifiedTransactionItem } from '@/domains/transactions/components/unified-transaction-item';

interface RecentTransactionsProps {
  accountId?: string;
}

export function RecentTransactions({ accountId }: RecentTransactionsProps) {
  const { data, isLoading, error } = useAccountRecentTransactions(accountId, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <p className="text-destructive">Failed to load transactions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const transactions = data?.data || [];

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold">Recent Transactions</p>
      {transactions.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        transactions.map(transaction => (
          <UnifiedTransactionItem
            key={transaction.id}
            transaction={transaction}
            mode="default"
            isSelected={false}
          />
        ))
      )}
      <Button variant="outline" className="w-full" asChild>
        <Link to="/transactions">
          View All Transactions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
