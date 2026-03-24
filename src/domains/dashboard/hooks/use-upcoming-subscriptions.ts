import { useSubscriptions } from '@/domains/subscriptions/hooks';
import type { I_Subscription } from '@/domains/subscriptions/types/types-and-interfaces';

const sortByNextDueDate = (subscriptions: I_Subscription[]) => {
  return [...subscriptions]
    .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
    .slice(0, 5);
};

export const useUpcomingSubscriptions = () => {
  const subscriptionsQuery = useSubscriptions({ is_active: true });

  const subscriptions = sortByNextDueDate(subscriptionsQuery.data?.data ?? []);

  return {
    data: {
      subscriptions,
    },
    states: {
      isLoading: subscriptionsQuery.isLoading,
      isError: subscriptionsQuery.isError,
      isEmpty:
        !subscriptionsQuery.isLoading && !subscriptionsQuery.isError && subscriptions.length === 0,
    },
    handlers: {},
  };
};
