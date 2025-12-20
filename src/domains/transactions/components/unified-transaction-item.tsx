import React from 'react';
import { Calendar, Tag, CreditCard, Wallet, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { Button } from '@/domains/ui-system/components/button';
import { Surface } from '@/domains/global/components/surface';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import {
  getTransactionIconComponent,
  getIconSizeClass,
  formatDateLong,
  formatDateShort,
  formatCurrencyWithSign,
  getCurrencyClasses,
  getMovementTypeLabel,
  getMovementTypeColor,
} from '@/domains/transactions/utils/transaction-formatting';
import { EditTransaction } from './edit-transaction';

interface UnifiedTransactionItemProps {
  // Core transaction data
  transaction: I_TransactionResponse;

  // Display mode
  mode: 'compact' | 'default';

  // Interaction handlers
  onEdit?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void | null;
  onSave?: (transaction: I_TransactionResponse) => void;
  onCancel?: () => void;

  // Edit state (for default mode)
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  isEditing?: boolean;

  // Selection handlers
  isSelected: boolean;
  isIgnored?: boolean;
  onSelectTransaction?: (id: string) => void;
  onSelectionChange?: (selected: boolean) => void;
  showCheckbox?: boolean;

  // Styling
  className?: string;
}

export const UnifiedTransactionItem = ({
  transaction,
  mode,
  onEdit,
  onDelete,
  onTriggerEditMode,
  onIgnoreTransaction,
  onSave,
  onCancel,
  isEditing = false,
  isSelected = false,
  isIgnored = false,
  onSelectTransaction,
  onSelectionChange,
  showCheckbox = false,
  className,
}: UnifiedTransactionItemProps) => {
  // Format transaction data
  const IconComponent = getTransactionIconComponent(
    transaction.category,
    transaction.movement_type
  );
  const currency = formatCurrencyWithSign(transaction.amount, transaction.movement_type);
  const movementTypeColor = getMovementTypeColor(transaction.movement_type);
  const movementTypeLabel = getMovementTypeLabel(transaction.movement_type);
  const currencyClasses = getCurrencyClasses(transaction.movement_type, 'large');

  // Determine if this is a credit card transaction
  const isCredit = !!transaction.credit_card_id;
  const transactionTypeIcon = isCredit ? CreditCard : Wallet;
  const transactionTypeLabel = isCredit ? 'Credit' : 'Account';

  // Handle delete action - prefer onDelete, fallback to onIgnoreTransaction
  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction);
    } else if (onIgnoreTransaction) {
      onIgnoreTransaction(transaction.id);
    }
  };

  // Handle selection - support both onSelectTransaction and onSelectionChange
  const handleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(!isSelected);
    } else if (onSelectTransaction) {
      onSelectTransaction(transaction.id);
    }
  };

  // Hover Actions Component
  const HoverActions = () => (
    <div
      className="hover-actions opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1"
      onClick={e => e.stopPropagation()}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onTriggerEditMode?.(transaction)}
        className="h-6 w-6 p-0 hover:bg-primary/10"
      >
        <Edit className="h-3 w-3" />
      </Button>
      {(onDelete || onIgnoreTransaction) && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  // Compact Mode
  if (mode === 'compact') {
    if (isEditing) {
      return (
        <EditTransaction
          transaction={transaction}
          onSave={onSave || (() => {})}
          onCancel={onCancel || (() => {})}
        />
      );
    }

    return (
      <ViewableTransaction
        transaction={transaction}
        isSelected={isSelected}
        isIgnored={isIgnored}
        onSelectTransaction={onSelectTransaction}
        onSelectionChange={onSelectionChange}
        onDelete={onDelete}
        onIgnoreTransaction={onIgnoreTransaction}
        onTriggerEditMode={onTriggerEditMode || (() => {})}
      />
    );
  }

  // Default Mode (Auto-Editable)
  if (isEditing) {
    return (
      <EditTransaction
        transaction={transaction}
        onSave={onSave || (() => {})}
        onCancel={onCancel || (() => {})}
      />
    );
  }

  return (
    <Surface
      data-ui="unified-transaction-item"
      className={cn(
        'group transition-colors hover:bg-muted/50 rounded-sm',
        isIgnored && 'cursor-not-allowed opacity-80',
        className
      )}
      size="sm"
      onClick={() => null}
    >
      <div className="flex items-center">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => {
              e.stopPropagation();
              if (!isIgnored) {
                handleSelection();
              }
            }}
            onClick={e => e.stopPropagation()}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-3"
            disabled={isIgnored}
          />
        )}
        <div className="flex gap-2 items-center">
          <IconComponent className={cn(getIconSizeClass('xs'), 'text-muted-foreground')} />
          <p className="text-xs leading-tight">{transaction.description}</p>
        </div>

        <p className={cn(currencyClasses, 'text-sm ml-2')}>
          {currency.sign}
          {currency.amount}
        </p>

        <div className="flex gap-1 ml-9 items-center" data-ui="transaction-tags">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              isCredit
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            )}
          >
            {React.createElement(transactionTypeIcon, { className: 'h-3 w-3' })}
            {transactionTypeLabel}
          </span>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
              movementTypeColor
            )}
          >
            {movementTypeLabel}
          </span>
        </div>

        <div className="flex gap-1 items-center ml-3">
          <Tag className="h-3 w-3" />
          <span className="text-xs text-muted-foreground">
            {transaction.category || 'Uncategorized'}
          </span>
        </div>

        <div className="flex gap-1 items-center ml-auto mr-10">
          <Calendar className="h-3 w-3" />
          <span className="text-xs text-muted-foreground">{formatDateLong(transaction.date)}</span>
        </div>

        <HoverActions />
      </div>
    </Surface>
  );
};

interface ViewableTransactionProps {
  transaction: I_TransactionResponse;
  isSelected: boolean;
  isIgnored: boolean;
  onSelectTransaction?: (id: string) => void;
  onSelectionChange?: (selected: boolean) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void;
  onTriggerEditMode: (transaction: I_TransactionResponse) => void;
}

const ViewableTransaction = ({
  transaction,
  isSelected,
  isIgnored,
  onSelectTransaction,
  onSelectionChange,
  onDelete,
  onIgnoreTransaction,
  onTriggerEditMode,
}: ViewableTransactionProps) => {
  // Handle delete action - prefer onDelete, fallback to onIgnoreTransaction
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(transaction);
    } else if (onIgnoreTransaction) {
      onIgnoreTransaction(transaction.id);
    }
  };

  // Handle selection - support both onSelectTransaction and onSelectionChange
  const handleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(!isSelected);
    } else if (onSelectTransaction) {
      onSelectTransaction(transaction.id);
    }
  };
  const IconComponent = getTransactionIconComponent(
    transaction.category,
    transaction.movement_type
  );
  const currency = formatCurrencyWithSign(transaction.amount, transaction.movement_type);
  const currencyClasses = getCurrencyClasses(transaction.movement_type, 'compact');

  return (
    <div
      className={cn(
        'group flex items-center space-x-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer',
        isIgnored && 'opacity-30 bg-gray-100 cursor-not-allowed',
        isSelected && 'bg-primary/10 border-l-4 border-primary',
        'border rounded-lg p-3'
      )}
      onClick={() => !isIgnored && handleSelection()}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => !isIgnored && handleSelection()}
        onClick={e => e.stopPropagation()}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        disabled={isIgnored}
      />

      <div className="p-1.5 rounded-full bg-primary/10 flex-shrink-0">
        <IconComponent className={getIconSizeClass('sm')} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{transaction.category || 'Uncategorized'}</span>
          <span>•</span>
          <span>{formatDateShort(transaction.date)}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="text-sm">
          <span className={currencyClasses}>
            {currency.sign}
            {currency.amount}
          </span>
        </div>
      </div>

      {!isIgnored && (
        <div className="hover-actions opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={e => {
              e.stopPropagation();
              onTriggerEditMode(transaction);
            }}
            className="h-6 w-6 p-0 hover:bg-primary/10"
          >
            <Edit className="h-3 w-3" />
          </Button>
          {(onDelete || onIgnoreTransaction) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
