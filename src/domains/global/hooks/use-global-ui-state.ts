import { useNavigate } from '@tanstack/react-router';

export const useGlobalUIState = () => {
  const navigate = useNavigate();

  const closeUI = () => {
    void navigate({ search: {} as never });
  };

  // Simple convenience methods - no complex state objects
  const openAccountCreate = () => {
    void navigate({ search: { drawer: 'account-create' } as never });
  };
  const openBrokerCreate = () => {
    void navigate({ search: { drawer: 'broker-create' } as never });
  };
  const openTransactionCreate = () => {
    void navigate({ search: { drawer: 'transaction-create' } as never });
  };
  const openCreditCardCreate = () => {
    void navigate({ search: { drawer: 'credit-card-create' } as never });
  };
  const openInvestmentCreate = () => {
    void navigate({ search: { drawer: 'investment-create' } as never });
  };
  const openInvestmentDataCreate = () => {
    void navigate({ search: { drawer: 'investment-data-create' } as never });
  };

  return {
    closeUI,
    openAccountCreate,
    openBrokerCreate,
    openTransactionCreate,
    openCreditCardCreate,
    openInvestmentCreate,
    openInvestmentDataCreate,
  };
};
