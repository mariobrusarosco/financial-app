import { createFileRoute } from '@tanstack/react-router';
import { AccountStatementsUpload } from '@/domains/accounts/components/account-statements-upload';

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/upload')({
  component: UploadRouteComponent,
});

function UploadRouteComponent() {
  const params = Route.useParams();

  return <AccountStatementsUpload accountId={params.slug} />;
}
