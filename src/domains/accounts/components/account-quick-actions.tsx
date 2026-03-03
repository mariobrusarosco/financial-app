import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

interface AccountQuickActionsProps {
  slug: string;
}

const AccountQuickActions = ({ slug }: AccountQuickActionsProps) => {
  const { openTransactionCreate } = useGlobalUIState();

  return (
    <div data-ui="account-quick-actions flex gap-4 ml-auto">
      <Button variant="default" className="flex items-center gap-2" onClick={openTransactionCreate}>
        <span className="text-xs">Transaction</span>
        <Plus className="h-5 w-5  text-white" />
      </Button>
    </div>
  );
};

export default AccountQuickActions;
