import { useState } from 'react';
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
import type { T_TransactionType } from '../types/types-and-interfaces';

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  transactionType?: T_TransactionType; // Optional as filters might apply later
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm';
}

import { findCategoryById } from '@/domains/categories/utils/category-tree-utils';

export const CategorySelector = ({
  value,
  onValueChange,
  // transactionType is temporarily unused as we fetch all categories,
  // but kept in props for future filtering if backend supports it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transactionType,
  placeholder = 'Select category...',
  className,
  disabled = false,
  size = 'default',
}: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: categories = [] } = useCategories();

  // useCategories returns a tree structure I_CategoryTreeNode[]

  const currentCategory = findCategoryById(categories, value);

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
          {currentCategory ? (
            <span className="flex items-center gap-2">
              <span className="truncate">{currentCategory.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map(category => (
                <CommandItem
                  key={category.id}
                  value={category.name} // CommandItem value is usually for filtering, better use name
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
                  <span className="flex items-center gap-2">{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
