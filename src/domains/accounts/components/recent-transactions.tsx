import { Card, CardContent, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { ShoppingCart, Package, Coffee, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { Link } from '@tanstack/react-router';

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
}

// Temporary mock data - replace with real data later
const transactions: Transaction[] = [
  {
    id: '1',
    name: 'Fresh Foods Market',
    category: 'Grocery',
    amount: 78.5,
    date: 'Oct 26',
    type: 'debit',
  },
  {
    id: '2',
    name: 'Gadget Emporium',
    category: 'Online Retailer',
    amount: 120.0,
    date: 'Oct 25',
    type: 'debit',
  },
  {
    id: '3',
    name: 'The Cozy Corner Cafe',
    category: 'Restaurant',
    amount: 45.75,
    date: 'Oct 24',
    type: 'debit',
  },
  {
    id: '4',
    name: 'Paycheck Deposit',
    category: 'Income',
    amount: 2500.0,
    date: 'Oct 21',
    type: 'credit',
  },
];

const getTransactionIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'grocery':
      return <ShoppingCart className="h-4 w-4" />;
    case 'online retailer':
      return <Package className="h-4 w-4" />;
    case 'restaurant':
      return <Coffee className="h-4 w-4" />;
    case 'income':
      return <DollarSign className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

export function RecentTransactions() {
  const formatCurrency = (amount: number, type: 'debit' | 'credit') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    return (
      <span className={cn('tabular-nums', type === 'debit' ? 'text-red-500' : 'text-green-500')}>
        {type === 'debit' ? '-' : '+'}
        {formatted}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                {getTransactionIcon(transaction.category)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatCurrency(transaction.amount, transaction.type)}
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/transactions">
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
