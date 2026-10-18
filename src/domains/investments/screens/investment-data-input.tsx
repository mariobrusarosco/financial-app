import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/domains/ui-system/components/card';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Label } from '@/domains/ui-system/components/label';
import { PlusIcon, TrendingUpIcon } from 'lucide-react';

import { useMonthlyBalanceSummaries } from '../hooks/use-monthly-balance-summaries';
import { useCreateBalancePoint } from '../hooks/use-create-balance-point';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';

export const InvestmentDataInputScreen = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<string>('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    balance: '',
    note: '',
  });

  // Fetch all accounts and filter for investment type
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();

  // Filter accounts to only show investment type accounts
  const investmentAccounts =
    accountsQuery.data?.accounts.filter(account => account.type === 'investment') ?? [];
  const isLoadingInvestments = accountsQuery.isLoading;
  const investmentsError = accountsQuery.error;

  // Fetch monthly summaries for selected investment
  const {
    data: monthlyData,
    isLoading: isLoadingMonthly,
    error: monthlyError,
  } = useMonthlyBalanceSummaries({
    account_id: selectedInvestment,
    year: new Date().getFullYear(),
    months: 12,
  });

  const investmentHistory = monthlyData || [];

  // Create balance point mutation
  const createBalancePointMutation = useCreateBalancePoint();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedInvestment || !formData.balance) {
      return;
    }

    createBalancePointMutation.mutate({
      account_id: selectedInvestment,
      date: formData.date,
      balance: parseFloat(formData.balance),
      note: formData.note || undefined,
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedInvestmentName = investmentAccounts.find(
    account => account.id === selectedInvestment
  )?.name;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
          Investment Data Input
        </h1>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Investment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingInvestments ? (
          <div className="col-span-3 text-center py-8">
            <div className="text-muted-foreground">Loading investments...</div>
          </div>
        ) : investmentsError ? (
          <div className="col-span-3 text-center py-8">
            <div className="text-destructive">
              Error loading investments: {investmentsError.message}
            </div>
          </div>
        ) : investmentAccounts.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <div className="text-muted-foreground">
              No investment accounts found. Create your first investment account to get started.
            </div>
          </div>
        ) : (
          investmentAccounts.map(account => (
            <Card
              key={account.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedInvestment === account.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedInvestment(account.id)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                    {account.broker.name}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">R$ {account.balance.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{account.currency}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedInvestment && (
        <div data-id="investment-history">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUpIcon className="w-5 h-5" />
            <h2 className="text-2xl font-bold">{selectedInvestmentName} Details</h2>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
              <h3 className="text-lg font-semibold sticky top-0 bg-background py-2 z-10">
                Investment History
              </h3>

              {isLoadingMonthly ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading monthly data...</div>
                </div>
              ) : monthlyError ? (
                <div className="text-center py-8">
                  <div className="text-destructive">
                    Error loading monthly data: {monthlyError.message}
                  </div>
                </div>
              ) : investmentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    No monthly data available for this investment.
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  {investmentHistory.map(entry => (
                    <Card key={`${entry.month}-${entry.year}`} className="border p-2 gap-0">
                      <CardHeader className="p-2">
                        <CardTitle className="text-base">{entry.month_name}</CardTitle>
                        {!entry.has_data && (
                          <div className="w-fit rounded-full border px-2.5 py-1 text-xs font-medium">
                            No data
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-2">
                        {entry.has_data ? (
                          <>
                            <div className="text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Started with</span>
                                <span className="font-mono">
                                  R$ {parseFloat(entry.started_with).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Mov</span>
                                <span className="font-mono">
                                  R$ {parseFloat(entry.movement).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Ended with</span>
                                <span className="font-mono">
                                  R$ {parseFloat(entry.ended_with).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Profit</span>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                                      entry.profit_percentage >= 0
                                        ? 'text-positive'
                                        : 'text-destructive'
                                    }`}
                                  >
                                    {entry.profit_percentage.toFixed(1)}%
                                  </span>
                                  <div
                                    className={`text-sm font-mono ${
                                      parseFloat(entry.profit) >= 0
                                        ? 'text-positive'
                                        : 'text-destructive'
                                    }`}
                                  >
                                    R$ {parseFloat(entry.profit).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No balance data for this month
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="w-80 flex-shrink-0">
              <form
                onSubmit={handleSubmit}
                className="sticky top-6 space-y-4 bg-background border rounded-lg p-6 shadow-sm"
              >
                <h4 className="text-lg font-semibold mb-4">Add Balance Point</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={e => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.balance}
                      onChange={e => handleInputChange('balance', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (optional)</Label>
                    <Input
                      id="note"
                      type="text"
                      placeholder="Add a note about this balance point"
                      value={formData.note}
                      onChange={e => handleInputChange('note', e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createBalancePointMutation.isPending || !formData.balance}
                >
                  {createBalancePointMutation.isPending ? 'Saving...' : 'Save Balance Point'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
