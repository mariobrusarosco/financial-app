import { useMemo } from 'react';
import * as dateFns from 'date-fns';
import { CalendarRange } from 'lucide-react';
import { Currency } from '@/domains/ui-system/components/currency';
import { cn } from '@/domains/ui-system/utils';

interface InstallmentPlanPreviewProps {
  totalAmount: number;
  installmentCount: number;
  startDate: string;
}

export const InstallmentPlanPreview = ({
  totalAmount,
  installmentCount,
  startDate,
}: InstallmentPlanPreviewProps) => {
  const installments = useMemo(() => {
    const hasValidAmount = Number.isFinite(totalAmount) && totalAmount > 0;
    const hasValidCount = Number.isInteger(installmentCount) && installmentCount > 0;
    if (!hasValidAmount || !hasValidCount || !startDate) return [];

    const firstDate = dateFns.parseISO(startDate);
    if (!dateFns.isValid(firstDate)) return [];

    const monthlyAmount = totalAmount / installmentCount;
    return Array.from({ length: installmentCount }, (_, i) => ({
      number: i + 1,
      amount: monthlyAmount,
      date: dateFns.addMonths(firstDate, i),
    }));
  }, [totalAmount, installmentCount, startDate]);

  const firstInstallment = installments[0];
  const lastInstallment = installments[installments.length - 1];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4" data-ui="installment-plan-preview">
      <div className="shrink-0">
        <h3 className="text-base font-semibold text-foreground">Plan preview</h3>
        <p className="text-sm text-muted-foreground">Generated schedule based on your input.</p>
      </div>

      {firstInstallment && lastInstallment ? (
        <>
          <div className="shrink-0 rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-xs text-muted-foreground">Monthly payment</p>
            <Currency
              value={firstInstallment.amount}
              color="default"
              className="financial-value text-2xl text-foreground"
            />
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-primary/10 pt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <Currency
                  value={totalAmount}
                  variant="small"
                  color="default"
                  className="text-foreground"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground">
                  {installments.length} {installments.length === 1 ? 'month' : 'months'}
                </p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="h-3 w-3" />
              {dateFns.format(firstInstallment.date, 'MMM yyyy')} →{' '}
              {dateFns.format(lastInstallment.date, 'MMM yyyy')}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <p className="shrink-0 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Installment timeline
            </p>
            <ol className="min-h-0 flex-1 divide-y divide-border/60 overflow-y-auto rounded-xl border border-border/80 bg-card">
              {installments.map(item => {
                const isLast = item.number === installments.length;
                return (
                  <li
                    key={item.number}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2 text-sm',
                      isLast && 'bg-muted/40'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs tabular-nums text-muted-foreground">
                        {item.number}/{installments.length}
                      </span>
                      <span className="font-medium text-foreground">
                        {dateFns.format(item.date, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <Currency
                      value={item.amount}
                      variant="small"
                      color="default"
                      className="text-foreground"
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center text-muted-foreground">
          <CalendarRange className="mb-2 h-8 w-8 opacity-20" />
          <p className="text-xs">
            Fill out the amount and number of installments to see the preview.
          </p>
        </div>
      )}
    </div>
  );
};
