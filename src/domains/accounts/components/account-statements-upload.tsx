import { Button } from '@/domains/ui-system/components/button';
import { Currency } from '@/domains/ui-system/components/currency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/ui-system/components/table';
import { Surface } from '@/domains/global/components/surface';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Edit3,
} from 'lucide-react';
import { useRef, useState, useMemo } from 'react';
import { useParseAccountStatement } from '@/domains/accounts/hooks/use-parse-account-statement';
import { useCreateAccountStatement } from '@/domains/accounts/hooks/use-create-account-statement';
import { EditableTransactionsTable } from '@/domains/transactions/components/editable-transactions-table';
import { convertAccountStatementTransactionsToEditableFormat } from '@/domains/accounts/utils/statement-converter';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import type {
  I_Transaction,
  I_CreateTransactionForm,
  T_TransactionType,
} from '@/domains/transactions/types/types-and-interfaces';

interface AccountStatementsUploadProps {
  accountId: string;
}

export const AccountStatementsUpload = ({ accountId }: AccountStatementsUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedFile, statement, handleFileChange, isLoading } = useParseAccountStatement();
  const { createStatement, isLoading: isCreating } = useCreateAccountStatement();
  const createBulkTransactionsMutation = useCreateBulkTransactions();
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);

  // Convert account statement transactions to editable format
  const editableTransactions = useMemo(() => {
    if (!statement?.transactions) return [];
    return convertAccountStatementTransactionsToEditableFormat(
      statement.transactions,
      accountId,
      '1' // TODO: Get actual broker ID
    );
  }, [statement?.transactions, accountId]);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleCreateStatement = () => {
    if (statement && accountId) {
      createStatement({
        account_id: accountId,
        raw_statement: statement,
      });
    }
  };

  const handleSaveEditedTransactions = async (editedTransactions: I_Transaction[]) => {
    console.log('💾 Saving edited transactions:', editedTransactions);

    // Convert I_Transaction to I_CreateTransactionForm format for the API
    const transactionForms: I_CreateTransactionForm[] = editedTransactions.map(transaction => ({
      description: transaction.description,
      amount: parseFloat(transaction.amount),
      date: transaction.date,
      account_id: transaction.account_id,
      credit_card_id: undefined,
      broker_id: transaction.broker_id,
      is_paid: transaction.is_paid,
      type: 'expense' as T_TransactionType, // Default to expense for account statements
      category: 'General', // Default category
    }));

    // Create bulk transactions
    createBulkTransactionsMutation.mutate(transactionForms);
  };

  if (isLoading) {
    return (
      <Surface className="flex-1">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">Parsing statement...</p>
          </div>
        </div>
      </Surface>
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
          <Button
            onClick={handleButtonClick}
            className="w-full h-24 border-2 border-dashed border-border hover:border-primary/50 bg-background"
            variant="outline"
            disabled={isLoading || isCreating}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium">Click to upload PDF statement</span>
              <span className="text-sm text-muted-foreground">Supports PDF files up to 10MB</span>
            </div>
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Selected file: {selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {statement && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Statement parsed successfully!
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Period: {statement.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Balance: </span>
                        <Currency
                          value={parseFloat(statement.balance)}
                          autoColor
                          variant="compact"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                      Found {statement.transactions?.length || 0} transactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Transactions</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {statement.transactions?.length || 0} transactions
                    </div>
                    <Button
                      variant={useAdvancedEditor ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUseAdvancedEditor(!useAdvancedEditor)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      {useAdvancedEditor ? 'Switch to Basic View' : 'Enable Advanced Editing'}
                    </Button>
                  </div>
                </div>

                {useAdvancedEditor ? (
                  // Advanced Editable Table with Lazy Loading Immer
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-800">🎓 Advanced Editing Mode</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        This table demonstrates <strong>lazy loading Immer</strong> for state
                        management. Simple edits use native JavaScript, while complex operations
                        lazy load Immer (~43KB) on demand. Open DevTools Network tab to see the
                        optimization in action!
                      </p>
                    </div>
                    <EditableTransactionsTable
                      initialTransactions={editableTransactions}
                      onSave={handleSaveEditedTransactions}
                    />
                  </div>
                ) : (
                  // Basic Read-Only Table
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="text-right font-semibold">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statement.transactions?.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {transaction.category || 'Uncategorized'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <Currency
                              value={parseFloat(transaction.amount)}
                              autoColor
                              variant="compact"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>

              <Button onClick={handleCreateStatement} className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Save Statement'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Surface>
  );
};
