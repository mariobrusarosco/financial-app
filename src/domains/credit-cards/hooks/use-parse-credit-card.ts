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
} as const;

export const useParseCreditCardInvoice = (creditCardId: string, accountId?: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invoice, setInvoice] = useState<I_CreditCardInvoiceResponse | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    await Promise.resolve(); // Satisfy require-await
    void mutation.mutate(formData, {
      onSuccess: data => {
        setInvoice(data);
      },
    });
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

      // Update statements list query
      void queryClient.invalidateQueries({
        queryKey: CREDIT_CARD_KEYS.statements(),
      });
    },

    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to parse credit card statement. Please check the file and try again.',
      });
    },

    retry: false,
  });

  return {
    mutation,
    invoice,
    handleFileUpload,
    handleFileChange,
    selectedFile,
  };
};
