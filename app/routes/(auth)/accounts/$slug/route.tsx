import { createFileRoute } from '@tanstack/react-router';
import { AccountLayout } from '@/domains/accounts/layouts/account-layout';

export const Route = createFileRoute('/(auth)/accounts/$slug')({
  component: AccountLayoutComponent,
});

function AccountLayoutComponent() {
  const { slug } = Route.useParams();

  return <AccountLayout slug={slug} />;
}
