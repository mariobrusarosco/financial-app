import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/domains/ui-system/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { cn } from '@/domains/ui-system/utils';
import { TagPicker } from '@/domains/tags/components/tag-picker';
import { useTags } from '@/domains/tags/hooks/use-tags';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import { mergeReadableTags } from '@/domains/tags/utils/tag-selection';

interface TagSelectorProps {
  value: string[];
  onValueChange: (tagIds: string[]) => void;
  historicalTags?: I_Tag[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const TagSelector = ({
  value,
  onValueChange,
  historicalTags = [],
  placeholder = 'Select tags',
  className,
  disabled = false,
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    tags: { query: tagsQuery },
  } = useTags();

  const readableTags = mergeReadableTags(tagsQuery.data ?? [], historicalTags);
  const selectedTags = value
    .map(tagId => readableTags.find(tag => tag.id === tagId))
    .filter((tag): tag is I_Tag => Boolean(tag));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn('h-auto min-h-10 w-full justify-between px-3 py-2', className)}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {selectedTags.length > 0 ? (
              selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className={cn(
                    'inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand',
                    !tag.is_active && 'bg-muted text-muted-foreground'
                  )}
                >
                  {tag.name}
                  {!tag.is_active && ' (inactive)'}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,22rem)] p-0" align="start">
        <TagPicker value={value} onValueChange={onValueChange} historicalTags={historicalTags} />
      </PopoverContent>
    </Popover>
  );
};
