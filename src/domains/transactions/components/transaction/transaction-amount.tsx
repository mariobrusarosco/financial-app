import { cn } from '@/domains/ui-system/utils';
import {
  formatCurrencyWithSign,
  getCurrencyClasses,
} from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionAmountProps } from './types';

export const TransactionAmount = ({
  amount,
  movementType,
  size = 'large',
}: TransactionAmountProps) => {
  const currency = formatCurrencyWithSign(amount, movementType);
  const currencyClasses = getCurrencyClasses(movementType, size);

  return (
    <p className={cn(currencyClasses, 'text-md truncate')}>
      {currency.sign}
      {currency.amount}
    </p>
  );
};
