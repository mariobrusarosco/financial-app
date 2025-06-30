import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
import { I_CreditCardRawInvoice } from '@/domains/credit-cards/types/types-and-interfaces';
import { useState } from 'react';

export const CREDIT_CARD_KEYS = {
  all: ['credit-cards'] as const,
  statements: () => [...CREDIT_CARD_KEYS.all, 'statements'] as const,
  statement: (statementId: string) => [...CREDIT_CARD_KEYS.statements(), statementId] as const,
} as const;

export const useParseCreditCardInvoice = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawInvoice, setRawInvoice] = useState<I_CreditCardRawInvoice | null>(null);
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
        setRawInvoice(data);
      },
    });
  };

  const mutation = useMutation<I_CreditCardRawInvoice, Error, FormData>({
    mutationFn: creditCardApi.parseInvoice,

    onSuccess: data => {
      console.log('Statement parsed successfully:', data);

      // Update statements list query
      queryClient.invalidateQueries({
        queryKey: CREDIT_CARD_KEYS.statements(),
      });
    },

    onError: error => {
      console.error('Failed to parse statement:', error.message);
    },

    retry: false,
  });

  return {
    mutation,
    invoice: rawInvoice,
    handleFileUpload,
    handleFileChange,
    selectedFile,
  };
};
