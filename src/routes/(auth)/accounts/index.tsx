import { createFileRoute } from '@tanstack/react-router';
import { AccountMainScreen } from '@/domains/accounts/screens/main';

export const Route = createFileRoute('/(auth)/accounts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountMainScreen />;
}
