import fs from 'fs';
import pdf from 'pdf-parse';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';


export const parsePdf = createServerFn({ method: 'POST' })
  .validator((data: { fileName: string }) => data)
  .handler(async ({ data }) => {
    console.log('Processing file:', data.fileName);
    return {
      message: `Processing ${data.fileName}`,
    }
  });