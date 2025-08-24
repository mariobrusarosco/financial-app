import { useState } from 'react';
import { InvestmentSectionNavigation } from '@/domains/investments/components/investment-section-navigation';
import { InvestmentSectionContent } from '@/domains/investments/components/investment-section-content';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

export const InvestmentsMainScreen = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<I_InvestmentPortfolio | null>(null);

  const handleInvestmentClick = (investment: I_InvestmentPortfolio) => {
    setSelectedInvestment(investment);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            Track your investment portfolio performance and balance history
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b">
        <InvestmentSectionNavigation selectedInvestment={selectedInvestment} />
      </div>

      {/* Section Content */}
      <div className="py-6">
        <InvestmentSectionContent
          selectedInvestment={selectedInvestment}
          onInvestmentClick={handleInvestmentClick}
        />
      </div>
    </div>
  );
};
