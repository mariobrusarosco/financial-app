import { useState } from 'react';
import type {
  I_Installment,
  I_InstallmentPlan,
  T_InstallmentPlanStatus,
  T_InstallmentStatus,
} from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, ChevronDown, Link2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import { useNavigate } from '@tanstack/react-router';

interface InstallmentPlanItemProps {
  plan: I_InstallmentPlan;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Without the currency sign, for a total shown right after a formatted amount
const formatAmount = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PLAN_STATUS_STYLES: Record<T_InstallmentPlanStatus, string> = {
  active: 'bg-positive/10 text-positive',
  finished: 'bg-primary/10 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

const INSTALLMENT_STATUS: Record<T_InstallmentStatus, { label: string; className: string }> = {
  linked: { label: 'Paid', className: 'bg-positive/10 text-positive' },
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive' },
};

export const InstallmentPlanItem = ({ plan, onEdit, onDelete }: InstallmentPlanItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const installments = plan.installments ?? [];
  const paidInstallments = installments.filter(i => i.status === 'linked').length;
  const progress = plan.installment_count ? (paidInstallments / plan.installment_count) * 100 : 0;
  const remainingValue = installments
    .filter(i => i.status !== 'linked')
    .reduce((acc, i) => acc + i.amount, 0);
  const nextInstallment = installments.find(i => i.status !== 'linked');

  const openLinkPayment = (installment: I_Installment) => {
    (navigate as any)({
      search: (prev: any) => ({
        ...prev,
        drawer: 'installment-link-payment',
        installmentId: installment.id,
        planId: plan.id,
      }),
    });
  };

  return (
    <li
      data-ui="installment-plan-item"
      className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-panel)]"
    >
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-baseline gap-2">
            {/* The name keeps its width; the start date is what gets cut */}
            <p className="max-w-full shrink-0 truncate font-semibold text-foreground">
              {plan.name}
            </p>
            <p className="hidden min-w-0 truncate text-xs text-muted-foreground sm:block">
              Started {format(parseISO(plan.start_date), 'PP')}
            </p>
          </div>

          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
              PLAN_STATUS_STYLES[plan.status]
            )}
          >
            {plan.status}
          </span>
          <div className="flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Edit plan"
              onClick={() => onEdit(plan.id)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete plan"
              onClick={() => onDelete(plan.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm tabular-nums">
          <p>
            <span className="text-xs text-muted-foreground">
              {nextInstallment
                ? `Next · ${format(parseISO(nextInstallment.due_date), 'MMM d')}`
                : 'Next'}
            </span>{' '}
            <span className="font-semibold text-foreground">
              {nextInstallment ? formatCurrency(nextInstallment.amount) : '—'}
            </span>
          </p>
          <p>
            <span className="text-xs text-muted-foreground">Remaining</span>{' '}
            <span className="font-semibold text-foreground">{formatCurrency(remainingValue)}</span>{' '}
            <span className="text-xs text-muted-foreground">
              of {formatAmount(plan.total_amount)}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {paidInstallments}/{plan.installment_count} paid · {Math.round(progress)}%
          </span>
          {installments.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {isExpanded ? 'Hide' : `${installments.length} installments`}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')}
              />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border/80 bg-muted/20 p-3 animate-in slide-in-from-top-2 duration-200">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {installments.map(installment => {
              const status = INSTALLMENT_STATUS[installment.status];
              return (
                <li key={installment.id}>
                  <button
                    type="button"
                    onClick={() => openLinkPayment(installment)}
                    title="Link a payment to this installment"
                    className="group w-full rounded-xl border border-border/80 bg-card p-2.5 text-left transition-colors hover:border-primary/30 hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {format(parseISO(installment.due_date), 'MMM d, yyyy')}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                        #{installment.number}
                        <Link2 className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(installment.amount)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
};
