import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionsApi } from '@/domains/transactions/api/transactions.api';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import type {
  I_AccountTransactionsParams,
  I_TransactionResponse,
  I_AccountTransactionsResponse,
} from '@/domains/transactions/types/types-and-interfaces';
import type { I_CreditCardTransactionsParams } from '@/domains/credit-cards/types/types-and-interfaces';

export const GET_ACCOUNT_TRANSACTIONS_COMBINED_QUERY_KEY = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => [
  'account-transactions-combined',
  accountId,
  // Serialize params to ensure stable cache key
  JSON.stringify(params || {}),
];

// Hook that combines account transactions and credit card transactions for an account
export const useAccountTransactionsCombined = (
  accountId: string,
  params?: I_AccountTransactionsParams
) => {
  // First get the credit cards for this account
  const { data: creditCardsData } = useCreditCards(accountId);
  const creditCards = creditCardsData?.data || [];
  const creditCardIds = creditCards.map(card => card.id);

  return useQuery({
    queryKey: GET_ACCOUNT_TRANSACTIONS_COMBINED_QUERY_KEY(accountId, params),
    queryFn: async (): Promise<I_AccountTransactionsResponse> => {
      try {
        // To handle pagination correctly across multiple data sources,
        // we need to fetch ALL transactions first, then apply pagination
        // This ensures we get accurate combined results

        // Fetch ALL account transactions (remove pagination from individual calls)
        const accountTransactionsPromise = transactionsApi.getAccountTransactions(accountId, {
          ...params,
          page: undefined,
          per_page: undefined, // Get all transactions
        });

        // Fetch ALL credit card transactions for each credit card
        const creditCardTransactionsPromises = creditCardIds.map(creditCardId =>
          creditCardApi.getCreditCardTransactions(creditCardId, {
            page: undefined,
            per_page: undefined, // Get all transactions
            date_from: params?.date_from,
            date_to: params?.date_to,
            amount_min: params?.amount_min,
            amount_max: params?.amount_max,
            description_contains: params?.description_contains,
            movement_type: params?.movement_type,
            is_paid: params?.is_paid,
            sort_by: params?.sort_by as any,
            sort_order: params?.sort_order,
          } as I_CreditCardTransactionsParams)
        );

        // Wait for all API calls to complete
        const [accountTransactions, ...creditCardTransactionsArrays] = await Promise.all([
          accountTransactionsPromise,
          ...creditCardTransactionsPromises,
        ]);

        // Combine all transactions
        let allTransactions: I_TransactionResponse[] = [
          ...accountTransactions.data,
          ...creditCardTransactionsArrays.flatMap(ccResponse =>
            ccResponse.data.map(
              transaction =>
                ({
                  // Convert credit card transaction to account transaction format
                  id: transaction.id,
                  account_id: accountId, // Use the account ID we're querying for
                  broker_id: transaction.broker_id,
                  credit_card_id: transaction.credit_card_id, // This will be populated for credit transactions
                  is_deleted: false, // Credit card transactions don't have is_deleted, default to false
                  is_paid: transaction.is_paid,
                  date: transaction.date,
                  amount: transaction.amount.toString(),
                  description: transaction.description,
                  movement_type: transaction.movement_type as any, // Type conversion needed
                  category: transaction.category || '',
                  created_at: transaction.created_at,
                  updated_at: transaction.updated_at,
                }) as I_TransactionResponse
            )
          ),
        ];

        // Apply filtering that wasn't handled by the APIs
        if (params?.category) {
          allTransactions = allTransactions.filter(t =>
            t.category?.toLowerCase().includes(params.category!.toLowerCase())
          );
        }

        // Sort all transactions by the requested field and order
        allTransactions.sort((a, b) => {
          const sortBy = params?.sort_by || 'date';
          const sortOrder = params?.sort_order || 'desc';

          let valueA: any, valueB: any;

          switch (sortBy) {
            case 'date':
              valueA = new Date(a.date).getTime();
              valueB = new Date(b.date).getTime();
              break;
            case 'amount':
              valueA = parseFloat(a.amount);
              valueB = parseFloat(b.amount);
              break;
            case 'created_at':
              valueA = new Date(a.created_at).getTime();
              valueB = new Date(b.created_at).getTime();
              break;
            case 'category':
              valueA = a.category || '';
              valueB = b.category || '';
              break;
            default:
              valueA = new Date(a.date).getTime();
              valueB = new Date(b.date).getTime();
          }

          if (sortOrder === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
          } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
          }
        });

        // Apply pagination to the combined and sorted results
        const page = params?.page || 1;
        const perPage = params?.per_page || 20;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

        // Calculate meta information
        const total = allTransactions.length;
        const totalPages = Math.ceil(total / perPage);

        return {
          data: paginatedTransactions,
          meta: {
            total,
            page,
            per_page: perPage,
            has_next: page < totalPages,
            has_previous: page > 1,
          },
        };
      } catch (error) {
        console.error('Error fetching combined transactions:', error);
        // Return empty response on error
        return {
          data: [],
          meta: {
            total: 0,
            page: params?.page || 1,
            per_page: params?.per_page || 20,
            has_next: false,
            has_previous: false,
          },
        };
      }
    },
    enabled: !!accountId && creditCards.length >= 0, // Enable when we have account ID and credit cards are loaded
    placeholderData: keepPreviousData, // Prevents UI flickering
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
    retry: failureCount => {
      // Don't retry too many times to avoid overwhelming the server
      if (failureCount >= 3) return false;
      return true;
    },
  });
};
