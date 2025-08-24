import { useSearch } from '@tanstack/react-router';
import type { I_InvestmentPortfolio } from '@/domains/investments/types/types-and-interfaces';

export type T_InvestmentSection = 'accounts' | 'overview' | 'history' | 'data-input' | 'individual';

export interface I_UseInvestmentSectionContentProps {
  selectedInvestment?: I_InvestmentPortfolio | null;
}

export const useInvestmentSectionContent = ({
  selectedInvestment,
}: I_UseInvestmentSectionContentProps = {}) => {
  const search = useSearch({ from: '/(auth)/investments/' });
  const currentSection = (search.section || 'accounts') as T_InvestmentSection;

  const getSectionContent = () => {
    switch (currentSection) {
      case 'accounts':
        return {
          type: 'accounts' as const,
          props: {},
        };
      case 'overview':
        return {
          type: 'overview' as const,
          props: {},
        };
      case 'history':
        return {
          type: 'history' as const,
          props: {
            title: 'All Investments Balance History',
            description: 'Complete history of all your investment balances and movements',
          },
        };
      case 'data-input':
        return {
          type: 'data-input' as const,
          props: {},
        };
      case 'individual':
        if (!selectedInvestment) {
          return {
            type: 'accounts' as const,
            props: {},
          };
        }
        return {
          type: 'individual' as const,
          props: {
            investmentId: selectedInvestment.investment.id,
            title: `${selectedInvestment.investment.name} Balance History`,
            description: `Balance history and performance for ${selectedInvestment.investment.name}`,
          },
        };
      default:
        return {
          type: 'accounts' as const,
          props: {},
        };
    }
  };

  return {
    currentSection,
    sectionContent: getSectionContent(),
  };
};
