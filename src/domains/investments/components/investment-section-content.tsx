import { InvestmentsList } from '@/domains/investments/components/investments-list';
import { InvestmentBalanceTable } from '@/domains/investments/components/investment-balance-table';
import { InvestmentAccountsList } from '@/domains/investments/components/investment-accounts-list';
import { InvestmentDataInputScreen } from '@/domains/investments/screens/investment-data-input';
import { useInvestmentSectionContent } from '@/domains/investments/hooks/use-investment-section-content';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

export interface I_InvestmentSectionContentProps {
  selectedInvestment?: I_InvestmentPortfolio | null;
  onInvestmentClick?: (investment: I_InvestmentPortfolio) => void;
}

export const InvestmentSectionContent = ({
  selectedInvestment,
  onInvestmentClick,
}: I_InvestmentSectionContentProps) => {
  const { sectionContent } = useInvestmentSectionContent({ selectedInvestment });

  const renderContent = () => {
    switch (sectionContent.type) {
      case 'accounts':
        return <InvestmentAccountsList />;

      case 'overview':
        return <InvestmentsList onInvestmentClick={onInvestmentClick} />;

      case 'history':
        return (
          <InvestmentBalanceTable
            title={sectionContent.props.title}
            description={sectionContent.props.description}
          />
        );

      case 'data-input':
        return <InvestmentDataInputScreen />;

      case 'individual':
        return (
          <InvestmentBalanceTable
            investmentId={sectionContent.props.investmentId}
            title={sectionContent.props.title}
            description={sectionContent.props.description}
          />
        );

      default:
        return <InvestmentAccountsList />;
    }
  };

  return <div className="space-y-6">{renderContent()}</div>;
};
