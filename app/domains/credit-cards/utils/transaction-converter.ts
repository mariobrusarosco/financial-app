import type { I_Transaction } from '@/domains/transactions/types/types-and-interfaces';
import type { I_CreditCardTransaction } from '@/domains/credit-cards/types/types-and-interfaces';

/**
 * Converts credit card transactions from parsed statement to editable transaction format
 */
export const convertCreditCardTransactionsToEditableFormat = (
  creditCardTransactions: I_CreditCardTransaction[],
  accountId: string,
  brokerId = 'broker-001'
): I_Transaction[] => {
  return creditCardTransactions.map((transaction, index) => ({
    id: `cc-txn-${Date.now()}-${index}`, // Generate unique ID
    account_id: accountId,
    broker_id: brokerId,
    is_deleted: false,
    is_paid: true, // Credit card transactions are typically already processed
    date: transaction.date,
    amount: transaction.amount.toString(),
    description: transaction.description,
  }));
};

/**
 * Converts editable transactions back to credit card transaction format for saving
 */
export const convertEditableTransactionsToCreditCardFormat = (
  editableTransactions: I_Transaction[]
): I_CreditCardTransaction[] => {
  return editableTransactions.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    category: 'General', // Default category since our current interface doesn't have category
  }));
};
