import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { ICreditCardStatement } from '@/domains/credit-cards/types/interfaces';

export const CREDIT_CARD_KEYS = {
  all: ['credit-cards'] as const,
  statements: () => [...CREDIT_CARD_KEYS.all, 'statements'] as const,
  statement: (statementId: string) => [...CREDIT_CARD_KEYS.statements(), statementId] as const,
} as const;

export const useParseStatement = () => {
  const queryClient = useQueryClient();

  return useMutation<ICreditCardStatement, Error, FormData>({
    mutationFn: creditCardApi.parseStatement,
    
    onSuccess: (data) => {
      console.log('Statement parsed successfully:', data);
      
      // Update statements list query
      queryClient.invalidateQueries({
        queryKey: CREDIT_CARD_KEYS.statements()
      });
    },
    
    onError: (error) => {
      console.error('Failed to parse statement:', error.message);
    },

    retry: false
  });
};
