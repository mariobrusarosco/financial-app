'use client';

import { useMemo, useEffect } from 'react';
import { Route } from '@/routes/(auth)/route';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
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
import { cn } from '@/domains/ui-system/utils';

const URL_DATE_FORMAT = 'yyyy-MM-dd';
const MONTHS_IN_RAIL = 5;

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
  const visibleMonths = useMemo(() => getVisibleMonths(selectedMonth), [selectedMonth]);
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
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-xs text-muted-foreground">{formatDateRange}</span>

        <div
          className="flex min-w-0 items-center gap-1 rounded-xl bg-muted p-1"
          aria-label="Calendar month navigation"
        >
          <button
            type="button"
            onClick={() => handleSelectMonth(addMonths(selectedMonth, -1))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            aria-label="Select previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => handleSelectMonth(selectedMonth)}
            className={cn(
              'h-9 min-w-36 flex-1 rounded-lg px-3 text-xs font-semibold transition-colors sm:hidden',
              isMonthActive(selectedMonth)
                ? 'bg-card text-brand shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {format(selectedMonth, 'MMMM yyyy')}
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-1 sm:flex">
            {visibleMonths.map(month => {
              const isActive = isMonthActive(month);
              return (
                <button
                  type="button"
                  key={format(month, 'yyyy-MM')}
                  onClick={() => handleSelectMonth(month)}
                  aria-label={`Select ${format(month, 'MMMM yyyy')}`}
                  aria-pressed={isActive}
                  className={cn(
                    'h-9 min-w-14 flex-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground',
                    isActive && 'bg-card font-semibold text-brand shadow-sm'
                  )}
                >
                  <span className="block">{format(month, 'MMM')}</span>
                  <span className="block text-[0.6rem] opacity-60">{format(month, 'yy')}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleSelectMonth(addMonths(selectedMonth, 1))}
            disabled={!canSelectNextMonth}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Select next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1"
          aria-label="Rolling date ranges"
        >
          {PRESETS.map(preset => {
            const isActive = isPresetActive(preset);
            return (
              <button
                type="button"
                key={preset.label}
                onClick={() => handleSetDateRange(preset.getValue())}
                aria-pressed={isActive}
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

const getVisibleMonths = (selectedMonth: Date) => {
  const currentMonth = startOfMonth(new Date());
  const centeredEndMonth = addMonths(selectedMonth, 2);
  const endMonth =
    centeredEndMonth.getTime() > currentMonth.getTime() ? currentMonth : centeredEndMonth;
  const startMonth = addMonths(endMonth, -(MONTHS_IN_RAIL - 1));

  return Array.from({ length: MONTHS_IN_RAIL }, (_, index) => addMonths(startMonth, index));
};

interface Preset {
  label: string;
  getValue: () => DateRange;
}
