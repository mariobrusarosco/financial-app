import { useState } from 'react';
import type { ReactNode } from 'react';
import { Ban } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { cn } from '@/domains/ui-system/utils';
import { TagBadge } from '@/domains/tags/components/tag-badge';
import { TagChip } from '@/domains/tags/components/tag-chip';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { TAG_COLORS, TAG_ICON_GROUPS } from '@/domains/tags/utils/tag-appearance';

type TagAppearance = Pick<I_Tag, 'icon' | 'bg_color' | 'icon_color'>;

interface TagAppearancePickerProps {
  tag: I_Tag;
  onSave: (appearance: TagAppearance) => void;
}

/** Picks a tag's icon and colors. Changes are saved once, when the popover closes. */
export const TagAppearancePicker = ({ tag, onSave }: TagAppearancePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<TagAppearance>(() => toAppearance(tag));

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraft(toAppearance(tag));
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
    if (haveSameAppearance(draft, toAppearance(tag))) return;
    onSave(draft);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Change icon and colors for ${tag.name}`}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TagBadge tag={tag} className="h-8 w-8" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={8}
        // Scrolls instead of running off short screens
        className="max-h-(--radix-popover-content-available-height) w-[min(92vw,20rem)] space-y-4 overflow-y-auto p-3"
      >
        <div className="flex justify-center rounded-lg bg-muted/40 py-3">
          <TagChip tag={{ ...tag, ...draft }} />
        </div>

        <section className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">Icon</h4>
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            <OptionButton
              label="No icon"
              isSelected={draft.icon === null}
              onClick={() => setDraft(current => ({ ...current, icon: null }))}
              className="hover:bg-muted"
            >
              <Ban className="h-4 w-4 text-muted-foreground" />
            </OptionButton>
            {TAG_ICON_GROUPS.map(group => (
              <div key={group.label} className="space-y-1">
                <p className="text-[11px] text-muted-foreground">{group.label}</p>
                <div className="grid grid-cols-8 gap-1">
                  {Object.entries(group.icons).map(([key, Icon]) => (
                    <OptionButton
                      key={key}
                      label={key}
                      isSelected={draft.icon === key}
                      onClick={() => setDraft(current => ({ ...current, icon: key }))}
                      className="hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" />
                    </OptionButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <ColorOptions
          label="Background"
          value={draft.bg_color}
          onChange={bg_color => setDraft(current => ({ ...current, bg_color }))}
        />
        <ColorOptions
          label="Icon color"
          value={draft.icon_color}
          onChange={icon_color => setDraft(current => ({ ...current, icon_color }))}
        />
      </PopoverContent>
    </Popover>
  );
};

const ColorOptions = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (color: string | null) => void;
}) => (
  <section className="space-y-2">
    <h4 className="text-xs font-semibold text-muted-foreground">{label}</h4>
    <div className="flex flex-wrap gap-1.5">
      <OptionButton
        label={`No ${label.toLowerCase()}`}
        isSelected={value === null}
        onClick={() => onChange(null)}
        className="h-6 w-6 rounded-full border border-dashed hover:scale-110"
      >
        <Ban className="h-3 w-3 text-muted-foreground" />
      </OptionButton>
      {Object.entries(TAG_COLORS).map(([key, color]) => (
        <OptionButton
          key={key}
          label={key}
          isSelected={value === key}
          onClick={() => onChange(key)}
          className={cn('h-6 w-6 rounded-full hover:scale-110', color.swatch)}
        />
      ))}
    </div>
  </section>
);

const OptionButton = ({
  label,
  isSelected,
  onClick,
  className,
  children,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  children?: ReactNode;
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={isSelected}
    onClick={onClick}
    className={cn(
      'flex h-8 w-8 items-center justify-center rounded-md transition',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      isSelected && 'ring-2 ring-brand ring-offset-1 ring-offset-popover',
      className
    )}
  >
    {children}
  </button>
);

const toAppearance = ({ icon, bg_color, icon_color }: I_Tag): TagAppearance => ({
  icon,
  bg_color,
  icon_color,
});

const haveSameAppearance = (left: TagAppearance, right: TagAppearance) =>
  left.icon === right.icon &&
  left.bg_color === right.bg_color &&
  left.icon_color === right.icon_color;
