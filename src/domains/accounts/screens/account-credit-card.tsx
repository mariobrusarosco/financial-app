import { CreditCardStatementUpload } from '@/domains/credit-cards/components/credit-card-statement-upload';
import { CreditCardInvoiceList } from '@/domains/credit-cards/components/credit-card-invoice-list';
import { CreditCardTransactionsList } from '@/domains/credit-cards/components/credit-card-transactions-list';
import { useCreditCard } from '@/domains/credit-cards/hooks/use-credit-card';
import { CreditCardHeading } from '@/domains/credit-cards/components/credit-card-heading';
import { useMemo } from 'react';
import type { I_CreditCard } from '@/domains/credit-cards/types/types-and-interfaces';
import { Skeleton } from '@/domains/ui-system/components/skeleton';

interface AccountCreditCardScreenProps {
  params: {
    slug: string;
    creditCardId: string;
  };
}

export const AccountCreditCardScreen = ({ params }: AccountCreditCardScreenProps) => {
  const { creditCardId } = params;
  const creditCard = useCreditCard(creditCardId);

  const currentView = useMemo(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/invoices')) return 'invoices';
    if (pathname.includes('/transactions')) return 'transactions';
    return 'overview'; // Default view shows all sections
  }, []);

  if (creditCard.isLoading) {
    return <Skeleton className="h-80 w-full rounded-2xl" />;
  }

  if (creditCard.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive">
        We couldn&apos;t load this credit card: {creditCard.error.message}
      </div>
    );
  }

  if (!creditCard.isSuccess) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Credit card not found.
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ui="account-credit-card-screen">
      <CreditCardHeading creditCard={creditCard.data} />
      {renderContent(currentView, creditCard.data)}
    </div>
  );
};

const renderContent = (currentView: string, creditCard: I_CreditCard) => {
  switch (currentView) {
    case 'transactions':
      return (
        <div>
          <CreditCardTransactionsList creditCardId={creditCard.id} />
        </div>
      );
    case 'invoices':
      return (
        <div className="grid gap-5 xl:grid-cols-2">
          <CreditCardStatementUpload creditCardId={creditCard.id} />
          <CreditCardInvoiceList creditCardId={creditCard.id} />
        </div>
      );
    default:
      return (
        <div className="grid gap-5">
          <CreditCardStatementUpload creditCardId={creditCard.id} />
          <CreditCardInvoiceList creditCardId={creditCard.id} />
          <CreditCardTransactionsList creditCardId={creditCard.id} />
        </div>
      );
  }
};
