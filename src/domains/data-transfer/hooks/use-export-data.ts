import { useMutation } from '@tanstack/react-query';
import { dataTransferApi } from '@/domains/data-transfer/api';
import type { I_ExportPayload } from '@/domains/data-transfer/type/types-and-interfaces';

export const useExportData = () => {
  return useMutation({
    mutationFn: (payload: I_ExportPayload = {}) => dataTransferApi.exportData(payload),
  });
};
