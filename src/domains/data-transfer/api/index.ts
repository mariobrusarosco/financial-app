import { apiClient } from '@/config/api';
import type {
  I_ExportPayload,
  I_ExportResponse,
  I_ImportResponse,
  I_ValidateResponse,
} from '@/domains/data-transfer/type/types-and-interfaces';

const exportData = async (payload: I_ExportPayload = {}): Promise<I_ExportResponse> => {
  const response = await apiClient.post<I_ExportResponse>('/data_transfer/export', payload);
  return response.data;
};

const downloadExport = async (exportId: string): Promise<Blob> => {
  const response = await apiClient.get(`/data_transfer/export/${exportId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

const importData = async (file: File): Promise<I_ImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<I_ImportResponse>('/data_transfer/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const validateImport = async (file: File): Promise<I_ValidateResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<I_ValidateResponse>(
    '/data_transfer/import/validate',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const dataTransferApi = {
  exportData,
  downloadExport,
  importData,
  validateImport,
};
