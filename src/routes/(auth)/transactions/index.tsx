import { createFileRoute } from '@tanstack/react-router';
import { TransactionsMainScreen } from '@/domains/transactions/screens/main';

export const Route = createFileRoute('/(auth)/transactions/')({
  component: TransactionsRouteComponent,
});

function TransactionsRouteComponent() {
  return <TransactionsMainScreen />;
}
