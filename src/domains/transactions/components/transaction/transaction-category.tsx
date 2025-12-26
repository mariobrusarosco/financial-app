import { Tag } from 'lucide-react';
import type { TransactionCategoryProps } from './types';

export const TransactionCategory = ({
  categoryTree,
  categoryName,
  category,
}: TransactionCategoryProps) => {
  const displayName = categoryTree?.name || categoryName || category || 'Uncategorized';
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
