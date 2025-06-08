import { createFileRoute } from '@tanstack/react-router';
import BrokerCreateScreen from '@/domains/broker/screens/create';

export const Route = createFileRoute('/(auth)/brokers/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BrokerCreateScreen />;
}

export default Route;
