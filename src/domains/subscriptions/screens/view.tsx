import { Route } from '@tanstack/react-router';
import { SubscriptionsMainScreen } from './main';

export const route = Route.useRoute('/(auth)/subscriptions/$subscriptionId');

export const ViewSubscriptionScreen = () => {
  const { subscriptionId } = route.useParams();
  return (
    <div className="p-4">
      <h1>View Subscription Screen</h1>
      <p>Viewing details for Subscription ID: {subscriptionId}</p>
    </div>
  );
};
