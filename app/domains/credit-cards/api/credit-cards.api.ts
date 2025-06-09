import {
  I_CreditCardInvoiceRequest,
  I_CreditCardInvoiceResponse,
  I_CreditCardRawInvoice,
} from '@/domains/credit-cards/types/types-and-interfaces';
import { parsePdf } from '@/server-functions/pdf-parser';
import { apiClient } from '@/config/api';

export const creditCardApi = {
  parseInvoice: async (formData: FormData): Promise<I_CreditCardRawInvoice> => {
    const result = await parsePdf({ data: formData });
    return result;
  },
  createCreditCardInvoice: async (data: I_CreditCardInvoiceRequest) => {
    const response = await apiClient.post<I_CreditCardInvoiceResponse>(
      '/credit-card-invoices',
      data
    );
    return response.data;
  },
};
