import { useState, useEffect } from 'react';
import { useInstallmentPlan } from '@/domains/installments/hooks/use-installment-plan';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { useLinkInstallmentTransaction } from '@/domains/installments/hooks/use-link-installment-transaction';
import { TransactionRow } from '@/domains/transactions/components/transaction/transaction-row';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Switch } from '@/domains/ui-system/components/switch';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Pagination } from '@/domains/ui-system/components/pagination';
import { ArrowLeft, Check, Info, Link as LinkIcon, Loader2, Search } from 'lucide-react';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import type {
  I_Installment,
  I_InstallmentPlan,
  T_InstallmentStatus,
} from '@/domains/installments/types/types-and-interfaces';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { addDays, format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import { useRouter } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/route';

const PER_PAGE = 10;
// "Near due date" shows transactions within this many days before/after the installment's due date
const DUE_DATE_WINDOW_DAYS = 31;

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// The API calls a paid installment "linked"
const INSTALLMENT_STATUS: Record<T_InstallmentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
  linked: { label: 'Paid', className: 'bg-positive/10 text-positive' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive' },
};

const getTransactionAmount = (transaction: I_TransactionResponse) =>
  Math.abs(parseFloat(transaction.amount));

const getDueDateWindow = (installment: I_Installment) => {
  const dueDate = parseISO(installment.due_date);
  const from = addDays(dueDate, -DUE_DATE_WINDOW_DAYS);
  const to = addDays(dueDate, DUE_DATE_WINDOW_DAYS);
  return {
    // The API compares full datetimes (inclusive), so cover the whole last day
    date_from: `${format(from, 'yyyy-MM-dd')}T00:00:00`,
    date_to: `${format(to, 'yyyy-MM-dd')}T23:59:59`,
    label: `${format(from, 'MMM d')} – ${format(to, 'MMM d, yyyy')}`,
  };
};

const isSameAmount = (transaction: I_TransactionResponse, installment: I_Installment) =>
  Math.abs(getTransactionAmount(transaction) - installment.amount) < 0.005;

export const LinkPaymentToInstallmentDrawer = () => {
  const router = useRouter();
  const { planId, installmentId } = Route.useSearch();

  const { data: installmentPlanData, states: installmentPlanStates } = useInstallmentPlan(
    planId,
    installmentId
  );
  const { plan, installment } = installmentPlanData;
  const {
    isLoading: isPlanLoading,
    isError: isPlanError,
    isEmpty: isPlanEmpty,
  } = installmentPlanStates;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });
  const [selectedTransaction, setSelectedTransaction] = useState<I_TransactionResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isNearDueDate, setIsNearDueDate] = useState(true);
  const dueDateWindow = installment ? getDueDateWindow(installment) : null;

  // Reset to page 1 when the filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, isNearDueDate]);

  // Every transaction not linked to an installment yet. Not "unpaid": users can mark a
  // transaction paid by hand, and it should still be linkable
  const {
    data,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useAllTransactions({
    description_contains: debouncedSearchTerm || undefined,
    has_installment: false,
    ...(isNearDueDate &&
      dueDateWindow && { date_from: dueDateWindow.date_from, date_to: dueDateWindow.date_to }),
    sort_by: 'date',
    sort_order: 'desc',
    page: currentPage,
    per_page: PER_PAGE,
  });

  const { mutate: linkTransaction, isPending: isLinking } = useLinkInstallmentTransaction();

  const handleClose = router.history.back;

  const handleConfirm = () => {
    if (!selectedTransaction || !installment) return;

    linkTransaction(
      {
        installmentId: installment.id,
        transactionId: selectedTransaction.id,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (isPlanLoading) {
    return (
      <DrawerLayout data-ui="link-payment-to-installment-drawer">
        <DrawerLayoutHeader
          icon={LinkIcon}
          title="Link a payment"
          description="Loading…"
          onClose={() => handleClose()}
        />
        <DrawerLayoutBody className="grid place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  if (isPlanError || isPlanEmpty || !plan || !installment) {
    return (
      <DrawerLayout data-ui="link-payment-to-installment-drawer">
        <DrawerLayoutHeader icon={LinkIcon} title="Link a payment" onClose={() => handleClose()} />
        <DrawerLayoutBody>
          <p className="text-sm text-destructive">Failed to load installment details.</p>
        </DrawerLayoutBody>
      </DrawerLayout>
    );
  }

  const transactions = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / PER_PAGE) : 1;
  const status = INSTALLMENT_STATUS[installment.status] ?? INSTALLMENT_STATUS.pending;

  return (
    // flex-1 + min-h-0 let this shrink to the drawer's height, so the list below can scroll
    <DrawerLayout data-ui="link-payment-to-installment-drawer">
      <DrawerLayoutHeader
        icon={LinkIcon}
        title="Link a payment"
        description={`${plan.name} · Installment ${installment.number} of ${plan.installment_count}`}
        onClose={() => handleClose()}
        actions={
          <Button variant="ghost" size="sm" onClick={() => handleClose()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to plan</span>
          </Button>
        }
      />

      {/* Installment summary and filters (stay visible while the list scrolls) */}
      <div className="shrink-0 space-y-4 border-b border-border px-5 py-4 md:px-8">

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-muted/50 px-4 py-3 text-sm">
          <span className="text-lg font-bold tabular-nums">
            {formatCurrency(installment.amount)}
          </span>
          <span className="text-muted-foreground">
            due {format(parseISO(installment.due_date), 'MMM d, yyyy')}
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', status.className)}>
            {status.label}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search unlinked transactions…"
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search unlinked transactions"
          />
        </div>

        {dueDateWindow && (
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Switch checked={isNearDueDate} onCheckedChange={setIsNearDueDate} />
            <span>Near due date</span>
            <span className="text-xs text-muted-foreground">({dueDateWindow.label})</span>
          </label>
        )}
      </div>

      {/* Transactions (the only scrolling area) */}
      <DrawerLayoutBody className="py-4">
        <TransactionListContent
          isLoading={isTransactionsLoading}
          isError={isTransactionsError}
          transactions={transactions}
          searchTerm={debouncedSearchTerm}
          isNearDueDate={isNearDueDate}
          onShowAllDates={() => setIsNearDueDate(false)}
          installment={installment}
          selectedTransactionId={selectedTransaction?.id ?? null}
          onSelect={setSelectedTransaction}
        />

        {meta && totalPages > 1 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t pt-4 sm:flex-row">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} · {meta.total} transactions
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNext={meta.has_next}
              hasPrevious={meta.has_previous}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </DrawerLayoutBody>

      {/* Footer: what will happen + actions */}
      <LinkFooter
        plan={plan}
        installment={installment}
        selectedTransaction={selectedTransaction}
        isLinking={isLinking}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      />
    </DrawerLayout>
  );
};

interface TransactionListContentProps {
  isLoading: boolean;
  isError: boolean;
  transactions: I_TransactionResponse[];
  searchTerm: string;
  isNearDueDate: boolean;
  onShowAllDates: () => void;
  installment: I_Installment;
  selectedTransactionId: string | null;
  onSelect: (transaction: I_TransactionResponse) => void;
}

const TransactionListContent = ({
  isLoading,
  isError,
  transactions,
  searchTerm,
  isNearDueDate,
  onShowAllDates,
  installment,
  selectedTransactionId,
  onSelect,
}: TransactionListContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <div className="py-12 text-center text-destructive">Failed to load transactions.</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        <p>
          {searchTerm
            ? `No unlinked transactions match "${searchTerm}"`
            : 'No unlinked transactions to link'}
          {isNearDueDate ? ' near the due date.' : '.'}
        </p>
        {isNearDueDate && (
          <Button variant="link" size="sm" onClick={onShowAllDates} className="mt-1">
            Show all dates
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2" role="radiogroup" aria-label="Transactions">
      {transactions.map(transaction => {
        const isSelected = selectedTransactionId === transaction.id;
        return (
          // A div (not a button) because the transaction row renders an <li>
          <div
            key={transaction.id}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onSelect(transaction)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(transaction);
              }
            }}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isSelected && 'ring-2 ring-brand'
            )}
          >
            <span
              className={cn(
                'ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                isSelected ? 'border-brand bg-brand text-brand-foreground' : 'border-border'
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </span>
            <div className="min-w-0 flex-1">
              {isSameAmount(transaction, installment) && (
                <span className="mb-1 inline-flex rounded-full bg-positive/10 px-2 py-0.5 text-[11px] font-medium text-positive">
                  Same amount
                </span>
              )}
              <ul>
                <TransactionRow transaction={transaction} variant="picker" />
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LinkFooter = ({
  plan,
  installment,
  selectedTransaction,
  isLinking,
  onCancel,
  onConfirm,
}: {
  plan: I_InstallmentPlan;
  installment: I_Installment;
  selectedTransaction: I_TransactionResponse | null;
  isLinking: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const selectedAmount = selectedTransaction ? getTransactionAmount(selectedTransaction) : 0;
  const amountChanges =
    selectedTransaction !== null && !isSameAmount(selectedTransaction, installment);

  return (
    <div className="shrink-0 space-y-3 border-t border-border bg-background px-5 py-4 md:px-8">
      {selectedTransaction ? (
        <div className="space-y-1.5 text-sm">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-muted-foreground">Selected:</span>
            <span className="truncate font-medium">{selectedTransaction.description}</span>
            <span className="font-semibold tabular-nums">{formatCurrency(selectedAmount)}</span>
          </p>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Linking marks it as paid
              {plan.vendor ? `, sets its vendor to ${plan.vendor.name}` : ''} and replaces its tags
              with the plan&apos;s.
              {amountChanges &&
                ` This installment's amount will change from ${formatCurrency(installment.amount)} to ${formatCurrency(selectedAmount)}.`}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select the transaction that paid this installment.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!selectedTransaction || isLinking}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLinking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          {isLinking ? 'Linking…' : 'Link payment'}
        </Button>
      </div>
    </div>
  );
};
