import { ICreditCardStatement } from '@/domains/credit-cards/types/interfaces';

export const creditCardApi = {
  parseStatement: async (formData: FormData): Promise<ICreditCardStatement> => {
    const response = await fetch('/api/parse-credit-card', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to parse credit card statement');
    }

    return response.json();
  },
};
