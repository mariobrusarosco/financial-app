import { CreditCardStatementUpload } from '@/domains/credit-cards/components/credit-card-statement-upload';
import { CreditCardInvoiceList } from '@/domains/credit-cards/components/credit-card-invoice-list';
import { useCreditCard } from '@/domains/credit-cards/hooks/use-credit-card';

interface AccountCreditCardScreenProps {
  params: {
    slug: string;
    creditCardId: string;
  };
}

export const AccountCreditCardScreen = ({ params }: AccountCreditCardScreenProps) => {
  const { creditCardId } = params;
  const creditCard = useCreditCard(creditCardId);

  if (creditCard.isLoading) {
    return <div>Loading...</div>;
  }

  if (creditCard.error) {
    return <div>Error: {creditCard.error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex items-center gap-4">
          <h1 className="text-2xl font-bold">Credit Card</h1>
          <h2 className="text-lg text-rose-500 font-semibold">{creditCard.data?.name}</h2>
        </div>
      </div>

      <CreditCardInvoiceList creditCardId={creditCardId} />

      <CreditCardStatementUpload creditCardId={creditCardId} />
    </div>
  );
};
