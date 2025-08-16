import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';
import { InvestmentsList } from '../components/investments-list';
import { InvestmentBalanceTable } from '../components/investment-balance-table';
import { InvestmentAccountsList } from '../components/investment-accounts-list';
import type { I_InvestmentPortfolio } from '../types/types-and-interfaces';

export const InvestmentsMainScreen = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<I_InvestmentPortfolio | null>(null);

  const handleInvestmentClick = (investment: I_InvestmentPortfolio) => {
    setSelectedInvestment(investment);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            Track your investment portfolio performance and balance history
          </p>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="history">Balance History</TabsTrigger>
          {selectedInvestment && (
            <TabsTrigger value="individual">{selectedInvestment.investment.name}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <InvestmentAccountsList />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <InvestmentsList onInvestmentClick={handleInvestmentClick} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <InvestmentBalanceTable
            title="All Investments Balance History"
            description="Complete history of all your investment balances and movements"
          />
        </TabsContent>

        {selectedInvestment && (
          <TabsContent value="individual" className="space-y-6">
            <InvestmentBalanceTable
              investmentId={selectedInvestment.investment.id}
              title={`${selectedInvestment.investment.name} Balance History`}
              description={`Balance history and performance for ${selectedInvestment.investment.name}`}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
