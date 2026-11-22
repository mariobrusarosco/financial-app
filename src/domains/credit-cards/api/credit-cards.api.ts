import type {
  I_CreditCardInvoiceResponse,
  I_CreditCardInvoicesResponse,
  I_CreateCreditCardRequest,
  I_CreateCreditCardResponse,
  I_CreateCreditCardsResponse,
  I_CreditCard,
  I_CreditCardTransactionsResponse,
  I_CreditCardTransactionsParams,
  I_CreditCardUpdatePayload,
} from '@/domains/credit-cards/types/types-and-interfaces';
import { apiClient } from '@/config/api';

export const creditCardApi = {
  updateInvoiceCompetence: async (
    creditCardId: string,
    invoiceId: string,
    competenceMonth: string
  ) => {
    const response = await apiClient.patch<I_CreditCardInvoiceResponse>(
      `/credit_cards/${creditCardId}/invoices/${invoiceId}`,
      { competence_month: competenceMonth }
    );
    return response.data;
  },
  createCreditCard: async (
    data: I_CreateCreditCardRequest
  ): Promise<I_CreateCreditCardResponse> => {
    const response = await apiClient.post<I_CreateCreditCardResponse>('/credit_cards', data);
    return response.data;
  },
  parseInvoicePdf: async (formData: FormData, creditCardId: string): Promise<any> => {
    const response = await apiClient.post<any>(
      `/credit_cards/${creditCardId}/invoices/parse-pdf`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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
  updateCreditCard: async (creditCardId: string, payload: I_CreditCardUpdatePayload) => {
    const response = await apiClient.patch<I_CreditCard>(`/credit_cards/${creditCardId}`, payload);
    return response.data;
  },
  getCreditCard: async (creditCardId: string) => {
    const response = await apiClient.get<I_CreditCard>(`/credit_cards/${creditCardId}`);
    return response.data;
  },

  getCreditCardInvoices: async (creditCardId: string) => {
    const response = await apiClient.get<I_CreditCardInvoicesResponse>(
      `/credit_cards/${creditCardId}/invoices`
    );
    return response.data.data; // Return just the invoices array
  },

  getCreditCardTransactions: async (
    creditCardId: string,
    params?: I_CreditCardTransactionsParams
  ): Promise<I_CreditCardTransactionsResponse> => {
    const response = await apiClient.get<I_CreditCardTransactionsResponse>(
      `/credit_cards/${creditCardId}/transactions`,
      { params }
    );
    return response.data; // Return full response with data and meta
  },
};
