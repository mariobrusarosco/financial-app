import { ICreditCardStatement } from '@/domains/credit-cards/types/interfaces';
import { parsePdf } from '@/server-functions/pdf-parser';

export const creditCardApi = {
  parseStatement: async (formData: FormData): Promise<ICreditCardStatement> => {
    const result = await parsePdf({ data: formData });
    return result as ICreditCardStatement;
  },
};
