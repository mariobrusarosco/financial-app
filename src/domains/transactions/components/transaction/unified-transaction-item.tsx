import { TransactionForm } from '../transaction-form'; // Corrected import path
import { TransactionItemDefault } from './transaction-item-default';
import { TransactionItemCompact } from './transaction-item-compact';
import type { TransactionItemProps } from './types';
import type { I_TransactionPayload, I_TransactionResponse } from '../types/types-and-interfaces';


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
      <div className="rounded-lg p-4 bg-white border shadow-sm">
        <TransactionForm
          initialValues={transaction} // transaction is I_TransactionResponse, which TransactionForm can handle
          isEditMode={true}
          // The onSave prop expects Partial<I_TransactionResponse>, TransactionForm onSubmit returns I_TransactionPayload.
          // I_TransactionPayload is largely compatible with the update structure,
          // but we cast it to Partial<I_TransactionResponse> to satisfy the prop type.
          onSubmit={(values: I_TransactionPayload) => onSave?.(values as Partial<I_TransactionResponse>)}
          onCancel={onCancel}
        />
      </div>
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
