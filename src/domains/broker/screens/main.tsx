import { Landmark } from 'lucide-react';
import BrokersList from '../components/brokers-list';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { PageHeader } from '@/domains/global/components';
import useBrokers from '@/domains/broker/hooks/use-brokers';

const BrokerRootScreen = () => {
  const { openBrokerCreate } = useGlobalUIState();
  const { isLoading, error } = useBrokers();

  return (
    <div data-testid="broker-index-screen" className="py-6 pr-6">
      <PageHeader title="Brokers" icon={Landmark} onAdd={openBrokerCreate} showAddButton={!isLoading && !error} addButtonLabel="New broker" />

      <section className="bg-section-background rounded-3xl">
        <BrokersList />
      </section>
    </div>
  );
};

export default BrokerRootScreen;
