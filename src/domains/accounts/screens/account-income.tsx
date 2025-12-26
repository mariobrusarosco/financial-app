import { useState, useMemo } from 'react';
import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';
import AccountTransactionAnalyzer from '@/domains/transactions/components/account-transaction-analyzer';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/route';

interface AccountIncomeScreenProps {
  slug: string;
}

export const AccountIncomeScreen = ({ slug }: AccountIncomeScreenProps) => {
  const { from, to } = Route.useSearch();
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 20,
    sort_by: 'date',
    sort_order: 'desc',
    movement_type: 'income',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from,
      date_to: to,
    }),
    [params, from, to]
  );

  const query = useAccountTransactionsPaginated(slug, mergedParams, true);

  const transactions = query.data?.data || [];

  return (
    <div className="space-y-6">
      <div
        data-ui="account-income-screen"
        className="grid grid-cols-[300px_1fr] justify-between gap-12"
      >
        <AccountTransactionAnalyzer transactions={transactions} type="income" />
      </div>
      <AccountTransactionsList params={mergedParams} onParamsChange={setParams} query={query} />
    </div>
  );
};
