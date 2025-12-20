import { useParseCreditCardInvoice } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import { Card } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Upload, FileText, AlertTriangle } from 'lucide-react';

interface InvoiceUploadProcessProps {
  creditCardId: string;
}

export const InvoiceUploadProcess = ({ creditCardId }: InvoiceUploadProcessProps) => {
  const { handleFileUpload, handleFileChange, selectedFile, mutation } =
    useParseCreditCardInvoice(creditCardId);

  if (mutation.isPending) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <div>
            <h3 className="font-semibold text-lg">Processing Invoice</h3>
            <p className="text-muted-foreground">Parsing your PDF invoice...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Upload Credit Card Invoice</h2>
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
              <p className="text-sm text-destructive">{mutation.error?.message}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
