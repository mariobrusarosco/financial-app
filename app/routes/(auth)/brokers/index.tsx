import { createFileRoute } from '@tanstack/react-router';
import BrokerRootScreen from '@/domains/broker/screens/main';

export const Route = createFileRoute('/(auth)/brokers/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BrokerRootScreen />;
}

export default Route;
