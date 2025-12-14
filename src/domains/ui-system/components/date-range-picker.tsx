'use client';

import * as React from 'react';
import { format } from 'date-fns/format';
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

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Pick a date range';
    }

    if (!dateRange.to) {
      return format(dateRange.from, 'PP');
    }

    return `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateRange?.from}
          className="data-[empty=true]:text-muted-foreground w-full md:w-auto justify-start text-left font-normal"
        >
          <CalendarIcon />
          <span>{formatDateRange()}</span>
        </Button>
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
