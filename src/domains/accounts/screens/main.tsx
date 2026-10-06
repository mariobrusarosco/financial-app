import AccountsList from '@/domains/accounts/components/accounts-list';
import { PiggyBank } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { PageHeader } from '@/domains/global/components';

export const AccountMainScreen = () => {
  const { openAccountCreate } = useGlobalUIState();
  const {
    accounts: { query },
  } = useAccounts({ is_active: true });

  return (
    <div data-ui="accounts-main-screen" className="py-6 pr-6">
      <PageHeader
        title="Accounts"
        icon={PiggyBank}
        iconColor="bg-teal-900"
        onAdd={() => void openAccountCreate()}
        showAddButton={!query.isLoading && !query.error}
        addButtonLabel="New account"
      />

      <AccountsList />
    </div>
  );
};
