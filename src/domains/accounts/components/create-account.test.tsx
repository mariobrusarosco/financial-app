import { fireEvent, render, screen, waitFor } from '@/domains/testing/render-utils';
import { server } from '@/domains/testing/msw/server';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import CreateAccount from '@/domains/accounts/components/create-account';
import type { I_CreateAccountForm } from '@/domains/accounts/types/types-and-interfaces';
import { afterEach, describe, it, expect, vi } from 'vitest';
// import { mockBrokersList } from '@/domains/broker/testing'; // Removed
import { mockCreateAccount } from '@/domains/accounts/testing';
import { createMockBroker } from '@/domains/testing/test-data';
import { toast } from 'sonner';

// Define mockBrokersList locally due to import issues (MSW context)
const mockBrokersList = (data: any) => {
  return http.get('*/brokers', async () => {
    return HttpResponse.json(data);
  });
};

// Mock Toaster
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateAccount', () => {
  const renderWithSubmitButton = () => {
    return render(
      <>
        <CreateAccount />
        <button type="submit" form="account-create-form">
          External Submit
        </button>
      </>
    );
  };

  it('renders form fields correctly and loads brokers', async () => {
    const brokers = [
      createMockBroker({ id: 'b1', name: 'Test Broker' }),
      createMockBroker({ id: 'b2', name: 'Another Broker' }),
    ];

    server.use(mockBrokersList(brokers));

    renderWithSubmitButton();

    // Wait for data fetching and rendering
    expect(await screen.findByTestId('account-create-form')).toBeInTheDocument();

    expect(screen.getByTestId('account-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('account-type-select')).toBeInTheDocument();
    expect(screen.getByTestId('account-balance-input')).toBeInTheDocument();
    expect(screen.getByTestId('account-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('account-broker-select')).toBeInTheDocument();
    expect(screen.getByTestId('account-currency-select')).toBeInTheDocument();

    // Check if brokers are loaded in the select
    const brokerTrigger = screen.getByTestId('account-broker-select');
    expect(brokerTrigger).toBeInTheDocument();

    // Open select to verify options. By role, because the select also renders a hidden native option with the same text
    await userEvent.click(brokerTrigger);
    expect(await screen.findByRole('option', { name: 'Test Broker' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Another Broker' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    server.use(mockBrokersList([]));

    renderWithSubmitButton();

    // The form only renders once the brokers have loaded
    await screen.findByTestId('account-create-form');

    // Click submit without filling anything
    // fireEvent, because userEvent doesn't submit through a button's form attribute (as in the drawer footer)
    fireEvent.click(screen.getByText('External Submit'));

    // Currency starts as BRL, so the name is the only required field left empty
    expect(await screen.findByText(/account name is required/i)).toBeInTheDocument();
  });

  it('submits valid form data and redirects', async () => {
    const brokers = [createMockBroker({ id: 'b1', name: 'Test Broker' })];
    server.use(mockBrokersList(brokers));

    // Mock successful creation
    const newAccount = { id: 'new-acc-123', name: 'My New Savings', type: 'savings' };
    server.use(mockCreateAccount(newAccount));

    const { router } = renderWithSubmitButton();

    // The form only renders once the brokers have loaded
    await screen.findByTestId('account-create-form');

    // Fill form
    await userEvent.type(screen.getByTestId('account-name-input'), 'My New Savings');

    // Select Broker
    await userEvent.click(screen.getByTestId('account-broker-select'));
    await userEvent.click(await screen.findByRole('option', { name: 'Test Broker' }));

    // Select Currency
    await userEvent.click(screen.getByTestId('account-currency-select'));
    await userEvent.click(await screen.findByRole('option', { name: 'USD' }));

    // Click Submit
    // fireEvent, because userEvent doesn't submit through a button's form attribute (as in the drawer footer)
    fireEvent.click(screen.getByText('External Submit'));

    // Assert Toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Account created successfully!',
        expect.objectContaining({ description: expect.stringContaining('My New Savings') })
      );
    });

    // Assert Redirection
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/accounts/new-acc-123');
    });
  });

  describe('opening date', () => {
    const today = '2026-10-18';

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      { scenario: 'defaults to today', openingDate: undefined, expectedDate: today },
      {
        scenario: 'preserves a historical date',
        openingDate: '2022-12-31',
        expectedDate: '2022-12-31',
      },
      { scenario: 'uses today when cleared', openingDate: '', expectedDate: today },
    ])('$scenario in the account creation request', async ({ openingDate, expectedDate }) => {
      vi.useFakeTimers({ toFake: ['Date'] });
      // Late evening in São Paulo is already the next day in UTC.
      vi.setSystemTime(new Date(2026, 9, 18, 23, 30));

      const onCreate = vi.fn();
      server.use(
        mockBrokersList([createMockBroker({ id: 'history-broker', name: 'History Broker' })]),
        http.post('*/accounts', async ({ request }) => {
          const body = (await request.json()) as I_CreateAccountForm;
          onCreate(body);
          return HttpResponse.json({ ...body, id: 'new-acc-id' }, { status: 201 });
        })
      );

      renderWithSubmitButton();

      const dateInput = await screen.findByLabelText('Opening Date (optional):');
      const accountForm = screen.getByTestId(/^account-create-form$/);
      expect(dateInput).toHaveValue(today);
      expect(dateInput).not.toBeRequired();

      await userEvent.type(screen.getByLabelText('Account Name:'), 'Historical Investment');
      await userEvent.click(screen.getByTestId('account-type-select'));
      await userEvent.click(screen.getByRole('option', { name: 'Investment' }));
      await userEvent.click(screen.getByTestId(/^account-broker-select$/));
      await userEvent.click(screen.getByRole('option', { name: 'History Broker' }));
      fireEvent.change(screen.getByLabelText('Initial Balance:'), {
        target: { value: '1250.50' },
      });
      if (openingDate !== undefined) {
        fireEvent.change(dateInput, { target: { value: openingDate } });
      }

      expect(accountForm).toBeValid();
      fireEvent.submit(accountForm);

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Historical Investment',
            type: 'investment',
            broker_id: 'history-broker',
            balance: 1250.5,
            currency: 'BRL',
            opening_date: expectedDate,
          })
        );
      });
    });
  });
});
