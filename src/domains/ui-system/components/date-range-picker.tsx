'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/domains/ui-system/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { Button } from '@/domains/ui-system/components/button';
import type { DateRange } from 'react-day-picker';

interface Props {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

export function DateRangePicker({ dateRange, setDateRange }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          data-empty={!dateRange?.from}
          data-testid="date-range-picker"
          className="data-[empty=true]:text-primary text-sm text-primary bg-foreground p-3.5 rounded-md cursor-pointer"
        >
          <CalendarIcon className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          captionLayout="dropdown"
          onSelect={range => {
            if (range) {
              setDateRange(range);
              // Close popover if both dates are selected
              if (range.from && range.to) {
                setIsOpen(false);
              }
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
