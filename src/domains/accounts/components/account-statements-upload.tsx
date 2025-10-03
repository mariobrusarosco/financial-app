import { Button } from '@/domains/ui-system/components/button';
import { Currency } from '@/domains/ui-system/components/currency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Surface } from '@/domains/global/components/surface';
import {
  Upload,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParseAccountStatement } from '@/domains/accounts/hooks/use-parse-account-statement';
import { useCreateAccountStatement } from '@/domains/accounts/hooks/use-create-account-statement';
import { UnifiedTransactionItem } from '@/domains/transactions/components/unified-transaction-item';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import type { I_ParsedAccountStatement } from '@/domains/accounts/api';
import type {
  I_TransactionResponse,
  I_CreateTransactionForm,
} from '@/domains/transactions/types/types-and-interfaces';

interface AccountStatementsUploadProps {
  accountId: string;
}

export const AccountStatementsUpload = ({ accountId }: AccountStatementsUploadProps) => {
  const { selectedFile, statement, handleFileChange, handleFileUpload, mutation, isLoading } =
    useParseAccountStatement(accountId);
  const { createStatement, isLoading: isCreating } = useCreateAccountStatement();
  const { mutate: createBulkTransactions, isPending: isSavingTransactions } = useCreateBulkTransactions();
  
  // State for managing editable transactions
  const [editableTransactions, setEditableTransactions] = useState<I_TransactionResponse[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);


  // Use transactions directly from the statement (already in standard format)
  const displayTransactions = useMemo((): I_TransactionResponse[] => {
    if (!statement?.raw_statement?.transactions) return [];
    
    // Initialize editable transactions when statement changes
    if (statement.raw_statement.transactions.length > 0 && editableTransactions.length === 0) {
      setEditableTransactions(statement.raw_statement.transactions);
    }
    
    return editableTransactions.length > 0 ? editableTransactions : statement.raw_statement.transactions;
  }, [statement?.raw_statement?.transactions, editableTransactions]);

  const handleCreateStatement = () => {
    if (statement && accountId) {
      createStatement({
        account_id: accountId,
        raw_statement: statement.raw_statement,
      });
    }
  };

  const handleEditTransaction = (transaction: I_TransactionResponse) => {
    setEditingId(transaction.id);
  };

  const handleDeleteTransaction = (transaction: I_TransactionResponse) => {
    setEditableTransactions(prev => prev.filter(t => t.id !== transaction.id));
  };

  const handleSaveTransaction = (updatedTransaction: I_TransactionResponse) => {
    setEditableTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

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


  if (mutation.isPending) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <div>
            <h3 className="font-semibold text-lg">Processing Statement</h3>
            <p className="text-muted-foreground">Parsing your PDF statement...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Surface className="flex-1" data-ui="account-statements-upload">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Statement
        </CardTitle>
        <CardDescription>
          Upload PDF statements to automatically parse transactions and calculate balances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full cursor-pointer"
            />

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => void handleFileUpload()}
                  disabled={!selectedFile || mutation.isPending}
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {mutation.isPending ? 'Processing...' : 'Upload & Parse'}
                </Button>
              </div>
            )}

            {mutation.isError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{mutation.error?.message}</p>
              </div>
            )}
          </div>

          {statement && !mutation.isError && (
            <div className="space-y-4">
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Statement parsed successfully!
                    </p>
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Period: {statement.raw_statement?.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Closing Balance: </span>
                        <Currency
                          value={parseFloat(
                            statement.closing_balance?.replace(/[^\d,-]/g, '').replace(',', '.') ||
                              '0'
                          )}
                          autoColor
                          variant="default"
                        />
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        Found {statement.raw_statement?.transactions?.length || 0} transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6">
                <h2 className="text-xl font-semibold">Statement Summary</h2>
                <div className="flex gap-2 justify-between items-center">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Period</p>
                    <p className="text-lg font-bold text-foreground">
                      {statement.raw_statement?.period}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Opening Balance</p>
                    <p className="text-lg font-bold text-foreground">{statement.opening_balance}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Closing Balance</p>
                    <p className="text-lg font-bold text-foreground">{statement.closing_balance}</p>
                  </div>
                </div>
              </Card>

              {/* Transactions Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Transactions</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {displayTransactions.length} transactions
                    </div>
                    <Button
                      onClick={handleSaveAllTransactions}
                      disabled={isSavingTransactions || displayTransactions.length === 0}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSavingTransactions ? 'Saving...' : 'Save Transactions'}
                    </Button>
                  </div>
                </div>

                {/* Main Transaction View using UnifiedTransactionItem */}
                <div className="space-y-3">
                  {displayTransactions.map(transaction => (
                    <UnifiedTransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      mode="compact"
                      className="border rounded-lg"
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                      onSave={handleSaveTransaction}
                      onCancel={handleCancelEdit}
                      isEditing={editingId === transaction.id}
                    />
                  ))}
                </div>
              </Card>

              <Button onClick={handleCreateStatement} className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Save Statement'}
              </Button>
            </div>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500 p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                    Statement Processed Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your account statement has been parsed and is ready to save.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    // Reset the file input
                    const fileInput = document.querySelector(
                      'input[type="file"]'
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                    // Reset the component state
                    mutation.reset();
                  }}
                  variant="outline"
                  size="sm"
                >
                  Upload Another Statement
                </Button>
              </div>
            </Card>
          )}
        </div>
      </CardContent>
    </Surface>
  );
};
