import { useState, useMemo } from 'react';
import { Button } from '@/domains/ui-system/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/domains/ui-system/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils';
import { useCategories } from '@/domains/categories/hooks/use-categories';
import { findCategoryById } from '@/domains/categories/utils/category-tree-utils';
import type { I_CategoryTreeNode } from '@/domains/categories/types';
import { isUUID } from '@/domains/global/utils/string-utils';

interface HierarchicalCategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm';
}

export const HierarchicalCategorySelector = ({
  value,
  onValueChange,
  placeholder = 'Select category...',
  className,
  disabled = false,
  size = 'default',
}: HierarchicalCategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: categories = [] } = useCategories();

  const currentCategory = findCategoryById(categories, value);

  // Flatten categories for rendering with hierarchy information
  const flattenedCategories: {
    category: I_CategoryTreeNode;
    isChild: boolean;
    parentName?: string;
  }[] = [];

  categories.forEach(parent => {
    // Add parent category
    flattenedCategories.push({
      category: parent,
      isChild: false,
    });

    // Add child categories
    if (parent.children && parent.children.length > 0) {
      parent.children.forEach(child => {
        flattenedCategories.push({
          category: child,
          isChild: true,
          parentName: parent.name,
        });
      });
    }
  });

  const displayName = useMemo(() => {
    if (currentCategory) return currentCategory.name;
    if (!value) return placeholder;

    // If value is a UUID but not found in current categories list
    if (isUUID(value)) {
      return 'Loading...';
    }

    // Fallback for legacy categories (simple strings like "food")
    return value;
  }, [currentCategory, value, placeholder]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn('justify-between', size === 'sm' ? 'h-8 text-xs' : 'h-10', className)}
        >
          <span className="flex items-center gap-2 overflow-hidden">
            <span className={cn('truncate', !currentCategory && isUUID(value) && 'text-muted-foreground')}>
              {displayName}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {flattenedCategories.map(({ category, isChild, parentName }) => (
                <CommandItem
                  key={category.id}
                  value={`${category.name} ${parentName || ''}`} // Include parent name for better search
                  onSelect={() => {
                    onValueChange(category.id);
                    setIsOpen(false);
                  }}
                  className={cn(isChild && 'pl-8')}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex items-center gap-2">
                    {isChild && <span className="text-muted-foreground text-xs">(sub)</span>}
                    {category.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
