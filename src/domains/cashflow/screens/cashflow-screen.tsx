import { ArrowLeft, CalendarX2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useCashflow } from '@/domains/cashflow/hooks/use-cashflow';
import { CashflowChart } from '@/domains/cashflow/components/cashflow-chart';
import { CashflowHeader } from '@/domains/cashflow/components/cashflow-header';
import { CashflowSummaryCards } from '@/domains/cashflow/components/cashflow-summary-cards';
import {
  fillMonthlySeries,
  getPreviousPeriod,
  getTrendPeriod,
  isFullMonth,
  parseUrlDate,
} from '@/domains/cashflow/utils/cashflow-periods';
import type { I_Period } from '@/domains/cashflow/utils/cashflow-periods';
import { Route } from '@/routes/(auth)/route';
import { Button } from '@/domains/ui-system/components/button';

export const CashflowScreen = () => {
  const { from, to } = Route.useSearch();
  const navigate = Route.useNavigate();
  const previousPeriod = getPreviousPeriod(from, to);
  const trendPeriod = getTrendPeriod(to);

  const { data, isLoading, error } = useCashflow({ date_from: from, date_to: to });
  // Only compare once the selected range is known
  const { data: previousData } = useCashflow(
    { date_from: previousPeriod?.from, date_to: previousPeriod?.to },
    { enabled: Boolean(previousPeriod) }
  );
  const { data: trendData } = useCashflow({ date_from: trendPeriod.from, date_to: trendPeriod.to });
  const trendSeries = fillMonthlySeries(trendData?.monthly_data ?? [], trendPeriod);

  const isEmptyPeriod = data ? data.total_income === 0 && data.total_expenses === 0 : false;

  const goToPeriod = (period: I_Period) =>
    void navigate({ search: prev => ({ ...prev, from: period.from, to: period.to }) });

  return (
    <div data-ui="cashflow-screen" className="space-y-7 pb-8">
      <CashflowHeader activeTab="overview" from={from} to={to} />

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
      ) : (
        // Cards stacked on the left (about 20%), trend chart on the right; stacks on small screens
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(15rem,1fr)_4fr]">
          {!data || isEmptyPeriod ? (
            <EmptyPeriodState
              periodLabel={formatPeriodLabel(from, to)}
              previousPeriod={previousPeriod}
              onGoToPeriod={goToPeriod}
            />
          ) : (
            <CashflowSummaryCards
              summary={data}
              previousSummary={previousData}
              comparisonLabel={previousPeriod?.label}
              stacked
            />
          )}

          <CashflowChart data={trendSeries} from={from} to={to} />
        </div>
      )}
    </div>
  );
};

const EmptyPeriodState = ({
  periodLabel,
  previousPeriod,
  onGoToPeriod,
}: {
  periodLabel: string;
  previousPeriod?: I_Period & { label: string };
  onGoToPeriod: (period: I_Period) => void;
}) => {
  const previousLabel = previousPeriod
    ? formatPeriodLabel(previousPeriod.from, previousPeriod.to)
    : '';

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="rounded-2xl bg-muted p-3">
        <CalendarX2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h2 className="font-semibold text-foreground">No transactions in {periodLabel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick another period, or add transactions to see your income and expenses.
        </p>
      </div>
      {previousPeriod && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onGoToPeriod(previousPeriod)}
        >
          <ArrowLeft className="h-4 w-4" />
          {previousLabel}
        </Button>
      )}
    </div>
  );
};

// "October 2026" for a full month, otherwise "Oct 1 – Oct 18, 2026"
const formatPeriodLabel = (fromValue?: string, toValue?: string) => {
  const from = parseUrlDate(fromValue);
  const to = parseUrlDate(toValue);
  if (!from || !to) return 'this period';
  if (isFullMonth(from, to)) return format(from, 'MMMM yyyy');
  return `${format(from, 'MMM d')} – ${format(to, 'MMM d, yyyy')}`;
};
