import { createFileRoute } from '@tanstack/react-router';
import CreateAccount from '@/domains/accounts/components/create-account';

export const Route = createFileRoute('/(auth)/accounts/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateAccount />;
}
