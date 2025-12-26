import { useState } from 'react';
import { useAllTransactionsWithPagination } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionsErrorState } from '../components/transactions-error-state';
import { TransactionsLoadingState } from '../components/transactions-loading-state';
import { TransactionsEmptyState } from '../components/transactions-empty-state';
import { TransactionsList } from '../components/transactions-list';

const ITEMS_PER_PAGE = 20;

export const TransactionsMainScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData } = useAllTransactionsWithPagination(
    currentPage,
    ITEMS_PER_PAGE
  );

  const transactions = data?.data || [];
  const meta = data?.meta;

  if (error) return <TransactionsErrorState />;
  if (isLoading && !isPlaceholderData) return <TransactionsLoadingState />;
  if (transactions.length === 0 && !isLoading && !isPlaceholderData)
    return <TransactionsEmptyState />;

  return (
    <TransactionsList
      transactions={transactions}
      meta={meta}
      isPlaceholderData={isPlaceholderData}
      onPageChange={setCurrentPage}
    />
  );
};
