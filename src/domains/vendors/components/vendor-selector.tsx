import { useMemo, useState } from 'react';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react';
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
import { cn } from '@/domains/ui-system/utils';
import { useCreateVendor, useVendors } from '../hooks';
import type { I_Vendor } from '../types/types-and-interfaces';

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 50;

interface VendorSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  // Vendors the caller already has; used to show the selected vendor's name
  vendors: I_Vendor[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'default' | 'sm';
}

/**
 * Single-vendor picker with a debounced server search. Typing a new name offers to create the
 * vendor inline.
 */
export const VendorSelector = ({
  value,
  onValueChange,
  vendors,
  placeholder = 'Select Vendor',
  className,
  disabled = false,
  size = 'default',
}: VendorSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Keeps the label right while the vendors list refetches after creating one
  const [createdVendor, setCreatedVendor] = useState<I_Vendor | null>(null);
  const { mutateAsync: createVendor, isPending: isCreating } = useCreateVendor();

  const trimmedSearch = search.trim();
  const [debouncedSearch] = useDebouncedValue(trimmedSearch, { wait: SEARCH_DEBOUNCE_MS });
  const searchQuery = useVendors(
    {
      name_contains: debouncedSearch || undefined,
      sort_by: 'name',
      sort_order: 'asc',
      per_page: SEARCH_LIMIT,
    },
    { enabled: isOpen }
  );
  // True while typing or fetching, i.e. the results don't match the current input yet
  const isSearching = trimmedSearch !== debouncedSearch || searchQuery.isFetching;
  const visibleVendors = useMemo(() => searchQuery.data?.data ?? [], [searchQuery.data]);

  const knownVendors = [...vendors, ...visibleVendors, ...(createdVendor ? [createdVendor] : [])];
  const selectedVendor = knownVendors.find(vendor => vendor.id === value);
  // Wait for results matching the input, so an existing vendor isn't created twice
  const canCreate =
    trimmedSearch.length > 0 &&
    !isSearching &&
    !visibleVendors.some(vendor => normalizeName(vendor.name) === normalizeName(trimmedSearch));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setSearch('');
  };

  const selectVendor = (vendorId: string) => {
    onValueChange(vendorId);
    handleOpenChange(false);
  };

  const handleCreate = async () => {
    if (!canCreate || isCreating) return;
    try {
      const vendor = await createVendor({ name: trimmedSearch });
      setCreatedVendor(vendor);
      selectVendor(vendor.id);
    } catch {
      // Error toast is handled by useCreateVendor
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn(
            'w-full justify-between px-3.5 font-normal',
            size === 'sm' ? 'h-8' : 'h-10',
            className
          )}
        >
          <span className={cn('truncate', !selectedVendor && 'text-muted-foreground')}>
            {selectedVendor?.name ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(92vw,20rem)] p-0" align="start">
        <Command shouldFilter={false} loop>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search or create a vendor"
          />
          <CommandList className="max-h-72 p-1">
            {searchQuery.isLoading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading vendors…
              </div>
            ) : (
              <CommandEmpty>
                {isSearching
                  ? 'Searching…'
                  : trimmedSearch
                    ? 'No vendors found.'
                    : 'Type a name to create your first vendor.'}
              </CommandEmpty>
            )}

            {visibleVendors.length > 0 && (
              <CommandGroup>
                {visibleVendors.map(vendor => (
                  <CommandItem
                    key={vendor.id}
                    value={`vendor-${vendor.id}`}
                    onSelect={() => selectVendor(vendor.id)}
                  >
                    <Check
                      className={cn('h-4 w-4 text-brand', vendor.id !== value && 'invisible')}
                    />
                    <span className="truncate">{vendor.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {canCreate && (
              <CommandGroup>
                <CommandItem
                  value="create-vendor"
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
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const normalizeName = (name: string) => name.trim().toLocaleLowerCase();
