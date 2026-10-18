import { cn } from '@/domains/ui-system/utils';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import { formatCurrencyAmount, parseCurrencyAmount } from '@/domains/global/utils/formatting';

export {
  formatDateShort,
  formatDateLong,
  formatDateMedium,
  formatCurrencyAmount,
} from '@/domains/global/utils/formatting';

// Icon utilities
export const getIconSizeClass = (size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
  return {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];
};

// Currency formatting utilities
export const isDebitTransaction = (movementType: T_TransactionType): boolean => {
  return movementType === 'expense';
};

export const getCurrencyClasses = (
  movementType: T_TransactionType,
  variant: 'default' | 'large' | 'compact' = 'default'
) => {
  const isDebit = isDebitTransaction(movementType);
  const baseClasses = 'tabular-nums';
  const colorClasses = isDebit ? 'text-foreground' : 'text-positive';
  const sizeClasses = {
    default: 'font-medium',
    large: 'text-lg font-semibold',
    compact: 'text-sm font-medium',
  }[variant];

  return cn(baseClasses, colorClasses, sizeClasses);
};

export const formatCurrencyWithSign = (
  amount: string | number,
  movementType: T_TransactionType
) => {
  const isDebit = isDebitTransaction(movementType);
  const formatted = formatCurrencyAmount(Math.abs(parseCurrencyAmount(amount)));

  return {
    sign: isDebit ? '-' : '+',
    amount: formatted,
    isDebit,
  };
};

// Movement type utilities
export const getMovementTypeLabel = (movementType: T_TransactionType): string => {
  switch (movementType) {
    case 'expense':
      return 'Expense';
    case 'income':
      return 'Income';
    case 'investment':
      return 'Investment';
    case 'transfer':
      return 'Transfer';
    default:
      return movementType;
  }
};

export const getMovementTypeColor = (movementType: T_TransactionType): string => {
  switch (movementType) {
    case 'expense':
      return 'bg-red-100 text-red-800';
    case 'income':
      return 'bg-green-100 text-green-800';
    case 'investment':
      return 'bg-blue-100 text-blue-800';
    case 'transfer':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Payment status utilities
export const getPaymentStatusColor = (isPaid: boolean): string => {
  return isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
};

export const getPaymentStatusLabel = (isPaid: boolean): string => {
  return isPaid ? 'Paid' : 'Pending';
};
