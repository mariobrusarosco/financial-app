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
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
}

// Enhanced mock data that matches the image
const transactions: Transaction[] = [
  {
    id: '1',
    date: 'Mar 15, 2024',
    description: 'Grocery shopping at Local Market',
    category: 'Groceries',
    amount: 75.5,
    type: 'debit',
  },
  {
    id: '2',
    date: 'Mar 14, 2024',
    description: 'Rent payment',
    category: 'Rent',
    amount: 1500.0,
    type: 'debit',
  },
  {
    id: '3',
    date: 'Mar 14, 2024',
    description: 'Salary deposit',
    category: 'Salary',
    amount: 3500.0,
    type: 'credit',
  },
  {
    id: '4',
    date: 'Mar 13, 2024',
    description: 'Dinner at Italian Bistro',
    category: 'Dining',
    amount: 60.0,
    type: 'debit',
  },
  {
    id: '5',
    date: 'Mar 12, 2024',
    description: 'Gasoline refill',
    category: 'Transportation',
    amount: 45.0,
    type: 'debit',
  },
  {
    id: '6',
    date: 'Mar 11, 2024',
    description: 'Online shopping at Fashion Hub',
    category: 'Shopping',
    amount: 120.0,
    type: 'debit',
  },
  {
    id: '7',
    date: 'Mar 10, 2024',
    description: 'Coffee at Coffee Corner',
    category: 'Coffee',
    amount: 5.0,
    type: 'debit',
  },
  {
    id: '8',
    date: 'Mar 09, 2024',
    description: 'Movie tickets',
    category: 'Entertainment',
    amount: 30.0,
    type: 'debit',
  },
  {
    id: '9',
    date: 'Mar 08, 2024',
    description: 'Gym membership',
    category: 'Fitness',
    amount: 50.0,
    type: 'debit',
  },
  {
    id: '10',
    date: 'Mar 07, 2024',
    description: 'Internet bill',
    category: 'Utilities',
    amount: 80.0,
    type: 'debit',
  },
];

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
  const formatCurrency = (amount: number, type: 'debit' | 'credit') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    return (
      <span
        className={cn(
          'font-medium tabular-nums',
          type === 'debit' ? 'text-red-600' : 'text-green-600'
        )}
      >
        {type === 'debit' ? '-' : '+'}
        {formatted}
      </span>
    );
  };

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
              {transactions.map(transaction => (
                <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-muted-foreground">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('font-medium', getCategoryColor(transaction.category))}
                    >
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.amount, transaction.type)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">Showing 1 to 10 of 97 results</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
