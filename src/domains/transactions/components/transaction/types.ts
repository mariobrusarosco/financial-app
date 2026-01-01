import type {
  I_TransactionResponse,
  T_TransactionType,
} from '@/domains/transactions/types/types-and-interfaces';

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
  movementType: T_TransactionType;
  size?: 'sm' | 'xs';
}

// Transaction info props
export interface TransactionInfoProps {
  description: string;
  date: string;
  ignored: boolean;
  subscription?: {
    name: string;
  } | null;
  dateFormat?: 'short' | 'medium' | 'long';
}

// Amount props
export interface TransactionAmountProps {
  amount: number | string;
  movementType: T_TransactionType;
  ignored: boolean;
  size?: 'compact' | 'large';
}

// Category props
export interface TransactionCategoryProps {
  categoryTree?: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    } | null;
  } | null;
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
