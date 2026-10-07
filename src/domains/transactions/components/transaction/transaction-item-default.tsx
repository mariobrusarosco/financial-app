import { CreditCard, Edit, EyeOff, PiggyBank, Trash2 } from 'lucide-react';
import { TransactionAmount } from '@/domains/transactions/components/transaction/transaction-amount';
import { TransactionCategory } from '@/domains/transactions/components/transaction/transaction-category';
import { TransactionDate } from '@/domains/transactions/components/transaction/transaction-date';
import { TransactionIconBadge } from '@/domains/transactions/components/transaction/transaction-icon-badge';
import { TransactionInfo } from '@/domains/transactions/components/transaction/transaction-info';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils/index';

export interface TransactionItemDefaultProps {
  transaction: I_TransactionResponse;
  onIgnoreTransaction?: (id: string, currentIgnoreValue: boolean) => void | null;
  isPending?: boolean;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onSelectionChange?: (selected: boolean) => void;
}

export const TransactionItemDefault = ({
  transaction,
  isPending,
  onIgnoreTransaction,
  isSelected,
  showCheckbox,
  onTriggerEditMode,
  onDelete,
  onSelectionChange,
}: TransactionItemDefaultProps) => {
  return (
    <li
      data-ui="unified-transaction-item"
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-3 transition-colors hover:bg-muted/35 sm:px-4',
        isSelected && 'border-brand/30 bg-accent/45',
        transaction.ignored && 'opacity-60',
        isPending && 'cursor-wait'
      )}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={event => onSelectionChange?.(event.target.checked)}
          aria-label={`Select ${transaction.description}`}
          className="h-4 w-4 shrink-0 rounded border-input accent-[#1f4ae0]"
        />
      )}

      <TransactionIconBadge
        categoryName={transaction.category_name || transaction.category}
        movementType={transaction.movement_type}
        size="sm"
      />

      <div className="grid min-w-0 flex-1 items-center gap-2 md:grid-cols-[minmax(10rem,1fr)_minmax(7rem,0.55fr)_minmax(6rem,auto)] md:gap-5">
        <div className="min-w-0">
          <TransactionInfo description={transaction.description} />
          <TransactionCategory
            categoryTree={transaction.category_tree}
            categoryName={transaction.category_name}
            category={transaction.category}
          />
        </div>

        <div className="hidden min-w-0 md:block">
          {transaction.credit_card_id ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="h-3.5 w-3.5" />
              <span className="truncate">{transaction.credit_card_name ?? 'Credit card'}</span>
            </div>
          ) : transaction.account_id ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <PiggyBank className="h-3.5 w-3.5" />
              <span className="truncate">{transaction.account_name ?? 'Account'}</span>
            </div>
          ) : null}
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
          {transaction.ignored && (
            <span className="rounded-full bg-warning/10 px-2 py-1 text-[0.65rem] font-semibold text-warning">
              Ignored
            </span>
          )}
        </div>
      </div>

      <TransactionHoverActions
        transaction={transaction}
        onIgnoreTransaction={onIgnoreTransaction}
        onTriggerEditMode={onTriggerEditMode}
        onDelete={onDelete}
      />
    </li>
  );
};

interface TransactionHoverActionsProps {
  transaction: I_TransactionResponse;
  onIgnoreTransaction?: (id: string, currentIgnoreValue: boolean) => void | null;
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
}

const TransactionHoverActions = ({
  transaction,
  onIgnoreTransaction,
  onTriggerEditMode,
  onDelete,
}: TransactionHoverActionsProps) => (
  <div className="flex shrink-0 items-center gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
    {onIgnoreTransaction && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground"
        onClick={() => onIgnoreTransaction(transaction.id, transaction.ignored)}
        aria-label={transaction.ignored ? 'Include transaction' : 'Ignore transaction'}
      >
        <EyeOff className="h-4 w-4" />
      </Button>
    )}
    {onTriggerEditMode && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground"
        onClick={() => onTriggerEditMode(transaction)}
        aria-label="Edit transaction"
      >
        <Edit className="h-4 w-4" />
      </Button>
    )}
    {onDelete && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(transaction)}
        aria-label="Delete transaction"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    )}
  </div>
);
