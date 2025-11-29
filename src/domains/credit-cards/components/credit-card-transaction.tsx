import React from 'react';
import { Trash2 } from 'lucide-react';
import { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { Currency } from '@/domains/ui-system/components/currency';
import { Badge } from '@/domains/ui-system/components/badge';
import { Button } from '@/domains/ui-system/components/button';
import { formatDateMedium } from '@/domains/transactions/utils/transaction-formatting';

interface Props {
  transaction: I_TransactionResponse;
  onDelete?: (transactionId: string) => void;
}

export const CreditCardTransaction = ({ transaction, onDelete }: Props) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      onDelete &&
      window.confirm(`Are you sure you want to delete "${transaction.description}"?`)
    ) {
      onDelete(transaction.id);
    }
  };

  return (
    <div
      data-ui="credit-card-transaction"
      className="group flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex flex-col gap-1 flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-medium">{transaction.description}</span>
          {transaction.category && (
            <Badge variant="secondary" className="text-xs">
              {transaction.category}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{formatDateMedium(transaction.date)}</div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Currency value={parseFloat(transaction.amount)} color="negative" variant="default" />
        {onDelete && (
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={e => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
