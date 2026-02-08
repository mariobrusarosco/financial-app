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
import { cn } from '@/domains/ui-system/utils';
import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';

export {
  formatDateShort,
  formatDateLong,
  formatDateMedium,
  formatCurrencyAmount,
} from '@/domains/global/utils/formatting';

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

// Category display utilities

/**
 * Checks if a string is a UUID format.
 * Old transactions may have category as a UUID (deprecated) instead of a name.
 * We don't want to display UUIDs to users.
 */
export const isUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Gets a displayable category name, filtering out UUID values.
 * Handles legacy data where `category` field might contain a UUID
 * instead of a human-readable name.
 *
 * @param category - The category string (could be a name or UUID)
 * @returns The category name if it's displayable, undefined otherwise
 */
export const getDisplayableCategoryName = (category?: string): string | undefined => {
  if (!category) return undefined;
  // If it's a UUID, don't display it
  if (isUUID(category)) return undefined;
  return category;
};

/**
 * Resolves the display name for a transaction category.
 * Handles the priority chain: category_tree.name > categoryName > category (if not UUID) > fallback
 *
 * @param categoryTree - The resolved category tree from the API
 * @param categoryName - The category name field
 * @param category - The legacy category field (may contain UUID or text)
 * @param fallback - The fallback value if no category is found (default: 'Uncategorized')
 * @returns The resolved display name
 */
export const resolveCategoryDisplayName = (
  categoryTree?: { name: string } | null,
  categoryName?: string | null,
  category?: string,
  fallback: string = 'Uncategorized'
): string => {
  return (
    categoryTree?.name ||
    categoryName ||
    getDisplayableCategoryName(category) ||
    fallback
  );
};
