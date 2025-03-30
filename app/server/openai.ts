import { createServerFn } from '@tanstack/react-start';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../core/api/config';
import { z } from 'zod';

// Define the Zod schema for expense analysis
export const ExpenseAnalysisSchema = z.object({
  date: z.string().nullable(),
  amount: z.number().nullable(),
  currencySymbol: z.string().nullable(),
  description: z.string(),
  paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Cash', 'Other']).nullable(),
  bank: z.string().nullable()
});

// Define our expense analysis response type from the Zod schema
export type ExpenseAnalysisResult = z.infer<typeof ExpenseAnalysisSchema>;

// Define a schema for the input
const InputSchema = z.object({
  description: z.string().min(1, "Description is required")
});

/**
 * Server function for analyzing expense descriptions using OpenAI
 */
export const analyzeExpense = createServerFn({
  method: 'POST',
})
  .validator((input) => {
    try {
      return InputSchema.parse(input);
    } catch (error) {
      throw new Error('Invalid input: Description is required');
    }
  })
  .handler(async ({ data }) => {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Create an OpenAI client (server-side)
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // System prompt for context
    const systemPrompt = `
    You are a financial assistant that extracts structured information from expense descriptions.
    Parse the expense description and extract date, amount, currency symbol, description, payment method, and bank information.
    Be precise and only extract what is explicitly mentioned or can be directly inferred.
    `;

    // User prompt with the specific request
    const userPrompt = `
    Please analyze this expense description and extract the following information:
    
    Expense description: ${data.description}
    
    Return the information in the specified format, with null for any fields that aren't specified in the description.
    `;

    console.log('Sending analysis request for:', data.description);

    try {
      // Call OpenAI API with structured output
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }
      
      const parsedContent = JSON.parse(content);

      return parsedContent;
    } catch (error) {
      console.error('Error analyzing expense with OpenAI:', error);
      throw new Error('Failed to analyze expense description');
    }
  }); 