import { useState, useMemo } from 'react';
import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import AccountTransactionAnalyzer from '@/domains/transactions/components/account-transaction-analyzer';
import { Route } from '@/routes/(auth)/route';

interface AccountExpensesScreenProps {
  slug: string;
}

export const AccountExpensesScreen = ({ slug }: AccountExpensesScreenProps) => {
  const { from, to } = Route.useSearch();
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 100,
    sort_by: 'date',
    sort_order: 'desc',
    movement_type: 'expense',
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
        data-ui="account-expenses-screen"
        className="grid grid-cols-1 md:grid-cols-[300px_1fr] justify-between gap-12"
      >
        <AccountTransactionAnalyzer transactions={transactions} type="expense" />
        <AccountTransactionsList params={mergedParams} onParamsChange={setParams} query={query} />
      </div>
    </div>
  );
};
