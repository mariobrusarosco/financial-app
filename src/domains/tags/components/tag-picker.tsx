import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/domains/ui-system/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/domains/ui-system/components/command';
import { cn } from '@/domains/ui-system/utils';
import { useTagSearch } from '@/domains/tags/hooks/use-tag-search';
import { useTags } from '@/domains/tags/hooks/use-tags';
import type { I_Tag } from '@/domains/tags/types/types-and-interfaces';
import {
  MAX_SELECTED_TAGS,
  hasTagNamed,
  mergeReadableTags,
  toggleTagSelection,
} from '@/domains/tags/utils/tag-selection';

interface TagPickerProps {
  value: string[];
  onValueChange: (tagIds: string[]) => void;
  historicalTags?: I_Tag[];
  className?: string;
}

/**
 * Notion-style tag picker: search, toggle with keyboard or pointer, and create tags inline.
 * Meant to be rendered inside a popover; it does not manage its own open state.
 */
export const TagPicker = ({
  value,
  onValueChange,
  historicalTags = [],
  className,
}: TagPickerProps) => {
  const [search, setSearch] = useState('');
  const {
    tags: { query: tagsQuery, mutations: tagMutations },
  } = useTags();

  // Options come from a debounced server search; the full list is only used to show chip names
  const searchQuery = useTagSearch(search);
  const visibleTags = useMemo(() => searchQuery.data ?? [], [searchQuery.data]);
  const activeTags = useMemo(() => tagsQuery.data ?? [], [tagsQuery.data]);
  const knownTags = mergeReadableTags(activeTags, [...historicalTags, ...visibleTags]);
  const selectedTags = value
    .map(tagId => knownTags.find(tag => tag.id === tagId))
    .filter((tag): tag is I_Tag => Boolean(tag));

  const trimmedSearch = search.trim();
  const isCreating = tagMutations.create.isPending;
  // Wait for results matching the input, so an existing tag isn't created twice
  const canCreate =
    trimmedSearch.length > 0 && !searchQuery.isSearching && !hasTagNamed(knownTags, trimmedSearch);

  const applySelection = (tag: I_Tag) => {
    const result = toggleTagSelection(value, tag);
    if (result.limitReached) {
      toast.error(`A transaction can have at most ${MAX_SELECTED_TAGS} tags`);
      return;
    }
    onValueChange(result.value);
  };

  const handleCreate = async () => {
    if (!canCreate || isCreating) return;
    try {
      const createdTag = await tagMutations.create.mutateAsync({ name: trimmedSearch });
      applySelection(createdTag);
      setSearch('');
    } catch {
      // Error toast is handled by the create mutation
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && search === '' && value.length > 0) {
      event.preventDefault();
      onValueChange(value.slice(0, -1));
    }
  };

  return (
    <Command shouldFilter={false} loop className={cn('rounded-lg', className)}>
      <div className="flex flex-wrap items-center gap-1.5 border-b bg-muted/40 px-2.5 py-2">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className={cn(
              'inline-flex items-center gap-1 rounded-full bg-brand/10 py-0.5 pl-2 pr-1 text-xs font-medium text-brand',
              !tag.is_active && 'bg-muted text-muted-foreground'
            )}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => onValueChange(value.filter(tagId => tagId !== tag.id))}
              aria-label={`Remove ${tag.name}`}
              className="rounded-full p-0.5 hover:bg-brand/15"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <CommandPrimitive.Input
          value={search}
          onValueChange={setSearch}
          onKeyDown={handleInputKeyDown}
          placeholder={selectedTags.length > 0 ? 'Add more…' : 'Search or create a tag'}
          aria-label="Search or create a tag"
          className="h-6 min-w-[6rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {searchQuery.isSearching && trimmedSearch && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
        )}
      </div>

      <CommandList className="max-h-72 p-1">
        {searchQuery.isLoading ? (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tags…
          </div>
        ) : (
          <CommandEmpty>
            {searchQuery.isSearching
              ? 'Searching…'
              : trimmedSearch
                ? 'No tags found.'
                : 'Type a name to create your first tag.'}
          </CommandEmpty>
        )}

        {visibleTags.length > 0 && (
          <CommandGroup>
            {visibleTags.map(tag => {
              const isSelected = value.includes(tag.id);
              return (
                <CommandItem
                  key={tag.id}
                  value={`tag-${tag.id}`}
                  onSelect={() => applySelection(tag)}
                  data-checked={isSelected}
                >
                  <Check className={cn('h-4 w-4 text-brand', !isSelected && 'invisible')} />
                  {tag.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {canCreate && (
          <CommandGroup>
            <CommandItem
              value="create-tag"
              onSelect={() => void handleCreate()}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="truncate">Create “{trimmedSearch}”</span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>

      <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
        <span>
          {value.length}/{MAX_SELECTED_TAGS} selected
        </span>
        {value.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onValueChange([])}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
    </Command>
  );
};
