import { Tag } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { TagChip } from '@/domains/tags/components/tag-chip';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';

interface TagChipsProps {
  tags: I_Tag[];
  maxVisible?: number;
  // Rendered when there are no tags; omit to render nothing
  emptyLabel?: string;
  className?: string;
}

/** Read-only tag chips, collapsing extras into "+N". */
export const TagChips = ({ tags, maxVisible = 3, emptyLabel, className }: TagChipsProps) => {
  if (tags.length === 0) {
    if (!emptyLabel) return null;

    return (
      <span className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
        <Tag className="h-3 w-3 shrink-0" />
        {emptyLabel}
      </span>
    );
  }

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);

  return (
    <span className={cn('flex min-w-0 flex-wrap items-center gap-1', className)}>
      {visibleTags.map(tag => (
        <TagChip key={tag.id} tag={tag} className="max-w-[10rem]" />
      ))}
      {hiddenTags.length > 0 && (
        <span
          className="text-xs font-medium text-muted-foreground"
          title={hiddenTags.map(tag => tag.name).join(', ')}
        >
          +{hiddenTags.length}
        </span>
      )}
    </span>
  );
};
