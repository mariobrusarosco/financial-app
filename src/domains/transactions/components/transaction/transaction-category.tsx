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
  const parentName = categoryTree?.parent?.name;

  return (
    <div className="mt-1 flex w-full items-center gap-1 text-muted-foreground">
      <Tag className="h-3 w-3 shrink-0" />

      <div className="flex gap-1 w-full">
        <span className="truncate text-xs">{displayName}</span>
        {parentName && (
          <div className="flex items-center gap-1 truncate text-xs">
            <span aria-hidden="true">·</span>
            <p className="truncate">{parentName}</p>
          </div>
        )}
      </div>
    </div>
  );
};
