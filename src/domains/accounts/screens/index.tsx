import AccountsList from '../components/accounts-list';
import { RecentTransactions } from '../components/recent-transactions';
import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

export const AccountIndexScreen = () => {
  const { openAccountCreate } = useGlobalUIState();
  return (
    <div data-ui="accounts-index-screen" className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <Button onClick={openAccountCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AccountsList />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};
