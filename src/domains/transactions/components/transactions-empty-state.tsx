import { CreditCard } from 'lucide-react';

export const TransactionsEmptyState = () => {
  return (
    <div data-ui="transactions-main-screen-empty" className="w-full flex-1 h-full">
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <div className="p-6 bg-muted-foreground/10 rounded-3xl">
          <CreditCard className="h-15 w-15 text-muted-foreground stroke-1" />
        </div>
        <p className="text-2xl font-light">No transactions yet</p>
        <p className="text-muted-foreground mb-4">
          Transactions will appear here once you start using your accounts
        </p>
      </div>
    </div>
  );
};
