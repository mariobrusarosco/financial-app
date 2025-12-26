import { createFileRoute } from '@tanstack/react-router';
import { SettingsMainScreen } from '@/domains/settings/screens/main';

export const Route = createFileRoute('/(auth)/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsMainScreen />;
}
