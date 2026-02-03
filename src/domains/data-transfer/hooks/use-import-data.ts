import { useMutation } from '@tanstack/react-query';
import { dataTransferApi } from '@/domains/data-transfer/api';

export const useImportData = () => {
  return useMutation({
    mutationFn: (file: File) => dataTransferApi.importData(file),
  });
};
