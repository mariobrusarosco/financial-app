import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import { AccountIndexScreen } from '@/domains/accounts/screens/index';

export const Route = createFileRoute('/(auth)/accounts/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <AccountIndexScreen />
    </AppLayout>
  );
}
