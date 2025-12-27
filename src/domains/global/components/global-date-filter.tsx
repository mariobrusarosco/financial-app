'use client';

import { useMemo, useEffect } from 'react';
import { Route } from '@/routes/(auth)/route';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
import { Button } from '@/domains/ui-system/components/button';
import type { DateRange } from 'react-day-picker';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isValid,
  subDays,
  subMonths,
  startOfYear,
  endOfYear,
  isSameDay,
} from 'date-fns';
import { cn } from '@/domains/ui-system/utils';

const formatDateForURL = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  return {
    from: startOfMonth(today),
    to: endOfMonth(today),
  };
};

interface Preset {
  label: string;
  getValue: () => DateRange;
}

const PRESETS: Preset[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: '30d',
    getValue: () => {
      const today = new Date();
      return { from: subDays(today, 30), to: today };
    },
  },
  {
    label: '3M',
    getValue: () => {
      const today = new Date();
      return { from: subMonths(today, 3), to: today };
    },
  },
  {
    label: '6M',
    getValue: () => {
      const today = new Date();
      return { from: subMonths(today, 6), to: today };
    },
  },
  {
    label: 'YTD',
    getValue: () => {
      const today = new Date();
      return { from: startOfYear(today), to: endOfYear(today) };
    },
  },
];

export const GlobalDateFilter = () => {
  const { from, to } = Route.useSearch();
  const navigate = Route.useNavigate();

  // Initialize URL with default date range if not present
  useEffect(() => {
    if (!from && !to) {
      const defaultRange = getDefaultDateRange();
      void navigate({
        search: prev => ({
          ...prev,
          from: formatDateForURL(defaultRange.from!),
          to: formatDateForURL(defaultRange.to!),
        }),
        replace: true, // Use replace to avoid adding to history
      });
    }
  }, [from, to, navigate]);

  const dateRange = useMemo((): DateRange => {
    const defaultRange = getDefaultDateRange();

    const fromDate = from ? parseISO(from) : defaultRange.from;
    const toDate = to ? parseISO(to) : defaultRange.to;

    return {
      from: fromDate && isValid(fromDate) ? fromDate : defaultRange.from,
      to: toDate && isValid(toDate) ? toDate : defaultRange.to,
    };
  }, [from, to]);

  const handleSetDateRange = (range: DateRange) => {
    void navigate({
      search: prev => ({
        ...prev,
        from: range?.from ? formatDateForURL(range.from) : undefined,
        to: range?.to ? formatDateForURL(range.to) : undefined,
      }),
    });
  };

  const isPresetActive = (preset: Preset) => {
    const presetRange = preset.getValue();

    if (!dateRange.from || !dateRange.to || !presetRange.from || !presetRange.to) {
      return false;
    }

    return isSameDay(dateRange.from, presetRange.from) && isSameDay(dateRange.to, presetRange.to);
  };

  return (
    <div data-ui="global-date-filter" className="flex items-center gap-2">
      <div className="flex gap-1 items-center bg-muted/50 p-1 rounded-lg border border-border">
        {PRESETS.map(preset => {
          const isActive = isPresetActive(preset);
          return (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              onClick={() => handleSetDateRange(preset.getValue())}
              className={cn(
                'h-7 px-3 text-xs font-medium rounded-md transition-all hover:bg-primary/10',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground  hover:text-foreground'
              )}
            >
              {preset.label}
            </Button>
          );
        })}
      </div>
      <div className="w-px h-8 bg-border mx-1" />
      <DateRangePicker dateRange={dateRange} setDateRange={handleSetDateRange} />
    </div>
  );
};
