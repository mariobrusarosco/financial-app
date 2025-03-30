import { useState, useRef } from 'react';

interface PdfUploaderProps {
  onUploadComplete: (extractedData: any) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export function PdfUploader({ 
  onUploadComplete, 
  onError, 
  isProcessing = false 
}: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (file: File) => {
    // Check file type
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('File size exceeds 10MB limit');
      return;
    }

    setSelectedFile(file);
    // Auto-submit when file is selected
    handleUpload(file);
  };

  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Call server function to process PDF
      const response = await fetch('/api/process-bank-invoice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }

      const data = await response.json();
      onUploadComplete(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  // Handle drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Trigger file input click
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* PDF upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        } transition-colors duration-200 cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelectFileClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-2">
          {/* Upload icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg 
              className="h-6 w-6 text-gray-600 dark:text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>

          {/* Status text */}
          {isProcessing ? (
            <div className="text-center">
              <div className="mt-2 flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Processing PDF...</span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This may take a few moments depending on the file size
              </p>
            </div>
          ) : selectedFile ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop your bank invoice PDF here
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                or click to browse (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PDF preview (optional) */}
      {selectedFile && !isProcessing && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF loaded and ready for processing
          </p>
        </div>
      )}
    </div>
  );
} 