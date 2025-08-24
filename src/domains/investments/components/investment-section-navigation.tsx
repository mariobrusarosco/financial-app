import { useNavigate } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';
import { useInvestmentSectionContent } from '@/domains/investments/hooks/use-investment-section-content';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

export interface I_InvestmentSectionNavigationProps {
  selectedInvestment?: I_InvestmentPortfolio | null;
}

export const InvestmentSectionNavigation = ({
  selectedInvestment,
}: I_InvestmentSectionNavigationProps) => {
  const navigate = useNavigate();
  const { currentSection } = useInvestmentSectionContent({ selectedInvestment });

  const handleSectionChange = (value: string) => {
    navigate({
      to: '/investments',
      search: { section: value },
    });
  };

  return (
    <Tabs value={currentSection} onValueChange={handleSectionChange}>
      <TabsList>
        <TabsTrigger value="accounts">Investment Accounts</TabsTrigger>
        <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
        <TabsTrigger value="history">Balance History</TabsTrigger>
        <TabsTrigger value="data-input">Data Input</TabsTrigger>
        {selectedInvestment && (
          <TabsTrigger value="individual">{selectedInvestment.investment.name}</TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};
