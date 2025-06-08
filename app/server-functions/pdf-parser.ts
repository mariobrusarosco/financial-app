import { createServerFn } from '@tanstack/react-start';
import PDFParser from 'pdf2json';
import OpenAI from 'openai';  


const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

const systemPrompt = `
You are a financial assistant. A user has provided a Nubank credit card statement (in Portuguese).
Your job is to extract a structured and concise summary in JSON format, including:

- "total_due": string
- "due_date": string
- "period": string
- "min_payment": string
- "installment_options": array of { "months": number, "total": string }
- "transactions": array of { "date": string, "description": string, "amount": string }
- "next_due_info": optional, includes next due amount or balance if available

Ignore boilerplate text and disclaimers. Return JSON only — no explanation.
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
    
    const parseResult = await new Promise<{ text: string, pages: number }>((resolve, reject) => {
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        resolve({
          text: decodeURIComponent(pdfData.Pages.map(page => 
            page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
          ).join('\n')),
          pages: pdfData.Pages.length
        });
      });
      
      pdfParser.on('pdfParser_dataError', reject);
      
      pdfParser.parseBuffer(buffer);
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: parseResult.text.slice(0, 12000) } // GPT-4 input limit handling
      ],
      temperature: 0.3
    });
  
    const result = response.choices[0].message.content;
    console.log('✅ GPT-4 Summary:\n', result);
  });