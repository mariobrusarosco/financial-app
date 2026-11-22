import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/ui-system/components/table';
import { useState, type ReactNode } from 'react';
import { parseISO } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  MoreHorizontal,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { useInvestments } from '../hooks/use-investments';
import useBrokers from '@/domains/broker/hooks/use-brokers';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';
import { Route } from '@/routes/(auth)/route';
import type { I_InvestmentPortfolio } from '../types/types-and-interfaces';
import type { I_Broker } from '@/domains/broker/type/types-and-interfaces';

interface InvestmentsListProps {
  onInvestmentClick?: (investment: I_InvestmentPortfolio) => void;
}

export const InvestmentsList = ({ onInvestmentClick }: InvestmentsListProps) => {
  const { from, to } = Route.useSearch();
  // GlobalDateFilter puts the current month in the URL on the first visit; wait for it
  const { data, isLoading, error } = useInvestments(
    { date_from: from, date_to: to },
    { enabled: !!from && !!to }
  );
  const { data: brokers } = useBrokers();
  const { openInvestmentCreate, openInvestmentDataCreate } = useGlobalUIState();
  // No sort keeps the order the API returns
  const [sort, setSort] = useState<I_Sort | null>(null);
  const investments = sortInvestments((data?.data ?? []).map(withBrokerName(brokers)), sort);

  const handleSort = (column: T_SortColumn) => {
    setSort(current =>
      current?.column === column && current.direction === 'asc'
        ? { column, direction: 'desc' }
        : { column, direction: 'asc' }
    );
  };

  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericAmount);
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-positive" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span className={cn('font-medium', isPositive ? 'text-positive' : 'text-destructive')}>
          {isPositive ? '+' : ''}
          {percentage.toFixed(2)}%
        </span>
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ReportingPeriod />
        <Card>
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>Manage your investment accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-destructive">Error loading investments: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportingPeriod />

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
                <p className="text-2xl font-bold text-positive">
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
          <Card className="py-2">
            <CardContent className="px-2 sm:px-3">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <SortableHead column="name" sort={sort} onSort={handleSort}>
                      Investment
                    </SortableHead>
                    <SortableHead column="broker" sort={sort} onSort={handleSort}>
                      Broker
                    </SortableHead>
                    <SortableHead column="last_updated" sort={sort} onSort={handleSort}>
                      Last updated
                    </SortableHead>
                    <SortableHead
                      column="current_balance"
                      sort={sort}
                      onSort={handleSort}
                      className="text-right"
                    >
                      Current Balance
                    </SortableHead>
                    <SortableHead
                      column="total_growth"
                      sort={sort}
                      onSort={handleSort}
                      className="text-right"
                    >
                      Growth
                    </SortableHead>
                    <SortableHead
                      column="growth_percentage"
                      sort={sort}
                      onSort={handleSort}
                      className="text-right"
                    >
                      %
                    </SortableHead>
                    <TableHead className="w-10">
                      <span className="sr-only">Options</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map(investment => (
                    <TableRow
                      key={investment.investment.id}
                      className={cn(onInvestmentClick && 'cursor-pointer')}
                      onClick={() => onInvestmentClick?.(investment)}
                    >
                      <TableCell>
                        <p className="font-semibold">{investment.investment.name}</p>
                        {investment.investment.description && (
                          <p className="max-w-xs truncate text-xs text-muted-foreground">
                            {investment.investment.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{investment.brokerName || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {parseISO(investment.last_updated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(investment.current_balance)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-positive">
                        {formatCurrency(investment.total_growth)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {formatPercentage(investment.growth_percentage)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Investment options</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// GET /investments only has the broker id; the name comes from GET /brokers
interface I_InvestmentRow extends I_InvestmentPortfolio {
  brokerName: string;
}

const withBrokerName =
  (brokers: I_Broker[] = []) =>
  (investment: I_InvestmentPortfolio): I_InvestmentRow => ({
    ...investment,
    brokerName: brokers.find(broker => broker.id === investment.investment.broker_id)?.name ?? '',
  });

const COMPARE_BY_COLUMN = {
  name: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    a.investment.name.localeCompare(b.investment.name, 'pt-BR'),
  broker: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    a.brokerName.localeCompare(b.brokerName, 'pt-BR'),
  // ISO dates sort as text
  last_updated: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    a.last_updated.localeCompare(b.last_updated),
  current_balance: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    parseFloat(a.current_balance) - parseFloat(b.current_balance),
  total_growth: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    parseFloat(a.total_growth) - parseFloat(b.total_growth),
  growth_percentage: (a: I_InvestmentRow, b: I_InvestmentRow) =>
    a.growth_percentage - b.growth_percentage,
};

type T_SortColumn = keyof typeof COMPARE_BY_COLUMN;

interface I_Sort {
  column: T_SortColumn;
  direction: 'asc' | 'desc';
}

const sortInvestments = (investments: I_InvestmentRow[], sort: I_Sort | null) => {
  if (!sort) return investments;

  const compare = COMPARE_BY_COLUMN[sort.column];
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...investments].sort((a, b) => sign * compare(a, b));
};

const SortableHead = ({
  column,
  sort,
  onSort,
  className,
  children,
}: {
  column: T_SortColumn;
  sort: I_Sort | null;
  onSort: (column: T_SortColumn) => void;
  className?: string;
  children: ReactNode;
}) => {
  const direction = sort?.column === column ? sort.direction : null;
  const SortIcon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown;

  return (
    <TableHead
      className={className}
      aria-sort={
        direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined
      }
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1 uppercase tracking-wide hover:text-foreground',
          direction && 'text-foreground'
        )}
      >
        {children}
        <SortIcon className={cn('h-3 w-3', !direction && 'opacity-50')} />
      </button>
    </TableHead>
  );
};

const ReportingPeriod = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-[var(--shadow-panel)] lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-sm font-semibold text-foreground">Reporting period</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Balances, growth, and performance follow this range.
      </p>
    </div>
    <GlobalDateFilter />
  </div>
);
