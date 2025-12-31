import { createFileRoute } from '@tanstack/react-router';
import { InstallmentsMainScreen } from '@/domains/installments/screens/main';

export const Route = createFileRoute('/(auth)/installments/')({
  component: InstallmentsMainScreen,
});
