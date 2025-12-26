import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

// Main transaction item props
export interface TransactionItemProps {
  transaction: I_TransactionResponse;
  mode: 'compact' | 'default';
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void | null;
  onSave?: (updates: Partial<I_TransactionResponse>) => void;
  onCancel?: () => void;
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  isEditing?: boolean;
  isSelected: boolean;
  onSelectTransaction?: (id: string) => void;
  onSelectionChange?: (selected: boolean) => void;
  showCheckbox?: boolean;
  className?: string;
}

// Hover actions props
export interface TransactionHoverActionsProps {
  transaction: I_TransactionResponse;
  isSelected: boolean;
  showCheckbox: boolean;
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void | null;
  onSelectionChange?: (selected: boolean) => void;
  onSelectTransaction?: (id: string) => void;
}

// Icon badge props
export interface TransactionIconBadgeProps {
  categoryName?: string;
  movementType: string;
  size?: 'sm' | 'xs';
}

// Transaction info props
export interface TransactionInfoProps {
  description: string;
  date: string;
  ignored: boolean;
  dateFormat?: 'short' | 'medium' | 'long';
}

// Amount props
export interface TransactionAmountProps {
  amount: number;
  movementType: string;
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

// Default mode layout props
export interface TransactionItemDefaultProps {
  transaction: I_TransactionResponse;
  isSelected: boolean;
  showCheckbox: boolean;
  onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onIgnoreTransaction?: (id: string) => void | null;
  onSelectionChange?: (selected: boolean) => void;
  onSelectTransaction?: (id: string) => void;
  className?: string;
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
