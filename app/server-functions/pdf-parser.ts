import { createServerFn } from '@tanstack/react-start';
import PDFParser from 'pdf2json';

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
    
    return new Promise((resolve, reject) => {
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
  });