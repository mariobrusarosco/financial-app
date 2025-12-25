import { Button } from '@/domains/ui-system/components/button';
import { Landmark, Plus } from 'lucide-react';
import BrokersList from '../components/brokers-list';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const BrokerRootScreen = () => {
  const { openBrokerCreate } = useGlobalUIState();

  return (
    <div data-testid="broker-index-screen" className="py-4 space-y-5 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="p-3 bg-foreground/20 rounded-lg">
            <Landmark className="h-5 w-5 text-primary" />
          </span>
          <h1 className="text-4xl text-primary font-light tracking-tight">Brokers</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="">Add</span>
          <Button
            className="rounded-full w-10 h-10"
            variant="default"
            onClick={() => void openBrokerCreate()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BrokersList />
    </div>
  );
};

export default BrokerRootScreen;
