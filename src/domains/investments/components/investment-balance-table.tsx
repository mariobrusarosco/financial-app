import { Badge } from '@/domains/ui-system/components/badge';
import { Button } from '@/domains/ui-system/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/ui-system/components/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { ChevronLeft, ChevronRight, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { useAllInvestmentBalancesWithPagination } from '../hooks/use-investment-balance-history';
import { useState } from 'react';
import type { I_InvestmentBalanceWithCalculations } from '../types/types-and-interfaces';
import { formatCurrencyAmount } from '@/domains/global/utils/formatting';

const ITEMS_PER_PAGE = 20;

interface InvestmentBalanceTableProps {
  investmentId?: string;
  title?: string;
  description?: string;
}

export const InvestmentBalanceTable = ({
  investmentId,
  title = 'Investment Balance History',
  description = 'Track your investment performance over time',
}: InvestmentBalanceTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useAllInvestmentBalancesWithPagination(
    currentPage,
    ITEMS_PER_PAGE,
    investmentId ? { investment_id: investmentId } : undefined
  );

  const formatCurrency = (amount: string, showSign = false) => {
    const numericAmount = parseFloat(amount);
    const formatted = formatCurrencyAmount(Math.abs(numericAmount));

    if (!showSign) return formatted;

    return (
      <span className={cn('font-medium', numericAmount >= 0 ? 'text-green-600' : 'text-red-600')}>
        {numericAmount >= 0 ? '+' : '-'}
        {formatted}
      </span>
    );
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-green-600" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-600" />
        )}
        <span className={cn('font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
          {Math.abs(percentage).toFixed(2)}%
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  const getMovementBadge = (amount: string | undefined) => {
    if (!amount || parseFloat(amount) === 0) return null;

    const numericAmount = parseFloat(amount);
    const isDeposit = numericAmount > 0;

    return (
      <Badge
        variant="outline"
        className={cn(
          'font-medium',
          isDeposit
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200'
        )}
      >
        {isDeposit ? 'Deposit' : 'Withdrawal'}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading investment data: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground">Movement</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Balance</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Diff</TableHead>
                <TableHead className="font-semibold text-foreground text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading investment data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No investment data found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((balance: I_InvestmentBalanceWithCalculations) => (
                  <TableRow key={balance.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-muted-foreground">
                      {formatDate(balance.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {balance.movement_amount && (
                          <>
                            <span className="font-medium">
                              {formatCurrency(balance.movement_amount)}
                            </span>
                            {getMovementBadge(balance.movement_amount)}
                          </>
                        )}
                        {!balance.movement_amount && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(balance.balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.diff_amount && parseFloat(balance.diff_amount) !== 0 ? (
                        formatCurrency(balance.diff_amount, true)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {balance.diff_percentage !== 0 ? (
                        formatPercentage(balance.diff_percentage)
                      ) : (
                        <span className="text-muted-foreground">0.00%</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, data.meta.total)} of {data.meta.total} records
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.has_previous}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.has_next}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
