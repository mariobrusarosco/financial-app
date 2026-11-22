import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvoiceTransactionsRefinementProcess } from '@/domains/credit-cards/components/invoice-transactions-refinement-process';
import { transformFormToBulkRequest } from '@/domains/transactions/api/transactions.api';
import type { I_CreditCardInvoiceResponse } from '@/domains/credit-cards/types/types-and-interfaces';

const { save, changeMonth } = vi.hoisted(() => ({ save: vi.fn(), changeMonth: vi.fn() }));
vi.mock('@/domains/transactions/hooks/use-create-bulk-transactions', () => ({
  useCreateBulkTransactions: () => ({ mutate: save, isPending: false }),
}));
vi.mock('@/domains/credit-cards/api/credit-cards.api', () => ({
  creditCardApi: { updateInvoiceCompetence: changeMonth },
}));
vi.mock('@/domains/transactions/components/transaction/transaction-row', () => ({
  TransactionRow: ({ transaction, draft }: any) => (
    <li>
      {transaction.description}
      <button onClick={draft.onIgnore}>Exclude {transaction.id}</button>
    </li>
  ),
}));

const invoice = {
  id: 'invoice-1',
  credit_card_id: 'card-1',
  broker_id: 'broker-1',
  competence_month: '2026-11-01',
  created_at: '2026-11-01',
  updated_at: '2026-11-01',
  raw_invoice: {
    due_date: '2026-11-06',
    total_due: '55.00',
    transactions: [
      {
        date: '2026-09-29',
        description: 'Same purchase',
        amount: '30.00',
        movement_type: 'expense',
        invoice_row: 1,
      },
      {
        date: '2026-09-29',
        description: 'Same purchase',
        amount: '30.00',
        movement_type: 'expense',
        invoice_row: 2,
      },
      {
        date: '2026-10-10',
        description: 'IOF refund',
        amount: '5.00',
        movement_type: 'income',
        invoice_row: 3,
      },
    ],
    import_audit: {
      page_count: 10,
      processed_pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      transaction_count: 3,
      status: 'reconciled',
      calculated_total: '55.00',
    },
  },
} as unknown as I_CreditCardInvoiceResponse;

const show = (value = invoice) =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
    >
      <InvoiceTransactionsRefinementProcess invoice={value} />
    </QueryClientProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  changeMonth.mockResolvedValue(invoice);
});

describe('invoice save boundary', () => {
  it('preserves refunds, duplicate source rows, source dates, and an editable reporting month', async () => {
    show();
    fireEvent.change(screen.getByLabelText('Competência'), { target: { value: '2026-12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Transactions' }));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    expect(changeMonth).toHaveBeenCalledWith('card-1', 'invoice-1', '2026-12-01');
    const request = transformFormToBulkRequest(save.mock.calls[0][0]);
    expect(request).toHaveLength(3);
    expect(request.map(row => row.invoice_row)).toEqual([1, 2, 3]);
    expect(request[2].movement_type).toBe('income');
    expect(request[0].date).toMatch(/^2026-09-29/);
    expect(request.every(row => row.competence_month === '2026-12-01')).toBe(true);
  });

  it('does not renumber source rows after an exclusion', async () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Exclude 0' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save Transactions' }));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    expect(save.mock.calls[0][0].map((row: any) => row.invoice_row)).toEqual([2, 3]);
  });

  it('does not save after a month-update failure', async () => {
    changeMonth.mockRejectedValue(new Error('Could not update month'));
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Save Transactions' }));
    await waitFor(() => expect(changeMonth).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save Transactions' })).toBeEnabled()
    );
    expect(save).not.toHaveBeenCalled();
  });
});
