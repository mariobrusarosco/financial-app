import AccountsList from '@/domains/accounts/components/accounts-list';
import { PiggyBank } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { useGetAllActiveAccounts } from '../hooks/use-accounts';
import { PageHeader } from '@/domains/global/components';

export const AccountMainScreen = () => {
  const { openAccountCreate } = useGlobalUIState();
  const { isLoading, error } = useGetAllActiveAccounts();

  return (
    <div data-ui="accounts-main-screen" className="py-6 pr-6">
      <PageHeader
        title="Accounts"
        icon={PiggyBank}
        iconColor="bg-teal-700"
        onAdd={() => void openAccountCreate()}
        showAddButton={!isLoading && !error}
      />

      <AccountsList />
    </div>
  );
};
