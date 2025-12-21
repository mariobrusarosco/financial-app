import { createFileRoute } from '@tanstack/react-router';
import { AccountIncomeScreen } from '@/domains/accounts/screens/account-income';

export const Route = createFileRoute('/(auth)/accounts/$slug/income/')({
  component: AccountIncomeRouteComponent,
});

function AccountIncomeRouteComponent() {
  const { slug } = Route.useParams();
  return <AccountIncomeScreen slug={slug} />;
}
