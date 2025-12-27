import { createFileRoute } from '@tanstack/react-router';
import { SubscriptionsMainScreen } from '@/domains/subscriptions/screens/main';

export const Route = createFileRoute('/(auth)/subscriptions/')({
  component: SubscriptionsMainScreen,
});
