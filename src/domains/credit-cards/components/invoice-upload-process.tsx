import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';
import { AlertTriangle, FileText, Loader2, UploadCloud, X } from 'lucide-react';

interface InvoiceUploadProcessProps {
  creditCardId: string;
}

const isPdf = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

export const InvoiceUploadProcess = ({ creditCardId }: InvoiceUploadProcessProps) => {
  const { handleFileUpload, handleFileChange, selectFile, selectedFile, mutation } =
    useParseCreditCardInvoice(creditCardId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!isPdf(file)) {
      setFileError('Only PDF invoices are supported.');
      return;
    }

    setFileError(null);
    selectFile(file);
  };

  const clearFile = () => {
    selectFile(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const errorMessage = fileError ?? (mutation.isError ? mutation.error?.message : null);

  return (
    <div className="space-y-4" data-ui="invoice-upload-process">
      <div>
        <h2 className="text-base font-semibold text-foreground">Import an invoice</h2>
        <p className="text-sm text-muted-foreground">
          Upload the PDF from your bank. We&apos;ll extract its transactions so you can review them
          before saving.
        </p>
      </div>

      {mutation.isPending ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/40 px-6 py-10 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Reading your invoice…</p>
            <p className="text-xs text-muted-foreground">
              {selectedFile?.name ?? 'This usually takes a few seconds.'}
            </p>
          </div>
        </div>
      ) : selectedFile ? (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
              Remove
            </Button>
            <Button size="sm" onClick={() => void handleFileUpload()}>
              <UploadCloud className="h-4 w-4" />
              Upload &amp; parse
            </Button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
            'focus-within:ring-2 focus-within:ring-ring',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/40'
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop your PDF here or <span className="text-primary">browse files</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PDF invoices only</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={e => {
              setFileError(null);
              handleFileChange(e);
            }}
            className="sr-only"
          />
        </label>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
