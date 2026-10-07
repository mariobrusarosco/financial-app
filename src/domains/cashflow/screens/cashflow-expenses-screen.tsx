import { useMemo } from 'react';
import { Route } from '@/routes/(auth)/route';
import { PageHeader } from '@/domains/global/components';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useCategories } from '@/domains/categories/hooks/use-categories';
import { Loader2, TrendingDown } from 'lucide-react';
import {
  groupExpensesByAccount,
  groupExpensesByCategory,
  groupExpensesByCreditCard,
} from '@/domains/cashflow/utils/grouping-utils';
import { ExpensesByAccount } from '@/domains/cashflow/components/expenses/expenses-by-account';
import { ExpensesByCategory } from '@/domains/cashflow/components/expenses/expenses-by-category';
import { ExpensesByCreditCard } from '@/domains/cashflow/components/expenses/expenses-by-credit-card';

export const CashflowExpensesScreen = () => {
  const { from, to } = Route.useSearch();

  // 1. Fetch Transactions
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useAllTransactions({
    date_from: from,
    date_to: to,
    movement_type: 'expense',
    per_page: 100, // Temporary limit
  });

  // 2. Fetch Accounts, Credit Cards, and Categories for Mapping
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const { data: creditCardsResponse } = useCreditCards(undefined);
  const creditCards = creditCardsResponse?.data || [];
  const { data: categories = [] } = useCategories();

  // 3. Process Data
  const { groupedByCategory, groupedByAccount, groupedByCreditCard, overallTotal, hasExpenses } =
    useMemo(() => {
      const transactions = transactionsData?.data || [];
      if (transactions.length === 0) {
        return {
          groupedByCategory: [],
          groupedByAccount: [],
          groupedByCreditCard: [],
          overallTotal: 0,
          hasExpenses: false,
        };
      }

      // Build Maps
      const accountMap = new Map(
        accountsQuery.data?.accounts.map(account => [account.id, account.name])
      );
      const creditCardMap = new Map(creditCards?.map(cc => [cc.id, cc.name]));

      const categoryMap = new Map<string, string>();
      categories.forEach(c => {
        categoryMap.set(c.id, c.name);
        c.children?.forEach(child => {
          categoryMap.set(child.id, child.name);
        });
      });

      // Grouping
      const byCategory = groupExpensesByCategory(transactions, categoryMap);
      const byAccount = groupExpensesByAccount(transactions, accountMap);
      const byCreditCard = groupExpensesByCreditCard(transactions, creditCardMap);

      const total = transactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

      return {
        groupedByCategory: byCategory,
        groupedByAccount: byAccount,
        groupedByCreditCard: byCreditCard,
        overallTotal: total,
        hasExpenses: true,
      };
    }, [transactionsData, accountsQuery.data, creditCards, categories]);

  const isLoading = isLoadingTransactions;

  return (
    <div data-ui="cashflow-expenses-screen" className="space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <PageHeader title="Expenses Analysis" icon={TrendingDown} showAddButton={false} />
        <GlobalDateFilter />
      </div>

      {isLoading ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8">
          <Loader2 className="mb-4 h-7 w-7 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Analyzing expenses...</p>
        </div>
      ) : transactionsError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load expenses</p>
          <p className="mt-1 text-sm opacity-80">
            {transactionsError instanceof Error ? transactionsError.message : 'Unexpected error'}
          </p>
        </div>
      ) : !hasExpenses ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <h2 className="mb-2 font-semibold text-foreground">No expenses found for this period</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Try adjusting your date filters to see your expense breakdown.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <ExpensesByAccount groupedData={groupedByAccount} overallTotal={overallTotal} />
            <div className="h-6" />
            <ExpensesByCreditCard groupedData={groupedByCreditCard} overallTotal={overallTotal} />
          </div>

          <div className="lg:col-span-2">
            <ExpensesByCategory groupedData={groupedByCategory} overallTotal={overallTotal} />
          </div>
        </div>
      )}
    </div>
  );
};
