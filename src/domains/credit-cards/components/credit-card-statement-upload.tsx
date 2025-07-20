import { useState, useMemo } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { useCreateCreditCardInvoice } from '@/domains/credit-cards/hooks/use-create-credit-card-invoice';
import type { I_Transaction } from '@/domains/transactions/types/types-and-interfaces';
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
import { Upload, FileText, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import { EditableTransactionsTable } from '@/domains/transactions/components/editable-transactions-table';
import { convertCreditCardTransactionsToEditableFormat } from '@/domains/credit-cards/utils/transaction-converter';

interface CreditCardStatementUploadProps {
  creditCardId?: string;
}

export function CreditCardStatementUpload({ creditCardId }: CreditCardStatementUploadProps) {
  const { invoice, handleFileUpload, handleFileChange, selectedFile, mutation } =
    useParseCreditCardInvoice();
  const { mutation: createInvoiceMutation } = useCreateCreditCardInvoice();
  const [useAdvancedEditor, setUseAdvancedEditor] = useState(false);

  // Convert credit card transactions to editable format
  const editableTransactions = useMemo(() => {
    if (!invoice?.transactions) return [];
    return convertCreditCardTransactionsToEditableFormat(
      invoice.transactions,
      creditCardId || 'default-account',
      '1' // TODO: Get actual broker ID
    );
  }, [invoice?.transactions, creditCardId]);

  const handleCreateInvoice = () => {
    if (invoice && creditCardId) {
      createInvoiceMutation.mutate({
        credit_card_id: creditCardId,
        raw_invoice: invoice,
      });
    }
  };

  // Use a void function for onSave if EditableTransactionsTable expects void
  const handleSaveEditedTransactions = async (editedTransactions: I_Transaction[]) => {
    console.log('💾 Saving edited transactions:', editedTransactions);
    // Convert back to credit card format for API
    // const updatedCreditCardTransactions =
    //   convertEditableTransactionsToCreditCardFormat(editedTransactions);
    // TODO: Add API call or further processing here if needed
    await Promise.resolve();
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

      {invoice && (
        <div className="space-y-6">
          <div className="flex grid-cols-3 gap-4">
            {/* Statement Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Statement Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.total_due}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.due_date}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Period</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.period}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Minimum Payment</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.min_payment}</p>
                </div>
              </div>
            </Card>

            {/* Installment Options */}
            {invoice.installment_options.length > 0 && (
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
                    {invoice.installment_options.map((option, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{option.months}x installments</TableCell>
                        <TableCell className="text-right font-medium">{option.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Next Due Information */}
            {invoice.next_due_info && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-6">Next Due Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Next Due Amount</p>
                    <p className="text-2xl font-bold text-foreground">
                      {invoice.next_due_info.amount}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Balance Due</p>
                    <p className="text-2xl font-bold text-foreground">
                      {invoice.next_due_info.balance}
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
                  {invoice.transactions.length} transactions
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
                    management. Simple edits use native JavaScript, while complex operations lazy
                    load Immer (~43KB) on demand. Open DevTools Network tab to see the optimization
                    in action!
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
                  {invoice.transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Success Message */}
          {createInvoiceMutation.isSuccess && (
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
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {creditCardId && !createInvoiceMutation.isSuccess && (
              <Button
                onClick={handleCreateInvoice}
                disabled={createInvoiceMutation.isPending}
                variant="default"
              >
                {createInvoiceMutation.isPending ? 'Creating Invoice...' : 'Save Statement'}
              </Button>
            )}
            <Button variant="outline">Export to CSV</Button>
          </div>

          {/* Error handling for invoice creation */}
          {createInvoiceMutation.isError && (
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <h4 className="font-semibold">Error creating invoice</h4>
                  <p className="text-sm">{createInvoiceMutation.error.message}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
