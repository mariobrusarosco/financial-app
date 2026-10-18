import { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

export interface I_GroupedEntity {
  id: string;
  name: string;
  count: number;
  total: number;
}

export const groupExpensesByAccount = (
  transactions: I_TransactionResponse[],
  accountMap: Map<string, string>
): I_GroupedEntity[] => {
  const groups: Record<string, I_GroupedEntity> = {};

  transactions.forEach(transaction => {
    if (!transaction.account_id) return;

    const id = transaction.account_id;
    const amount = Math.abs(parseFloat(transaction.amount));

    if (!groups[id]) {
      groups[id] = {
        id,
        name: accountMap.get(id) || 'Unknown Account',
        count: 0,
        total: 0,
      };
    }

    groups[id].count += 1;
    groups[id].total += amount;
  });

  return Object.values(groups).sort((a, b) => b.total - a.total);
};

export const groupExpensesByCreditCard = (
  transactions: I_TransactionResponse[],
  creditCardMap: Map<string, string>
): I_GroupedEntity[] => {
  const groups: Record<string, I_GroupedEntity> = {};

  transactions.forEach(transaction => {
    if (!transaction.credit_card_id) return;

    const id = transaction.credit_card_id;
    const amount = Math.abs(parseFloat(transaction.amount));

    if (!groups[id]) {
      groups[id] = {
        id,
        name: creditCardMap.get(id) || 'Unknown Credit Card',
        count: 0,
        total: 0,
      };
    }

    groups[id].count += 1;
    groups[id].total += amount;
  });

  return Object.values(groups).sort((a, b) => b.total - a.total);
};
