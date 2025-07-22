import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AccountStatementsHeading } from '@/domains/accounts/components/account-statements-heading';

export const Route = createFileRoute('/(auth)/accounts/$slug/statements')({
  component: StatementsLayoutComponent,
});

function StatementsLayoutComponent() {
  const params = Route.useParams();

  return (
    <div className="space-y-6">
      <AccountStatementsHeading accountId={params.slug} />
      <Outlet />
    </div>
  );
}
