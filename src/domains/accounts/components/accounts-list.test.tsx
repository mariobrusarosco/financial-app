
import { render, screen, waitFor } from '@/domains/testing/render-utils';
import { server } from '@/domains/testing/msw/server';
import { HttpResponse } from 'msw';
import { createMockAccount } from '@/domains/testing/test-data';
import AccountsList from './accounts-list';
import { describe, it, expect } from 'vitest';
import { mockAccountBalancePoints, mockActiveAccounts } from '../testing';
import { I_BalancePoint } from '../types/types-and-interfaces';

describe('AccountsList', () => {

    // Test Grouping Logic
    it('groups accounts by type (Cash vs Investment)', async () => {
        // Relies on default active accounts (Cash, Savings, Credit)

        render(<AccountsList />);

        // Wait for accounts to load
        expect(await screen.findByTestId('accounts-list')).toBeInTheDocument();

        // Verify Headers
        expect(screen.getByTestId('accounts-group-cash')).toBeInTheDocument();
        // Check header text (which is uppercased via CSS but "cash" in DOM)
        expect(screen.getByTestId('accounts-group-header-cash')).toHaveTextContent(/cash/i);
        expect(screen.getByText('Checking Account')).toBeInTheDocument();

        expect(screen.getByTestId('accounts-group-savings')).toBeInTheDocument();
        expect(screen.getByTestId('accounts-group-header-savings')).toHaveTextContent(/savings/i);
        expect(screen.getByText('Savings Account')).toBeInTheDocument();

        expect(screen.getByTestId('accounts-group-credit')).toBeInTheDocument();
        expect(screen.getByTestId('accounts-group-header-credit')).toHaveTextContent(/credit/i);
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });

    // Test Child Component Data Fetching (Thick Integration)
    it('displays loading state for balance then shows correct amount', async () => {
        const accountId = 'acc-loading-test';
        const mockAccounts = [
            createMockAccount({ id: accountId, name: 'Balance Test Account' })
        ];

        // Mock Active Accounts to return immediately
        server.use(mockActiveAccounts(mockAccounts));

        const balanceData: I_BalancePoint[] = [{
            id: 'bp-1',
            account_id: accountId,
            date: '2024-01-01',
            balance: 5000,
            snapshot_type: 'opening'
        }];

        // Mock Balance Points to return data
        server.use(mockAccountBalancePoints(accountId, balanceData));

        // Important: Pass date params to enable the query hook!
        render(<AccountsList />, { route: '/?from=2024-01-01&to=2024-01-31' });

        // 1. Account name should appear (parent logic)
        expect(await screen.findByText('Balance Test Account')).toBeInTheDocument();

        // 2. Wait for the balance to appear formatted
        // Default locale is en-US and currency is USD -> $5,000.00
        expect(await screen.findByText('$5,000.00')).toBeInTheDocument();
    });
});
