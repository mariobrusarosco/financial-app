import { createFileRoute, Outlet } from '@tanstack/react-router';
import { z } from 'zod';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';
import { PlannerCTA } from '@/domains/global/components/planner-cta';
import { AuthGuard } from '@/domains/auth/components/auth-guard';

const authSearchSchema = z.object({
  drawer: z
    .enum([
      'account-create',
      'broker-create',
      'transaction-create',
      'transaction-edit',
      'credit-card-create',
      'investment-create',
      'investment-data-create',
      'category-manager',
      'vendor-create', // New
      'vendor-edit',   // New
    ])
    .optional(),
  transactionId: z.string().optional(),
  vendorId: z.string().optional(), // New
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AuthSearchParams = z.infer<typeof authSearchSchema>;

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutComponent,
  validateSearch: authSearchSchema,
});

function AuthLayoutComponent() {
  const { drawer } = Route.useSearch();

  return (
    <AuthGuard>
      <AppLayout>
        <Outlet />
        {drawer && <GlobalDrawer drawerType={drawer} />}
        <PlannerCTA />
      </AppLayout>
    </AuthGuard>
  );
}
