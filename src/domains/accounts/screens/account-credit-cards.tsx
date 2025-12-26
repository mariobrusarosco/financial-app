import { Link } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import { Plus, CreditCard, CreditCardIcon } from 'lucide-react';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { Surface } from '@/domains/global/components/surface';
import { Separator } from '@/domains/ui-system/components/separator';
import { Currency } from '@/domains/ui-system/components/currency';

interface AccountCreditCardsScreenProps {
  params: {
    slug: string;
  };
}

export const AccountCreditCardsScreen = ({ params }: AccountCreditCardsScreenProps) => {
  const { openCreditCardCreate } = useGlobalUIState();
  const {
    data: creditCards,
    isLoading: isLoadingCreditCards,
    error: errorCreditCards,
  } = useCreditCards(params.slug);

  const accountHasCreditCards = creditCards?.data && creditCards.data.length > 0;

  if (isLoadingCreditCards) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading credit cards...</p>
      </div>
    );
  }

  if (errorCreditCards) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error: {errorCreditCards.message}</p>
      </div>
    );
  }

  return (
    <div className="" data-ui="account-credit-cards-screen">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Credit Cards</h2>
          <p className="text-sm text-muted-foreground">Credit cards associated with this account</p>
        </div>
        <Button onClick={openCreditCardCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Credit Card
        </Button>
      </div>

      {accountHasCreditCards && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {creditCards.data.map(creditCard => (
            <li key={creditCard.id}>
              <Link
                to="/accounts/$slug/credit-card/$creditCardId"
                params={{ slug: params.slug, creditCardId: creditCard.id }}
                className="block h-full"
              >
                <Surface
                  hoverable
                  clickable
                  variant="elevated"
                  size="lg"
                  className="h-48 w-full hover:bg-primary/5 p-4 flex flex-col justify-between"
                >
                  <div className="flex-shrink-0 mb-3">
                    <div className="flex items-center gap-1 mb-3">
                      <span className="font-medium truncate">{creditCard.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {creditCard.last_four_digits}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 flex-grow">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-primary">Available</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-primary">Compromised</span>
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                  </div>
                </Surface>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
