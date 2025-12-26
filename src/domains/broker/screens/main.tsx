import { Landmark } from 'lucide-react';
import BrokersList from '../components/brokers-list';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { PageHeader } from '@/domains/global/components';

const BrokerRootScreen = () => {
  const { openBrokerCreate } = useGlobalUIState();

  return (
    <div data-testid="broker-index-screen" className="py-4 space-y-5 rounded-3xl">
      <PageHeader title="Brokers" icon={Landmark} onAdd={openBrokerCreate} />

      <BrokersList />
    </div>
  );
};

export default BrokerRootScreen;
