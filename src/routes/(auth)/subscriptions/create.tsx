import { createFileRoute } from '@tanstack/react-router';
import { CreateSubscriptionScreen } from '@/domains/subscriptions/screens/create';

export const Route = createFileRoute('/(auth)/subscriptions/create')({
  component: CreateSubscriptionScreen,
});
