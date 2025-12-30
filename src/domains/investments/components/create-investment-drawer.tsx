import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import CreateInvestment from './create-investment';
import { TrendingUp } from 'lucide-react';

export const CreateInvestmentDrawer = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create New Investment"
          icon={TrendingUp}
        />
        <Button size="lg" form="investment-create-form">
          Create Investment
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateInvestment />
      </div>
    </div>
  );
};
