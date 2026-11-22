import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';
import { subscriptionsApi } from '../api/subscriptions.api';
import { SUBSCRIPTIONS_QUERY_KEYS } from '../api/keys';
import { getMonthCharges } from '../utils/subscription-charges';
import type { I_Subscription, I_SubscriptionsParams } from '../types/types-and-interfaces';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';

// The API returns at most 100 subscriptions per page
const PER_PAGE = 100;

const ACTIVE_SUBSCRIPTIONS_PARAMS: I_SubscriptionsParams = { is_active: true };

// The charges of every active subscription in the month of `month`, for the calendar.
// Kept under the subscriptions list key, so creating, editing, deleting or paying one refreshes it.
export const useSubscriptionCharges = (month: Date) => {
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const { data: creditCardsData } = useCreditCards(undefined);

  const accounts = accountsQuery.data?.accounts;
  const creditCards = creditCardsData?.data;

  const paymentSourceNames = useMemo(
    () => toPaymentSourceNames([...(accounts ?? []), ...(creditCards ?? [])]),
    [accounts, creditCards]
  );

  const toChargesOfMonth = useCallback(
    (subscriptions: I_Subscription[]) =>
      getMonthCharges(subscriptions, month, startOfDay(new Date()), paymentSourceNames),
    [month, paymentSourceNames]
  );

  const chargesQuery = useQuery({
    queryKey: [...SUBSCRIPTIONS_QUERY_KEYS.list(ACTIVE_SUBSCRIPTIONS_PARAMS), 'all-pages'],
    queryFn: getEveryActiveSubscription,
    select: toChargesOfMonth,
  });

  return {
    charges: {
      query: chargesQuery,
      actions: {
        refetchCharges: chargesQuery.refetch,
      },
    },
  };
};

const toPaymentSourceNames = (paymentSources: { id: string; name: string }[]) =>
  Object.fromEntries(paymentSources.map(source => [source.id, source.name]));

const getEveryActiveSubscription = async () => {
  const subscriptions: I_Subscription[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await subscriptionsApi.getSubscriptions({
      ...ACTIVE_SUBSCRIPTIONS_PARAMS,
      page,
      per_page: PER_PAGE,
    });
    subscriptions.push(...response.data);
    hasNext = response.meta.has_next;
    page += 1;
  }

  return subscriptions;
};
