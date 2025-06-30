import { Button } from '@/domains/ui-system/components/button';
import { Link } from '@tanstack/react-router';
import BrokersList from '../components/brokers-list';

const BrokerRootScreen = () => {
  return (
    <div
      data-testid="broker-root-screen"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1>Brokers</h1>
      <BrokersList />
      <Button>
        <Link to="/brokers/create">Create Broker</Link>
      </Button>
    </div>
  );
};

export default BrokerRootScreen;
