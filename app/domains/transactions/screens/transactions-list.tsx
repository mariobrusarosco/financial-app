import { TransactionsTable } from '@/domains/transactions/components/transactions-table';

export const TransactionsListScreen = () => {
  return (
    <div className="space-y-6">
      <TransactionsTable />
    </div>
  );
};
