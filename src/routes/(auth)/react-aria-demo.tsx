import { createFileRoute } from '@tanstack/react-router';
import { ReactAriaSelectDemo } from '@ui-system/components/react-aria-select-demo';

export const Route = createFileRoute('/(auth)/react-aria-demo')({
  component: ReactAriaDemoPage,
});

function ReactAriaDemoPage() {
  return <ReactAriaSelectDemo />;
}