import { DollarSign } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { getIconSizeClass } from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionIconBadgeProps } from './types';

export const TransactionIconBadge = ({ size = 'xs' }: TransactionIconBadgeProps) => {
  return (
    <div className="p-3 rounded-lg bg-primary flex-shrink-0">
      <DollarSign className={cn(getIconSizeClass(size), 'text-neutral-white')} />
    </div>
  );
};
