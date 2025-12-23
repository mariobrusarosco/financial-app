import { createFileRoute } from '@tanstack/react-router';
import { AccountExpensesScreen } from '@/domains/accounts/screens/account-expenses';

export const Route = createFileRoute('/(auth)/accounts/$slug/expenses/')({
  component: AccountExpensesRouteComponent,
});

function AccountExpensesRouteComponent() {
  const { slug } = Route.useParams();
  return <AccountExpensesScreen slug={slug} />;
}
