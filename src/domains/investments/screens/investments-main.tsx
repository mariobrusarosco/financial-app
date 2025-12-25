import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { InvestmentSectionNavigation } from '@/domains/investments/components/investment-section-navigation';
import { InvestmentSectionContent } from '@/domains/investments/components/investment-section-content';
import { PageHeader } from '@/domains/global/components';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

export const InvestmentsMainScreen = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<I_InvestmentPortfolio | null>(null);

  const handleInvestmentClick = (investment: I_InvestmentPortfolio) => {
    setSelectedInvestment(investment);
  };

  return (
    <div className="py-4 space-y-5 rounded-3xl">
      <PageHeader title="Investments" icon={TrendingUp} showAddButton={false} />

      <p className="text-sm text-muted-foreground">
        Track your investment portfolio performance and balance history
      </p>

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
