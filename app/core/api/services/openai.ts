import { z } from 'zod';
import { analyzeExpense, type ExpenseAnalysisResult } from '../../../server/openai';
export { ExpenseAnalysisSchema } from '../../../server/openai';
export type { ExpenseAnalysisResult } from '../../../server/openai';

// Default response for server-side rendering or when API is not available
export const defaultExpenseAnalysis: ExpenseAnalysisResult = {
  date: null,
  amount: null,
  currencySymbol: null,
  description: "",
  paymentMethod: null,
  bank: null
};

/**
 * Service for interacting with OpenAI via server functions
 */
export const openaiService = {
  /**
   * Analyze an expense description to extract structured information
   * 
   * @param description The expense description to analyze
   * @returns Structured information about the expense
   */
  async analyzeExpense(description: string): Promise<ExpenseAnalysisResult> {
    // For server-side rendering, return default response
    if (typeof window === 'undefined') {
      return { ...defaultExpenseAnalysis, description };
    }
    
    try {
      // Call the server function
      console.log('Calling analyzeExpense server function with:', description);
      const result = await analyzeExpense({ 
        data: { description } 
      });
      return result;
    } catch (error) {
      console.error('Error analyzing expense with OpenAI:', error);
      return { ...defaultExpenseAnalysis, description };
    }
  }
}; 