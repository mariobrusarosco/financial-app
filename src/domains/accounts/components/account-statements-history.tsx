import { Badge } from '@/domains/ui-system/components/badge';
import { Currency } from '@/domains/ui-system/components/currency';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Surface } from '@/domains/global/components/surface';
import { FileText, DollarSign } from 'lucide-react';
import { useAccountStatements } from '@/domains/accounts/hooks/use-account-statements';
import { I_AccountStatement } from '@/domains/accounts/api';

interface AccountStatementsHistoryProps {
  accountId: string;
}

export const AccountStatementsHistory = ({ accountId }: AccountStatementsHistoryProps) => {
  const { data: statements, isLoading: isLoadingStatements } = useAccountStatements(accountId);

  return (
    <Surface className="flex-1" data-ui="account-statements-history">
      <CardHeader>
        <CardTitle>Statement History</CardTitle>
        <CardDescription>Previously uploaded statements for this account</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingStatements ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading statements...</p>
          </div>
        ) : statements && statements.length > 0 ? (
          <div className="space-y-4">
            {statements.map((statement: I_AccountStatement) => (
              <div
                key={statement.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{statement.raw_statement.period}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(statement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">Processed</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Balance:</span>
                    <Currency
                      value={parseFloat(statement.raw_statement.balance)}
                      autoColor
                      variant="compact"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Transactions:</span>
                    <span>{statement.raw_statement.transactions?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No statements uploaded yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first statement to start tracking your account history
            </p>
          </div>
        )}
      </CardContent>
    </Surface>
  );
};
