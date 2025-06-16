import { createFileRoute } from '@tanstack/react-router';
import { TransactionsListScreen } from '@/domains/transactions/screens/transactions-list';

export const Route = createFileRoute('/(auth)/transactions/')({
  component: TransactionsRouteComponent,
});

function TransactionsRouteComponent() {
  return <TransactionsListScreen />;
}
