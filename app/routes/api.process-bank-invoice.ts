import { createFileRoute } from "@tanstack/react-router";
import { OPENAI_API_KEY } from '../core/api/config';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import { z } from 'zod';

// Define the schema for bank invoice extraction results
export const BankInvoiceSchema = z.object({
  bankName: z.string().nullable(),
  statementDate: z.string().nullable(),
  accountNumber: z.string().nullable(),
  totalAmount: z.number().nullable(),
  currencySymbol: z.string().nullable(),
  transactions: z.array(z.object({
    date: z.string().nullable(),
    description: z.string(),
    amount: z.number().nullable(),
    category: z.string().nullable(),
  })),
});

export type BankInvoiceResult = z.infer<typeof BankInvoiceSchema>;

export const Route = createFileRoute('/api/process-bank-invoice')({
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
      // Extract file from form data
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        return {
          status: 400,
          error: 'No PDF file provided'
        };
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
        return {
          status: 400,
          error: 'File must be a PDF'
        };
      }

      // Extract text from PDF
      const fileBuffer = await file.arrayBuffer();
      const pdfData = await pdfParse(Buffer.from(fileBuffer));
      const extractedText = pdfData.text;

      // Check if we have OpenAI API key
      if (!OPENAI_API_KEY) {
        return {
          status: 500,
          error: 'OpenAI API key is not configured'
        };
      }

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
      });

      // System prompt for bank invoice analysis
      const systemPrompt = `
      You are a financial assistant that extracts information from bank invoice PDFs.
      Analyze the text extracted from a bank invoice PDF and extract structured information.
      
      Return the data in the following JSON format:
      {
        "bankName": (string or null),
        "statementDate": (string or null),
        "accountNumber": (string or null, masked if present),
        "totalAmount": (number or null),
        "currencySymbol": (string or null),
        "transactions": [
          {
            "date": (string or null),
            "description": (string),
            "amount": (number or null),
            "category": (string or null)
          }
        ]
      }
      
      Extract as many transactions as you can identify in the PDF.
      Be precise and only extract what is explicitly mentioned or can be directly inferred.
      Always use camelCase for all property names in the response.
      `;

      // User prompt with the extracted text
      const userPrompt = `
      Please analyze this bank statement text and extract structured information:
      
      ---BANK STATEMENT TEXT---
      ${extractedText}
      ---END OF TEXT---
      
      Return the information in the specified JSON format.
      `;

      console.log('Analyzing PDF content with OpenAI');
      
      // Call OpenAI API with structured output
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k", // Using a model with larger context
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        return {
          status: 500,
          error: 'Empty response from OpenAI'
        };
      }
      
      try {
        // Parse the JSON response
        const parsedContent = JSON.parse(content);
        
        // Validate with our schema
        const validatedData = BankInvoiceSchema.parse(parsedContent);
        
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
      console.error('Error processing bank invoice PDF:', error);
      return {
        status: 500,
        error: 'Failed to process bank invoice PDF'
      };
    }
  },
  
  // This route doesn't have a UI component since it's an API endpoint
  component: () => null,
}); 