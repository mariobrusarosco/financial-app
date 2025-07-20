import { cn } from '@/domains/ui-system/utils';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import {
  getTransactionIconComponent,
  getIconSizeClass,
  formatDateShort,
  formatCurrencyWithSign,
  getCurrencyClasses,
} from '@/domains/transactions/utils/transaction-formatting';

interface TransactionRowProps {
  id: string;
  description: string;
  category?: string;
  amount: string;
  date: string;
  movementType: T_TransactionType;
  className?: string;
}

export function TransactionRow({
  id,
  description,
  category,
  amount,
  date,
  movementType,
  className,
}: TransactionRowProps) {
  const IconComponent = getTransactionIconComponent(category, movementType);
  const currency = formatCurrencyWithSign(amount, movementType);

  return (
    <div className={cn('flex items-center space-x-3 py-2', className)}>
      <div className="p-1.5 rounded-full bg-primary/10 flex-shrink-0">
        <IconComponent className={getIconSizeClass('sm')} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{description}</p>
        <p className="text-xs text-muted-foreground truncate">{category || 'Uncategorized'}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="text-sm">
          <span className={getCurrencyClasses(movementType, 'compact')}>
            {currency.sign}
            {currency.amount}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{formatDateShort(date)}</div>
      </div>
    </div>
  );
}
