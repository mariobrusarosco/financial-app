import { createFileRoute } from '@tanstack/react-router'
// import { Button } from '@/domains/ui-system' // Uncomment if you have a Button component

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/')({
  component: StatementsRouteComponent,
})

import React, { useRef, useState } from 'react';

function StatementsRouteComponent() {
  // Access the slug param from the route
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Statements for Account: {slug}</h1>
      <p>This is where the statements for account <b>{slug}</b> will be displayed.</p>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={handleButtonClick}
      >
        Upload PDF
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
    </div>
  )
}
