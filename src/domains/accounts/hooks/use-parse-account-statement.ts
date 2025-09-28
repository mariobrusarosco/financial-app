import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { accountsApi, I_AccountRawStatement } from '@/domains/accounts/api';
import * as React from 'react';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useParseAccountStatement = (accountId: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statement, setStatement] = useState<I_AccountRawStatement | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append('account_id', accountId);
      return accountsApi.parseAccountStatement(formData);
    },
    onSuccess: data => {
      setStatement(data);
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to parse account statement. Please check the file and try again.',
      });
      setStatement(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatement(null); // Reset previous statement

      const formData = new FormData();
      formData.append('file', file);
      mutation.mutate(formData);
    }
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setStatement(null);

    const formData = new FormData();
    formData.append('file', file);
    mutation.mutate(formData);
  };

  const resetStatement = () => {
    setStatement(null);
    setSelectedFile(null);
    mutation.reset();
  };

  return {
    selectedFile,
    statement,
    mutation,
    handleFileChange,
    handleFileUpload,
    resetStatement,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
