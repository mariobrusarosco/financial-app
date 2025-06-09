import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/domains/ui-system/components/app-layout';

export const Route = createFileRoute('/(auth)/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <div>Hello "/(auth)/settings/"!</div>
    </AppLayout>
  );
}
