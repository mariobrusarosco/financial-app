import { createFileRoute } from '@tanstack/react-router';
import { AccountStatementsScreen } from '@/domains/accounts/screens/account-statements';

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/')({
  component: StatementsRouteComponent,
});

function StatementsRouteComponent() {
  const { slug } = Route.useParams();

  return <AccountStatementsScreen />;
}
