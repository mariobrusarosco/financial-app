import { createFileRoute } from "@tanstack/react-router";
import { MainLayout } from "../components/layout";
import { useState, useEffect } from "react";
import { PdfUploader } from "../components/uploads/PdfUploader";
import { z } from "zod";

// Define the schema for bank invoice extraction results
export const BankInvoiceSchema = z.object({
  bankName: z.string().nullable(),
  statementDate: z.string().nullable(),
  accountNumber: z.string().nullable(),
  totalAmount: z.number().nullable(),
  currencySymbol: z.string().nullable(),
  transactions: z.array(z.object({
    date: z.string().nullable(),
    description: z.string(),
    amount: z.number().nullable(),
    category: z.string().nullable(),
  })),
});

export type BankInvoiceResult = z.infer<typeof BankInvoiceSchema>;

// Define the route
export const Route = createFileRoute('/bank-invoice')({
  component: BankInvoice,
});

function BankInvoice() {
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<BankInvoiceResult | null>(null);

  // Handle server-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle upload complete
  const handleUploadComplete = (data: BankInvoiceResult) => {
    setIsProcessing(false);
    setInvoiceData(data);
    console.log("Invoice processing complete:", data);
  };

  // Handle error
  const handleError = (errorMessage: string) => {
    setIsProcessing(false);
    setError(errorMessage);
  };

  // Format currency
  const formatCurrency = (amount: number | null, symbol: string | null = null) => {
    if (amount === null) return "N/A";
    return `${symbol || ''}${amount.toFixed(2)}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Bank Invoice Processor</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Upload your bank statement PDF to extract transactions automatically
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="rounded-md bg-danger-50 p-4 dark:bg-danger-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Error icon */}
                <svg className="h-5 w-5 text-danger-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-danger-800 dark:text-danger-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Upload area */}
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Upload Bank Statement
          </h2>
          
          {isMounted && (
            <PdfUploader
              onUploadComplete={handleUploadComplete}
              onError={handleError}
              isProcessing={isProcessing}
            />
          )}
        </div>
        
        {/* Results section */}
        {invoiceData && (
          <div className="card space-y-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Statement Summary
            </h2>
            
            {/* Bank details */}
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Bank</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {invoiceData.bankName || "Not detected"}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Statement Date</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {invoiceData.statementDate || "Not detected"}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Account Number</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {invoiceData.accountNumber || "Not detected"}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {invoiceData.totalAmount !== null 
                        ? formatCurrency(invoiceData.totalAmount, invoiceData.currencySymbol) 
                        : "Not detected"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Transactions */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                Extracted Transactions ({invoiceData.transactions.length})
              </h3>
              
              {invoiceData.transactions.length > 0 ? (
                <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Category
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {invoiceData.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {transaction.date || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {transaction.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {transaction.category || "Uncategorized"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                            <span className={`${transaction.amount && transaction.amount < 0 ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
                              {transaction.amount !== null 
                                ? formatCurrency(transaction.amount, invoiceData.currencySymbol) 
                                : "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No transactions were detected in the statement.</p>
              )}
              
              {/* Actions */}
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-700 dark:hover:bg-primary-600"
                  onClick={() => {
                    // Logic to save all transactions
                    alert('Save functionality would be implemented here');
                  }}
                >
                  Save All Transactions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 