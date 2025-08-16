import { Badge } from '@/domains/ui-system/components/badge';
import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { TrendingUp, TrendingDown, Plus, MoreHorizontal, PlusCircle } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { useInvestments } from '../hooks/use-investments';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import type { I_InvestmentPortfolio } from '../types/types-and-interfaces';

interface InvestmentsListProps {
  onInvestmentClick?: (investment: I_InvestmentPortfolio) => void;
}

export const InvestmentsList = ({ onInvestmentClick }: InvestmentsListProps) => {
  const { data, isLoading, error } = useInvestments();
  const { openInvestmentCreate, openInvestmentDataCreate } = useGlobalUIState();

  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className={cn('font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
          {isPositive ? '+' : ''}
          {percentage.toFixed(2)}%
        </span>
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Manage your investment accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading investments: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {data && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Total portfolio performance</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={openInvestmentCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
                <Button onClick={openInvestmentDataCreate} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Data
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(data.meta.total_balance)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Growth</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.meta.total_growth)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Overall Performance</p>
                <div className="text-2xl font-bold">
                  {formatPercentage(data.meta.overall_growth_percentage)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Investments */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading investments...</p>
              </div>
            </CardContent>
          </Card>
        ) : data?.data.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No investments found</p>
              <Button onClick={openInvestmentCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first investment
              </Button>
            </CardContent>
          </Card>
        ) : (
          data?.data.map(investment => (
            <Card
              key={investment.investment.id}
              className={cn(
                'transition-all hover:shadow-md',
                onInvestmentClick && 'cursor-pointer hover:border-primary/50'
              )}
              onClick={() => onInvestmentClick?.(investment)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{investment.investment.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        Investment
                      </Badge>
                    </div>
                    {investment.investment.description && (
                      <p className="text-sm text-muted-foreground">
                        {investment.investment.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(investment.last_updated).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-bold text-lg">
                        {formatCurrency(investment.current_balance)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(investment.total_growth)}
                        </span>
                        {formatPercentage(investment.growth_percentage)}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Investment options</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
