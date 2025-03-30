import { createFileRoute } from "@tanstack/react-router";
import { OPENAI_API_KEY } from '../core/api/config';
import OpenAI from 'openai';
import { ExpenseAnalysisSchema } from '../core/api/services/openai';

export const Route = createFileRoute('/api/analyze-expense')({
  // Use loader for GET requests and action for POST requests
  // Since we're using POST, we'll use action
  validateSearch: () => ({}),
  
  // This handler will run on the server
  action: async ({ request }) => {
    if (!request) {
      return {
        status: 400,
        error: 'Invalid request'
      };
    }
    
    try {
      const data = await request.json();
      const { description } = data;
      
      if (!description) {
        return {
          status: 400,
          error: 'Description is required'
        };
      }

      if (!OPENAI_API_KEY) {
        return {
          status: 500,
          error: 'OpenAI API key is not configured'
        };
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
      
      Expense description: ${description}
      
      Return the information in the specified format, with null for any fields that aren't specified in the description.
      `;

      // Call OpenAI API with structured output
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      
      if (!content) {
        return {
          status: 500,
          error: 'Failed to get a response from OpenAI'
        };
      }
      
      try {
        const parsedContent = JSON.parse(content);
        // Validate with our schema
        const validatedData = ExpenseAnalysisSchema.parse(parsedContent);
        
        return {
          status: 200,
          data: validatedData
        };
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return {
          status: 500,
          error: 'Failed to parse AI response'
        };
      }
    } catch (error) {
      console.error('Error analyzing expense with OpenAI:', error);
      return {
        status: 500,
        error: 'Failed to analyze expense description'
      };
    }
  },
  
  // This route doesn't have a UI component since it's an API endpoint
  component: () => null,
}); 