import { useState, useCallback } from 'react';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { I_ParsedAccountStatement } from '@/domains/accounts/api';
import type { I_Account } from '@/domains/accounts/types/types-and-interfaces';

export const useEditableTransactions = ({
  statement,
  account,
}: {
  statement: I_ParsedAccountStatement | undefined;
  account: I_Account | undefined;
}) => {
  const [editableTransactions, setEditableTransactions] = useState<I_TransactionResponse[]>(
    statement?.raw_statement.transactions?.map((transaction, index) => ({
      id: index.toString(),
      account_id: statement.account_id,
      broker_id: account?.broker.id || '',
      credit_card_id: undefined,
      is_deleted: false,
      is_paid: false,
      ignored: false,
      date: transaction.date,
      amount: transaction.amount,
      description: transaction.description,
      movement_type: transaction.movement_type,
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
