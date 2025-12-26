import { cn } from '@/domains/ui-system/utils';
import {
  getTransactionIconComponent,
  getIconSizeClass,
} from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionIconBadgeProps } from './types';

export const TransactionIconBadge = ({
  categoryName,
  movementType,
  size = 'xs',
}: TransactionIconBadgeProps) => {
  const IconComponent = getTransactionIconComponent(categoryName, movementType);

  return (
    <div className="p-3 rounded-lg bg-primary flex-shrink-0">
      <IconComponent className={cn(getIconSizeClass(size), 'text-neutral-white')} />
    </div>
  );
};
