import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/domains/transactions/api/transactions.api';
import { GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY } from '@/domains/transactions/hooks/use-account-transactions-paginated';
import { toAccountExpensesCharts } from '@/domains/accounts/utils/expense-charts';
import type {
  I_AccountTransactionsParams,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';

// The API returns at most 100 transactions per page
const PER_PAGE = 100;

interface I_AccountExpensesPages {
  expenses: I_TransactionResponse[];
  dateFrom: string;
  dateTo: string;
}

// Every expense of the account in the range, credit card purchases included.
// The API doesn't sum expenses by day yet, so this loads every page and the charts add them up.
export const useAccountExpenses = (accountId: string, dateFrom = '', dateTo = '') => {
  const params: I_AccountTransactionsParams = {
    movement_type: 'expense',
    date_from: dateFrom,
    date_to: dateTo,
    include_credit_cards: true,
  };

  const expensesQuery = useQuery({
    // Kept under the paginated list's key, so every transaction change that refreshes the list refreshes the charts
    queryKey: [...GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY(accountId, params), 'all-pages'],
    queryFn: async (): Promise<I_AccountExpensesPages> => ({
      expenses: await getEveryPage(accountId, params),
      dateFrom,
      dateTo,
    }),
    select: toChartsForTheirRange,
    enabled: !!accountId && !!dateFrom && !!dateTo,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    expenses: {
      query: expensesQuery,
      actions: {
        refetchExpenses: expensesQuery.refetch,
      },
    },
  };
};

// The range travels with the data, so the previous range's charts stay right while the next one loads
const toChartsForTheirRange = ({ expenses, dateFrom, dateTo }: I_AccountExpensesPages) =>
  toAccountExpensesCharts(expenses, dateFrom, dateTo);

const getEveryPage = async (accountId: string, params: I_AccountTransactionsParams) => {
  const expenses: I_TransactionResponse[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await transactionsApi.getAccountTransactions(accountId, {
      ...params,
      page,
      per_page: PER_PAGE,
    });
    expenses.push(...response.data);
    hasNext = response.meta.has_next;
    page += 1;
  }

  return expenses;
};
