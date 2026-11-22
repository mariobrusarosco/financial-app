import CreateBroker from '@/domains/broker/components/create-broker';

const BrokerCreateScreen = () => {
  return (
    <div
      data-testid="broker-create-screen"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
        Create Broker
      </h1>

      <CreateBroker />
    </div>
  );
};

export default BrokerCreateScreen;
