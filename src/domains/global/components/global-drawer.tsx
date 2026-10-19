import { Suspense, lazy } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Drawer, DrawerContent } from '@ui-system/components/drawer';
import { useMediaQuery } from '@/domains/ui-system/hooks/use-media-query';
import { cn } from '@/domains/ui-system/utils';

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
const EditTransactionDrawer = lazy(() =>
  import('@/domains/transactions/components/edit-transaction-drawer').then(module => ({
    default: module.EditTransactionDrawer,
  }))
);

// Vendors
const CreateVendorDrawer = lazy(() =>
  import('@/domains/vendors/components/create-vendor-drawer').then(module => ({
    default: module.CreateVendorDrawer,
  }))
);
const EditVendorDrawer = lazy(() =>
  import('@/domains/vendors/components/edit-vendor-drawer').then(module => ({
    default: module.EditVendorDrawer,
  }))
);

// Subscriptions
const CreateSubscriptionDrawer = lazy(() =>
  import('@/domains/subscriptions/components/create-subscription-drawer').then(module => ({
    default: module.CreateSubscriptionDrawer,
  }))
);
const EditSubscriptionDrawer = lazy(() =>
  import('@/domains/subscriptions/components/edit-subscription-drawer').then(module => ({
    default: module.EditSubscriptionDrawer,
  }))
);

// Installments
const CreateInstallmentDrawer = lazy(() =>
  import('@/domains/installments/components/create-installment-drawer').then(module => ({
    default: module.CreateInstallmentDrawer,
  }))
);

const EditInstallmentPlanDrawer = lazy(() =>
  import('@/domains/installments/components/edit-installment-plan-drawer').then(module => ({
    default: module.EditInstallmentPlanDrawer,
  }))
);

const LinkPaymentToInstallmentDrawer = lazy(() =>
  import('@/domains/installments/components/link-payment-to-installment-drawer').then(module => ({
    default: module.LinkPaymentToInstallmentDrawer,
  }))
);

interface GlobalDrawerProps {
  drawerType:
    | 'account-create'
    | 'broker-create'
    | 'transaction-create'
    | 'transaction-edit'
    | 'credit-card-create'
    | 'investment-create'
    | 'investment-data-create'
    | 'vendor-create'
    | 'vendor-edit'
    | 'subscription-create'
    | 'subscription-edit'
    | 'installment-plan-create'
    | 'installment-plan-edit'
    | 'installment-link-payment';
}

// Form-heavy drawers open as a right-side sheet from md up (bottom sheet on mobile), with these widths
const SIDE_SHEET_WIDTHS: Partial<Record<GlobalDrawerProps['drawerType'], string>> = {
  'transaction-create': 'data-[vaul-drawer-direction=right]:sm:max-w-5xl',
  'transaction-edit': 'data-[vaul-drawer-direction=right]:sm:max-w-3xl',
};

export const GlobalDrawer = ({ drawerType }: GlobalDrawerProps) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 48rem)');
  const sideSheetWidth = SIDE_SHEET_WIDTHS[drawerType];
  const direction = sideSheetWidth && isDesktop ? 'right' : 'bottom';

  const handleClose = () => {
    navigate({
      search: (prev: any) => {
        const newSearch = { ...prev };
        delete newSearch.drawer;
        delete newSearch.transactionId;
        delete newSearch.vendorId;
        delete newSearch.subscriptionId;
        delete newSearch.planId;
        delete newSearch.installmentId;
        return newSearch;
      },
    });
  };

  // Simple mapping - no parsing needed
  let DrawerComponent = null;

  if (drawerType === 'account-create') {
    DrawerComponent = CreateAccountDrawer;
  } else if (drawerType === 'broker-create') {
    DrawerComponent = CreateBrokerDrawer;
  } else if (drawerType === 'transaction-create') {
    DrawerComponent = CreateTransactionDrawer;
  } else if (drawerType === 'transaction-edit') {
    DrawerComponent = EditTransactionDrawer;
  } else if (drawerType === 'credit-card-create') {
    DrawerComponent = CreateCreditCardDrawer;
  } else if (drawerType === 'investment-create') {
    DrawerComponent = CreateInvestmentDrawer;
  } else if (drawerType === 'investment-data-create') {
    DrawerComponent = CreateInvestmentDataDrawer;
  } else if (drawerType === 'vendor-create') {
    DrawerComponent = CreateVendorDrawer;
  } else if (drawerType === 'vendor-edit') {
    DrawerComponent = EditVendorDrawer;
  } else if (drawerType === 'subscription-create') {
    DrawerComponent = CreateSubscriptionDrawer;
  } else if (drawerType === 'subscription-edit') {
    DrawerComponent = EditSubscriptionDrawer;
  } else if (drawerType === 'installment-plan-create') {
    DrawerComponent = CreateInstallmentDrawer;
  } else if (drawerType === 'installment-plan-edit') {
    DrawerComponent = EditInstallmentPlanDrawer;
  } else if (drawerType === 'installment-link-payment') {
    DrawerComponent = LinkPaymentToInstallmentDrawer;
  }

  if (!DrawerComponent) {
    return null;
  }

  return (
    <Drawer
      open={true}
      direction={direction}
      // Keyboard-aware resizing is for mobile bottom sheets; on a side sheet it pins a stale inline height
      repositionInputs={direction === 'bottom'}
      onOpenChange={open => !open && handleClose()}
    >
      <DrawerContent
        className={cn(
          'min-h-[95vh] md:min-h-[80vh]',
          sideSheetWidth &&
            'overflow-hidden data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:rounded-l-3xl data-[vaul-drawer-direction=right]:border-l-0',
          sideSheetWidth
        )}
      >
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
