import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import BrokerRootScreen from '@/domains/broker/screens/main';

export const Route = createFileRoute('/(auth)/brokers/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <BrokerRootScreen />
    </AppLayout>
  );
}

export default Route;
