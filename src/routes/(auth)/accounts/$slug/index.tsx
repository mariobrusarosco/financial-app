import { createFileRoute } from '@tanstack/react-router';
import { AccountOverviewScreen } from '@/domains/accounts/screens/account-overview';

export const Route = createFileRoute('/(auth)/accounts/$slug/')({
  component: AccountOverviewComponent,
});

function AccountOverviewComponent() {
  const { slug } = Route.useParams();
  return <AccountOverviewScreen slug={slug} />;
}
