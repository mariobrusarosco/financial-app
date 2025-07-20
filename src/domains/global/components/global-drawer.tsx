import { Suspense, lazy } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Drawer, DrawerContent } from '@ui-system/components/drawer';

// Direct lazy imports - simple and clear
const CreateAccountDrawer = lazy(() =>
  import('@/domains/accounts/components/create-account-drawer').then(module => ({
    default: module.CreateAccountDrawer,
  }))
);
const CreateBrokerDrawer = lazy(() =>
  import('@/domains/broker/components/create-broker-drawer').then(module => ({
    default: module.CreateBrokerDrawer,
  }))
);

interface GlobalDrawerProps {
  drawerType: 'account-create' | 'broker-create' | 'transaction-create';
}

export const GlobalDrawer = ({ drawerType }: GlobalDrawerProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  // Simple mapping - no parsing needed
  let DrawerComponent = null;

  if (drawerType === 'account-create') {
    DrawerComponent = CreateAccountDrawer;
  } else if (drawerType === 'broker-create') {
    DrawerComponent = CreateBrokerDrawer;
  }

  if (!DrawerComponent) {
    return null;
  }

  return (
    <Drawer open={true} onOpenChange={open => !open && handleClose()}>
      <DrawerContent className="min-h-[80vh]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          }
        >
          <DrawerComponent />
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
};
