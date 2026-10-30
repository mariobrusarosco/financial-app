import type { ReactNode } from 'react';
import { cn } from '@/domains/ui-system/utils';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { getTagColor, getTagIcon } from '@/domains/tags/utils/tag-appearance';

interface TagChipProps {
  tag: I_Tag;
  // Rendered after the name, e.g. a remove button
  children?: ReactNode;
  className?: string;
}

/** A tag's pill: its icon, its background color and its name. Inactive tags are muted. */
export const TagChip = ({ tag, children, className }: TagChipProps) => {
  const Icon = getTagIcon(tag.icon);
  const iconColor = tag.is_active ? getTagColor(tag.icon_color)?.icon : undefined;

  return (
    <span
      className={cn(
        'inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        chipColorsOf(tag),
        className
      )}
    >
      {Icon && <Icon className={cn('h-3 w-3 shrink-0', iconColor)} />}
      <span className="truncate">{tag.name}</span>
      {children}
    </span>
  );
};

// Without a background color, a tag keeps the brand look it had before tags had colors
const chipColorsOf = (tag: I_Tag) => {
  if (!tag.is_active) return 'bg-muted text-muted-foreground';

  const background = getTagColor(tag.bg_color)?.background;
  return background ? cn(background, 'text-foreground') : 'bg-brand/10 text-brand';
};
