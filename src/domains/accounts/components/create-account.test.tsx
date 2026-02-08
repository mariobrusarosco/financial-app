```typescript
import { render, screen, waitFor } from '@/domains/testing/render-utils';
import { server } from '@/domains/testing/msw/server';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import CreateAccount from './create-account';
import { describe, it, expect, vi } from 'vitest';
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
                <button type="submit" form="account-create-form">External Submit</button>
            </>
        );
    };

    it('renders form fields correctly and loads brokers', async () => {

        const brokers = [
            createMockBroker({ id: 'b1', name: 'Test Broker' }),
            createMockBroker({ id: 'b2', name: 'Another Broker' })
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

        // Open select to verify options
        await userEvent.click(brokerTrigger);
        expect(await screen.findByText('Test Broker')).toBeInTheDocument();
        expect(await screen.findByText('Another Broker')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        server.use(mockBrokersList([]));

        renderWithSubmitButton();

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        // Click submit without filling anything
        await userEvent.click(screen.getByText('External Submit'));

        // Check for validation errors
        expect(await screen.findByText(/account name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/currency is required/i)).toBeInTheDocument();
    });

    it('submits valid form data and redirects', async () => {
        const brokers = [createMockBroker({ id: 'b1', name: 'Test Broker' })];
        server.use(mockBrokersList(brokers));

        // Mock successful creation
        const newAccount = { id: 'new-acc-123', name: 'My New Savings', type: 'savings' };
        server.use(mockCreateAccount(newAccount));

        const { router } = renderWithSubmitButton();

        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        // Fill form
        await userEvent.type(screen.getByTestId('account-name-input'), 'My New Savings');

        // Select Broker
        await userEvent.click(screen.getByTestId('account-broker-select'));
        await userEvent.click(await screen.findByText('Test Broker'));

        // Select Currency
        await userEvent.click(screen.getByTestId('account-currency-select'));
        await userEvent.click(await screen.findByText('USD'));

        // Click Submit
        await userEvent.click(screen.getByText('External Submit'));

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
});
