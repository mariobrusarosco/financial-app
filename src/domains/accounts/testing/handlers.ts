import { http, HttpResponse } from 'msw';
import { createMockAccount } from '@/domains/testing/test-data';
import { ACCOUNTS_ROUTES } from '../api/backend-routes';
import { mockActiveAccounts } from './index';

// Define the default active accounts for the happy path
export const defaultActiveAccounts = [
  createMockAccount({ id: 'acc-1', name: 'Checking Account', type: 'cash' }),
  createMockAccount({ id: 'acc-2', name: 'Savings Account', type: 'savings' }),
];

export const handlers = [
  // Active Accounts (using our factory)
  mockActiveAccounts(defaultActiveAccounts),

  // Account Detail
  http.get(`*${ACCOUNTS_ROUTES.DETAIL(':id')}`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json(createMockAccount({ id: id as string, name: `Account ${id}` }));
  }),

  // Account Creation
  http.post(`*${ACCOUNTS_ROUTES.LIST}`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json(createMockAccount({ ...body, id: 'new-acc-id' }), { status: 201 });
  }),

  // Account Statements
  http.get(`*${ACCOUNTS_ROUTES.STATEMENTS(':id')}`, ({ params }) => {
    return HttpResponse.json({
      data: [
        {
          id: 'st-1',
          account_id: params.id,
          raw_statement: {
            period: 'Jan 2024',
            balance: '1500.00',
            transactions: [{}, {}],
          },
          created_at: new Date().toISOString(),
        },
      ],
      meta: { total: 1 },
    });
  }),

  // Balance Points
  http.get(`*${ACCOUNTS_ROUTES.BALANCE_POINTS(':id')}`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json([
      {
        id: 'bp-1',
        account_id: id,
        date: '2024-01-01',
        balance: 1000.5,
        snapshot_type: 'opening',
      },
      {
        id: 'bp-2',
        account_id: id,
        date: '2024-01-02',
        balance: 1200.75,
        snapshot_type: 'transaction',
      },
    ]);
  }),
];
