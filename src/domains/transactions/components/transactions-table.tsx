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
import { MoreHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { useAllTransactionsWithPagination } from '../hooks/use-all-transactions';
import { useState } from 'react';
import type { T_TransactionType } from '../types/types-and-interfaces';

const ITEMS_PER_PAGE = 20;

// Category color mapping using our Rose theme
const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'groceries':
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200';
    case 'salary':
      return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
    case 'rent':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
    case 'dining':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200';
    case 'transportation':
      return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200';
    case 'shopping':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200';
    case 'coffee':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200';
    case 'entertainment':
      return 'bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200';
    case 'fitness':
      return 'bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200';
    case 'utilities':
      return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200';
    default:
      return 'bg-muted text-muted-foreground hover:bg-muted/80 border-border';
  }
};

export const TransactionsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useAllTransactionsWithPagination(currentPage, ITEMS_PER_PAGE);

  const formatCurrency = (amount: string, type: T_TransactionType) => {
    const numericAmount = parseFloat(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);

    const isCredit = type === 'income';
    return (
      <span
        className={cn('font-medium tabular-nums', isCredit ? 'text-green-600' : 'text-red-600')}
      >
        {isCredit ? '+' : '-'}
        {formatted}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete record of all your financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading transactions: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A complete record of all your financial transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground">Description</TableHead>
                <TableHead className="font-semibold text-foreground">Category</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map(transaction => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-muted-foreground">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.category ? (
                        <Badge
                          variant="outline"
                          className={cn('font-medium', getCategoryColor(transaction.category))}
                        >
                          {transaction.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.amount, transaction.movement_type)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
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
              {Math.min(currentPage * ITEMS_PER_PAGE, data.meta.total)} of {data.meta.total} results
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
