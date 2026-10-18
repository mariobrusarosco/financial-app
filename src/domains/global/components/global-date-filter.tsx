'use client';

import { useMemo, useEffect } from 'react';
import { Route } from '@/routes/(auth)/route';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
import type { DateRangePreset } from '@/domains/ui-system/components/date-range-picker';
import type { DateRange } from 'react-day-picker';
import {
  addMonths,
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const selectedMonth = useMemo(() => startOfMonth(dateRange.from ?? new Date()), [dateRange.from]);
  const canSelectNextMonth = selectedMonth.getTime() < startOfMonth(new Date()).getTime();

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

  const handleSelectMonth = (month: Date) => {
    handleSetDateRange({
      from: startOfMonth(month),
      to: endOfMonth(month),
    });
  };

  const isMonthActive = (month: Date) => {
    if (!dateRange.from || !dateRange.to) {
      return false;
    }

    return (
      isSameDay(dateRange.from, startOfMonth(month)) && isSameDay(dateRange.to, endOfMonth(month))
    );
  };

  const isSelectedMonthActive = isMonthActive(selectedMonth);
  const periodLabel = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 'Pick a date range';
    if (isSelectedMonthActive) return format(selectedMonth, 'MMMM yyyy');
    if (isSameDay(dateRange.from, dateRange.to)) return format(dateRange.from, 'MMM d, yyyy');
    return `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`;
  }, [dateRange, isSelectedMonthActive, selectedMonth]);

  const presets: DateRangePreset[] = PRESETS.map(preset => ({
    ...preset,
    isActive: isPresetActive(preset),
  }));
  const activePreset = presets.find(preset => preset.isActive);
  const rangeButtonLabel = activePreset?.label ?? (isSelectedMonthActive ? 'Range' : 'Custom');

  return (
    <div data-ui="global-date-filter" className="flex w-full items-center gap-2 sm:w-auto">
      <div
        className="flex min-w-0 flex-1 items-center gap-1 rounded-xl bg-muted p-1 sm:flex-none"
        aria-label="Calendar month navigation"
      >
        <button
          type="button"
          onClick={() => handleSelectMonth(addMonths(selectedMonth, -1))}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          aria-label="Select previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span
          className="min-w-0 flex-1 truncate px-2 text-center text-sm font-semibold text-foreground sm:min-w-36"
          aria-live="polite"
        >
          {periodLabel}
        </span>

        <button
          type="button"
          onClick={() => handleSelectMonth(addMonths(selectedMonth, 1))}
          disabled={!canSelectNextMonth}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Select next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DateRangePicker
        dateRange={dateRange}
        setDateRange={handleSetDateRange}
        presets={presets}
        label={rangeButtonLabel}
      />
    </div>
  );
};

interface Preset {
  label: string;
  getValue: () => DateRange;
}
