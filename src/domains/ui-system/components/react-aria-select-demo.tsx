'use client';

import * as React from 'react';
import { ReactAriaSelect } from './react-aria-select';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

function ReactAriaSelectDemo() {
  const [selectedAccount, setSelectedAccount] = React.useState<string | number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string | number | null>('USD');

  const accounts: Account[] = [
    { id: '1', name: 'Main Checking', type: 'Checking', balance: 5420.50 },
    { id: '2', name: 'Savings Account', type: 'Savings', balance: 12300.75 },
    { id: '3', name: 'Investment Portfolio', type: 'Investment', balance: 45600.00 },
    { id: '4', name: 'Emergency Fund', type: 'Savings', balance: 8900.25 },
  ];

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  ];

  const accountSections = [
    {
      key: 'checking',
      title: 'Checking Accounts',
      items: accounts.filter(acc => acc.type === 'Checking'),
    },
    {
      key: 'savings',
      title: 'Savings Accounts', 
      items: accounts.filter(acc => acc.type === 'Savings'),
    },
    {
      key: 'investment',
      title: 'Investment Accounts',
      items: accounts.filter(acc => acc.type === 'Investment'),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">React Aria Select Components Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating accessible, enhanced Select components using React Aria with Tailwind styling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Select Example */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Currency Selector</h2>
          <ReactAriaSelect
            label="Preferred Currency"
            placeholder="Choose a currency..."
            items={currencies}
            selectedKey={selectedCurrency}
            onSelectionChange={setSelectedCurrency}
            getKey={(currency) => currency.code}
            getLabel={(currency) => `${currency.code} - ${currency.name}`}
            getDescription={(currency) => `Symbol: ${currency.symbol}`}
          />
          {selectedCurrency && (
            <p className="text-sm text-muted-foreground">
              Selected: {currencies.find(c => c.code === selectedCurrency)?.name}
            </p>
          )}
        </div>

        {/* Grouped Select Example */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account Selector</h2>
          <ReactAriaSelect
            label="Select Account"
            placeholder="Choose an account..."
            items={accounts}
            sections={accountSections}
            selectedKey={selectedAccount}
            onSelectionChange={setSelectedAccount}
            getKey={(account) => account.id}
            getLabel={(account) => account.name}
            getDescription={(account) => 
              `${account.type} • $${account.balance.toLocaleString()}`
            }
          />
          {selectedAccount && (
            <p className="text-sm text-muted-foreground">
              Selected: {accounts.find(a => a.id === selectedAccount)?.name}
            </p>
          )}
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Size Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReactAriaSelect
            label="Small Size"
            size="sm"
            items={currencies.slice(0, 3)}
            getKey={(currency) => currency.code}
            getLabel={(currency) => currency.name}
            placeholder="Small select..."
          />
          <ReactAriaSelect
            label="Default Size"
            size="default"
            items={currencies.slice(0, 3)}
            getKey={(currency) => currency.code}
            getLabel={(currency) => currency.name}
            placeholder="Default select..."
          />
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Disabled State</h2>
        <ReactAriaSelect
          label="Disabled Select"
          items={currencies}
          getKey={(currency) => currency.code}
          getLabel={(currency) => currency.name}
          placeholder="This select is disabled"
          isDisabled
        />
      </div>

      {/* Features Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">React Aria Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-medium text-green-600">✓ Enhanced Accessibility</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Full ARIA compliance</li>
              <li>• Screen reader optimized</li>
              <li>• Keyboard navigation</li>
              <li>• Focus management</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-medium text-blue-600">✓ Better UX</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Superior mobile support</li>
              <li>• Touch-friendly interactions</li>
              <li>• Smooth animations</li>
              <li>• Type-ahead search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ReactAriaSelectDemo };