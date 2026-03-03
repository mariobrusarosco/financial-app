import { useState, useMemo } from 'react';
import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { AccountBalancePoints } from '@/domains/accounts/components/account-balance-points';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import { Route } from '@/routes/(auth)/route';
import { CategoryManagerButton } from '@/domains/categories/components/category-manager-button';

interface AccountOverviewScreenProps {
  slug: string;
}

export const AccountOverviewScreen = ({ slug }: AccountOverviewScreenProps) => {
  const { from, to } = Route.useSearch();
  const [params, setParams] = useState<I_AccountTransactionsParams>({
    page: 1,
    per_page: 100,
    sort_by: 'date',
    sort_order: 'desc',
  });

  const mergedParams = useMemo(
    () => ({
      ...params,
      date_from: from,
      date_to: to,
    }),
    [params, from, to]
  );

  const transactionsQuery = useAccountTransactionsPaginated(slug, mergedParams, true);

  return (
    <div data-ui="account-overview-screen" className="">
      <AccountTransactionsList
        params={mergedParams}
        onParamsChange={setParams}
        query={transactionsQuery}
      />
    </div>
  );
};
