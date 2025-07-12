import {
  I_CreditCardInvoiceRequest,
  I_CreditCardInvoiceResponse,
  I_CreditCardRawInvoice,
  I_CreateCreditCardRequest,
  I_CreateCreditCardResponse,
  I_CreateCreditCardsResponse,
  I_CreditCard,
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
    return await parsePdf({ data: formData });
  },
  createCreditCardInvoice: async (data: I_CreditCardInvoiceRequest) => {
    const response = await apiClient.post<I_CreditCardInvoiceResponse>(
      `/credit_cards/invoices`,
      data
    );
    return response.data;
  },
  getAllCreditCards: async (accountId?: string) => {
    const response = await apiClient.get<I_CreateCreditCardsResponse>(`/credit_cards`, {
      params: {
        account_id: accountId,
      },
    });
    return response.data;
  },
  getCreditCard: async (creditCardId: string) => {
    const response = await apiClient.get<I_CreditCard>(`/credit_cards/${creditCardId}`);
    return response.data;
  },

  getCreditCardInvoices: async (creditCardId: string) => {
    const response = await apiClient.get<I_CreditCardInvoiceResponse>(
      `/credit_cards/${creditCardId}/invoices`
    );
    return response.data;
  },
};
