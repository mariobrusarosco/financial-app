import { createFileRoute } from '@tanstack/react-router';
import { CashflowExpensesScreen } from '@/domains/cashflow/screens/cashflow-expenses-screen';

export const Route = createFileRoute('/(auth)/cashflow/expenses')({
  component: CashflowExpensesRouteComponent,
});

function CashflowExpensesRouteComponent() {
  return <CashflowExpensesScreen />;
}
