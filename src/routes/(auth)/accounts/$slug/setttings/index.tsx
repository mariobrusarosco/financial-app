import { createFileRoute } from '@tanstack/react-router';
import { AccountSettingsScreen } from '@/domains/accounts/screens/account-settings';

export const Route = createFileRoute('/(auth)/accounts/$slug/setttings/')({
  component: AccountSettingsRouteComponent,
});

function AccountSettingsRouteComponent() {
  return <AccountSettingsScreen />;
}
