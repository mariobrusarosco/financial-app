import { Button } from '@/domains/ui-system/components/button';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  // Redirect to dashboard for now
  return <Navigate to="/dashboard" />;
}
