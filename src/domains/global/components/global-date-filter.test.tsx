import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@/domains/testing/render-utils';
import { GlobalDateFilter } from '@/domains/global/components/global-date-filter';

interface NavigateOptions {
  search: (previous: Record<string, unknown>) => Record<string, unknown>;
}

const navigate = vi.hoisted(() => vi.fn<(options: NavigateOptions) => void>());

vi.mock('@/routes/(auth)/route', () => ({
  Route: {
    useSearch: () => ({ from: '2026-10-01', to: '2026-10-31' }),
    useNavigate: () => navigate,
  },
}));

vi.mock('@/domains/ui-system/components/date-range-picker', () => ({
  DateRangePicker: () => <button type="button">Custom range</button>,
}));

describe('GlobalDateFilter month navigation', () => {
  afterEach(() => {
    vi.useRealTimers();
    navigate.mockReset();
  });

  it('selects a complete previous calendar month and preserves other search state', async () => {
    vi.setSystemTime(new Date('2026-10-07T12:00:00'));

    render(<GlobalDateFilter />);

    fireEvent.click(await screen.findByRole('button', { name: 'Select previous month' }));

    const navigation = navigate.mock.calls[0][0];
    expect(navigation.search({ drawer: 'transaction-create' })).toEqual({
      drawer: 'transaction-create',
      from: '2026-09-01',
      to: '2026-09-30',
    });
  });

  it('shows the selected month as the period label', async () => {
    vi.setSystemTime(new Date('2026-10-07T12:00:00'));

    render(<GlobalDateFilter />);

    expect(await screen.findByText('October 2026')).toBeInTheDocument();
  });
});
