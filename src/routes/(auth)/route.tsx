import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';
import { PlannerCTA } from '@/domains/global/components/planner-cta';
import { AuthGuard } from '@/domains/auth/components/auth-guard';

type AuthSearchParams = {
  drawer?: 'account-create' | 'broker-create' | 'transaction-create';
};

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutComponent,
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    const drawer = search.drawer;
    if (
      typeof drawer === 'string' &&
      ['account-create', 'broker-create', 'transaction-create'].includes(drawer)
    ) {
      return { drawer: drawer as AuthSearchParams['drawer'] };
    }
    return {};
  },
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
