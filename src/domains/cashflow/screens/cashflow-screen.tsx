import { BarChart3, Loader2, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/domains/global/components';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';
import { useCashflow } from '../hooks/use-cashflow';
import { CashflowChart } from '../components/cashflow-chart';
import { CashflowSummaryCards } from '../components/cashflow-summary-cards';
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
    <div data-ui="cashflow-screen" className="py-4 space-y-8 rounded-3xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Cashflow" icon={BarChart3} showAddButton={false} />
        <div className="flex items-center gap-2">
          <Link to="/cashflow/expenses" search={{ from, to }}>
            <Button variant="outline" size="sm">
              <TrendingDown className="h-4 w-4 mr-2" />
              Analyze Expenses
            </Button>
          </Link>
          <GlobalDateFilter />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-muted/10 rounded-3xl border border-dashed border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Calculating your cashflow data...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-center">
          <p className="font-semibold">Failed to load cashflow data</p>
          <p className="text-sm opacity-80">{(error as any)?.message || 'An unexpected error occurred'}</p>
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
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-3xl border border-dashed">
          <h2 className="text-xl font-medium text-muted-foreground mb-2">No data found for this period</h2>
          <p className="text-sm text-muted-foreground/60 max-w-md text-center">
            Try adjusting your date filters to see your income and expenses.
          </p>
        </div>
      )}
    </div>
  );
};