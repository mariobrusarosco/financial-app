import { format, parseISO } from 'date-fns';
import { ListPlus, Pencil, X } from 'lucide-react';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';
import type { I_CreateTransactionForm } from '@/domains/transactions/types/types-and-interfaces';
import {
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_STYLES,
} from '@/domains/transactions/utils/movement-type-styles';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';

interface PendingTransactionsPanelProps {
  transactions: I_CreateTransactionForm[];
  /** Resolves the bank account / credit card name shown under each row */
  getDestinationName: (transaction: I_CreateTransactionForm) => string | undefined;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  /** Editing loads a row into the form, so it's blocked while the form holds unsaved input */
  canEdit: boolean;
}

export const PendingTransactionsPanel = ({
  transactions,
  getDestinationName,
  onEdit,
  onRemove,
  canEdit,
}: PendingTransactionsPanelProps) => {
  const totals = MOVEMENT_TYPES.map(type => ({
    type,
    count: transactions.filter(transaction => transaction.movement_type === type).length,
    amount: transactions
      .filter(transaction => transaction.movement_type === type)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount ?? 0), 0),
  })).filter(total => total.count > 0);

  return (
    <aside
      data-ui="pending-transactions"
      aria-labelledby="pending-transactions-title"
      className="flex min-h-0 flex-col gap-4 border-t border-border bg-sidebar p-5 md:border-t-0 md:border-l md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="pending-transactions-title" className="text-base font-semibold text-foreground">
          To be saved
        </h3>
        {transactions.length > 0 && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
            {transactions.length}
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-4 py-8 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-muted-foreground ring-1 ring-border">
            <ListPlus className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted-foreground">
            Add several transactions, then save them all at once.
          </p>
        </div>
      ) : (
        <>
          <dl className="space-y-1.5 rounded-2xl bg-card p-4 ring-1 ring-border">
            {totals.map(total => (
              <div key={total.type} className="flex items-center justify-between gap-3 text-sm">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      MOVEMENT_TYPE_STYLES[total.type].dotClassName
                    )}
                  />
                  {MOVEMENT_TYPE_STYLES[total.type].label} ({total.count})
                </dt>
                <dd className="financial-value font-semibold text-foreground">
                  {formatCurrencyAmount(total.amount)}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="-mr-2 min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
            {transactions.map((transaction, index) => (
              <PendingTransactionRow
                key={index}
                transaction={transaction}
                destinationName={getDestinationName(transaction)}
                onEdit={() => onEdit(index)}
                onRemove={() => onRemove(index)}
                canEdit={canEdit}
              />
            ))}
          </ul>
        </>
      )}
    </aside>
  );
};

const PendingTransactionRow = ({
  transaction,
  destinationName,
  onEdit,
  onRemove,
  canEdit,
}: {
  transaction: I_CreateTransactionForm;
  destinationName?: string;
  onEdit: () => void;
  onRemove: () => void;
  canEdit: boolean;
}) => {
  const style = MOVEMENT_TYPE_STYLES[transaction.movement_type];
  const amount = Math.abs(transaction.amount ?? 0);
  const sign =
    transaction.movement_type === 'expense' ? '−' : transaction.movement_type === 'income' ? '+' : '';
  const details = [formatPendingDate(transaction.date), destinationName].filter(Boolean).join(' · ');

  return (
    <li className="flex items-start gap-3 rounded-xl bg-card p-3 ring-1 ring-border">
      <span
        className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', style.dotClassName)}
        title={style.label}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{transaction.description}</p>
        <p className="truncate text-xs text-muted-foreground">{details}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className={cn('financial-value text-sm font-semibold', style.amountClassName)}>
          {sign}
          {formatCurrencyAmount(amount)}
        </p>
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground"
            onClick={onEdit}
            disabled={!canEdit}
            aria-label={`Edit ${transaction.description}`}
            title={canEdit ? 'Edit' : 'Add or clear the current entry first'}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label={`Remove ${transaction.description}`}
            title="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </li>
  );
};

const formatPendingDate = (date: string) => {
  try {
    return format(parseISO(date), 'MMM d');
  } catch {
    return date;
  }
};
