import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/domains/testing/msw/server';
import { cashflowApi } from '@/domains/cashflow/api/cashflow.api';

describe('cashflowApi.getSummary', () => {
  it('requests an account summary for the selected range and normalizes decimal strings', async () => {
    server.use(
      http.get('*/analytics/cashflow', ({ request }) => {
        const url = new URL(request.url);

        expect(url.searchParams.get('account_id')).toBe('account-1');
        expect(url.searchParams.get('date_from')).toBe('2026-10-01');
        expect(url.searchParams.get('date_to')).toBe('2026-10-31');

        return HttpResponse.json({
          total_income: '1250.50',
          total_expenses: '775.25',
          net_cashflow: '475.25',
          savings_rate: 38,
          monthly_data: [
            {
              month: '2026-10',
              income: '1250.50',
              expenses: '775.25',
              savings: '475.25',
              investments: '0.00',
            },
          ],
        });
      })
    );

    await expect(
      cashflowApi.getSummary({
        account_id: 'account-1',
        date_from: '2026-10-01',
        date_to: '2026-10-31',
      })
    ).resolves.toEqual({
      total_income: 1250.5,
      total_expenses: 775.25,
      net_cashflow: 475.25,
      savings_rate: 38,
      monthly_data: [
        {
          month: '2026-10',
          income: 1250.5,
          expenses: 775.25,
          savings: 475.25,
          investments: 0,
        },
      ],
    });
  });
});
