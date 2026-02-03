import { useState, useRef } from 'react';
import { Download, Upload, FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { Separator } from '@/domains/ui-system/components/separator';
import { Badge } from '@/domains/ui-system/components/badge';
import { useExportData } from '@/domains/data-transfer/hooks/use-export-data';
import { useDownloadExport } from '@/domains/data-transfer/hooks/use-download-export';
import { useImportData } from '@/domains/data-transfer/hooks/use-import-data';
import { useValidateImport } from '@/domains/data-transfer/hooks/use-validate-import';
import { toast } from 'sonner';

export const DataTransferCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportMutation = useExportData();
  const downloadMutation = useDownloadExport();
  const importMutation = useImportData();
  const validateMutation = useValidateImport();

  const handleExport = async () => {
    try {
      const payload = {
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        include_deleted: false,
        format: 'csv' as const,
      };

      const result = await exportMutation.mutateAsync(payload);

      if (result.status === 'completed' && result.download_url) {
        toast.success(`Export completed! ${result.row_count} rows exported.`);
        // Download the file
        await downloadMutation.mutateAsync(result.export_id);
      } else if (result.status === 'failed') {
        toast.error(result.error_message || 'Export failed');
      } else {
        toast.info('Export is being processed...');
      }
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleValidate = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const result = await validateMutation.mutateAsync(selectedFile);

      if (result.valid) {
        toast.success(`File is valid! ${result.row_count} rows found.`, {
          description:
            result.warnings.length > 0 ? `Warnings: ${result.warnings.join(', ')}` : undefined,
        });
      } else {
        toast.error('File validation failed', {
          description: `${result.errors.length} errors found`,
        });
      }
    } catch (error) {
      toast.error('Failed to validate file');
      console.error('Validation error:', error);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const result = await importMutation.mutateAsync(selectedFile);

      if (result.status === 'completed') {
        const stats = result.statistics;
        const entities = result.entities_created;

        toast.success('Import completed successfully!', {
          description: stats
            ? `Imported: ${stats.imported}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`
            : undefined,
        });

        // Reset file selection
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Log entities created
        if (entities) {
          console.log('Entities created:', entities);
        }
      } else if (result.status === 'failed') {
        toast.error('Import failed', {
          description:
            result.error_details && result.error_details.length > 0
              ? `${result.error_details.length} errors found`
              : undefined,
        });
      } else {
        toast.info('Import is being processed...');
      }
    } catch (error) {
      toast.error('Failed to import data');
      console.error('Import error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Transfer
        </CardTitle>
        <CardDescription>
          Export your financial data or import data from a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Export Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download all your financial data as a CSV file. Optionally filter by date range.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date (Optional)</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">To Date (Optional)</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending || downloadMutation.isPending}
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {exportMutation.isPending || downloadMutation.isPending
              ? 'Exporting...'
              : 'Export Data'}
          </Button>

          {exportMutation.isSuccess && exportMutation.data && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                Exported {exportMutation.data.row_count} rows (
                {((exportMutation.data.file_size || 0) / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Import Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Import Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV file to import financial data. File must be less than 50MB.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select CSV File</Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleValidate}
              disabled={!selectedFile || validateMutation.isPending}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <FileCheck className="h-4 w-4" />
              {validateMutation.isPending ? 'Validating...' : 'Validate'}
            </Button>

            <Button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="flex-1 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {importMutation.isPending ? 'Importing...' : 'Import'}
            </Button>
          </div>

          {validateMutation.isSuccess && validateMutation.data && (
            <div
              className={`flex items-start gap-2 text-sm p-3 rounded-md ${
                validateMutation.data.valid
                  ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
                  : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
              }`}
            >
              {validateMutation.data.valid ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">
                  {validateMutation.data.valid ? 'File is valid' : 'Validation failed'}
                </p>
                <p className="text-xs mt-1">
                  {validateMutation.data.valid
                    ? `${validateMutation.data.row_count} rows ready to import`
                    : `${validateMutation.data.errors.length} errors found`}
                </p>
              </div>
            </div>
          )}

          {importMutation.isSuccess && importMutation.data && (
            <div className="flex items-start gap-2 text-sm p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Import completed</p>
                {importMutation.data.statistics && (
                  <p className="text-xs mt-1">
                    Imported: {importMutation.data.statistics.imported}, Skipped:{' '}
                    {importMutation.data.statistics.skipped}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
