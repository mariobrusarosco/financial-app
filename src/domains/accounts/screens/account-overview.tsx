import { useState } from 'react';
import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';

interface AccountOverviewScreenProps {
  slug: string;
}

export const AccountOverviewScreen = ({ slug }: AccountOverviewScreenProps) => {
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const query = useAccountTransactionsPaginated(slug, params, true);

  const transactions = query.data?.data || [];

  return (
    <div className="space-y-6">
      <div
        data-ui="account-overview-screen"
        className="grid grid-cols-[300px_1fr] justify-between gap-12"
      >
        <AccountBalancePoints slug={slug} />
        <AccountTransactionsList params={params} onParamsChange={setParams} query={query} />
      </div>
    </div>
  );
};
