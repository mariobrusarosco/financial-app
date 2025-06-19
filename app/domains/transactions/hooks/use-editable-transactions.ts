import { useState, useCallback } from 'react';
import { useImmer } from 'use-immer';
import type { I_Transaction } from '@/domains/transactions/types/types-and-interfaces';

export const useEditableTransactions = (initialTransactions: I_Transaction[] = []) => {
  const [transactions, updateTransactions] = useImmer<I_Transaction[]>(initialTransactions);
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  const editTransaction = useCallback(
    (id: string, updates: Partial<I_Transaction>) => {
      updateTransactions(draft => {
        const transaction = draft.find(t => t.id === id);
        if (transaction) {
          Object.assign(transaction, updates);
        }
      });
    },
    [updateTransactions]
  );

  const removeSelected = useCallback(() => {
    updateTransactions(draft => {
      return draft.filter(t => !selectedIds.has(t.id));
    });
    setSelectedIds(new Set());
  }, [updateTransactions, selectedIds]);

  const addTransaction = useCallback(
    (transaction: I_Transaction) => {
      updateTransactions(draft => {
        draft.push(transaction);
      });
    },
    [updateTransactions]
  );

  const removeTransaction = useCallback(
    (id: string) => {
      updateTransactions(draft => draft.filter(t => t.id !== id));
    },
    [updateTransactions]
  );

  return {
    transactions,
    selectedIds,
    setSelectedIds,
    editTransaction,
    removeSelected,
    addTransaction,
    removeTransaction,
  };
};
