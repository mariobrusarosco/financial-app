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
const CreateTransactionDrawer = lazy(() =>
  import('@/domains/transactions/components/create-transaction-drawer').then(module => ({
    default: module.CreateTransactionDrawer,
  }))
);
const CreateCreditCardDrawer = lazy(() =>
  import('@/domains/credit-cards/components/create-credit-card-drawer').then(module => ({
    default: module.CreateCreditCardDrawer,
  }))
);
const CreateInvestmentDrawer = lazy(() =>
  import('@/domains/investments/components/create-investment-drawer').then(module => ({
    default: module.CreateInvestmentDrawer,
  }))
);
const CreateInvestmentDataDrawer = lazy(() =>
  import('@/domains/investments/components/create-investment-data-drawer').then(module => ({
    default: module.CreateInvestmentDataDrawer,
  }))
);
const CategoryManagerDrawer = lazy(() =>
  import('@/domains/categories/components/category-manager-drawer').then(module => ({
    default: module.CategoryManagerDrawer,
  }))
);

interface GlobalDrawerProps {
  drawerType:
    | 'account-create'
    | 'broker-create'
    | 'transaction-create'
    | 'credit-card-create'
    | 'investment-create'
    | 'investment-data-create'
    | 'category-manager';
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
  } else if (drawerType === 'transaction-create') {
    DrawerComponent = CreateTransactionDrawer;
  } else if (drawerType === 'credit-card-create') {
    DrawerComponent = CreateCreditCardDrawer;
  } else if (drawerType === 'investment-create') {
    DrawerComponent = CreateInvestmentDrawer;
  } else if (drawerType === 'investment-data-create') {
    DrawerComponent = CreateInvestmentDataDrawer;
  } else if (drawerType === 'category-manager') {
    DrawerComponent = CategoryManagerDrawer;
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
