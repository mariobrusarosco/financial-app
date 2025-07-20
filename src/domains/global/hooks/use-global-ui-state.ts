import { useNavigate } from '@tanstack/react-router';

export const useGlobalUIState = () => {
  const navigate = useNavigate();

  const closeUI = () => {
    navigate({ search: {} });
  };

  // Simple convenience methods - no complex state objects
  const openAccountCreate = () => navigate({ search: { drawer: 'account-create' } });
  const openBrokerCreate = () => navigate({ search: { drawer: 'broker-create' } });
  const openTransactionCreate = () => navigate({ search: { drawer: 'transaction-create' } });
  const openCreditCardCreate = () => navigate({ search: { drawer: 'credit-card-create' } });

  return {
    closeUI,
    openAccountCreate,
    openBrokerCreate,
    openTransactionCreate,
    openCreditCardCreate,
  };
};
