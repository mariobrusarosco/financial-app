import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';

export const Route = createFileRoute('/(auth)/_auth')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
