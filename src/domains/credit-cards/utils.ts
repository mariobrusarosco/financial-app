import {
  I_CreditCardInvoiceRequest,
  I_CreditCardRawInvoice,
} from '@/domains/credit-cards/types/types-and-interfaces';

export const parseCreditCardInvoiceRequest = ({
  invoice,
  creditCardId,
  brokerId,
}: {
  invoice: I_CreditCardRawInvoice;
  creditCardId: string;
  brokerId: string;
}) => {
  return {
    credit_card_id: creditCardId,
    broker_id: brokerId,
    raw_invoice: invoice,
  } as I_CreditCardInvoiceRequest;
};
