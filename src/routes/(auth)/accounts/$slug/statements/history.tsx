import { createFileRoute } from '@tanstack/react-router';
import { AccountStatementsHistory } from '@/domains/accounts/components/account-statements-history';

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/history')({
  component: HistoryRouteComponent,
});

function HistoryRouteComponent() {
  const params = Route.useParams();

  return <AccountStatementsHistory accountId={params.slug} />;
}
