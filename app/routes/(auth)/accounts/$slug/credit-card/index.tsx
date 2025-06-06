import { createFileRoute } from '@tanstack/react-router'
import React, { useRef, useState } from 'react'
import { parsePdf } from '@/server-functions/pdf-parser';

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    const data = await parsePdf({ data: formData });
    console.log({data});
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

      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}
