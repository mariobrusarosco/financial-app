import { createFileRoute } from '@tanstack/react-router';
import { VendorsMainScreen } from '@/domains/vendors/screens/main';

export const Route = createFileRoute('/(auth)/vendors/')({
  component: VendorsMainScreen,
});
