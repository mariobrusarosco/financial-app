import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { AccountIncomeScreen } from '@/domains/accounts/screens/account-income';

const accountIncomeSearchSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional(),
  amount_min: z.number().optional(),
  amount_max: z.number().optional(),
  category: z.string().optional(),
  description_contains: z.string().optional(),
  is_paid: z.boolean().optional(),
  sort_by: z.enum(['date', 'amount', 'created_at', 'category']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

export const Route = createFileRoute('/(auth)/accounts/$slug/income/')({
  component: AccountIncomeRouteComponent,
  validateSearch: accountIncomeSearchSchema,
});

function AccountIncomeRouteComponent() {
  const { slug } = Route.useParams();
  return <AccountIncomeScreen slug={slug} />;
}
