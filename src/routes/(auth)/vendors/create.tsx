import { createFileRoute } from '@tanstack/react-router';
import { CreateVendorScreen } from '@/domains/vendors/screens/create';

export const Route = createFileRoute('/(auth)/vendors/create')({
  component: CreateVendorScreen,
});
