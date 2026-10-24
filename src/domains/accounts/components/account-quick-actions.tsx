import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const AccountQuickActions = () => {
  const { openTransactionCreate } = useGlobalUIState();

  return (
    <div data-ui="account-quick-actions">
      <Button variant="default" size="sm" onClick={openTransactionCreate}>
        <Plus className="h-4 w-4" />
        New transaction
      </Button>
    </div>
  );
};

export default AccountQuickActions;
