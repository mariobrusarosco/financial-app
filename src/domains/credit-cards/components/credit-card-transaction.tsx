import { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { Currency } from '@/domains/ui-system/components/currency';
import { Badge } from '@/domains/ui-system/components/badge';
import { formatDateMedium } from '@/domains/transactions/utils/transaction-formatting';

interface Props {
  transaction: I_TransactionResponse;
}

export const CreditCardTransaction = ({ transaction }: Props) => {
  return (
    <div
      data-ui="credit-card-transaction"
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
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

      <div className="flex-shrink-0">
        <Currency value={parseFloat(transaction.amount)} color="negative" variant="default" />
      </div>
    </div>
  );
};
