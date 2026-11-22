import { CreditCard } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import { CreateCreditCardForm } from './create-credit-card-form';

interface CreateCreditCardDrawerProps {
  accountId?: string;
}

export const CreateCreditCardDrawer = ({ accountId }: CreateCreditCardDrawerProps) => (
  <DrawerLayout data-ui="create-credit-card-drawer">
    <DrawerLayoutHeader
      icon={CreditCard}
      title="New credit card"
      description="Track its invoices and the purchases made with it."
    />
    <DrawerLayoutBody>
      <CreateCreditCardForm accountId={accountId} />
    </DrawerLayoutBody>
    <DrawerLayoutFooter>
      <DrawerLayoutCancel />
      <Button type="submit" form="credit-card-create-form">
        Create credit card
      </Button>
    </DrawerLayoutFooter>
  </DrawerLayout>
);
