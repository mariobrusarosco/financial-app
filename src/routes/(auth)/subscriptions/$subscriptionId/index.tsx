import { createFileRoute } from '@tanstack/react-router';
import { ViewSubscriptionScreen } from '@/domains/subscriptions/screens/view';

export const Route = createFileRoute('/(auth)/subscriptions/$subscriptionId/')({
  component: ViewSubscriptionScreen,
});
