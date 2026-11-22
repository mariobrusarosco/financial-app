import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CREDIT_CARD_INVOICES_QUERY_KEY } from '@/domains/credit-cards/api/keys';
import { creditCardApi } from '@/domains/credit-cards/api/credit-cards.api';
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

  const queryClient = useQueryClient();
  const [competenceMonth, setCompetenceMonth] = useState(
    (invoice?.competence_month ?? invoice?.raw_invoice.due_date ?? '').slice(0, 7)
  );
  const competenceMutation = useMutation({
    mutationFn: () =>
      creditCardApi.updateInvoiceCompetence(creditCardId, invoice!.id, `${competenceMonth}-01`),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: GET_CREDIT_CARD_INVOICES_QUERY_KEY(creditCardId),
      });
      void queryClient.invalidateQueries({ queryKey: ['cashflow-summary'] });
      void queryClient.invalidateQueries({ queryKey: ['credit-card-transactions'] });
    },
  });
  const [editableTransactions, setEditableTransactions] = useState<I_TransactionResponse[]>(
    invoice?.raw_invoice?.transactions?.map((transaction, index) => ({
      ...transaction, // Spread all fields from backend (includes movement_type, etc.)
      id: index.toString(),
      invoice_id: invoice.id,
      invoice_row: transaction.invoice_row ?? index + 1,
      competence_month: invoice.competence_month,
      tags: transaction.tags ?? [],
      tag_ids: transaction.tag_ids ?? [],
      created_at: invoice.created_at,
      updated_at: invoice.updated_at, // Override with index-based ID for UI editing
      account_id: null, // Credit card transactions don't have account_id
      broker_id: brokerId || '',
      credit_card_id: creditCardId,
      is_deleted: false,
      is_paid: false,
      ignored: false,
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

  const updateTransactionInEditionMode = (
    updates: Partial<I_TransactionResponse> & { id: string }
  ) => {
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

  const selectedNet =
    editableTransactions.reduce((total, transaction) => {
      if (ignoredTransactions.has(transaction.id)) return total;
      const cents = Math.round(Number(transaction.amount) * 100);
      return total + (transaction.movement_type === 'income' ? -cents : cents);
    }, 0) / 100;

  // Derived states
  const inSelectionMode = selectedTransactions.size > 0;
  const inEditionMode = transactionInEditMode !== null;

  return {
    selectedNet,
    competenceMonth,
    setCompetenceMonth,
    saveCompetence: competenceMutation.mutateAsync,
    isSavingCompetence: competenceMutation.isPending,
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
