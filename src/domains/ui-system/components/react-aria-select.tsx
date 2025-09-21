'use client';

import * as React from 'react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Collection,
  Header,
  Section,
  Text,
} from 'react-aria-components';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/domains/ui-system/utils/index';

interface ReactAriaSelectProps<T extends object> {
  label?: string;
  placeholder?: string;
  items: T[];
  selectedKey?: string | number | null;
  onSelectionChange?: (key: string | number | null) => void;
  getKey: (item: T) => string | number;
  getLabel: (item: T) => string;
  getDescription?: (item: T) => string;
  isDisabled?: boolean;
  className?: string;
  size?: 'sm' | 'default';
  sections?: Array<{
    key: string | number;
    title: string;
    items: T[];
  }>;
}

function ReactAriaSelect<T extends object>({
  label,
  placeholder = 'Select an option',
  items,
  selectedKey,
  onSelectionChange,
  getKey,
  getLabel,
  getDescription,
  isDisabled = false,
  className,
  size = 'default',
  sections,
}: ReactAriaSelectProps<T>) {
  return (
    <Select
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      isDisabled={isDisabled}
      className={cn('group flex flex-col gap-1', className)}
    >
      {label && (
        <Label className="text-sm font-medium text-foreground cursor-default">
          {label}
        </Label>
      )}
      
      <Button
        className={cn(
          // Base styles
          'relative flex items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none',
          // Focus styles  
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          // Hover styles
          'hover:bg-accent/50',
          // Disabled styles
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Invalid styles
          'group-data-[invalid]:border-destructive group-data-[invalid]:ring-destructive/20',
          // Dark mode
          'dark:bg-input/30 dark:hover:bg-input/50',
          // Size variants
          size === 'default' ? 'h-9' : 'h-8',
          // Placeholder styles
          'data-[placeholder]:text-muted-foreground'
        )}
      >
        <SelectValue className="flex items-center gap-2 truncate">
          {({ selectedItem, selectedText }) => {
            if (!selectedItem) return placeholder;
            return selectedText;
          }}
        </SelectValue>
        <ChevronDownIcon 
          className="size-4 opacity-50 transition-transform group-data-[open]:rotate-180" 
          aria-hidden="true" 
        />
      </Button>

      <Popover 
        className={cn(
          // Base popover styles
          'min-w-[var(--trigger-width)] bg-popover text-popover-foreground rounded-md border shadow-md',
          // Animation styles
          'data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95',
          'data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95',
          // Placement styles
          'data-[placement=bottom]:slide-in-from-top-2',
          'data-[placement=top]:slide-in-from-bottom-2',
          'data-[placement=left]:slide-in-from-right-2',
          'data-[placement=right]:slide-in-from-left-2',
          // Z-index
          'z-50'
        )}
      >
        <ListBox className="max-h-72 overflow-auto p-1">
          {sections ? (
            <Collection items={sections}>
              {(section) => (
                <Section key={section.key}>
                  <Header className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {section.title}
                  </Header>
                  <Collection items={section.items}>
                    {(item) => (
                      <ListBoxItem
                        key={getKey(item)}
                        id={getKey(item)}
                        className={cn(
                          // Base item styles
                          'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                          // Hover/focus styles
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:bg-accent focus:text-accent-foreground',
                          // Selected styles
                          'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
                          // Disabled styles
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        )}
                      >
                        <div className="flex flex-1 flex-col gap-0.5">
                          <Text slot="label">{getLabel(item)}</Text>
                          {getDescription && (
                            <Text 
                              slot="description" 
                              className="text-xs text-muted-foreground"
                            >
                              {getDescription(item)}
                            </Text>
                          )}
                        </div>
                        <div className="flex size-3.5 items-center justify-center">
                          <CheckIcon className="size-4 opacity-0 data-[selected]:opacity-100" />
                        </div>
                      </ListBoxItem>
                    )}
                  </Collection>
                </Section>
              )}
            </Collection>
          ) : (
            <Collection items={items}>
              {(item) => (
                <ListBoxItem
                  key={getKey(item)}
                  id={getKey(item)}
                  className={cn(
                    // Base item styles
                    'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
                    // Hover/focus styles
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                    // Selected styles
                    'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
                    // Disabled styles
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <div className="flex flex-1 flex-col gap-0.5">
                    <Text slot="label">{getLabel(item)}</Text>
                    {getDescription && (
                      <Text 
                        slot="description" 
                        className="text-xs text-muted-foreground"
                      >
                        {getDescription(item)}
                      </Text>
                    )}
                  </div>
                  <div className="flex size-3.5 items-center justify-center">
                    <CheckIcon className="size-4 opacity-0 data-[selected]:opacity-100" />
                  </div>
                </ListBoxItem>
              )}
            </Collection>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}

export { ReactAriaSelect };
export type { ReactAriaSelectProps };