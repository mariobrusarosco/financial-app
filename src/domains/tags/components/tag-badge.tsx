import { Tag } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { getTagColor, getTagIcon } from '@/domains/tags/utils/tag-appearance';

interface TagBadgeProps {
  tag: Pick<I_Tag, 'icon' | 'bg_color' | 'icon_color'>;
  className?: string;
}

/** A tag's icon in a round badge. Without an icon or colors it shows a muted generic tag icon. */
export const TagBadge = ({ tag, className }: TagBadgeProps) => {
  const Icon = getTagIcon(tag.icon) ?? Tag;

  return (
    <span
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
        getTagColor(tag.bg_color)?.background ?? 'bg-muted',
        className
      )}
    >
      <Icon
        className={cn('h-3.5 w-3.5', getTagColor(tag.icon_color)?.icon ?? 'text-muted-foreground')}
      />
    </span>
  );
};
