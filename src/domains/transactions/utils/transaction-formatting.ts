import {
  ShoppingCart,
  Package,
  Coffee,
  DollarSign,
  PartyPopper,
  Heart,
  Book,
  Car,
  CreditCard,
  Plane,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/domains/ui-system/utils';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';

// Icon utilities
export const getTransactionIconComponent = (
  category?: string,
  movementType?: T_TransactionType
) => {
  if (movementType === 'income') {
    return DollarSign;
  }

  if (!category) return DollarSign;

  switch (category.toLowerCase()) {
    case 'grocery':
    case 'food':
      return ShoppingCart;
    case 'shopping':
    case 'retail':
      return Package;
    case 'restaurant':
    case 'dining':
      return Coffee;
    case 'transportation':
      return Car;
    case 'entertainment':
      return PartyPopper;
    case 'health':
      return Heart;
    case 'education':
      return Book;
    case 'bills':
      return CreditCard;

    case 'travel':
      return Plane;
    case 'healthcare':
      return Heart;
    case 'other':
    default:
      return DollarSign;
  }
};

export const getIconSizeClass = (size: 'xs' | 'sm' | 'md' | 'lg' = 'md') => {
  return {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];
};

// Date formatting utilities
export const formatDateShort = (dateString: string | Date) => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateLong = (dateString: string | Date) => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'EEE, MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatDateMedium = (dateString: string | Date) => {
  if (!dateString) return 'Invalid Date';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Currency formatting utilities
export const isDebitTransaction = (movementType: T_TransactionType): boolean => {
  return movementType === 'expense';
};

export const formatCurrencyAmount = (
  amount: string | number,
  options: {
    showSign?: boolean;
    currency?: string;
  } = {}
) => {
  const { showSign = false, currency = 'USD' } = options;

  if (!amount && amount !== 0) return '$0.00';

  try {
    let numAmount: number;

    if (typeof amount === 'string') {
      // Handle Brazilian format (e.g., "5.861,36" or "+ 5.861,36" or "- 1.772,93")
      let cleanAmount = amount.trim();

      // Remove leading + or - signs for parsing
      const isNegative = cleanAmount.startsWith('-');
      cleanAmount = cleanAmount.replace(/^[+-]\s*/, '');

      // Check if it's Brazilian format (contains comma as decimal separator and possibly dots as thousands)
      if (
        cleanAmount.includes(',') &&
        cleanAmount.lastIndexOf(',') > cleanAmount.lastIndexOf('.')
      ) {
        // Brazilian format: "5.861,36" -> "5861.36"
        cleanAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
      }

      numAmount = parseFloat(cleanAmount);

      // Apply original sign if it was negative
      if (isNegative) {
        numAmount = -numAmount;
      }
    } else {
      numAmount = amount;
    }

    if (isNaN(numAmount)) return '$0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(showSign ? Math.abs(numAmount) : numAmount);
  } catch (error) {
    return '$0.00';
  }
};

export const getCurrencyClasses = (
  movementType: T_TransactionType,
  variant: 'default' | 'large' | 'compact' = 'default'
) => {
  const isDebit = isDebitTransaction(movementType);
  const baseClasses = 'tabular-nums';
  const colorClasses = isDebit ? 'text-red-700/90' : 'text-teal-500/80';
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
  const formatted = formatCurrencyAmount(amount, { showSign: true });

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
