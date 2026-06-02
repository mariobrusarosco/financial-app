import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TransactionsMainScreen } from '@/domains/transactions/screens/main';

const transactionsSearchSchema = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
  sort_by: z.enum(['date', 'amount', 'created_at', 'category']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/transactions/')({
  component: TransactionsRouteComponent,
  validateSearch: transactionsSearchSchema,
});

function TransactionsRouteComponent() {
  return <TransactionsMainScreen />;
}
