import { cn } from '@/domains/ui-system/utils';
import { Badge } from '@/domains/ui-system/components/badge';
import { TransactionIconBadge } from './transaction-icon-badge';
import { TransactionInfo } from './transaction-info';
import { TransactionAmount } from './transaction-amount';
import { TransactionCategory } from './transaction-category';
import { TransactionHoverActions } from './transaction-hover-actions';
import type { TransactionItemDefaultProps } from './types';

export const TransactionItemDefault = ({
  transaction,
  isSelected,
  showCheckbox,
  onTriggerEditMode,
  onDelete,
  onIgnoreTransaction,
  onSelectionChange,
  onSelectTransaction,
  className,
}: TransactionItemDefaultProps) => {
  // grid grid-cols-[40px_300px_100px_180px_auto]
  return (
    <div
      data-ui="unified-transaction-item"
      className={cn(
        'group transition-colors hover:bg-muted/50 rounded-sm px-4 py-6 bg-neutral-white  items-center flex gap-4',
        className
      )}
    >
      <TransactionIconBadge
        categoryName={transaction.category_name || transaction.category}
        movementType={transaction.movement_type}
        size="xs"
      />

      <TransactionInfo
        description={transaction.description}
        date={transaction.date}
        ignored={transaction.ignored}
        dateFormat="medium"
      />

      <div className="grid items-center">
        <TransactionAmount
          amount={transaction.amount}
          movementType={transaction.movement_type}
          ignored={transaction.ignored}
          size="compact"
        />

        <TransactionCategory
          categoryTree={transaction.category_tree}
          categoryName={transaction.category_name}
          category={transaction.category}
        />
      </div>

      {transaction.ignored && (
        <Badge
          variant="outline"
          className="px-3 py-1 text-xs bg-orange-700 text-neutral-white border-orange-200"
        >
          Ignored
        </Badge>
      )}

      <TransactionHoverActions
        transaction={transaction}
        isSelected={isSelected}
        showCheckbox={showCheckbox}
        onTriggerEditMode={onTriggerEditMode}
        onDelete={onDelete}
        onIgnoreTransaction={onIgnoreTransaction}
        onSelectionChange={onSelectionChange}
        onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
};
