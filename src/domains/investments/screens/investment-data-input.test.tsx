import { render, screen, waitFor } from '@/domains/testing/render-utils';
import { server } from '@/domains/testing/msw/server';
import { createMockAccount } from '@/domains/testing/test-data';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { InvestmentDataInputScreen } from './investment-data-input';

const CURRENT_YEAR = new Date().getFullYear();

describe('InvestmentDataInputScreen', () => {
  let requestedYears: string[];

  beforeEach(() => {
    requestedYears = [];
    server.use(
      http.get('*/accounts', () =>
        HttpResponse.json([
          createMockAccount({ id: 'prev-1', name: 'Previdência', type: 'investment' }),
        ])
      ),
      http.get('*/balance_points/account/:id/monthly-summary', ({ request }) => {
        const year = new URL(request.url).searchParams.get('year') ?? '';
        requestedYears.push(year);
        return HttpResponse.json([
          {
            month: 1,
            year: Number(year),
            month_name: 'Jan',
            started_with: '11036.00',
            ended_with: '11196.00',
            movement: '0.00',
            profit: '160.00',
            profit_percentage: 1.45,
            has_data: true,
          },
        ]);
      })
    );
  });

  const openHistory = async () => {
    const user = userEvent.setup();
    render(<InvestmentDataInputScreen />);
    await user.click(await screen.findByText('Previdência'));
    await screen.findByText('Jan');
    return user;
  };

  it('shows the current year first and cannot go past it', async () => {
    await openHistory();

    expect(requestedYears).toEqual([String(CURRENT_YEAR)]);
    expect(screen.getByText(String(CURRENT_YEAR))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next year' })).toBeDisabled();
  });

  it('loads earlier years with the previous-year button', async () => {
    const user = await openHistory();

    await user.click(screen.getByRole('button', { name: 'Previous year' }));
    await user.click(screen.getByRole('button', { name: 'Previous year' }));

    await waitFor(() => expect(requestedYears).toContain(String(CURRENT_YEAR - 2)));
    expect(screen.getByText(String(CURRENT_YEAR - 2))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next year' })).toBeEnabled();
  });
});
