import { Landmark } from 'lucide-react';
import BrokersList from '@/domains/broker/components/brokers-list';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { PageHeader } from '@/domains/global/components';
import useBrokers from '@/domains/broker/hooks/use-brokers';

const BrokerRootScreen = () => {
  const { openBrokerCreate } = useGlobalUIState();
  const { isLoading, error } = useBrokers();

  return (
    <div data-testid="broker-index-screen" className="space-y-7 pb-8">
      <PageHeader
        title="Brokers"
        icon={Landmark}
        onAdd={openBrokerCreate}
        showAddButton={!isLoading && !error}
        addButtonLabel="New broker"
      />

      <section>
        <BrokersList />
      </section>
    </div>
  );
};

export default BrokerRootScreen;
