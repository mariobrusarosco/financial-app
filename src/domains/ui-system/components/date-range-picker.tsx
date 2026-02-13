'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowRight, Check, X } from 'lucide-react';

import { Calendar } from '@/domains/ui-system/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/domains/ui-system/components/popover';
import { Button } from '@/domains/ui-system/components/button';
import { cn } from '@/domains/ui-system/utils';
import type { DateRange } from 'react-day-picker';

interface Props {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

type SelectionMode = 'from' | 'to';

export function DateRangePicker({ dateRange, setDateRange }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectionMode, setSelectionMode] = React.useState<SelectionMode>('from');
  const [tempRange, setTempRange] = React.useState<DateRange>(dateRange);

  // Sync tempRange when dateRange changes externally or popover opens
  React.useEffect(() => {
    if (isOpen) {
      setTempRange(dateRange);
      setSelectionMode('from');
    }
  }, [isOpen, dateRange]);

  const handleDayClick = (day: Date) => {
    if (selectionMode === 'from') {
      // When selecting "from", clear "to" if the new "from" is after current "to"
      const newTo = tempRange.to && day > tempRange.to ? undefined : tempRange.to;
      setTempRange({ from: day, to: newTo });
      setSelectionMode('to');
    } else {
      // When selecting "to", ensure it's not before "from"
      if (tempRange.from && day < tempRange.from) {
        // If user clicks a date before "from", swap them
        setTempRange({ from: day, to: tempRange.from });
      } else {
        setTempRange({ ...tempRange, to: day });
      }
    }
  };

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      setDateRange(tempRange);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setIsOpen(false);
  };

  const handleClearFrom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempRange({ from: undefined, to: tempRange.to });
    setSelectionMode('from');
  };

  const handleClearTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempRange({ from: tempRange.from, to: undefined });
    setSelectionMode('to');
  };

  const canApply = tempRange.from && tempRange.to;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          data-empty={!dateRange?.from}
          data-testid="date-range-picker"
          className="data-[empty=true]:text-primary text-sm text-primary bg-foreground p-3.5 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
        >
          <CalendarIcon className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
        <div className="flex flex-col">
          {/* Selection Mode Header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              {/* From Date Selector */}
              <button
                type="button"
                onClick={() => setSelectionMode('from')}
                className={cn(
                  'flex-1 flex flex-col items-start gap-1 p-3 rounded-lg border-2 transition-all',
                  selectionMode === 'from'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-transparent bg-background hover:bg-accent/50'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium uppercase tracking-wide',
                    selectionMode === 'from' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  Start Date
                </span>
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      tempRange.from ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {tempRange.from ? format(tempRange.from, 'MMM d, yyyy') : 'Select date'}
                  </span>
                  {tempRange.from && (
                    <X
                      className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
                      onClick={handleClearFrom}
                    />
                  )}
                </div>
              </button>

              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

              {/* To Date Selector */}
              <button
                type="button"
                onClick={() => setSelectionMode('to')}
                className={cn(
                  'flex-1 flex flex-col items-start gap-1 p-3 rounded-lg border-2 transition-all',
                  selectionMode === 'to'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-transparent bg-background hover:bg-accent/50'
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium uppercase tracking-wide',
                    selectionMode === 'to' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  End Date
                </span>
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      tempRange.to ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {tempRange.to ? format(tempRange.to, 'MMM d, yyyy') : 'Select date'}
                  </span>
                  {tempRange.to && (
                    <X
                      className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
                      onClick={handleClearTo}
                    />
                  )}
                </div>
              </button>
            </div>

            {/* Selection hint */}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {selectionMode === 'from'
                ? 'Click a date to set the start of your range'
                : 'Click a date to set the end of your range'}
            </p>
          </div>

          {/* Calendar */}
          <div className="p-2">
            <Calendar
              mode="range"
              selected={tempRange}
              captionLayout="dropdown"
              onDayClick={handleDayClick}
              numberOfMonths={2}
              modifiers={{
                selecting_from: selectionMode === 'from' && tempRange.from ? [tempRange.from] : [],
                selecting_to: selectionMode === 'to' && tempRange.to ? [tempRange.to] : [],
              }}
              modifiersClassNames={{
                selecting_from: 'ring-2 ring-primary ring-offset-2',
                selecting_to: 'ring-2 ring-primary ring-offset-2',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-border bg-muted/30">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} disabled={!canApply}>
              <Check className="h-4 w-4 mr-1.5" />
              Apply Range
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
