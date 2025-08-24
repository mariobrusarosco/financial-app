import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { InvestmentsMainScreen } from '@/domains/investments/screens/investments-main';

const investmentsSearchSchema = z.object({
  section: z.enum(['accounts', 'overview', 'history', 'data-input', 'individual']).optional(),
});

export const Route = createFileRoute('/(auth)/investments/')({
  component: InvestmentsRouteComponent,
  validateSearch: investmentsSearchSchema,
});

function InvestmentsRouteComponent() {
  return <InvestmentsMainScreen />;
}
