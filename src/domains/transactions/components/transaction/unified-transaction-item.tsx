import { EditTransaction } from '../edit-transaction';
import { TransactionItemDefault } from './transaction-item-default';
import { TransactionItemCompact } from './transaction-item-compact';
import type { TransactionItemProps } from './types';

export const UnifiedTransactionItem = ({
  transaction,
  mode,
  onDelete,
  onTriggerEditMode,
  onIgnoreTransaction,
  onSave,
  onCancel,
  isEditing = false,
  isSelected = false,
  onSelectTransaction,
  onSelectionChange,
  showCheckbox = false,
  className,
}: TransactionItemProps) => {
  // Handle edit mode for both layouts
  if (isEditing) {
    return (
      <EditTransaction
        transaction={transaction}
        onSave={onSave || (() => {})}
        onCancel={onCancel || (() => {})}
      />
    );
  }

  // Render compact mode
  if (mode === 'compact') {
    return (
      <TransactionItemCompact
        transaction={transaction}
        isSelected={isSelected}
        onTriggerEditMode={onTriggerEditMode || (() => {})}
        onDelete={onDelete}
        onIgnoreTransaction={onIgnoreTransaction}
        onSelectionChange={onSelectionChange}
        onSelectTransaction={onSelectTransaction}
      />
    );
  }

  // Render default mode
  return (
    <TransactionItemDefault
      transaction={transaction}
      isSelected={isSelected}
      showCheckbox={showCheckbox}
      onTriggerEditMode={onTriggerEditMode}
      onDelete={onDelete}
      onIgnoreTransaction={onIgnoreTransaction}
      onSelectionChange={onSelectionChange}
      onSelectTransaction={onSelectTransaction}
      className={className}
    />
  );
};
