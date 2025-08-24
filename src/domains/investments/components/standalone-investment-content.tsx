import { InvestmentSectionContent } from '@/domains/investments/components/investment-section-content';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

/**
 * Example component showing how to use InvestmentSectionContent independently
 * This component can be rendered anywhere and will automatically show the correct
 * content based on the current URL parameters
 */
export interface I_StandaloneInvestmentContentProps {
  selectedInvestment?: I_InvestmentPortfolio | null;
  onInvestmentClick?: (investment: I_InvestmentPortfolio) => void;
  className?: string;
}

export const StandaloneInvestmentContent = ({
  selectedInvestment,
  onInvestmentClick,
  className = '',
}: I_StandaloneInvestmentContentProps) => {
  return (
    <div className={`investment-section-wrapper ${className}`}>
      <InvestmentSectionContent
        selectedInvestment={selectedInvestment}
        onInvestmentClick={onInvestmentClick}
      />
    </div>
  );
};
