import { useEffect } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { AccountTransactionsList } from '@/domains/transactions/components/account-transactions-list';
import { useAccountTransactionsPaginated } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import type { I_AccountTransactionsParams } from '@/domains/transactions/types/types-and-interfaces';
import AccountTransactionAnalyzer from '@/domains/transactions/components/account-transaction-analyzer';

const accountExpensesRoute = getRouteApi('/(auth)/accounts/$slug/expenses/');
const START_PAGE = 1;
const ITEMS_PER_PAGE = 100;
const DEFAULT_SORT_BY = 'date';
const DEFAULT_SORT_ORDER = 'desc';

export const AccountExpensesScreen = ({ slug }: AccountExpensesScreenProps) => {
  const search = accountExpensesRoute.useSearch();
  const navigate = accountExpensesRoute.useNavigate();

  const params: I_AccountTransactionsParams = {
    page: search.page ?? START_PAGE,
    per_page: search.per_page ?? ITEMS_PER_PAGE,
    amount_min: search.amount_min,
    amount_max: search.amount_max,
    category: search.category,
    description_contains: search.description_contains,
    movement_type: 'expense',
    is_paid: search.is_paid,
    sort_by: search.sort_by ?? DEFAULT_SORT_BY,
    sort_order: search.sort_order ?? DEFAULT_SORT_ORDER,
    date_from: search.from,
    date_to: search.to,
  };

  const handleParamsChange = (nextParams: I_AccountTransactionsParams) => {
    void navigate({
      search: prev => ({
        ...prev,
        page: nextParams.page,
        per_page: nextParams.per_page,
        amount_min: nextParams.amount_min,
        amount_max: nextParams.amount_max,
        category: nextParams.category,
        description_contains: nextParams.description_contains,
        is_paid: nextParams.is_paid,
        sort_by: nextParams.sort_by,
        sort_order: nextParams.sort_order,
      }),
    });
  };

  useEffect(
    function InitializeAccountExpensesSearchParams() {
      if (search.page && search.per_page && search.sort_by && search.sort_order) {
        return;
      }

      void navigate({
        search: prev => ({
          ...prev,
          page: search.page ?? START_PAGE,
          per_page: search.per_page ?? ITEMS_PER_PAGE,
          sort_by: search.sort_by ?? DEFAULT_SORT_BY,
          sort_order: search.sort_order ?? DEFAULT_SORT_ORDER,
        }),
        replace: true,
      });
    },
    [navigate, search.page, search.per_page, search.sort_by, search.sort_order]
  );

  const query = useAccountTransactionsPaginated(slug, params, true);
  const transactions = query.data?.data || [];

  return (
    <div>
      <div
        data-ui="account-expenses-screen"
        className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]"
      >
        <AccountTransactionAnalyzer transactions={transactions} type="expense" />
        <AccountTransactionsList
          params={params}
          onParamsChange={handleParamsChange}
          query={query}
          showMovementTypeFilter={false}
        />
      </div>
    </div>
  );
};

interface AccountExpensesScreenProps {
  slug: string;
}
