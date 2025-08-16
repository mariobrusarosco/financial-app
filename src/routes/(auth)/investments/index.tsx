import { createFileRoute } from '@tanstack/react-router';
import { InvestmentsMainScreen } from '@/domains/investments/screens/investments-main';

export const Route = createFileRoute('/(auth)/investments/')({
  component: InvestmentsRouteComponent,
});

function InvestmentsRouteComponent() {
  return <InvestmentsMainScreen />;
}
