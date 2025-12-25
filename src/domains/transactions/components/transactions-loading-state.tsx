import { ArrowRightLeft, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';

export const TransactionsLoadingState = () => {
  return (
    <div data-ui="transactions-main-screen-loading" className="w-full flex-1 h-full">
      <div className="flex flex-col gap-4 h-full">
        <PageHeader title="Transaction History" icon={ArrowRightLeft} showAddButton={false} />
        <h2>A complete record of all your financial transactions</h2>

        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <div className="p-6 rounded-3xl">
            <RefreshCcw className="h-15 w-15 animate-spin text-muted-foreground/50 stroke-1 transform-origin-center" />
          </div>
        </div>
      </div>
    </div>
  );
};
