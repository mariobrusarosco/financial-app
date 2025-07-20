import { createFileRoute } from '@tanstack/react-router';
import { DashboardIndexScreen } from '@/domains/dashboard/screens';

export const Route = createFileRoute('/(auth)/dashboard/')({
  component: DashboardIndexScreen,
});
