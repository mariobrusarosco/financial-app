import { Button } from '@/domains/ui-system/components/button';
import { Plus } from 'lucide-react';
import BrokersList from '../components/brokers-list';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';

const BrokerRootScreen = () => {
  const { openBrokerCreate } = useGlobalUIState();

  return (
    <div data-testid="broker-root-screen" className="p-6 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Brokers</h1>
        <Button onClick={openBrokerCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Broker
        </Button>
      </div>

      {/* Content Row */}
      <div className="mt-6">
        <BrokersList />
      </div>
    </div>
  );
};

export default BrokerRootScreen;
