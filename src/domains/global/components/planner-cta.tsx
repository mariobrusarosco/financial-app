import { useState } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { ChevronDown, Plus } from 'lucide-react';

export const PlannerCTA = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { openAccountCreate, openBrokerCreate, openTransactionCreate, openCreditCardCreate } =
    useGlobalUIState();

  if (isCollapsed) {
    return (
      <button
        type="button"
        aria-label="Open quick add menu"
        className="fixed right-4 bottom-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-brand shadow-lg shadow-brand/20 transition-transform hover:-translate-y-0.5"
        onClick={() => setIsCollapsed(false)}
      >
        <Plus className="h-5 w-5 text-brand-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 flex min-w-[220px] flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-pastel-blue text-xs font-bold text-brand">
            B
          </span>
          <p className="text-sm font-semibold">Quick add</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCollapsed(true)}
          className="h-6 w-6 p-0"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Button size="sm" onClick={openAccountCreate} variant="secondary" className="justify-between">
        <span className="font-semibold">Account</span>
        <Plus className="h-4 w-4" />
      </Button>
      <Button size="sm" onClick={openBrokerCreate} variant="secondary" className="justify-between">
        <span className="font-semibold">Broker</span>
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        onClick={openTransactionCreate}
        variant="secondary"
        className="justify-between"
      >
        <span className="font-semibold">Transaction</span>
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        onClick={openCreditCardCreate}
        variant="secondary"
        className="justify-between"
      >
        <span className="font-semibold">Credit Card</span>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
