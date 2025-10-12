import { Button } from '@/domains/ui-system/components/button';
import { Card } from '@/domains/ui-system/components/card';
import { UnifiedTransactionItem } from '@/domains/transactions/components/unified-transaction-item';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import { useEditableTransactions } from '@/domains/transactions/hooks/use-editable-transactions';
import type { I_ParsedAccountStatement } from '@/domains/accounts/api';
import type { I_CreateTransactionForm } from '@/domains/transactions/types/types-and-interfaces';

interface TransactionsRefinementProcessProps {
  statement: I_ParsedAccountStatement | undefined;
}

export const TransactionsRefinementProcess = ({
  statement,
}: TransactionsRefinementProcessProps) => {
  const {
    editableTransactions,
    selectedTransactions,
    toogleTransaction,
    ignoreTransaction,
    ignoredTransactions,
    resetRefinement,
    transactionInEditMode,
    setTransactionInEditMode,
    triggerEditMode,
    updateTransactionInEditionMode,
  } = useEditableTransactions({ statement });

  const { mutate: createBulkTransactions, isPending: isSavingTransactions } =
    useCreateBulkTransactions();

  const handleSaveAllTransactions = () => {
    // Convert to bulk transaction format
    const transactionForms: I_CreateTransactionForm[] = editableTransactions.map(transaction => ({
      description: transaction.description,
      amount: parseFloat(transaction.amount),
      date: transaction.date,
      account_id: transaction.account_id,
      credit_card_id: transaction.credit_card_id,
      broker_id: transaction.broker_id,
      is_paid: transaction.is_paid,
      type: transaction.movement_type,
      category: transaction.category || 'General',
    }));

    createBulkTransactions(transactionForms);
  };

  const handleTransactionIgnored = (transactionId: string) => {
    ignoreTransaction(transactionId);
    toogleTransaction(transactionId);
  };

  const handleResetRefinement = () => {
    resetRefinement();
  };

  if (!statement) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Transactions</h3>
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

      <div className="space-y-3">
        {editableTransactions.map(transaction => {
          const isIgnored = ignoredTransactions.has(transaction.id);
          const isSelected = selectedTransactions.has(transaction.id);
          const isEditing = transactionInEditMode?.id === transaction.id;

          return (
            <UnifiedTransactionItem
              key={transaction.id}
              transaction={transaction}
              mode="compact"
              className="border rounded-lg"
              onIgnoreTransaction={handleTransactionIgnored}
              isIgnored={isIgnored}
              onSelectTransaction={toogleTransaction}
              isSelected={isSelected}
              onTriggerEditMode={triggerEditMode}
              isEditing={isEditing}
              onSave={updateTransactionInEditionMode}
              onCancel={() => setTransactionInEditMode(null)}
            />
          );
        })}
      </div>
    </Card>
  );
};
