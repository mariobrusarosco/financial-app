import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/accounts/$slug/statements/')({
  component: StatementsIndexComponent,
});

function StatementsIndexComponent() {
  const params = Route.useParams();

  // Redirect to upload tab by default
  return <Navigate to="/accounts/$slug/statements/upload" params={{ slug: params.slug }} replace />;
}
