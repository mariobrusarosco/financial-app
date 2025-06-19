import { Link } from '@tanstack/react-router';
import { Button } from '@/domains/ui-system/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/domains/ui-system/components/card';
import { Plus, CreditCard } from 'lucide-react';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';

interface AccountCreditCardsScreenProps {
  params: {
    slug: string;
  };
}

export const AccountCreditCardsScreen = ({ params }: AccountCreditCardsScreenProps) => {
  const {
    data: creditCards,
    isLoading: isLoadingCreditCards,
    error: errorCreditCards,
  } = useCreditCards(params.slug);

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
    <div className="space-y-6">
      {/* Credit Cards List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Credit Cards</CardTitle>
              <CardDescription>Manage credit cards associated with this account</CardDescription>
            </div>
            <Link to="/accounts/$slug/credit-card/new" params={{ slug: params.slug }}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Credit Card
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {creditCards?.data && creditCards.data.length > 0 ? (
            <div className="space-y-4">
              {creditCards.data.map(creditCard => (
                <Link
                  to="/accounts/$slug/credit-card/$creditCardId"
                  params={{ slug: params.slug, creditCardId: creditCard.id }}
                  key={creditCard.id}
                  className="block"
                >
                  <div className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{creditCard.name}</p>
                        <p className="text-sm text-muted-foreground">{creditCard.brand}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No credit cards yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first credit card to start tracking expenses and statements
              </p>
              <Link to="/accounts/$slug/credit-card/new" params={{ slug: params.slug }}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credit Card
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Card Invoices</CardTitle>
          <CardDescription>Previously uploaded credit card invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
