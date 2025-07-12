# TanStack Query Implementation Plan

## 5. Implementation Phases

### Phase 1: Basic Setup

1. Install dependencies

   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```

2. Configure QueryClient

   ```typescript
   // app/lib/react-query.ts
   import { QueryClient } from '@tanstack/react-query';

   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 1000 * 60 * 5, // 5 minutes
         retry: 2,
         refetchOnWindowFocus: true,
       },
     },
   });
   ```

3. Set up QueryClientProvider

   ```typescript
   // app/root.tsx
   import { QueryClientProvider } from '@tanstack/react-query';
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   import { queryClient } from './lib/react-query';

   export default function App() {
     return (
       <QueryClientProvider client={queryClient}>
         {/* Your app components */}
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     );
   }
   ```

4. Add ReactQueryDevtools
   - Already included in the provider setup above
   - Provides debugging capabilities
   - Shows query states and cache

### Phase 2: API Layer

1. Create API module for credit card operations

   ```typescript
   // app/domains/credit-cards/api.ts
   import { ICreditCardStatement } from './types/interfaces';

   export const creditCardApi = {
     parseStatement: async (formData: FormData): Promise<ICreditCardStatement> => {
       const response = await fetch('/api/parse-credit-card', {
         method: 'POST',
         body: formData,
       });
       if (!response.ok) throw new Error('Failed to parse statement');
       return response.json();
     },

     getStatements: async (accountId: string): Promise<ICreditCardStatement[]> => {
       const response = await fetch(`/api/accounts/${accountId}/statements`);
       if (!response.ok) throw new Error('Failed to fetch statements');
       return response.json();
     },
   };
   ```

2. Implement error handling

   ```typescript
   // app/lib/api-error.ts
   export class ApiError extends Error {
     constructor(
       message: string,
       public status: number,
       public code?: string
     ) {
       super(message);
       this.name = 'ApiError';
     }
   }

   export function handleApiError(error: unknown): ApiError {
     if (error instanceof ApiError) return error;
     return new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
   }
   ```

3. Add type safety with interfaces

   ```typescript
   // app/domains/credit-cards/types/api.ts
   import { ICreditCardStatement } from './interfaces';

   export interface ParseStatementRequest {
     file: File;
   }

   export interface ParseStatementResponse {
     statement: ICreditCardStatement;
     success: boolean;
   }

   export interface GetStatementsResponse {
     statements: ICreditCardStatement[];
     totalCount: number;
   }
   ```
