import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { AccountExpensesScreen } from '@/domains/accounts/screens/account-expenses';

const accountExpensesSearchSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional(),
  amount_min: z.number().optional(),
  amount_max: z.number().optional(),
  tag_ids: z.array(z.string()).optional(),
  description_contains: z.string().optional(),
  is_paid: z.boolean().optional(),
  sort_by: z.enum(['date', 'amount', 'created_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/(auth)/accounts/$slug/expenses/')({
  component: AccountExpensesRouteComponent,
  validateSearch: accountExpensesSearchSchema,
});

function AccountExpensesRouteComponent() {
  const { slug } = Route.useParams();
  return <AccountExpensesScreen slug={slug} />;
}
