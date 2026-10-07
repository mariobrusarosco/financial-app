import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import type { I_Account } from '@/domains/accounts/types/types-and-interfaces';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import { useCashflow } from '@/domains/cashflow/hooks/use-cashflow';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { useUpcomingInstallments } from '@/domains/dashboard/hooks/use-upcoming-installments';
import { useUpcomingSubscriptions } from '@/domains/dashboard/hooks/use-upcoming-subscriptions';
import { useGlobalUIState } from '@/domains/global/hooks/use-global-ui-state';
import { useRecentTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { useVendors } from '@/domains/vendors/hooks/index';

interface BalanceByCurrency {
  currency: string;
  balance: number;
}

interface TransactionGroup {
  label: string;
  transactions: I_TransactionResponse[];
}

const groupBalancesByCurrency = (accounts: I_Account[]) => {
  const groupedBalances = accounts.reduce<Record<string, number>>((balances, account) => {
    balances[account.currency] = (balances[account.currency] ?? 0) + account.balance;
    return balances;
  }, {});

  return Object.entries(groupedBalances).map<BalanceByCurrency>(([currency, balance]) => ({
    currency,
    balance,
  }));
};

const getTransactionGroupLabel = (date: string) => {
  const transactionDate = parseISO(date);

  if (isToday(transactionDate)) return 'Today';
  if (isYesterday(transactionDate)) return 'Yesterday';
  return format(transactionDate, 'MMM d');
};

const groupTransactionsByDate = (transactions: I_TransactionResponse[]) => {
  return transactions.reduce<TransactionGroup[]>((groups, transaction) => {
    const label = getTransactionGroupLabel(transaction.date);
    const existingGroup = groups.find(group => group.label === label);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
      return groups;
    }

    groups.push({ label, transactions: [transaction] });
    return groups;
  }, []);
};

export const useDashboard = () => {
  const { user } = useAuth();
  const {
    accounts: { query: accountsQuery },
  } = useAccounts({ is_active: true });
  const creditCardsQuery = useCreditCards(undefined);
  const recentTransactionsQuery = useRecentTransactions(8);
  const vendorsQuery = useVendors({ page: 1, per_page: 5, sort_by: 'name', sort_order: 'asc' });
  const cashflowQuery = useCashflow();
  const upcomingSubscriptions = useUpcomingSubscriptions();
  const upcomingInstallments = useUpcomingInstallments();
  const globalActions = useGlobalUIState();

  const accounts = accountsQuery.data?.accounts ?? [];
  const transactions = recentTransactionsQuery.data?.data ?? [];

  return {
    data: {
      firstName: user?.name?.split(' ')[0] || 'there',
      balances: groupBalancesByCurrency(accounts),
      accountCount: accounts.length,
      creditCards: creditCardsQuery.data?.data ?? [],
      transactionGroups: groupTransactionsByDate(transactions),
      vendors: vendorsQuery.data?.data ?? [],
      cashflow: cashflowQuery.data,
      subscriptions: upcomingSubscriptions.data.subscriptions,
      installments: upcomingInstallments.data.installments,
    },
    states: {
      isAccountsLoading: accountsQuery.isLoading,
      isAccountsError: accountsQuery.isError,
      isCreditCardsLoading: creditCardsQuery.isLoading,
      isTransactionsLoading: recentTransactionsQuery.isLoading,
      isTransactionsError: recentTransactionsQuery.isError,
      isVendorsLoading: vendorsQuery.isLoading,
      isCashflowLoading: cashflowQuery.isLoading,
      isCashflowError: Boolean(cashflowQuery.error),
      isSubscriptionsLoading: upcomingSubscriptions.states.isLoading,
      isSubscriptionsError: upcomingSubscriptions.states.isError,
      isInstallmentsLoading: upcomingInstallments.states.isLoading,
      isInstallmentsError: upcomingInstallments.states.isError,
    },
    handlers: {
      openAccountCreate: globalActions.openAccountCreate,
      openCreditCardCreate: globalActions.openCreditCardCreate,
      openTransactionCreate: globalActions.openTransactionCreate,
    },
  };
};
