import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/')({
  component: CreditCardIndexRouteComponent,
});

function CreditCardIndexRouteComponent() {
  const { slug } = Route.useParams();
  const {
    data: creditCards,
    isLoading: isLoadingCreditCards,
    error: errorCreditCards,
  } = useCreditCards(slug);

  if (isLoadingCreditCards) {
    return <div>Loading...</div>;
  }
  if (errorCreditCards) {
    return <div>Error: {errorCreditCards.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Credit Cards for Account: {slug}</h1>
        <Link to="/accounts/$slug/credit-card/new" params={{ slug }}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Credit Card
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Here you can manage all credit cards associated with this account.
        </p>

        <div className="p-4 border border-gray-200 rounded-lg">
          {creditCards?.data.map(creditCard => (
            <Link
              to="/accounts/$slug/credit-card/$creditCardId"
              params={{ slug, creditCardId: creditCard.id }}
              key={creditCard.id}
              className="text-blue-500 hover:text-blue-700"
            >
              <p>{creditCard.name}</p>
              <p>{creditCard.brand}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
