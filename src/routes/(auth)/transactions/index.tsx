import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TransactionsMainScreen } from '@/domains/transactions/screens/main';

const transactionsSearchSchema = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
  sort_by: z.enum(['date', 'amount', 'created_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  amount_min: z.number().optional(),
  amount_max: z.number().optional(),
  tag_ids: z.array(z.string()).optional(),
  tag_match: z.enum(['all', 'any']).optional(),
  description_contains: z.string().optional(),
  movement_type: z.enum(['expense', 'income', 'investment', 'transfer']).optional(),
  is_paid: z.boolean().optional(),
});

export const Route = createFileRoute('/(auth)/transactions/')({
  component: TransactionsRouteComponent,
  validateSearch: transactionsSearchSchema,
});

function TransactionsRouteComponent() {
  return <TransactionsMainScreen />;
}
