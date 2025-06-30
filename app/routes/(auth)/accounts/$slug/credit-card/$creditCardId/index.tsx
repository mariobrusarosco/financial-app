import { createFileRoute } from '@tanstack/react-router';
import { AccountCreditCardScreen } from '@/domains/accounts/screens/account-credit-card';

export const Route = createFileRoute('/(auth)/accounts/$slug/credit-card/$creditCardId/')({
  component: () => {
    const params = Route.useParams();

    return <AccountCreditCardScreen params={params} />;
  },
});
