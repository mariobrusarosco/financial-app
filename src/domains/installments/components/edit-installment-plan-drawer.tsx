import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/installments/index';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { DrawerDescription, DrawerTitle } from '@/domains/ui-system/components/drawer';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Edit,
  Link as LinkIcon,
  Loader2,
  Check,
  Pencil,
  Store,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type * as React from 'react';
import { format, parseISO } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { INSTALLMENTS_QUERY_KEYS } from '@/domains/installments/api/keys';
import type {
  I_Installment,
  I_InstallmentPlan,
  T_InstallmentPlanStatus,
  T_InstallmentStatus,
} from '@/domains/installments/types/types-and-interfaces';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { TagChips } from '@/domains/tags/components/tag-chips';
import { VendorSelector } from '@/domains/vendors/components/vendor-selector';
import { Input } from '@/domains/ui-system/components/input';
import { useUpdateInstallmentPlan } from '../hooks/use-update-installment-plan';
import { installmentsApi } from '../api/installments.api';
import { cn } from '@/domains/ui-system/utils';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (isoDate: string, pattern = 'MMM d, yyyy') => format(parseISO(isoDate), pattern);

// The API calls a paid installment "linked" (it's linked to the transaction that paid it)
const INSTALLMENT_STATUS: Record<
  T_InstallmentStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning', icon: CalendarDays },
  linked: { label: 'Paid', className: 'bg-positive/10 text-positive', icon: CheckCircle2 },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

const PLAN_STATUS: Record<T_InstallmentPlanStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-brand/10 text-brand' },
  finished: { label: 'Finished', className: 'bg-positive/10 text-positive' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

export const EditInstallmentPlanDrawer = () => {
  const navigate = useNavigate();
  const { planId } = Route.useSearch();
  const params = useParams({ strict: false });
  const queryClient = useQueryClient();
  const { data: creditCardsData } = useCreditCards(undefined);

  // Cache-first approach: Try to find plan in ANY paginated cache
  // Note: We use getQueriesData (plural) because the cache key includes params
  const cachedPlanData = queryClient.getQueriesData<{
    data: I_InstallmentPlan[];
  }>({
    queryKey: INSTALLMENTS_QUERY_KEYS.planList(params),
  });

  const cachedPlan = cachedPlanData
    .flatMap(([, data]) => data?.data ?? [])
    .find(plan => plan.id === planId);

  // 2. Fetch data if not in cache, using cached item as initialData
  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: INSTALLMENTS_QUERY_KEYS.planDetail(planId!),
    queryFn: () => installmentsApi.getPlan(planId!),
    enabled: !!planId,
    initialData: cachedPlan,
  });

  const handleClose = () => {
    navigate({
      search: (prev: any) => {
        const next = { ...prev };
        delete next.drawer;
        delete next.planId;
        return next;
      },
    });
  };

  const openLinkPayment = (installment: I_Installment) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        drawer: 'installment-link-payment',
        installmentId: installment.id,
      }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <p>Failed to load installment plan.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <DrawerHeader title="Installment plan" icon={Edit} />
        <p>Installment plan not found.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  const installments = [...(plan.installments ?? [])].sort((a, b) => a.number - b.number);
  const paidInstallments = installments.filter(installment => installment.status === 'linked');
  const paidAmount = paidInstallments.reduce((sum, installment) => sum + installment.amount, 0);
  const remainingAmount = (plan.total_amount || 0) - paidAmount;
  const progress =
    plan.installment_count > 0 ? (paidInstallments.length / plan.installment_count) * 100 : 0;
  const nextInstallment = installments.find(installment => installment.status !== 'linked');
  const installmentAmount =
    installments[0]?.amount ?? plan.total_amount / Math.max(plan.installment_count, 1);
  const creditCard = creditCardsData?.data?.find(card => card.id === plan.credit_card_id);
  const planStatus = PLAN_STATUS[plan.status] ?? PLAN_STATUS.active;

  return (
    <div
      className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6 overflow-y-auto p-4 md:p-6"
      data-ui="edit-installment-plan-drawer"
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-border/70 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
          <CalendarDays className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <PlanNameEditor planId={plan.id} name={plan.name} />
            <span
              className={cn('rounded-full px-2 py-0.5 text-xs font-medium', planStatus.className)}
            >
              {planStatus.label}
            </span>
          </div>
          <DrawerDescription className="text-sm text-muted-foreground">
            {plan.installment_count} × {formatCurrency(installmentAmount)} · from{' '}
            {formatDate(plan.start_date)}
          </DrawerDescription>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* Summary */}
        <aside className="space-y-4 lg:sticky lg:top-0">
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4">
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold tracking-tight">{formatCurrency(remainingAmount)}</p>
              <p className="text-xs text-muted-foreground">
                of {formatCurrency(plan.total_amount)} total · {formatCurrency(paidAmount)} paid
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {paidInstallments.length} of {plan.installment_count} paid
                </span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-positive transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {nextInstallment && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Next payment</span>
                <span className="font-medium">
                  {formatCurrency(nextInstallment.amount)} ·{' '}
                  {formatDate(nextInstallment.due_date, 'MMM d')}
                </span>
              </div>
            )}
          </div>

          <dl className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 text-sm">
            <PlanVendorEditor planId={plan.id} vendor={plan.vendor ?? null} />
            <DetailRow
              icon={CreditCard}
              label="Credit card"
              value={
                creditCard
                  ? `${creditCard.name} (*${creditCard.last_four_digits})`
                  : plan.credit_card_id
                    ? 'Credit card'
                    : undefined
              }
            />
            <DetailRow icon={CalendarDays} label="Starts" value={formatDate(plan.start_date)} />
            {(plan.tags?.length ?? 0) > 0 && (
              <div className="space-y-1.5">
                <dt className="text-xs text-muted-foreground">Tags</dt>
                <dd>
                  <TagChips tags={plan.tags ?? []} maxVisible={6} />
                </dd>
              </div>
            )}
            {plan.description && (
              <div className="space-y-1">
                <dt className="text-xs text-muted-foreground">Notes</dt>
                <dd className="whitespace-pre-line text-foreground">{plan.description}</dd>
              </div>
            )}
          </dl>
        </aside>

        {/* Installments */}
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Installments
          </h3>
          <ul className="space-y-2">
            {installments.map(installment => (
              <InstallmentRow
                key={installment.id}
                installment={installment}
                total={plan.installment_count}
                isNext={installment.id === nextInstallment?.id}
                onSelect={() => openLinkPayment(installment)}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

const PlanNameEditor = ({ planId, name }: { planId: string; name: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const { mutate: updatePlan, isPending } = useUpdateInstallmentPlan();
  const trimmedName = draftName.trim();

  const startEditing = () => {
    setDraftName(name);
    setIsEditing(true);
  };

  const save = () => {
    if (!trimmedName || isPending) return;
    if (trimmedName === name) {
      setIsEditing(false);
      return;
    }
    updatePlan(
      { id: planId, payload: { name: trimmedName } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  if (!isEditing) {
    return (
      <span className="group/name flex min-w-0 items-center gap-1">
        <DrawerTitle className="truncate text-lg font-semibold leading-tight text-foreground">
          {name}
        </DrawerTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={startEditing}
          aria-label="Rename installment plan"
          className="h-7 w-7 text-muted-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </span>
    );
  }

  return (
    <form
      className="flex items-center gap-1"
      onSubmit={event => {
        event.preventDefault();
        save();
      }}
    >
      <DrawerTitle className="sr-only">{name}</DrawerTitle>
      <Input
        value={draftName}
        onChange={event => setDraftName(event.target.value)}
        aria-label="Installment plan name"
        className="h-8 w-64 max-w-full"
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!trimmedName || isPending}
        aria-label="Save name"
        className="h-8 w-8 text-positive"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsEditing(false)}
        aria-label="Cancel renaming"
        className="h-8 w-8 text-muted-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
};

const PlanVendorEditor = ({
  planId,
  vendor,
}: {
  planId: string;
  vendor: I_InstallmentPlan['vendor'] | null;
}) => {
  const { mutate: updatePlan, isPending } = useUpdateInstallmentPlan();

  const changeVendor = (vendorId: string) => {
    if (vendorId === vendor?.id) return;
    updatePlan({ id: planId, payload: { vendor_id: vendorId } });
  };

  return (
    <div className="space-y-1.5">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Store className="h-4 w-4" />
        Vendor
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      </dt>
      <dd>
        <VendorSelector
          value={vendor?.id ?? ''}
          onValueChange={changeVendor}
          vendors={vendor ? [vendor] : []}
          placeholder="Select a vendor"
          size="sm"
          disabled={isPending}
        />
      </dd>
    </div>
  );
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <dt className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </dt>
    <dd className={cn('truncate text-right', value ? 'font-medium' : 'text-muted-foreground')}>
      {value ?? '—'}
    </dd>
  </div>
);

const InstallmentRow = ({
  installment,
  total,
  isNext,
  onSelect,
}: {
  installment: I_Installment;
  total: number;
  isNext: boolean;
  onSelect: () => void;
}) => {
  const status = INSTALLMENT_STATUS[installment.status] ?? INSTALLMENT_STATUS.pending;
  const StatusIcon = status.icon;
  const isPaid = installment.status === 'linked';

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isNext ? 'border-brand/40 bg-brand/5' : 'border-border/70',
          isPaid && 'opacity-80'
        )}
      >
        <span className="w-12 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {installment.number}/{total}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate">{formatDate(installment.due_date)}</span>
          {isNext && (
            <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-brand-foreground">
              Next
            </span>
          )}
        </span>
        <span className="shrink-0 font-semibold tabular-nums">
          {formatCurrency(installment.amount)}
        </span>
        <span
          className={cn(
            'inline-flex w-24 shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            status.className
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
        <span className="hidden w-32 shrink-0 items-center justify-end gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
          <LinkIcon className="h-3.5 w-3.5" />
          {isPaid ? 'Change payment' : 'Link payment'}
        </span>
      </button>
    </li>
  );
};
