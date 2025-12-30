import { useNavigate } from '@tanstack/react-router';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { CreateCreditCardForm } from './create-credit-card-form';
import { CreditCard } from 'lucide-react';

interface CreateCreditCardDrawerProps {
  accountId?: string;
}

export const CreateCreditCardDrawer = ({ accountId }: CreateCreditCardDrawerProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ search: {} });
  };

  return (
    <div className="p-6 space-y-6 h-full">
      {/* Row 1: Title and Action Button */}
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create Credit Card"
          icon={CreditCard}
        />
        <Button size="lg" form="credit-card-create-form">
          Create Credit Card
        </Button>
      </div>

      {/* Row 2: Form Content */}
      <div className="flex-1 overflow-y-auto">
        <CreateCreditCardForm accountId={accountId} />
      </div>
    </div>
  );
};
