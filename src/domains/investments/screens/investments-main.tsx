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
    <div className="space-y-6 pb-8">
      <PageHeader title="Investments" icon={TrendingUp} showAddButton={false} />

      <p className="text-sm text-muted-foreground">
        Track your investment portfolio performance and balance history
      </p>

      {/* Section Navigation */}
      <div className="rounded-2xl border border-border/80 bg-card p-2 shadow-[var(--shadow-panel)]">
        <InvestmentSectionNavigation selectedInvestment={selectedInvestment} />
      </div>

      {/* Section Content */}
      <div>
        <InvestmentSectionContent
          selectedInvestment={selectedInvestment}
          onInvestmentClick={handleInvestmentClick}
        />
      </div>
    </div>
  );
};
