import AccountsList from '@/domains/accounts/components/accounts-list';
import { Button } from '@/domains/ui-system/components/button';
import { PiggyBank, Plus } from 'lucide-react';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

export const AccountIndexScreen = () => {
  const { openAccountCreate } = useGlobalUIState();

  return (
    <div data-ui="accounts-index-screen" className="py-4 space-y-5 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="p-3 bg-foreground/20 rounded-lg">
            <PiggyBank className="h-5 w-5 text-primary" />
          </span>
          <h1 className="text-4xl text-primary font-light tracking-tight">Accounts</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="">Add</span>
          <Button
            className="rounded-full w-10 h-10"
            variant="default"
            onClick={() => void openAccountCreate()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AccountsList />
    </div>
  );
};
