import { cn } from '@/domains/ui-system/utils';
import { Badge } from '@/domains/ui-system/components/badge';
import { TransactionIconBadge } from './transaction-icon-badge';
import { TransactionAmount } from './transaction-amount';
import { TransactionHoverActions } from './transaction-hover-actions';
import { formatDateShort } from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionItemCompactProps } from './types';

export const TransactionItemCompact = ({
  transaction,
  isSelected,
  onTriggerEditMode,
  onDelete,
  onIgnoreTransaction,
  onSelectionChange,
  onSelectTransaction,
}: TransactionItemCompactProps) => {
  const handleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(!isSelected);
    } else if (onSelectTransaction) {
      onSelectTransaction(transaction.id);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center space-x-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer',
        isSelected && 'bg-primary/10 border-l-4 border-primary',
        'border rounded-lg p-3'
      )}
      onClick={handleSelection}
    >
      <TransactionIconBadge
        categoryName={transaction.category_name || transaction.category}
        movementType={transaction.movement_type}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm font-medium truncate', transaction.ignored && 'opacity-50')}>
            {transaction.description}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatDateShort(transaction.date)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {transaction.category_tree?.name ||
              transaction.category_name ||
              transaction.category ||
              'Uncategorized'}
          </span>
          <span>•</span>
        </div>
      </div>

      {transaction.ignored && (
        <Badge
          variant="outline"
          className="text-xs bg-orange-50 text-orange-700 border-orange-200 flex-shrink-0"
        >
          Ignored
        </Badge>
      )}

      <div className="text-right flex-shrink-0">
        <TransactionAmount
          amount={transaction.amount}
          movementType={transaction.movement_type}
          ignored={transaction.ignored}
          size="compact"
        />
      </div>

      <TransactionHoverActions
        transaction={transaction}
        isSelected={isSelected}
        showCheckbox={true}
        onTriggerEditMode={onTriggerEditMode}
        onDelete={onDelete}
        onIgnoreTransaction={onIgnoreTransaction}
        onSelectionChange={onSelectionChange}
        onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
};
