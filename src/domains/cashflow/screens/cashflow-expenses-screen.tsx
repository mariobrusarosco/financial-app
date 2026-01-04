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
} from '../utils/grouping-utils';
import { ExpensesByAccount } from '../components/expenses/expenses-by-account';
import { ExpensesByCategory } from '../components/expenses/expenses-by-category';
import { ExpensesByCreditCard } from '../components/expenses/expenses-by-credit-card';

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
  const { data: accounts } = useAccounts();
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
      const accountMap = new Map(accounts?.map(a => [a.id, a.name]));
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
    }, [transactionsData, accounts, creditCards, categories]);

  const isLoading = isLoadingTransactions;

  return (
    <div data-ui="cashflow-expenses-screen" className="py-4 space-y-8 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Expenses Analysis" icon={TrendingDown} showAddButton={false} />
        <GlobalDateFilter />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-muted/10 rounded-3xl border border-dashed border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Analyzing expenses...</p>
        </div>
      ) : transactionsError ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-center">
          <p className="font-semibold">Failed to load expenses</p>
          <p className="text-sm opacity-80">{(transactionsError as any)?.message}</p>
        </div>
      ) : !hasExpenses ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-3xl border border-dashed">
          <h2 className="text-xl font-medium text-muted-foreground mb-2">
            No expenses found for this period
          </h2>
          <p className="text-sm text-muted-foreground/60 max-w-md text-center">
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
