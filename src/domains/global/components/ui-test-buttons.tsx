import { Button } from '@ui-system/components/button';
import { useGlobalUIState } from '../hooks/use-global-ui-state';

export const UITestButtons = () => {
  const { openAccountCreate, openBrokerCreate, closeUI } = useGlobalUIState();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-background border rounded-lg shadow-lg z-50">
      <p className="text-sm font-medium mb-2">Global UI Test</p>
      <Button size="sm" onClick={openAccountCreate}>
        Open Account Drawer
      </Button>
      <Button size="sm" onClick={openBrokerCreate}>
        Open Broker Drawer
      </Button>
      <Button size="sm" variant="outline" onClick={closeUI}>
        Close Drawer
      </Button>
    </div>
  );
};
