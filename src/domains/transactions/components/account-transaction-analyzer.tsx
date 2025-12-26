import { useMemo } from 'react';
import { cn } from '@/domains/ui-system/utils';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

interface AccountTransactionAnalyzerProps {
  transactions: I_TransactionResponse[];
  type: 'expense' | 'income';
}

interface I_GroupedSubcategory {
  id: string;
  name: string;
  count: number;
  total: number;
}

interface I_GroupedCategory {
  id: string;
  name: string;
  count: number;
  total: number;
  subcategories: Record<string, I_GroupedSubcategory>;
}

const AccountTransactionAnalyzer = ({ transactions, type }: AccountTransactionAnalyzerProps) => {
  // 1. Hierarchical Grouping Algorithm
  const analytics = useMemo(() => {
    const categoryGroups: Record<string, I_GroupedCategory> = {};

    transactions.forEach(transaction => {
      const { category_tree: tree, category_id, category_name, amount } = transaction;
      const transactionAmount = parseFloat(amount);

      // A "Main Category" is either the parent of the current category
      // or the category itself if it's already a root category.
      const mainId = tree?.parent?.id || category_id || 'un-categorized';
      const mainName = tree?.parent?.name || tree?.name || category_name || 'Uncategorized';

      // Initialize the Main Category group if it doesn't exist
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

      // Handle Subcategories:
      // If the current category is NOT the main category, it's a subcategory.
      const isSubcategory = category_id && category_id !== mainId;
      if (isSubcategory) {
        const subId = category_id;
        const subName = tree?.name || category_name || 'Uncategorized';

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

    // Sort and format for the UI
    return Object.values(categoryGroups)
      .sort((a, b) => b.total - a.total)
      .map(group => ({
        ...group,
        sortedSubcategories: Object.values(group.subcategories).sort((a, b) => b.total - a.total),
      }));
  }, [transactions]);

  const overallTotal = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const isExpense = type === 'expense';

  const colors = {
    bar: isExpense ? 'bg-red-500' : 'bg-green-500',
    subBar: isExpense ? 'bg-red-500/30' : 'bg-green-500/30',
    text: isExpense ? 'text-red-600' : 'text-green-600',
  };

  return (
    <div className="p-4 border rounded-lg bg-muted/30 space-y-4 h-fit">
      <div>
        <h3 className="font-semibold text-lg">Category Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Analysis of {transactions.length} transactions
        </p>
      </div>

      <div className="space-y-6">
        {analytics.map(category => {
          const categoryPercentage = overallTotal > 0 ? (category.total / overallTotal) * 100 : 0;

          return (
            <div key={category.id} className="space-y-2">
              {/* Main Category Header */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm font-bold">
                  <span>{category.name}</span>
                  <span className={colors.text}>{currencyFormatter.format(category.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{category.count} transactions total</span>
                  <span>{categoryPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden border">
                  <div
                    className={cn('h-full transition-all duration-500', colors.bar)}
                    style={{ width: `${categoryPercentage}%` }}
                  />
                </div>
              </div>

              {/* Nested Subcategories */}
              {category.sortedSubcategories.length > 0 && (
                <div className="ml-4 pl-4 border-l-2 space-y-2 py-1">
                  {category.sortedSubcategories.map(subcategory => (
                    <div key={subcategory.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>{subcategory.name}</span>
                        <span className={cn('font-semibold', colors.text)}>
                          {currencyFormatter.format(subcategory.total)}
                        </span>
                      </div>
                      {/* Sub-progress bar relative to the Main Category total */}
                      <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full transition-all duration-500', colors.subBar)}
                          style={{
                            width: `${(subcategory.total / category.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {transactions.length === 0 && (
          <p className="text-sm text-center py-4 text-muted-foreground italic">
            No transactions to analyze
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountTransactionAnalyzer;
