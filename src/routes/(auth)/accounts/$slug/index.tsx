import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { AccountOverviewScreen } from '@/domains/accounts/screens/account-overview';

const accountOverviewSearchSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional(),
  amount_min: z.number().optional(),
  amount_max: z.number().optional(),
  category: z.string().optional(),
  description_contains: z.string().optional(),
  movement_type: z.enum(['expense', 'income', 'investment', 'transfer']).optional(),
  is_paid: z.boolean().optional(),
  sort_by: z.enum(['date', 'amount', 'created_at', 'category']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/(auth)/accounts/$slug/')({
  component: AccountOverviewComponent,
  validateSearch: accountOverviewSearchSchema,
});

function AccountOverviewComponent() {
  const { slug } = Route.useParams();
  return <AccountOverviewScreen slug={slug} />;
}
