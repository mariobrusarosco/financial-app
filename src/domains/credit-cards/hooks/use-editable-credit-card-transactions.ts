import { useState, useCallback } from 'react';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import type { I_CreditCardInvoiceResponse } from '@/domains/credit-cards/types/types-and-interfaces';

export const useEditableCreditCardTransactions = ({
  invoice,
  creditCardId,
  brokerId,
}: {
  invoice: I_CreditCardInvoiceResponse | undefined;
  creditCardId: string;
  brokerId?: string;
}) => {
  console.log('💾 useEditableCreditCardTransactions - invoice:', invoice);
  console.log(
    '💾 useEditableCreditCardTransactions - raw transactions:',
    invoice?.raw_invoice?.transactions
  );

  const [editableTransactions, setEditableTransactions] = useState<I_TransactionResponse[]>(
    invoice?.raw_invoice?.transactions?.map((transaction, index) => ({
      ...transaction, // Spread all fields from backend (includes movement_type, category_id, etc.)
      id: index.toString(), // Override with index-based ID for UI editing
      account_id: null, // Credit card transactions don't have account_id
      broker_id: brokerId || '',
      credit_card_id: creditCardId,
      is_deleted: false,
      is_paid: false,
      ignored: false,
      category: transaction.category || 'Credit Card', // Fallback if backend didn't set it
    })) || []
  );

  const [selectedTransactions, setSelectedTransactions] = useState(new Set<string>());
  const [ignoredTransactions, setIgnoredTransactions] = useState(new Set<string>());
  const [transactionInEditMode, setTransactionInEditMode] = useState<I_TransactionResponse | null>(
    null
  );

  const triggerEditMode = (transaction: I_TransactionResponse) => {
    setTransactionInEditMode(transaction);
  };

  const updateTransactionInEditionMode = (updates: Partial<I_TransactionResponse> & { id: string }) => {
    setEditableTransactions(transactions => {
      return transactions.map(transaction =>
        transaction.id === updates.id ? { ...transaction, ...updates } : transaction
      );
    });
    setTransactionInEditMode(null);
  };

  const ignoreTransaction = useCallback((id: string) => {
    setIgnoredTransactions(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const toggleTransaction = useCallback((id: string) => {
    setTransactionInEditMode(null);
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const resetRefinement = useCallback(() => {
    setIgnoredTransactions(new Set());
    setSelectedTransactions(new Set());
  }, []);

  // Derived states
  const inSelectionMode = selectedTransactions.size > 0;
  const inEditionMode = transactionInEditMode !== null;

  return {
    ignoredTransactions,
    toggleTransaction,
    editableTransactions,
    selectedTransactions,
    setSelectedTransactions,
    updateTransactionInEditionMode,
    transactionInEditMode,
    setTransactionInEditMode,
    ignoreTransaction,
    resetRefinement,
    triggerEditMode,
    inSelectionMode,
    inEditionMode,
  };
};
