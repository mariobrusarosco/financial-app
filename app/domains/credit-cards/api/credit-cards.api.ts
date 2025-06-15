import {
  I_CreditCardInvoiceRequest,
  I_CreditCardInvoiceResponse,
  I_CreditCardRawInvoice,
  I_CreateCreditCardRequest,
  I_CreateCreditCardResponse,
  I_CreateCreditCardsResponse,
} from '@/domains/credit-cards/types/types-and-interfaces';
import { parsePdf } from '@/server-functions/pdf-parser';
import { apiClient } from '@/config/api';

export const creditCardApi = {
  createCreditCard: async (
    data: I_CreateCreditCardRequest
  ): Promise<I_CreateCreditCardResponse> => {
    const response = await apiClient.post<I_CreateCreditCardResponse>('/credit_cards/', data);
    return response.data;
  },
  parseInvoice: async (formData: FormData): Promise<I_CreditCardRawInvoice> => {
    const result = await parsePdf({ data: formData });
    return result;
  },
  createCreditCardInvoice: async (data: I_CreditCardInvoiceRequest) => {
    const response = await apiClient.post<I_CreditCardInvoiceResponse>(
      '/credit_cards/invoices',
      data
    );
    return response.data;
  },
  getAllCreditCards: async (accountId?: string) => {
    const response = await apiClient.get<I_CreateCreditCardsResponse>(`/credit_cards/${accountId}`);
    return response.data;
  },
};
