
import { render, screen, waitFor, userEvent } from '@/domains/testing/render-utils';
import { server } from '@/domains/testing/msw/server';
import { HttpResponse } from 'msw';
import { createMockAccount } from '@/domains/testing/test-data';
import { AccountMainScreen } from './main';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockActiveAccounts } from '../testing';

// No mocks for global UI state or Route! 
// We are testing the real integration with the Router provided by render-utils

describe('AccountMainScreen', () => {
    // Default handler reset is handled in setup.ts

    it('shows loading state and hides add button', async () => {
        // Override to simulate loading
        server.use(mockActiveAccounts([], { delay: 'infinite' }));

        render(<AccountMainScreen />);

        // Assert loading Spinner is present - using findBy to handle microtask delays
        expect(await screen.findByTestId('accounts-list-loading')).toBeInTheDocument();

        // Assert Add button is NOT present (queryByText returns null if not found)
        expect(screen.queryByRole('button', { name: /add account/i })).not.toBeInTheDocument();
    });

    it('shows error state and hides add button', async () => {
        // Override to simulate error
        server.use(mockActiveAccounts(HttpResponse.error()));

        render(<AccountMainScreen />);

        // Wait for error state
        expect(await screen.findByTestId('accounts-list-error')).toBeInTheDocument();

        // Assert Add button is NOT present
        expect(screen.queryByRole('button', { name: /add account/i })).not.toBeInTheDocument();
    });

    it('shows empty state and shows add button', async () => {
        // Override to simulate empty list
        server.use(mockActiveAccounts([]));

        const { router } = render(<AccountMainScreen />);

        // Wait for empty state
        expect(await screen.findByTestId('accounts-list-empty')).toBeInTheDocument();

        // Assert Add button IS present
        const addButton = screen.getByRole('button', { name: /add account/i });
        expect(addButton).toBeInTheDocument();

        // Test interaction - Click Open Drawer
        await userEvent.click(addButton);

        // Verify URL changed to include drawer param
        await waitFor(() => {
            expect(router.state.location.search).toEqual({ drawer: 'account-create' });
        });
    });

    it('shows list of accounts and shows add button', async () => {
        // No override needed! Relies on default happy-path handlers.

        const { router } = render(<AccountMainScreen />);

        // Wait for list to load
        expect(await screen.findByTestId('accounts-list')).toBeInTheDocument();

        // Verify accounts are rendered (names match default handlers)
        expect(screen.getByText('Checking Account')).toBeInTheDocument();
        expect(screen.getByText('Savings Account')).toBeInTheDocument();

        // Verify Add button is present
        const addButton = screen.getByRole('button', { name: /add account/i });
        expect(addButton).toBeInTheDocument();

        // Test interaction
        await userEvent.click(addButton);

        // Verify URL changed
        await waitFor(() => {
            expect(router.state.location.search).toEqual({ drawer: 'account-create' });
        });
    });
});
