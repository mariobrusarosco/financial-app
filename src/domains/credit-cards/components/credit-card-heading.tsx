import { FileText } from 'lucide-react';

import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Tabs, TabsTrigger, TabsList } from '@/domains/ui-system/components/tabs';
import { TrendingUp } from 'lucide-react';
import { I_CreditCard } from '@/domains/credit-cards/types/types-and-interfaces';

interface CreditCardHeadingProps {
  creditCard: I_CreditCard | null;
}

export const CreditCardHeading = ({ creditCard }: CreditCardHeadingProps) => {
  const activeTab = useMemo(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/invoices')) return 'invoices';
    if (pathname.includes('/transactions')) return 'transactions';
    return 'transactions';
  }, []);

  return (
    <div className="flex gap-8 items-center flex-1" data-ui="credit-card-heading">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Credit Card</p>
        <h1 className="text-3xl font-bold tracking-tight">{creditCard?.name}</h1>
      </div>

      <Tabs value={activeTab} className="ml-4">
        <TabsList>
          <Link
            to="/accounts/$slug/credit-card/$creditCardId/transactions"
            params={{ slug: creditCard?.account_id || '', creditCardId: creditCard?.id || '' }}
          >
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Transactions
            </TabsTrigger>
          </Link>
          <Link
            to="/accounts/$slug/credit-card/$creditCardId/invoices"
            params={{ slug: creditCard?.account_id || '', creditCardId: creditCard?.id || '' }}
          >
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};
