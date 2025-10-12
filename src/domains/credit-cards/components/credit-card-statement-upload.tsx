import { useQuery } from '@tanstack/react-query';
import { CREDIT_CARD_KEYS } from '@/domains/credit-cards/hooks/use-parse-credit-card';
import type { I_CreditCardInvoiceResponse } from '@/domains/credit-cards/types/types-and-interfaces';
import { Surface } from '@/domains/global/components/surface';
import { InvoiceUploadProcess } from './invoice-upload-process';
import { InvoiceTransactionsRefinementProcess } from './invoice-transactions-refinement-process';

interface CreditCardStatementUploadProps {
  creditCardId: string;
}

export function CreditCardStatementUpload({ creditCardId }: CreditCardStatementUploadProps) {
  // Read invoice data from cache
  const { data: invoice } = useQuery<I_CreditCardInvoiceResponse>({
    queryKey: CREDIT_CARD_KEYS.uploadedInvoice(creditCardId),
    enabled: false,
  });

  console.log('💾 CreditCardStatementUpload - invoice from cache:', invoice);

  return (
    <Surface className="flex-1" data-ui="credit-card-statement-upload">
      <div className="space-y-4">
        <InvoiceUploadProcess creditCardId={creditCardId} />
        {invoice && <InvoiceTransactionsRefinementProcess invoice={invoice} />}
      </div>
    </Surface>
  );
}
