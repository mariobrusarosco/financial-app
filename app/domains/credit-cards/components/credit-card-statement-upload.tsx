import { useState } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { I_CreditCardInvoice } from '@/domains/credit-cards/types/types-and-interfaces';

export function CreditCardStatementUpload() {
  const { invoice, handleFileUpload, mutation } = useParseCreditCardInvoice();

  if (mutation.isPending) {
    return <div>Processing your statement...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {mutation.isError && <div className="text-red-500 mt-2">{mutation.error.message}</div>}
      </div>

      {invoice && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Statement Summary</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500">Total Due</label>
              <div className="font-medium">{invoice.total_due}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <div className="font-medium">{invoice.due_date}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Period</label>
              <div className="font-medium">{invoice.period}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Minimum Payment</label>
              <div className="font-medium">{invoice.min_payment}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Transactions</h3>
            <div className="space-y-2">
              {invoice.transactions.map((transaction, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                  <div className="font-medium">{transaction.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {invoice.installment_options.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Installment Options</h3>
              <div className="space-y-2">
                {invoice.installment_options.map((option, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <div>{option.months}x</div>
                    <div className="font-medium">{option.total}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invoice.next_due_info && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Next Due Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Next Due Amount</label>
                  <div className="font-medium">{invoice.next_due_info.next_due_amount}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Balance Due</label>
                  <div className="font-medium">{invoice.next_due_info.total_balance_due}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
