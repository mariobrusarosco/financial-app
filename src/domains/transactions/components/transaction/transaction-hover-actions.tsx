import { Edit, Trash2 } from 'lucide-react';
import type { TransactionHoverActionsProps } from './types';

export const TransactionHoverActions = ({
  transaction,
  isSelected,
  showCheckbox,
  onTriggerEditMode,
  onDelete,
  onIgnoreTransaction,
  onSelectionChange,
  onSelectTransaction,
}: TransactionHoverActionsProps) => {
  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onDelete) {
      onDelete(transaction);
    } else if (onIgnoreTransaction) {
      onIgnoreTransaction(transaction.id);
    }
  };

  const handleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(!isSelected);
    } else if (onSelectTransaction) {
      onSelectTransaction(transaction.id);
    }
  };

  return (
    <div
      data-ui="transaction-hover-actions"
      className="hover-actions  group-hover:opacity-100 
      transition-all duration-200 transform translate-x-2 
      group-hover:translate-x-0 
      ml-auto flex gap-2 "
      onClick={e => e.stopPropagation()}
    >
      {showCheckbox && (
        <div className="p-3 rounded-lg flex cursor-pointer hover:bg-primary/10 transition-all duration-200">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => {
              e.stopPropagation();
              handleSelection();
            }}
            onClick={e => e.stopPropagation()}
            className="text-foreground focus:ring-foreground border-primary "
          />
        </div>
      )}
      <div
        onClick={() => onTriggerEditMode?.(transaction)}
        className="p-3 rounded-lg flex cursor-pointer hover:bg-primary/80 hover:text-neutral-white transition-all duration-200"
      >
        <Edit className="h-3 w-3 md:h-4 md:w-4" />
      </div>

      {(onDelete || onIgnoreTransaction) && (
        <div
          onClick={e => {
            e.stopPropagation();
            handleDelete(e);
          }}
          className="p-3 rounded-lg flex cursor-pointer hover:bg-destructive/80 hover:text-neutral-white transition-all duration-200"
        >
          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )}
    </div>
  );
};
