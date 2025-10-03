import { useMemo } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/ui-system/components/table';
import { Card } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { EditableTransactionsTable } from '@/domains/transactions/components/editable-transactions-table';

interface CreditCardStatementUploadProps {
  creditCardId: string;
}

export function CreditCardStatementUpload({ creditCardId }: CreditCardStatementUploadProps) {
  const { invoice, handleFileUpload, handleFileChange, selectedFile, mutation } =
    useParseCreditCardInvoice(creditCardId);

  // Always use the advanced editor mode
  const { mutate: createBulkTransactions, isPending: isSavingTransactions } =
    useCreateBulkTransactions();

  // Use transactions directly from the invoice (already in standard format)
  const editableTransactions = useMemo(() => {
    if (!invoice || !invoice.raw_invoice?.transactions) return [];
    return invoice.raw_invoice.transactions;
  }, [invoice?.raw_invoice?.transactions]);

  // Save all edited transactions using the existing bulk transaction API
  const handleSaveEditedTransactions = (editedTransactions: I_TransactionResponse[]) => {
    console.log('💾 Saving edited transactions:', editedTransactions);

    // Convert I_TransactionResponse[] to I_CreateTransactionForm[] for the bulk API
    const transactionsToSave = editedTransactions.map(transaction => ({
      credit_card_id: transaction.credit_card_id || creditCardId,
      account_id: transaction.account_id,
      broker_id: transaction.broker_id,
      description: transaction.description,
      amount: parseFloat(transaction.amount),
      type: transaction.movement_type,
      category: transaction.category || 'Credit Card',
      date: transaction.date,
      is_paid: transaction.is_paid,
    }));

    createBulkTransactions(transactionsToSave);
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Upload Credit Card Statement</h2>
          </div>

          <div className="space-y-4">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
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
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{mutation.error.message}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {invoice && !mutation.isError && (
        <div className="space-y-6">
          <div className="flex grid-cols-3 gap-4">
            {/* Statement Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Statement Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                  <p className="text-2xl font-bold text-foreground">
                    {invoice.raw_invoice.total_due}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-2xl font-bold text-foreground">
                    {invoice.raw_invoice.due_date}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Period</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.raw_invoice.period}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Minimum Payment</p>
                  <p className="text-2xl font-bold text-foreground">
                    {invoice.raw_invoice.min_payment}
                  </p>
                </div>
              </div>
            </Card>

            {/* Installment Options */}
            {invoice?.raw_invoice?.installment_options &&
              invoice.raw_invoice.installment_options.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Installment Options</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Installments</TableHead>
                        <TableHead className="text-right font-semibold">Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.raw_invoice.installment_options.map((option, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {option.months}x installments
                          </TableCell>
                          <TableCell className="text-right font-medium">{option.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

            {/* Next Due Information */}
            {invoice?.raw_invoice?.next_due_info && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-6">Next Due Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Next Due Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      {invoice.raw_invoice.next_due_info.amount}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Balance Due</p>
                    <p className="text-2xl font-bold text-foreground">
                      {invoice.raw_invoice.next_due_info.balance}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Transactions Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Transactions</h3>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {invoice?.raw_invoice?.transactions?.length || 0} transactions
                </div>
              </div>
            </div>

            {/* Advanced Editable Table with Lazy Loading Immer */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">🎓 Advanced Editing Mode</h4>
                </div>
                <p className="text-sm text-blue-700">
                  This table demonstrates <strong>lazy loading Immer</strong> for state management.
                  Simple edits use native JavaScript, while complex operations lazy load Immer
                  (~43KB) on demand. Open DevTools Network tab to see the optimization in action!
                </p>
              </div>

              {/* Save All Button */}
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => void handleSaveEditedTransactions(editableTransactions)}
                  disabled={isSavingTransactions || editableTransactions.length === 0}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSavingTransactions
                    ? 'Saving...'
                    : `Save All ${editableTransactions.length} Transactions`}
                </Button>
              </div>

              <EditableTransactionsTable
                initialTransactions={editableTransactions}
                onSave={handleSaveEditedTransactions}
              />
            </div>
          </Card>

          {/* Success Message */}
          {mutation.isSuccess && (
            <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500 p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                    Invoice Created Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your credit card statement has been processed and saved.
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline">Export to CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
}
