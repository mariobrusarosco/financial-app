import { useMutation } from '@tanstack/react-query';
import { dataTransferApi } from '@/domains/data-transfer/api';

export const useValidateImport = () => {
  return useMutation({
    mutationFn: (file: File) => dataTransferApi.validateImport(file),
  });
};
