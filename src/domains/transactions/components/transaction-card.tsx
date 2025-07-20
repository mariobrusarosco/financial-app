import { Calendar, Tag } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { Card, CardContent } from '@/domains/ui-system/components/card';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import {
  getTransactionIconComponent,
  getIconSizeClass,
  formatDateLong,
  formatCurrencyWithSign,
  getCurrencyClasses,
  getMovementTypeLabel,
  getMovementTypeColor,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from '@/domains/transactions/utils/transaction-formatting';

interface TransactionCardProps {
  id: string;
  description: string;
  category?: string;
  amount: string;
  date: string;
  movementType: T_TransactionType;
  isPaid?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TransactionCard({
  id,
  description,
  category,
  amount,
  date,
  movementType,
  isPaid,
  className,
  onClick,
}: TransactionCardProps) {
  const IconComponent = getTransactionIconComponent(category, movementType);
  const currency = formatCurrencyWithSign(amount, movementType);

  return (
    <Card
      className={cn(
        'transition-colors hover:bg-muted/50',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with icon and amount */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <IconComponent className={getIconSizeClass('md')} />
              </div>
              <div>
                <h3 className="font-medium text-base leading-tight">{description}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      getMovementTypeColor(movementType)
                    )}
                  >
                    {getMovementTypeLabel(movementType)}
                  </span>
                  {isPaid !== undefined && (
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        getPaymentStatusColor(isPaid)
                      )}
                    >
                      {getPaymentStatusLabel(isPaid)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={getCurrencyClasses(movementType, 'large')}>
                {currency.sign}
                {currency.amount}
              </span>
            </div>
          </div>

          {/* Footer with category and date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>{category || 'Uncategorized'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDateLong(date)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
