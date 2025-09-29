import React, { useState } from 'react';
import { Calendar, Tag, CreditCard, Wallet, Edit, Trash2, Save, X } from 'lucide-react';
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

interface UnifiedTransactionItemProps {
  // Core transaction data
  transaction: I_TransactionResponse;

  // Display mode
  mode: 'compact' | 'default';

  // Interaction handlers
  onEdit?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onSave?: (transaction: I_TransactionResponse) => void;
  onCancel?: () => void;

  // Edit state (for default mode)
  isEditing?: boolean;

  // Selection state
  isSelected?: boolean;
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
  onSave,
  onCancel,
  isEditing = false,
  isSelected = false,
  onSelectionChange,
  showCheckbox = false,
  className,
}: UnifiedTransactionItemProps) => {
  const [editForm, setEditForm] = useState<Partial<I_TransactionResponse>>(transaction);

  // Handle edit mode
  const handleEdit = () => {
    setEditForm(transaction);
    onEdit?.(transaction);
  };

  const handleSave = () => {
    onSave?.(editForm as I_TransactionResponse);
    setEditForm(transaction);
  };

  const handleCancel = () => {
    setEditForm(transaction);
    onCancel?.();
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete?.(transaction);
    }
  };

  // Handle click to select/deselect
  const handleClick = () => {
    if (showCheckbox && onSelectionChange) {
      onSelectionChange(!isSelected);
    }
  };

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

  // Hover Actions Component
  const HoverActions = () => (
    <div
      className="hover-actions opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1"
      onClick={e => e.stopPropagation()}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className="h-6 w-6 p-0 hover:bg-primary/10"
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDelete}
        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  // Edit Actions Component
  const EditActions = () => (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSave}
        className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-700"
      >
        <Save className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCancel}
        className="h-6 w-6 p-0 hover:bg-gray-100 hover:text-gray-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );

  // Compact Mode
  if (mode === 'compact') {
    return (
      <div
        className={cn(
          'group flex items-center space-x-3 py-2 hover:bg-muted/50 transition-colors',
          showCheckbox && 'cursor-pointer',
          className
        )}
        onClick={handleClick}
      >
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => onSelectionChange?.(e.target.checked)}
            onClick={e => e.stopPropagation()}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
        )}
        <div className="p-1.5 rounded-full bg-primary/10 flex-shrink-0">
          <IconComponent className={getIconSizeClass('sm')} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{transaction.description}</p>
          <p className="text-xs text-muted-foreground truncate">
            {transaction.category || 'Uncategorized'}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm">
            <span className={getCurrencyClasses(transaction.movement_type, 'compact')}>
              {currency.sign}
              {currency.amount}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">{formatDateShort(transaction.date)}</div>
        </div>

        <HoverActions />
      </div>
    );
  }

  // Default Mode (Auto-Editable)
  return (
    <Surface
      data-ui="unified-transaction-item"
      className={cn(
        'group transition-colors hover:bg-muted/50 rounded-sm',
        showCheckbox && 'cursor-pointer',
        className
      )}
      size="sm"
      onClick={handleClick}
    >
      <div className="flex items-center">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => onSelectionChange?.(e.target.checked)}
            onClick={e => e.stopPropagation()}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-3"
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

        {isEditing ? <EditActions /> : <HoverActions />}
      </div>
    </Surface>
  );
};
