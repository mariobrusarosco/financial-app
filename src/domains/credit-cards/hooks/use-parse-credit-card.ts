import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { I_CreditCardInvoiceResponse } from '@/domains/credit-cards/types/types-and-interfaces';
import { useState } from 'react';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const CREDIT_CARD_KEYS = {
  all: ['credit-cards'] as const,
  statements: () => [...CREDIT_CARD_KEYS.all, 'statements'] as const,
  statement: (statementId: string) => [...CREDIT_CARD_KEYS.statements(), statementId] as const,
  uploadedInvoice: (creditCardId: string) => [...CREDIT_CARD_KEYS.all, creditCardId, 'uploaded-invoice'] as const,
} as const;

export const useParseCreditCardInvoice = (creditCardId: string, accountId?: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Clear previous cached invoice
      queryClient.removeQueries({ queryKey: CREDIT_CARD_KEYS.uploadedInvoice(creditCardId) });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    await Promise.resolve(); // Satisfy require-await
    mutation.mutate(formData);
  };

  const mutation = useMutation<I_CreditCardInvoiceResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      if (accountId) {
        formData.append('account_id', accountId);
      }
      return creditCardApi.parseInvoicePdf(formData, creditCardId);
    },

    onSuccess: data => {
      console.log('Statement parsed successfully:', data);
      
      // Store in React Query cache
      queryClient.setQueryData(CREDIT_CARD_KEYS.uploadedInvoice(creditCardId), data);

      // Update statements list query
      void queryClient.invalidateQueries({
        queryKey: CREDIT_CARD_KEYS.statements(),
      });
    },

    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to parse credit card statement. Please check the file and try again.',
      });
      
      // Clear cache on error
      queryClient.removeQueries({ queryKey: CREDIT_CARD_KEYS.uploadedInvoice(creditCardId) });
    },

    retry: false,
  });

  const resetInvoice = () => {
    setSelectedFile(null);
    mutation.reset();
    queryClient.removeQueries({ queryKey: CREDIT_CARD_KEYS.uploadedInvoice(creditCardId) });
  };

  return {
    selectedFile,
    mutation,
    handleFileChange,
    handleFileUpload,
    resetInvoice,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
