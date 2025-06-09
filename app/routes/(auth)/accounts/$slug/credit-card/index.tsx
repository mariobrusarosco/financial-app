import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { useCreateCreditCardInvoice } from '@/domains/credit-cards/hooks/use-create-credit-card-invoice';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/')({
  component: CreditCardRouteComponent,
});

function CreditCardRouteComponent() {
  const { slug } = Route.useParams();
  const { mutation, invoice, handleFileUpload, handleFileChange, selectedFile } =
    useParseCreditCardInvoice();

  const { mutation: createInvoiceMutation } = useCreateCreditCardInvoice();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Credit Card for Account: {slug}</h1>
      <p>
        This is where the credit card information or features for account <b>{slug}</b> will be
        displayed.
      </p>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={handleButtonClick}
      >
        Select PDF
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className="mt-2 text-sm text-gray-700">
          Selected file: <b>{selectedFile.name}</b>
        </div>
      )}

      <button
        onClick={handleFileUpload}
        disabled={mutation.isPending}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {mutation.isPending ? 'Processing...' : 'Upload'}
      </button>

      {mutation.isError && (
        <div className="mt-2 text-sm text-red-600">{mutation.error.message}</div>
      )}

      <button
        onClick={() => {
          if (invoice) {
            createInvoiceMutation.mutate({
              creditCardId: slug,
              brokerId: '1',
              rawInvoice: invoice,
            });
          }
        }}
        disabled={createInvoiceMutation.isPending}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300"
      >
        Create Invoice
      </button>

      {mutation.isSuccess && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Statement Details</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(mutation.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
