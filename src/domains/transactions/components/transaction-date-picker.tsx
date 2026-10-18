'use client';

import * as React from 'react';
import * as dateFns from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/domains/ui-system/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';

interface Props {
  date: Date | undefined;
  setDate: (date: Date) => void;
  className?: string;
}

export function TransactionDatePicker({ date, setDate, className }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            'justify-start text-left font-normal w-full rounded-xl h-11 border-input px-3.5 gap-2.5 bg-background hover:bg-muted/30 transition-colors',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {date ? dateFns.format(date, 'MMMM d, yyyy') : <span>Pick a date</span>}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          fromYear={new Date().getFullYear() - 2}
          toYear={new Date().getFullYear() + 2}
          onSelect={selectedDate => {
            if (selectedDate) {
              setDate(selectedDate);
              setIsOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
