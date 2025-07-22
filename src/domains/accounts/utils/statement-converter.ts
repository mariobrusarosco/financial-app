import type { I_Transaction } from '@/domains/transactions/types/types-and-interfaces';
import type { I_AccountStatementTransaction } from '@/domains/accounts/api';

/**
 * Converts account statement transactions from parsed statement to editable transaction format
 */
export const convertAccountStatementTransactionsToEditableFormat = (
  statementTransactions: I_AccountStatementTransaction[],
  accountId: string,
  brokerId: string
): I_Transaction[] => {
  return statementTransactions.map((transaction, index) => ({
    id: transaction.id || `acc-stmt-${Date.now()}-${index}`,
    account_id: accountId,
    broker_id: brokerId,
    is_deleted: false,
    is_paid: true, // Account statement transactions are typically already processed
    date: transaction.date,
    amount: transaction.amount.toString(),
    description: transaction.description,
  }));
};

/**
 * Converts editable transactions back to account statement transaction format for saving
 */
export const convertEditableTransactionsToAccountStatementFormat = (
  editableTransactions: I_Transaction[]
): I_AccountStatementTransaction[] => {
  return editableTransactions.map(transaction => ({
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    type: 'debit', // Default to debit for now
    category: 'General', // Default category
  }));
};
