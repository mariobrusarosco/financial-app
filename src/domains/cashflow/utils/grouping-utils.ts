import { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { isUUID } from '@/domains/global/utils/string-utils';

export interface I_GroupedSubcategory {
  id: string;
  name: string;
  count: number;
  total: number;
}

export interface I_GroupedCategory {
  id: string;
  name: string;
  count: number;
  total: number;
  subcategories: Record<string, I_GroupedSubcategory>;
  sortedSubcategories?: I_GroupedSubcategory[];
}

export interface I_GroupedEntity {
  id: string;
  name: string;
  count: number;
  total: number;
}

export const groupExpensesByCategory = (
  transactions: I_TransactionResponse[],
  categoryMap?: Map<string, string>
) => {
  const categoryGroups: Record<string, I_GroupedCategory> = {};

  transactions.forEach(transaction => {
    const { category_tree: tree, category_id, category_name, amount } = transaction;
    const transactionAmount = Math.abs(parseFloat(amount));

    let mainId = tree?.parent?.id || category_id;
    let mainName = tree?.parent?.name || tree?.name || category_name;

    // Fallback logic for legacy transactions
    if (!mainId && !mainName) {
      const legacyCategory = transaction.category;
      
      if (legacyCategory) {
        if (isUUID(legacyCategory)) {
          // It's an ID, try to resolve name from map
          const resolvedName = categoryMap?.get(legacyCategory);
          if (resolvedName) {
            mainId = legacyCategory;
            mainName = resolvedName;
          } else {
            // Still treat as ID if we can't resolve, but mark as Unknown
            mainId = legacyCategory;
            mainName = 'Unknown Category';
          }
        } else {
          // It's a name!
          mainId = 'legacy-' + legacyCategory.toLowerCase().replace(/\s+/g, '-');
          mainName = legacyCategory;
        }
      }
    }

    mainId = mainId || 'un-categorized';
    mainName = mainName || 'Uncategorized';

    if (!categoryGroups[mainId]) {
      categoryGroups[mainId] = {
        id: mainId,
        name: mainName,
        count: 0,
        total: 0,
        subcategories: {},
      };
    }

    const mainGroup = categoryGroups[mainId];
    mainGroup.count += 1;
    mainGroup.total += transactionAmount;

    // Handle Subcategories
    const isSubcategory = category_id && category_id !== mainId;
    if (isSubcategory) {
      const subId = category_id;
      let subName = tree?.name || category_name;

      if (!subName && categoryMap) {
        subName = categoryMap.get(subId);
      }
      
      subName = subName || 'Uncategorized';

      if (!mainGroup.subcategories[subId]) {
        mainGroup.subcategories[subId] = {
          id: subId,
          name: subName,
          count: 0,
          total: 0,
        };
      }

      const subGroup = mainGroup.subcategories[subId];
      subGroup.count += 1;
      subGroup.total += transactionAmount;
    }
  });

  return Object.values(categoryGroups)
    .sort((a, b) => b.total - a.total)
    .map(group => ({
      ...group,
      sortedSubcategories: Object.values(group.subcategories).sort((a, b) => b.total - a.total),
    }));
};

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
