import { useState, useCallback } from 'react';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { I_ParsedAccountStatement } from '@/domains/accounts/api';

export const useEditableTransactions = ({
  statement,
}: {
  statement: I_ParsedAccountStatement | undefined;
}) => {
  const [editableTransactions, setEditableTransactions] = useState<I_TransactionResponse[]>(
    statement?.raw_statement.transactions?.map((transaction, index) => ({
      id: `temp-${index}`,
      account_id: statement.account_id,
      broker_id: '',
      credit_card_id: undefined,
      is_deleted: false,
      is_paid: false,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description,
      movement_type: transaction.amount.includes('+') ? 'income' : ('expense' as const),
      category: transaction.category || 'General',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  const updateTransactionInEditionMode = (updatedTransaction: I_TransactionResponse) => {
    setEditableTransactions(transactions => {
      return transactions.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
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

  const toogleTransaction = useCallback((id: string) => {
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

  // Derivated states
  const inSelectionMode = selectedTransactions.size > 0;
  const inEditionMode = transactionInEditMode !== null;

  return {
    ignoredTransactions,
    toogleTransaction,
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
