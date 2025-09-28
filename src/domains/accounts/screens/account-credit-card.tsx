import { CreditCardStatementUpload } from '@/domains/credit-cards/components/credit-card-statement-upload';
import { CreditCardInvoiceList } from '@/domains/credit-cards/components/credit-card-invoice-list';
import { CreditCardTransactionsList } from '@/domains/credit-cards/components/credit-card-transactions-list';
import { useCreditCard } from '@/domains/credit-cards/hooks/use-credit-card';
import { CreditCardHeading } from '@/domains/credit-cards/components/credit-card-heading';
import { useMemo } from 'react';
import { I_CreditCard } from '@/domains/credit-cards/types/types-and-interfaces';

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
    return <div>Loading...</div>;
  }

  if (creditCard.error) {
    return <div>Error: {creditCard.error.message}</div>;
  }

  if (!creditCard.isSuccess) {
    return <div>Credit card not found</div>;
  }

  return (
    <div className="space-y-6" data-ui="account-credit-card-screen">
      <CreditCardHeading creditCard={creditCard.data} />
      {renderContent(currentView, creditCard.data)}
    </div>
  );
};

const renderContent = (currentView: string, creditCard: I_CreditCard) => {
  switch (currentView) {
    case 'transactions':
      return (
        <div className="max-w-4xl">
          <CreditCardTransactionsList creditCardId={creditCard.id} />
        </div>
      );
    case 'invoices':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditCardStatementUpload creditCardId={creditCard.id} />
          <CreditCardInvoiceList creditCardId={creditCard.id} />
        </div>
      );
    default:
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CreditCardStatementUpload creditCardId={creditCard.id} />
          <CreditCardInvoiceList creditCardId={creditCard.id} />
          <CreditCardTransactionsList creditCardId={creditCard.id} />
        </div>
      );
  }
};
