import { ArrowRightLeft, XCircle } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';

export const TransactionsErrorState = () => {
  return (
    <div data-ui="transactions-main-screen-error" className="w-full flex-1 h-full">
      <div className="flex flex-col gap-4 h-full">
        <PageHeader title="Transaction History" icon={ArrowRightLeft} showAddButton={false} />
        <h2>A complete record of all your financial transactions</h2>

        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <div className="p-6 bg-destructive/10 rounded-3xl">
            <XCircle className="h-15 w-15 text-destructive stroke-1" />
          </div>
          <p className="text-destructive text-2xl font-light">
            Ops! Something went wrong while loading transactions
          </p>
        </div>
      </div>
    </div>
  );
};
