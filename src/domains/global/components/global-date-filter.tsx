'use client';

import { useMemo } from 'react';
import { Route } from '@/routes/(auth)/route';
import { DateRangePicker } from '@/domains/ui-system/components/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { format, parseISO, startOfMonth, endOfMonth, isValid } from 'date-fns';

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

export const GlobalDateFilter = () => {
  const { from, to } = Route.useSearch();
  const navigate = Route.useNavigate();

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
    navigate({
      search: prev => ({
        ...prev,
        from: range?.from ? formatDateForURL(range.from) : undefined,
        to: range?.to ? formatDateForURL(range.to) : undefined,
      }),
    });
  };

  return (
    <div data-ui="global-date-filter" className="flex items-center gap-2">
      <DateRangePicker dateRange={dateRange} setDateRange={handleSetDateRange} />
    </div>
  );
};
