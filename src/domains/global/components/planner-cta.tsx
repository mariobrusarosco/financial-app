import { useState } from 'react';
import { Button } from '@ui-system/components/button';
import { useGlobalUIState } from '../hooks/use-global-ui-state';
import { ChevronDown, Plus } from 'lucide-react';

export const PlannerCTA = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { openAccountCreate, openBrokerCreate, openTransactionCreate, openCreditCardCreate } =
    useGlobalUIState();

  if (isCollapsed) {
    return (
      <div
        className="fixed bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-background border rounded-full shadow-lg z-50 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setIsCollapsed(false)}
      >
        <img src="/wb.png" alt="Better Call Buffet" className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-lg z-50 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src="/wb.png" alt="Better Call Buffet" className="w-4 h-4" />
          <p className="text-sm font-medium">Your planner</p>
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

      <Button
        size="sm"
        onClick={openAccountCreate}
        className="bg-rose-500 hover:bg-rose-600 text-white"
      >
        <span className="font-semibold">Account</span>
        <Plus className="h-5 w-5  text-white" />
      </Button>
      <Button
        size="sm"
        onClick={openBrokerCreate}
        className="bg-rose-500 hover:bg-rose-600 text-white"
      >
        <span className="font-semibold">Broker</span>
        <Plus className="h-5 w-5  text-white" />
      </Button>
      <Button
        size="sm"
        onClick={openTransactionCreate}
        className="bg-rose-500 hover:bg-rose-600 text-white"
      >
        <span className="font-semibold">Transaction</span>
        <Plus className="h-5 w-5  text-white" />
      </Button>
      <Button
        size="sm"
        onClick={openCreditCardCreate}
        className="bg-rose-500 hover:bg-rose-600 text-white"
      >
        <span className="font-semibold">Credit Card</span>
        <Plus className="h-5 w-5  text-white" />
      </Button>
    </div>
  );
};
