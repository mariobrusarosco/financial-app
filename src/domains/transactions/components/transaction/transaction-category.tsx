import { Tag } from 'lucide-react';
import type { TransactionCategoryProps } from './types';
import { resolveCategoryDisplayName } from '@/domains/transactions/utils/transaction-formatting';

export const TransactionCategory = ({
  categoryTree,
  categoryName,
  category,
}: TransactionCategoryProps) => {
  // Priority: category_tree.name > categoryName > category (if not UUID) > 'Uncategorized'
  const displayName = resolveCategoryDisplayName(categoryTree, categoryName, category);
  const hasParent = categoryTree?.parent;

  return (
    <div className="flex gap-1 items-center ml-3">
      <Tag className="h-3 w-3" />
      <span className="text-xs text-muted-foreground">{displayName}</span>

      {hasParent && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <p className="">(sub)</p>
          <p className="">{categoryTree.parent.name}</p>
        </div>
      )}
    </div>
  );
};
