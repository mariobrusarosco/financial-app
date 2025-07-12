import { createServerFn } from '@tanstack/react-start';
import PDFParser from 'pdf2json';
import OpenAI from 'openai';
import { I_CreditCardRawInvoice } from '@/domains/credit-cards/types/types-and-interfaces';

const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

const systemPrompt = `
You are a financial assistant. A user has provided a Nubank credit card statement (in Portuguese).
Your task is to extract the required information from the statement and return it in a structured JSON format.
Focus on extracting only the relevant financial data and ignore any boilerplate text or disclaimers.

The response should be a valid JSON object with the following structure:
{
  "total_due": string,       // The total amount due on the credit card statement
  "due_date": string,       // The payment due date for the statement
  "period": string,         // The billing period of the statement
  "min_payment": string,    // The minimum payment amount required
  "installment_options": [  // Available installment payment options
    {
      "months": number,     // Number of months for the installment option
      "total": string      // Total amount for this installment option
    }
  ],
  "transactions": [        // List of transactions in the statement
    {
      "date": string,     // Date of the transaction
      "description": string, // Description of the transaction
      "amount": string,    // Amount of the transaction
      "category": string  // Empty string if no category is found
    }
  ],
  "next_due_info": {      // Optional: Information about the next payment due
    "amount": string,     // Next payment amount due
    "balance": string     // Current balance
  }
}

All amounts and monetary values should be returned as strings.
Dates should be in a consistent format.
`;

export const parsePdf = createServerFn({ method: 'POST' })
  .validator((formData: FormData) => {
    const file = formData.get('file') as File;

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided');
    }
    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }
    return { file };
  })
  .handler(async ({ data }) => {
    const arrayBuffer = await data.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser();

    const parseResult = await new Promise<{ text: string; pages: number }>((resolve, reject) => {
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        resolve({
          text: decodeURIComponent(
            pdfData.Pages.map((page: any) =>
              page.Texts.map((text: any) => text.R.map((r: any) => r.T).join(' ')).join(' ')
            ).join('\n')
          ),
          pages: pdfData.Pages.length,
        });
      });

      pdfParser.on('pdfParser_dataError', reject);

      pdfParser.parseBuffer(buffer);
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Please analyze the following credit card statement text and return the information in JSON format:\n\n${parseResult.text.slice(0, 12000)}`,
        }, // GPT-4 input limit handling
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Failed to parse PDF: No response from GPT');
    }

    try {
      // Parse the JSON string from GPT response
      const parsedData = JSON.parse(content) as I_CreditCardRawInvoice;
      console.log('✅ Structured GPT Response:\n', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Failed to parse GPT response:', error);
      throw new Error('Failed to parse PDF: Invalid response format');
    }
  });
