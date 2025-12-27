import { createFileRoute } from '@tanstack/react-router';
import { ViewVendorScreen } from '@/domains/vendors/screens/view';

export const Route = createFileRoute('/(auth)/vendors/$vendorId/')({
  component: ViewVendorScreen,
});
