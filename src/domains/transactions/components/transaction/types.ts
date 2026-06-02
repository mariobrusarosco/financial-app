import type {
  I_TransactionResponse,
  T_TransactionType,
} from '@/domains/transactions/types/types-and-interfaces';

// Icon badge props
export interface TransactionIconBadgeProps {
  categoryName?: string;
  movementType: T_TransactionType;
  size?: 'sm' | 'xs';
}

// Amount props
export interface TransactionAmountProps {
  amount: number;
  movementType: T_TransactionType;
  ignored: boolean;
  size?: 'compact' | 'large';
}

// Category props
export interface TransactionCategoryProps {
  categoryTree?: {
    name: string;
    parent?: {
      name: string;
    };
  };
  categoryName?: string;
  category?: string;
}

// Compact mode layout props
export interface TransactionItemCompactProps {
  transaction: I_TransactionResponse;
  isSelected: boolean;
  onTriggerEditMode: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void;
  onSelectionChange?: (selected: boolean) => void;
  onSelectTransaction?: (id: string) => void;
}
