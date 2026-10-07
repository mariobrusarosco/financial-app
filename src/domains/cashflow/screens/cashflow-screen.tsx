import { BarChart3, Loader2, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';
import { useCashflow } from '@/domains/cashflow/hooks/use-cashflow';
import { CashflowChart } from '@/domains/cashflow/components/cashflow-chart';
import { CashflowSummaryCards } from '@/domains/cashflow/components/cashflow-summary-cards';
import { Route } from '@/routes/(auth)/route';
import { Link } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';

export const CashflowScreen = () => {
  const { from, to } = Route.useSearch();
  const { data, isLoading, error } = useCashflow({
    date_from: from,
    date_to: to,
  });

  return (
    <div data-ui="cashflow-screen" className="space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <PageHeader title="Cashflow" icon={BarChart3} showAddButton={false} />
        <div className="flex items-center gap-2">
          <Link to="/cashflow/expenses" search={{ from, to }}>
            <Button variant="outline" size="sm">
              <TrendingDown className="h-4 w-4 mr-2" />
              Analyze expenses
            </Button>
          </Link>
          <GlobalDateFilter />
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8">
          <Loader2 className="mb-4 h-7 w-7 animate-spin text-brand" />
          <p className="text-sm text-muted-foreground">Calculating your cashflow data...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
          <p className="font-semibold">Failed to load cashflow data</p>
          <p className="mt-1 text-sm opacity-80">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      ) : data ? (
        <>
          <CashflowSummaryCards
            totalIncome={data.total_income}
            totalExpenses={data.total_expenses}
            netCashflow={data.net_cashflow}
            savingsRate={data.savings_rate}
          />

          <div className="grid grid-cols-1 gap-6">
            <CashflowChart data={data.monthly_data} />
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <h2 className="mb-2 font-semibold text-foreground">No data found for this period</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Try adjusting your date filters to see your income and expenses.
          </p>
        </div>
      )}
    </div>
  );
};
