import { useState } from 'react';
import type {
  I_Installment,
  I_InstallmentPlan,
  T_InstallmentPlanStatus,
  T_InstallmentStatus,
} from '../types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { Pencil, Trash2, Calendar, ChevronDown, CreditCard, Link2 } from 'lucide-react';
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
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{plan.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Started {format(parseISO(plan.start_date), 'PP')}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <span
                className={cn(
                  'mr-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  PLAN_STATUS_STYLES[plan.status]
                )}
              >
                {plan.status}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Edit plan"
                onClick={() => onEdit(plan.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete plan"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                {nextInstallment
                  ? `Next · ${format(parseISO(nextInstallment.due_date), 'MMM d')}`
                  : 'Next installment'}
              </p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {nextInstallment ? formatCurrency(nextInstallment.amount) : '—'}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3" />
                Remaining
              </p>
              <p className="tabular-nums">
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(remainingValue)}
                </span>{' '}
                <span className="text-xs text-muted-foreground">
                  of {formatCurrency(plan.total_amount)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {paidInstallments} of {plan.installment_count} paid
              </span>
              <span className="font-medium tabular-nums text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {installments.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between border-t border-border/80 px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            {isExpanded ? 'Hide installments' : `Show ${installments.length} installments`}
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>

          {isExpanded && (
            <div className="border-t border-border/80 bg-muted/20 p-4 animate-in slide-in-from-top-2 duration-200">
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2">
                {installments.map(installment => {
                  const status = INSTALLMENT_STATUS[installment.status];
                  return (
                    <li key={installment.id}>
                      <button
                        type="button"
                        onClick={() => openLinkPayment(installment)}
                        title="Link a payment to this installment"
                        className="group w-full rounded-xl border border-border/80 bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/40"
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
        </>
      )}
    </li>
  );
};
