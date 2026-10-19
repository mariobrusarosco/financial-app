import { TrendingUp } from 'lucide-react';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutCancel,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@/domains/ui-system/components/button';
import CreateInvestment from './create-investment';

export const CreateInvestmentDrawer = () => (
  <DrawerLayout data-ui="create-investment-drawer">
    <DrawerLayoutHeader
      icon={TrendingUp}
      title="New investment"
      description="Add an investment to follow its movements and balance over time."
    />
    <DrawerLayoutBody>
      <CreateInvestment />
    </DrawerLayoutBody>
    <DrawerLayoutFooter>
      <DrawerLayoutCancel />
      <Button type="submit" form="investment-create-form">
        Create investment
      </Button>
    </DrawerLayoutFooter>
  </DrawerLayout>
);
