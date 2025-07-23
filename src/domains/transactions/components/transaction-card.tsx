import React from 'react';
import { Calendar, Tag, CreditCard, Wallet } from 'lucide-react';
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
import { Surface } from '@/domains/global/components/surface';
import { Separator } from '@/domains/ui-system/components/separator';

interface TransactionCardProps {
  id: string;
  description: string;
  category?: string;
  amount: string;
  date: string;
  movementType: T_TransactionType;
  isPaid?: boolean;
  creditCardId?: string;
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
  creditCardId,
  className,
  onClick,
}: TransactionCardProps) {
  const IconComponent = getTransactionIconComponent(category, movementType);
  const currency = formatCurrencyWithSign(amount, movementType);
  const movementTypeColor = getMovementTypeColor(movementType);
  const movementTypeLabel = getMovementTypeLabel(movementType);
  const currencyClasses = getCurrencyClasses(movementType, 'large');

  // Determine if this is a credit card transaction or account transaction
  const isCredit = !!creditCardId;
  const transactionTypeIcon = isCredit ? CreditCard : Wallet;
  const transactionTypeLabel = isCredit ? 'Credit' : 'Account';

  return (
    <Surface
      data-ui="transaction-card"
      className={cn(
        'transition-colors hover:bg-muted/50 rounded-sm',
        onClick && 'cursor-pointer hover:shadow-md ',
        className
      )}
      size="sm"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex gap-2 items-center">
          <IconComponent className={cn(getIconSizeClass('xs'), 'text-muted-foreground')} />
          <p className="text-xs leading-tight">{description}</p>
        </div>

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

        <div className="flex gap-1 items-center ml-3">
          <Tag className="h-3  w-3" />
          <span className="text-xs text-muted-foreground">{category || 'Uncategorized'}</span>
        </div>

        <div className="flex gap-1 items-center ml-auto mr-10">
          <Calendar className="h-3 w-3" />
          <span className="text-xs text-muted-foreground">{formatDateLong(date)}</span>
        </div>

        <p className={cn(currencyClasses, 'text-sm')}>
          {currency.sign}
          {currency.amount}
        </p>
      </div>
    </Surface>
  );
}
