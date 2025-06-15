import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { useCreateCreditCardInvoice } from '@/domains/credit-cards/hooks/use-create-credit-card-invoice';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/$creditCardId/')({
  component: CreditCardDetailRouteComponent,
});

function CreditCardDetailRouteComponent() {
  const { slug, creditCardId } = Route.useParams();
  const { mutation, invoice, handleFileUpload, handleFileChange, selectedFile } =
    useParseCreditCardInvoice();

  const { mutation: createInvoiceMutation } = useCreateCreditCardInvoice();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credit Card Details</h1>
          <p className="text-gray-600">
            Account: {slug} | Credit Card: {creditCardId}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upload Statement</h2>

        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleButtonClick}
        >
          Select PDF Statement
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {selectedFile && (
          <div className="text-sm text-gray-700">
            Selected file: <b>{selectedFile.name}</b>
          </div>
        )}

        <button
          onClick={handleFileUpload}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {mutation.isPending ? 'Processing...' : 'Upload & Parse'}
        </button>

        {mutation.isError && <div className="text-sm text-red-600">{mutation.error.message}</div>}

        {invoice && (
          <button
            onClick={() => {
              createInvoiceMutation.mutate({
                credit_card_id: creditCardId,
                broker_id: '1',
                raw_invoice: invoice,
              });
            }}
            disabled={createInvoiceMutation.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300"
          >
            {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
          </button>
        )}

        {mutation.isSuccess && (
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Parsed Statement Details</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(mutation.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
