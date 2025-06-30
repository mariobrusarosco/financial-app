import CreateBroker from '@/domains/broker/components/create-broker';

const BrokerCreateScreen = () => {
  return (
    <div
      data-testid="broker-create-screen"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1>Create Broker</h1>

      <CreateBroker />
    </div>
  );
};

export default BrokerCreateScreen;
