import { useMutation } from '@tanstack/react-query';
import { dataTransferApi } from '@/domains/data-transfer/api';

export const useDownloadExport = () => {
  return useMutation({
    mutationFn: (exportId: string) => dataTransferApi.downloadExport(exportId),
    onSuccess: (blob, exportId) => {
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-data-export-${exportId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};
