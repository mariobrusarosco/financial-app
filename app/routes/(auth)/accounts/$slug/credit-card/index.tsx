import { createFileRoute } from '@tanstack/react-router'
import React, { useRef, useState } from 'react'
import { useParseStatement } from '@/domains/credit-cards/hooks/use-parse-credit-card';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/')({
  component: CreditCardRouteComponent,
})

function CreditCardRouteComponent() {
  const { slug } = Route.useParams()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const parseStatement = useParseStatement();

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    parseStatement.mutate(formData, {
      onSuccess: (data) => {
        console.log('Parsed statement:', data);
      }
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Credit Card for Account: {slug}</h1>
      <p>This is where the credit card information or features for account <b>{slug}</b> will be displayed.</p>

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
        onClick={handleUpload}
        disabled={parseStatement.isPending}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {parseStatement.isPending ? 'Processing...' : 'Upload'}
      </button>

      {parseStatement.isError && (
        <div className="mt-2 text-sm text-red-600">
          {parseStatement.error.message}
        </div>
      )}

      {parseStatement.isSuccess && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Statement Details</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(parseStatement.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
