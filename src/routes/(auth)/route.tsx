import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';
import { GlobalDrawer } from '@/domains/global/components/global-drawer';
import { UITestButtons } from '@/domains/global/components/ui-test-buttons';

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
    <AppLayout>
      <Outlet />

      {/* Global UI State Management */}
      {drawer && <GlobalDrawer drawerType={drawer} />}

      {/* Test buttons for development */}
      <UITestButtons />
    </AppLayout>
  );
}
