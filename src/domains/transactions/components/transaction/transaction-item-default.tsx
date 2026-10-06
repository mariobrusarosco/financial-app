import { cn } from '@/domains/ui-system/utils';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { TransactionIconBadge } from './transaction-icon-badge';
import { TransactionInfo } from './transaction-info';
import { TransactionAmount } from './transaction-amount';
import { TransactionCategory } from './transaction-category';
import { Edit, Trash2, EyeOff, PiggyBankIcon, CreditCardIcon } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { TransactionDate } from './transaction-date';

// Default mode layout props
export interface TransactionItemDefaultProps {
  transaction: I_TransactionResponse;
  onIgnoreTransaction?: (id: string, currentIgnoreValue: boolean) => void | null;
  isPending?: boolean;
  isSelected?: boolean;
  showCheckbox?: boolean;
  // onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onSelectionChange?: (selected: boolean) => void;
  // onSelectTransaction?: (id: string) => void;
  // className?: string;
}

export const TransactionItemDefault = ({
  transaction,
  isPending,
  onIgnoreTransaction,
  isSelected,
  showCheckbox,
  // onTriggerEditMode,
  onDelete,
  onSelectionChange,
  // onSelectTransaction,
  // className,
}: TransactionItemDefaultProps) => {
  // grid grid-cols-[40px_300px_100px_180px_auto]
  return (
    <div
      data-ui="unified-transaction-item"
      className="relative group transition-colors bg-neutral-grey/5 hover:bg-neutral-grey/10 rounded-sm px-4 py-2 items-center flex gap-4"
    >
      <TransactionIconBadge
        categoryName={transaction.category_name || transaction.category}
        movementType={transaction.movement_type}
        size="xs"
      />

      <div
        className={cn(
          'w-full flex gap-2',
          transaction.ignored && 'opacity-50',
          isPending && 'cursor-wait'
        )}
      >
        <div className="w-full max-w-[200px]">
          <TransactionInfo description={transaction.description} />
          <TransactionCategory
            categoryTree={transaction.category_tree}
            categoryName={transaction.category_name}
            category={transaction.category}
          />
        </div>

        <div className="w-full max-w-[120px] ">
          <TransactionAmount
            amount={transaction.amount}
            movementType={transaction.movement_type}
            size="compact"
          />
          <TransactionDate date={transaction.date} dateFormat="medium" />
        </div>

        <div className="w-full max-w-[100px] flex flex-col justify-between">
          {transaction.credit_card_id && (
            <div className="flex items-center gap-1 max-w-[100px]">
              <CreditCardIcon className="h-4 w-4 text-sea-blue" />
              <span className="flex-1 truncate text-sm">{transaction.credit_card_name}</span>
            </div>
          )}
          {transaction.account_id && (
            <div className="flex items-center gap-1 max-w-[100px]">
              <PiggyBankIcon className="h-4 w-4 fill-sea-blue" />
              <span className="flex-1 truncate text-sm">{transaction.account_name}</span>
            </div>
          )}
        </div>
      </div>

      {/* 
        {installment_info && (
          <div
            variant="outline"
            className="flex items-center gap-1 border-gray-200 bg-gray-50 text-sea-blue"
          >
            <Calendar className="h-3 w-3" />
            {installment_info.number}/{installment_info.total}
          </div>
        )} */}

      {/* {subscription && (
        <div
          variant="outline"
          className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700"
        >
          <Repeat className="h-3 w-3" />
          Recurring
        </div>
      )} */}

      {transaction.ignored && (
        <div className="py-1 px-2 text-xs text-neutral-white bg-red-400 rounded-sm ">ignored</div>
      )}

      <TransactionHoverActions
        transaction={transaction}
        onIgnoreTransaction={onIgnoreTransaction}
        isSelected={isSelected}
        showCheckbox={showCheckbox}
        // onTriggerEditMode={onTriggerEditMode}
        onDelete={onDelete}
        onSelectionChange={onSelectionChange}
        // onSelectTransaction={onSelectTransaction}
      />
    </div>
  );
};

// Hover actions props
export interface TransactionHoverActionsProps {
  transaction: I_TransactionResponse;
  onIgnoreTransaction?: (id: string, currentIgnoreValue: boolean) => void | null;
  isSelected?: boolean;
  showCheckbox?: boolean;
  // onTriggerEditMode?: (transaction: I_TransactionResponse) => void;
  onDelete?: (transaction: I_TransactionResponse) => void;
  onSelectionChange?: (selected: boolean) => void;
  // onSelectTransaction?: (id: string) => void;
}

export const TransactionHoverActions = ({
  transaction,
  onIgnoreTransaction,
  isSelected,
  showCheckbox,
  // onTriggerEditMode,
  onDelete,
  onSelectionChange,
  // onSelectTransaction,
}: TransactionHoverActionsProps) => {
  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onDelete) {
      onDelete(transaction);
    }
  };

  const handleSelection = () => {
    if (onSelectionChange) {
      onSelectionChange(!isSelected);
    }
  };

  return (
    <div
      data-ui="transaction-hover-actions"
      className="items-center opacity-0 absolute bg-sea-blue h-full px-4 py-2 rounded-sm  right-0 top-0 translate-x-20 group-hover:opacity-100 
      transition-all duration-400 transform 
      group-hover:translate-x-0
     flex gap-2 "
      onClick={e => e.stopPropagation()}
    >
      {showCheckbox && (
        <div className="p-3 rounded-lg flex cursor-pointer hover:bg-primary/10 transition-all duration-200">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => {
              e.stopPropagation();
              handleSelection();
            }}
            onClick={e => e.stopPropagation()}
            className="text-primary focus:ring-foreground border-primary "
          />
        </div>
      )}

      {onIgnoreTransaction && (
        <div
          onClick={e => {
            e.stopPropagation();
            onIgnoreTransaction(transaction.id, transaction.ignored);
          }}
          className="p-3 rounded-lg flex cursor-pointer hover:bg-red-400 text-neutral-white transition-all duration-200"
        >
          <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )}
      <div
        // onClick={() => onTriggerEditMode?.(transaction)}
        className="p-3 rounded-lg flex cursor-pointer text-neutral-white hover:text-sea-blue hover:bg-neutral-white transition-all duration-200"
      >
        <Edit className="h-3 w-3 md:h-4 md:w-4" />
      </div>

      {onDelete && (
        <div
          onClick={e => {
            e.stopPropagation();
            handleDelete(e);
          }}
          className="p-3 rounded-lg flex cursor-pointer hover:bg-destructive/80 text-neutral-white transition-all duration-200"
        >
          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      )}
    </div>
  );
};
