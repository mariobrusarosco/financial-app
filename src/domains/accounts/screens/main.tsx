import AccountsList from '@/domains/accounts/components/accounts-list';
import { PiggyBank } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { useGetAllActiveAccounts } from '../hooks/use-accounts';
import { PageHeader } from '@/domains/global/components';

export const AccountMainScreen = () => {
  const { openAccountCreate } = useGlobalUIState();
  const { isLoading, error } = useGetAllActiveAccounts();

  return (
    <div data-ui="accounts-main-screen" className="py-4 space-y-5 rounded-3xl h-full">
      <PageHeader
        title="Accounts"
        icon={PiggyBank}
        onAdd={openAccountCreate}
        showAddButton={!isLoading && !error}
      />

      <AccountsList />
    </div>
  );
};
