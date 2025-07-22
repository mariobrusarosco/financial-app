import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { accountsApi, I_AccountRawStatement } from '@/domains/accounts/api';

export const useParseAccountStatement = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statement, setStatement] = useState<I_AccountRawStatement | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await accountsApi.parseAccountStatement(formData);
      return result;
    },
    onSuccess: data => {
      setStatement(data);
    },
    onError: error => {
      console.error('Error parsing account statement:', error);
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
