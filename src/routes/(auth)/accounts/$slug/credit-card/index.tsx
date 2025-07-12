import { createFileRoute } from '@tanstack/react-router';
import { AccountCreditCardsScreen } from '@/domains/accounts/screens/account-credit-cards';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/')({
  component: CreditCardIndexRouteComponent,
});

function CreditCardIndexRouteComponent() {
  const params = Route.useParams();

  return <AccountCreditCardsScreen params={params} />;
}
