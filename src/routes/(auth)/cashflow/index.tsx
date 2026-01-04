import { createFileRoute } from '@tanstack/react-router';
import { CashflowScreen } from '@/domains/cashflow/screens/cashflow-screen';

export const Route = createFileRoute('/(auth)/cashflow/')({
  component: CashflowRouteComponent,
});

function CashflowRouteComponent() {
  return <CashflowScreen />;
}
