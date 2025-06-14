import { createFileRoute } from '@tanstack/react-router';
import { AccountScreen } from '@/domains/accounts/screens/account';

export const Route = createFileRoute('/(auth)/accounts/$slug/')({
  component: AccountScreen,
});
