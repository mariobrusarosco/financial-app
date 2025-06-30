import { I_CreditCardTransaction } from '@/domains/credit-cards/types/types-and-interfaces';

interface Props {
  transaction: I_CreditCardTransaction;
}

export const CreditCardTransaction = ({ transaction }: Props) => {
  return (
    <div data-ui="credit-card-transaction" className="flex flex-col gap-2">
      <div>{transaction.date}</div>
      <div>{transaction.description}</div>
      <div>{transaction.amount}</div>
    </div>
  );
};
