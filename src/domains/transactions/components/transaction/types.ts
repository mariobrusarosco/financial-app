import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';

// Icon badge props
export interface TransactionIconBadgeProps {
  movementType: T_TransactionType;
  size?: 'sm' | 'xs';
}

// Amount props
export interface TransactionAmountProps {
  amount: string | number;
  movementType: T_TransactionType;
  ignored?: boolean;
  size?: 'compact' | 'large';
}
