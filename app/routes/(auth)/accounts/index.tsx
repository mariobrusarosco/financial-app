import { createFileRoute } from '@tanstack/react-router';
import { AccountIndexScreen } from '@/domains/accounts/screens/index';

export const Route = createFileRoute('/(auth)/accounts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountIndexScreen />;
}
