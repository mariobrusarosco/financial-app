import { useState } from 'react';
import type * as React from 'react';
import { CreditCard, Edit, Eye, EyeOff, Loader2, PiggyBank, Trash2 } from 'lucide-react';
import { TransactionAmount } from '@/domains/transactions/components/transaction/transaction-amount';
import { TransactionDate } from '@/domains/transactions/components/transaction/transaction-date';
import { TransactionIconBadge } from '@/domains/transactions/components/transaction/transaction-icon-badge';
import { TransactionInfo } from '@/domains/transactions/components/transaction/transaction-info';
import { TransactionTagsCell } from '@/domains/transactions/components/transaction/transaction-tags-cell';
import { TransactionForm } from '@/domains/transactions/components/transaction-form';
import { useTransactionRowActions } from '@/domains/transactions/hooks/use-transaction-row-actions';
import type {
  I_CreateTransactionForm,
  I_TransactionResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/dialog';
import { cn } from '@/domains/ui-system/utils/index';

/**
 * - `full`: a saved transaction in a list. Edit (drawer), inline tags, ignore and delete.
 * - `readonly`: a saved transaction shown for context. Clicking the row opens the edit drawer.
 * - `picker`: shown inside a "pick a transaction" flow. No actions; the parent handles selection.
 * - `draft`: not saved yet (statement/invoice import). Edits stay local via the `draft` callbacks.
 */
export type T_TransactionRowVariant = 'full' | 'readonly' | 'picker' | 'draft';

export interface I_TransactionRowDraftActions {
  isIgnored: boolean;
  isEditing: boolean;
  onIgnore: () => void;
  onEdit: () => void;
  onSave: (updates: Partial<I_TransactionResponse> & { id: string }) => void;
  onCancelEdit: () => void;
}

interface TransactionRowProps {
  transaction: I_TransactionResponse;
  variant?: T_TransactionRowVariant;
  // Shows a selection checkbox when provided (bulk actions)
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  // Required for the `draft` variant
  draft?: I_TransactionRowDraftActions;
}

export const TransactionRow = ({
  transaction,
  variant = 'full',
  isSelected = false,
  onSelectionChange,
  draft,
}: TransactionRowProps) => {
  if (variant === 'draft' && draft?.isEditing) {
    return <DraftEditor transaction={transaction} draft={draft} />;
  }

  const isIgnored = transaction.ignored || Boolean(draft?.isIgnored);

  return (
    <li
      data-ui="transaction-row"
      data-variant={variant}
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-3 transition-colors sm:px-4',
        variant !== 'picker' && 'hover:bg-muted/35',
        isSelected && 'border-brand/30 bg-accent/45',
        isIgnored && 'opacity-60'
      )}
    >
      {onSelectionChange && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={event => onSelectionChange(event.target.checked)}
          aria-label={`Select ${transaction.description}`}
          className="h-4 w-4 shrink-0 rounded border-input accent-brand"
        />
      )}

      {variant === 'readonly' ? (
        <ReadonlyContent transaction={transaction} />
      ) : (
        <TransactionContent
          transaction={transaction}
          canEditTags={variant === 'full'}
          isIgnored={isIgnored}
        />
      )}

      {variant === 'full' && <SavedActions transaction={transaction} />}
      {variant === 'draft' && draft && <DraftActions draft={draft} />}
    </li>
  );
};

const TransactionContent = ({
  transaction,
  canEditTags,
  isIgnored,
}: {
  transaction: I_TransactionResponse;
  canEditTags: boolean;
  isIgnored: boolean;
}) => (
  <>
    <TransactionIconBadge movementType={transaction.movement_type} size="sm" />

    <div className="grid min-w-0 flex-1 items-center gap-2 md:grid-cols-[minmax(10rem,1fr)_minmax(7rem,0.55fr)_minmax(6rem,auto)] md:gap-5">
      <div className="min-w-0">
        <TransactionInfo description={transaction.description} />
        <TransactionTagsCell transaction={transaction} canEdit={canEditTags} />
      </div>

      <div className="hidden min-w-0 md:block">
        <TransactionSource transaction={transaction} />
        <TransactionDate date={transaction.date} dateFormat="medium" />
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        <div className="md:text-right">
          <TransactionAmount
            amount={transaction.amount}
            movementType={transaction.movement_type}
            size="compact"
          />
          <div className="md:hidden">
            <TransactionDate date={transaction.date} dateFormat="short" />
          </div>
        </div>
        {isIgnored && (
          <span className="rounded-full bg-warning/10 px-2 py-1 text-[0.65rem] font-semibold text-warning">
            Ignored
          </span>
        )}
      </div>
    </div>
  </>
);

// The whole row is a button that opens the edit drawer
const ReadonlyContent = ({ transaction }: { transaction: I_TransactionResponse }) => {
  const { openEdit } = useTransactionRowActions(transaction);

  return (
    <button
      type="button"
      onClick={openEdit}
      aria-label={`Edit ${transaction.description}`}
      className="-m-1 flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <TransactionContent transaction={transaction} canEditTags={false} isIgnored={false} />
    </button>
  );
};

const TransactionSource = ({ transaction }: { transaction: I_TransactionResponse }) => {
  if (transaction.credit_card_id) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CreditCard className="h-3.5 w-3.5" />
        <span className="truncate">{transaction.credit_card_name ?? 'Credit card'}</span>
      </div>
    );
  }
  if (transaction.account_id) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <PiggyBank className="h-3.5 w-3.5" />
        <span className="truncate">{transaction.account_name ?? 'Account'}</span>
      </div>
    );
  }
  return null;
};

// Always visible on touch screens (no hover); revealed on hover/focus where a pointer can hover
const ACTIONS_CLASS_NAME =
  'flex shrink-0 items-center gap-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100';

const ActionButton = ({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className={cn('h-8 w-8 text-muted-foreground', className)}
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    {children}
  </Button>
);

const SavedActions = ({ transaction }: { transaction: I_TransactionResponse }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { openEdit, toggleIgnored, remove, isUpdating, isDeleting } =
    useTransactionRowActions(transaction);

  return (
    <div className={ACTIONS_CLASS_NAME}>
      <ActionButton label="Edit transaction" onClick={openEdit}>
        <Edit className="h-4 w-4" />
      </ActionButton>
      <ActionButton
        label={transaction.ignored ? 'Include transaction' : 'Ignore transaction'}
        onClick={toggleIgnored}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : transaction.ignored ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </ActionButton>
      <ActionButton
        label="Delete transaction"
        onClick={() => setIsConfirmingDelete(true)}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </ActionButton>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete transaction?</DialogTitle>
            <DialogDescription>
              {transaction.description} will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => remove({ onSuccess: () => setIsConfirmingDelete(false) })}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DraftActions = ({ draft }: { draft: I_TransactionRowDraftActions }) => (
  <div className={ACTIONS_CLASS_NAME}>
    <ActionButton label="Edit transaction" onClick={draft.onEdit}>
      <Edit className="h-4 w-4" />
    </ActionButton>
    {!draft.isIgnored && (
      <ActionButton label="Ignore transaction" onClick={draft.onIgnore}>
        <EyeOff className="h-4 w-4" />
      </ActionButton>
    )}
  </div>
);

// Inline editor for an unsaved (imported) transaction; changes stay local until the import is saved
const DraftEditor = ({
  transaction,
  draft,
}: {
  transaction: I_TransactionResponse;
  draft: I_TransactionRowDraftActions;
}) => {
  const handleSubmit = (values: I_CreateTransactionForm) => {
    draft.onSave({
      id: transaction.id,
      description: values.description,
      amount: String(values.amount),
      date: values.date,
      movement_type: values.movement_type,
      account_id: values.account_id,
      credit_card_id: values.credit_card_id,
      is_paid: values.is_paid,
      ignored: values.ignored,
    });
  };

  return (
    <li
      data-ui="transaction-row"
      data-variant="draft-editing"
      className="space-y-4 rounded-xl border border-brand/30 bg-card p-4"
    >
      <TransactionForm
        initialValues={toFormValues(transaction)}
        onSubmit={handleSubmit}
        isEditMode
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={draft.onCancelEdit}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="transaction-form"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save changes
        </Button>
      </div>
    </li>
  );
};

const toFormValues = (transaction: I_TransactionResponse) => ({
  id: transaction.id,
  description: transaction.description,
  amount: Number(transaction.amount),
  date: transaction.date,
  account_id: transaction.account_id ?? undefined,
  credit_card_id: transaction.credit_card_id ?? undefined,
  vendor_id: transaction.vendor_id ?? undefined,
  is_paid: transaction.is_paid,
  ignored: transaction.ignored,
  movement_type: transaction.movement_type,
  tag_ids: transaction.tag_ids ?? [],
  tags: transaction.tags ?? [],
});
