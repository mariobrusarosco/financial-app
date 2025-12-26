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

interface SubCategorySelectorProps {
  categoryId: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SubCategorySelector = ({
  categoryId,
  value,
  onValueChange,
  placeholder = 'Select sub-category...',
  className,
  disabled = false,
}: SubCategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories = [] } = useCategories();

  const subCategories = useMemo(() => {
    if (!categoryId) return [];

    const parent = findCategoryById(categories, categoryId);
    return parent?.children || [];
  }, [categories, categoryId]);

  const selectedSubCategory = subCategories.find(c => c.id === value);

  if (!categoryId || subCategories.length === 0) {
    return (
      <Button
        variant="outline"
        role="combobox"
        disabled={true}
        className={cn('justify-between text-muted-foreground', className)}
      >
        {subCategories.length === 0 && categoryId ? 'No sub-categories' : 'Select category first'}
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn('justify-between', className)}
        >
          {selectedSubCategory ? (
            <span className="flex items-center gap-2">
              <span className="truncate">{selectedSubCategory.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search sub-categories..." />
          <CommandList>
            <CommandEmpty>No sub-category found.</CommandEmpty>
            <CommandGroup>
              {subCategories.map(category => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => {
                    onValueChange(category.id);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === category.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
