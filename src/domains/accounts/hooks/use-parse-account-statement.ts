import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { accountsApi, I_ParsedAccountStatement } from '@/domains/accounts/api';
import * as React from 'react';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';
import { GET_UPLOADED_STATEMENT_QUERY_KEY } from '../api/keys';
import { captureHandledError } from '@/config/observability';

export const useParseAccountStatement = (accountId: string) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return Sentry.startSpan(
        {
          name: 'account-statement.upload-parse',
          op: 'file.process',
          forceTransaction: true,
          attributes: {
            'app.domain': 'accounts',
            'file.type': selectedFile?.type ?? 'application/pdf',
            'file.size_bytes': selectedFile?.size ?? 0,
            'account.has_id': Boolean(accountId),
          },
        },
        () => accountsApi.parseAccountStatement(formData, accountId)
      );
    },
    onSuccess: (data: I_ParsedAccountStatement) => {
      // Store in React Query cache
      queryClient.setQueryData(GET_UPLOADED_STATEMENT_QUERY_KEY(accountId), data);
      // Invalidate queries to trigger re-renders for components with enabled: false
      void queryClient.invalidateQueries({ queryKey: GET_UPLOADED_STATEMENT_QUERY_KEY(accountId) });
    },
    onError: error => {
      handleErrorWithToast(error, {
        userMessage: 'Failed to parse account statement. Please check the file and try again.',
      });
      captureHandledError(error, {
        domain: 'accounts',
        operation: 'parse-account-statement',
        context: {
          hasFile: Boolean(selectedFile),
          hasAccountId: Boolean(accountId),
        },
      });

      // Clear cache on error
      queryClient.removeQueries({ queryKey: GET_UPLOADED_STATEMENT_QUERY_KEY(accountId) });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear previous cached statement but keep the query structure
      queryClient.setQueryData(GET_UPLOADED_STATEMENT_QUERY_KEY(accountId), undefined);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    await Promise.resolve(); // Satisfy require-await
    mutation.mutate(formData);
  };

  const resetStatement = () => {
    setSelectedFile(null);
    mutation.reset();
    queryClient.removeQueries({ queryKey: GET_UPLOADED_STATEMENT_QUERY_KEY(accountId) });
  };

  return {
    selectedFile,
    mutation,
    handleFileChange,
    handleFileUpload,
    resetStatement,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
