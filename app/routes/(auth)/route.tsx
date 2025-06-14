import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';

export const Route = createFileRoute('/(auth)')({
  component: AuthLayoutComponent,
});

function AuthLayoutComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
