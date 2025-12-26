'use client';

import * as React from 'react';
import * as dateFns from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/domains/ui-system/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { Button } from '@/domains/ui-system/components/button';

interface Props {
  date: Date;
  setDate: (date: Date) => void;
}

export function TransactionDatePicker({ date, setDate }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal w-full"
        >
          <CalendarIcon />
          {date ? dateFns.format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
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
