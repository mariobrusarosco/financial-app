import { createFileRoute } from '@tanstack/react-router';
import { TremorChartsDemo } from '@ui-system/components/tremor-charts';

export const Route = createFileRoute('/(auth)/tremor-demo')({
  component: TremorDemoPage,
});

function TremorDemoPage() {
  return <TremorChartsDemo />;
}