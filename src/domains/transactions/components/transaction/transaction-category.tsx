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
    <div className="flex gap-1 items-center w-full">
      <Tag className="h-3 w-3" />

      <div className="flex gap-1 w-full">
        <span className="text-sm text-muted-foreground truncate">{displayName}</span>
        {hasParent && (
          <div className="text-sm text-muted-foreground flex items-center gap-1 truncate">
            <p className="truncate">(sub)</p>
            <p className="truncate">{categoryTree.parent.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};
