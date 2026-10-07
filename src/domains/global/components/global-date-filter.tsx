'use client';

import { useMemo, useEffect } from 'react';
import { Route } from '@/routes/(auth)/route';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
import type { DateRange } from 'react-day-picker';
import {
  format,
  startOfMonth,
  endOfMonth,
  isValid,
  subDays,
  subMonths,
  startOfYear,
  endOfYear,
  isSameDay,
  parse,
} from 'date-fns';
import { cn } from '@/domains/ui-system/utils';

const URL_DATE_FORMAT = 'yyyy-MM-dd';

const formatDateForURL = (date: Date): string => {
  return format(date, URL_DATE_FORMAT);
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

    // Use parse() instead of parseISO() to avoid timezone issues
    // parseISO treats "2026-02-01" as UTC midnight, which shifts to previous day in local timezone
    // parse() with 'yyyy-MM-dd' format creates a local date at midnight
    const fromDate = from ? parse(from, URL_DATE_FORMAT, new Date()) : defaultRange.from;
    const toDate = to ? parse(to, URL_DATE_FORMAT, new Date()) : defaultRange.to;

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

  const formatDateRange = useMemo(() => {
    if (!dateRange?.from) {
      return 'Pick a date range';
    }

    if (!dateRange.to) {
      return format(dateRange.from, 'PP');
    }

    return `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`;
  }, [dateRange]);

  return (
    <div
      data-ui="global-date-filter"
      className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{formatDateRange}</span>

        <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
          {PRESETS.map(preset => {
            const isActive = isPresetActive(preset);
            return (
              <button
                type="button"
                key={preset.label}
                onClick={() => handleSetDateRange(preset.getValue())}
                className={cn(
                  'cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive && 'bg-card text-brand shadow-sm'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <DateRangePicker dateRange={dateRange} setDateRange={handleSetDateRange} />
    </div>
  );
};
