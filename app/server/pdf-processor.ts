import { createServerFn } from '@tanstack/react-start';
import { OPENAI_API_KEY } from '../core/api/config';
import OpenAI from 'openai';
import { z } from 'zod';
import pdfParse from 'pdf-parse';



/**
 * Process a bank invoice PDF
 */
export const processBankInvoice = createServerFn({
  method: 'POST',
})
  .handler(async (ctx) => {
    // Access the raw event which contains the request
    const { event } = ctx;
    
    if (!event?.request) {
      throw new Error('No request provided');
    }

    try {
      // Extract file from form data
      const formData = await event.request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        throw new Error('No PDF file provided');
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF');
      }

      // Extract text from PDF
      const fileBuffer = await file.arrayBuffer();
      const pdfData = await pdfParse(Buffer.from(fileBuffer));
      const extractedText = pdfData.text;

      console.log('Extracted text:', extractedText);

      // Check if we have OpenAI API key
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      // Validate against our schema
      return "test"
      
    } catch (error) {
      console.error('Error processing bank invoice PDF:', error);
      throw new Error('Failed to process bank invoice PDF');
    }
  }); 