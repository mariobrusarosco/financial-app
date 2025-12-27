import { Route } from '@tanstack/react-router';
import { VendorsMainScreen } from './main';

export const route = Route.useRoute('/(auth)/vendors/$vendorId');

export const ViewVendorScreen = () => {
  const { vendorId } = route.useParams();
  return (
    <div className="p-4">
      <h1>View Vendor Screen</h1>
      <p>Viewing details for Vendor ID: {vendorId}</p>
    </div>
  );
};
