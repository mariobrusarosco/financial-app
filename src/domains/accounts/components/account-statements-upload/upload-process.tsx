import { Button } from '@/domains/ui-system/components/button';
import { Currency } from '@/domains/ui-system/components/currency';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Upload, FileText, CheckCircle, Calendar } from 'lucide-react';
import { useParseAccountStatement } from '@/domains/accounts/hooks/use-parse-account-statement';
import { useCreateAccountStatement } from '@/domains/accounts/hooks/use-create-account-statement';
import { useQuery } from '@tanstack/react-query';
import type { I_ParsedAccountStatement } from '@/domains/accounts/api';
import { GET_UPLOADED_STATEMENT_QUERY_KEY } from '@/domains/accounts/api/keys';

interface UploadProcessProps {
  accountId: string;
  onStatementParsed?: (statement: I_ParsedAccountStatement) => void;
}

export const UploadProcess = ({ accountId, onStatementParsed }: UploadProcessProps) => {
  const { selectedFile, handleFileChange, handleFileUpload, mutation } =
    useParseAccountStatement(accountId);
  const { data: statement } = useQuery<I_ParsedAccountStatement>({
    queryKey: GET_UPLOADED_STATEMENT_QUERY_KEY(accountId),
    enabled: false, // Don't fetch, just read from cache
  });

  const { createStatement, isLoading: isCreating } = useCreateAccountStatement();

  const handleCreateStatement = () => {
    if (statement) {
      createStatement({
        account_id: accountId,
        raw_statement: statement.raw_statement,
      });
    }
  };

  if (mutation.isPending) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <div>
            <h3 className="font-semibold text-lg">Processing Statement</h3>
            <p className="text-muted-foreground">Parsing your PDF statement...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Statement
        </CardTitle>
        <CardDescription>
          Upload PDF statements to automatically parse transactions and calculate balances
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 flex flex-col justify-between gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full cursor-pointer"
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
          </div>

          {mutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{mutation.error?.message}</p>
            </div>
          )}

          {statement && !mutation.isError && (
            <div className="space-y-4 flex-1">
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Statement parsed successfully!
                    </p>
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Period: {statement.raw_statement?.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Closing Balance: </span>
                        <Currency
                          value={parseFloat(
                            statement.closing_balance?.replace(/[^\d,-]/g, '').replace(',', '.') ||
                              '0'
                          )}
                          autoColor
                          variant="default"
                        />
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        Found {statement.raw_statement?.transactions?.length || 0} transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="py-2 px-4 gap-1">
                <h2 className="text-xl font-semibold">Statement Summary</h2>
                <div className="flex gap-1 justify-between items-center flex-wrap">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Period</p>
                    <p className="text-lg font-bold text-foreground">
                      {statement.raw_statement?.period}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Opening Balance</p>
                    <p className="text-lg font-bold text-foreground">{statement.opening_balance}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Closing Balance</p>
                    <p className="text-lg font-bold text-foreground">{statement.closing_balance}</p>
                  </div>
                </div>
              </Card>

              <Button onClick={handleCreateStatement} className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Save Statement'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
