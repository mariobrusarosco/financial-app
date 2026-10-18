import { Button } from '@/domains/ui-system/components/button';
import { Card } from '@/domains/ui-system/components/card';
import { TransactionRow } from '@/domains/transactions/components/transaction/transaction-row';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import { useEditableCreditCardTransactions } from '@/domains/credit-cards/hooks/use-editable-credit-card-transactions';
import type { I_CreditCardInvoiceResponse } from '@/domains/credit-cards/types/types-and-interfaces';
import type { I_CreateTransactionForm } from '@/domains/transactions/types/types-and-interfaces';

interface InvoiceTransactionsRefinementProcessProps {
  invoice: I_CreditCardInvoiceResponse;
}

export const InvoiceTransactionsRefinementProcess = ({
  invoice,
}: InvoiceTransactionsRefinementProcessProps) => {
  const {
    editableTransactions,
    selectedTransactions,
    toggleTransaction,
    ignoreTransaction,
    ignoredTransactions,
    resetRefinement,
    transactionInEditMode,
    setTransactionInEditMode,
    triggerEditMode,
    updateTransactionInEditionMode,
  } = useEditableCreditCardTransactions({
    invoice,
    creditCardId: invoice.credit_card_id,
    brokerId: invoice.broker_id,
  });
  const { mutate: createBulkTransactions, isPending: isSavingTransactions } =
    useCreateBulkTransactions();

  const handleSaveAllTransactions = () => {
    // Convert to bulk transaction format
    const transactionForms: I_CreateTransactionForm[] = editableTransactions
      .map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        amount: parseFloat(transaction.amount),
        date: transaction.date,
        account_id: transaction.account_id,
        credit_card_id: transaction.credit_card_id,
        broker_id: transaction.broker_id,
        is_paid: transaction.is_paid,
        ignored: transaction.ignored ?? false,
        type: transaction.movement_type,
        is_deleted: transaction.is_deleted,
      }))
      .filter(transaction => !ignoredTransactions.has(transaction.id));

    console.log('💾 Saving credit card transactions:', transactionForms);
    createBulkTransactions(transactionForms);
  };

  const handleTransactionIgnored = (transactionId: string) => {
    ignoreTransaction(transactionId);
    toggleTransaction(transactionId);
  };

  const handleResetRefinement = () => {
    resetRefinement();
  };

  if (!invoice) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Transaction Refinement</h3>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {editableTransactions.length} transactions
          </div>

          <Button onClick={handleResetRefinement} size="sm" variant="outline">
            Reset
          </Button>

          <Button
            onClick={handleSaveAllTransactions}
            disabled={isSavingTransactions || editableTransactions.length === 0}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {isSavingTransactions ? 'Saving...' : 'Save Transactions'}
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {editableTransactions.map(transaction => {
          const isIgnored = ignoredTransactions.has(transaction.id);
          const isSelected = selectedTransactions.has(transaction.id);
          const isEditing = transactionInEditMode?.id === transaction.id;

          return (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              variant="draft"
              isSelected={isSelected}
              draft={{
                isIgnored,
                isEditing,
                onIgnore: () => handleTransactionIgnored(transaction.id),
                onEdit: () => triggerEditMode(transaction),
                onSave: updateTransactionInEditionMode,
                onCancelEdit: () => setTransactionInEditMode(null),
              }}
            />
          );
        })}
      </ul>
    </Card>
  );
};
