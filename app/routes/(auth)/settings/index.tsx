import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/(auth)/settings/&quot;!</div>;
}
