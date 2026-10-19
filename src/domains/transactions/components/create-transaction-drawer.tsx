import { useNavigate, useParams } from '@tanstack/react-router';
import type * as React from 'react';
import { useRef, useState } from 'react';
import { ArrowRightLeft, Check, ListPlus, Loader2, X } from 'lucide-react';
import { useAccounts } from '@/domains/accounts/hooks/use-accounts';
import type { I_Account } from '@/domains/accounts/types/types-and-interfaces';
import { useCreditCards } from '@/domains/credit-cards/hooks/use-credit-cards';
import { PendingTransactionsPanel } from '@/domains/transactions/components/pending-transactions-panel';
import { TransactionForm } from '@/domains/transactions/components/transaction-form';
import { useCreateBulkTransactions } from '@/domains/transactions/hooks/use-create-bulk-transactions';
import type { I_CreateTransactionForm } from '@/domains/transactions/types/types-and-interfaces';
import { Button } from '@/domains/ui-system/components/button';
import { DrawerDescription, DrawerTitle } from '@/domains/ui-system/components/drawer';
import { Skeleton } from '@/domains/ui-system/components/skeleton';

type T_FormSeed = Partial<I_CreateTransactionForm>;
type T_Destination = Pick<I_CreateTransactionForm, 'account_id' | 'credit_card_id'>;
type T_CreditCardOption = NonNullable<ReturnType<typeof useCreditCards>['data']>['data'][number];

const LAST_DESTINATION_KEY = 'transaction-last-destination';

export const CreateTransactionDrawer = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const {
    accounts: { query: accountsQuery },
  } = useAccounts();
  const { data: creditCardsData, isPending: isCreditCardsPending } = useCreditCards(undefined);
  const { mutate: createBulkTransactions, isPending: isSaving } = useCreateBulkTransactions();

  const [pendingTransactions, setPendingTransactions] = useState<I_CreateTransactionForm[]>([]);
  // The form may hold on to the submit handler from when it mounted, so read the list via a ref
  const pendingTransactionsRef = useRef(pendingTransactions);
  pendingTransactionsRef.current = pendingTransactions;
  const [isFormDirty, setIsFormDirty] = useState(false);
  // An entry pulled back from the list matches its own defaults, so it isn't "dirty" but must not be lost
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  // A new key remounts (clears) the form; the seed carries fields worth keeping between entries
  const [formKey, setFormKey] = useState(0);
  const [formSeed, setFormSeed] = useState<T_FormSeed | null>(null);
  // Which footer action submitted the form: add it to the list, or save everything now
  const submitIntentRef = useRef<'add' | 'save'>('add');

  const accounts = accountsQuery.data?.accounts ?? [];
  const creditCards = creditCardsData?.data ?? [];
  const isReady = !accountsQuery.isPending && !isCreditCardsPending;
  const routeDestination = {
    accountId: 'slug' in params && typeof params.slug === 'string' ? params.slug : undefined,
    creditCardId:
      'creditCardId' in params && typeof params.creditCardId === 'string'
        ? params.creditCardId
        : undefined,
  };
  const seed = formSeed ?? getDefaultDestination(routeDestination, accounts, creditCards);
  const hasFormEntry = isFormDirty || isEditingEntry;
  const saveCount = pendingTransactions.length + (hasFormEntry ? 1 : 0);

  const handleClose = () => {
    void navigate({
      to: '.',
      search: prev => ({ ...prev, drawer: undefined }),
    });
  };

  const resetForm = (nextSeed: T_FormSeed, { isEditing = false } = {}) => {
    setFormSeed(nextSeed);
    setFormKey(key => key + 1);
    setIsFormDirty(false);
    setIsEditingEntry(isEditing);
  };

  const saveTransactions = (transactions: I_CreateTransactionForm[]) => {
    createBulkTransactions(transactions, { onSuccess: handleClose });
  };

  const handleFormSubmit = (transaction: I_CreateTransactionForm) => {
    rememberDestination(transaction);

    if (submitIntentRef.current === 'save') {
      saveTransactions([...pendingTransactionsRef.current, transaction]);
    } else {
      setPendingTransactions(prev => [...prev, transaction]);
      resetForm(getCarryOverSeed(transaction));
    }
    submitIntentRef.current = 'add';
  };

  const handleSave = () => {
    if (isSaving) return;

    if (hasFormEntry) {
      // Submitting validates the current entry first; it's saved together with the list
      submitIntentRef.current = 'save';
      (document.getElementById('transaction-form') as HTMLFormElement | null)?.requestSubmit();
      return;
    }

    if (pendingTransactions.length > 0) {
      saveTransactions(pendingTransactions);
    }
  };

  const handleEditPending = (index: number) => {
    const transaction = pendingTransactions[index];
    setPendingTransactions(prev => prev.filter((_, i) => i !== index));
    resetForm(transaction, { isEditing: true });
  };

  const handleRemovePending = (index: number) => {
    setPendingTransactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }
  };

  const getDestinationName = (transaction: I_CreateTransactionForm) =>
    transaction.credit_card_id
      ? creditCards.find(card => card.id === transaction.credit_card_id)?.name
      : accounts.find(account => account.id === transaction.account_id)?.name;

  return (
    <div
      data-ui="create-transaction-drawer"
      className="flex min-h-0 flex-1 flex-col"
      onKeyDown={handleKeyDown}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-8 md:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pastel-blue text-brand">
            <ArrowRightLeft className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <DrawerTitle className="text-lg font-semibold text-foreground">
              New transactions
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground">
              Add one or several, then save them together.
            </DrawerDescription>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Close"
          className="h-9 w-9 shrink-0 text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden">
        <div className="px-5 py-6 md:overflow-y-auto md:px-8">
          {isReady ? (
            <TransactionForm
              key={formKey}
              initialValues={seed}
              onSubmit={handleFormSubmit}
              onDirtyChange={setIsFormDirty}
              autoFocus
            />
          ) : (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-2/3 rounded-xl" />
            </div>
          )}
        </div>

        <PendingTransactionsPanel
          transactions={pendingTransactions}
          getDestinationName={getDestinationName}
          onEdit={handleEditPending}
          onRemove={handleRemovePending}
          canEdit={!hasFormEntry}
        />
      </div>

      <footer className="flex flex-col gap-3 border-t border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="hidden text-xs text-muted-foreground sm:block">
          <Kbd>Enter</Kbd> adds to the list · <Kbd>⌘/Ctrl</Kbd> + <Kbd>Enter</Kbd> saves
        </p>
        <div className="flex gap-2 sm:justify-end">
          {/* First submit button for the form, so pressing Enter in a field adds to the list */}
          <Button
            type="submit"
            form="transaction-form"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => {
              submitIntentRef.current = 'add';
            }}
            disabled={!isReady || isSaving}
          >
            <ListPlus className="h-4 w-4" />
            Add to list
          </Button>
          <Button
            type="button"
            className="flex-1 sm:flex-none"
            onClick={handleSave}
            disabled={saveCount === 0 || isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isSaving
              ? 'Saving…'
              : saveCount === 0
                ? 'Save'
                : `Save ${saveCount} ${saveCount === 1 ? 'transaction' : 'transactions'}`}
          </Button>
        </div>
      </footer>
    </div>
  );
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans text-[0.7rem] font-medium text-foreground">
    {children}
  </kbd>
);

/** Keep what usually repeats in a batch (date, type, destination, tags); clear the rest */
const getCarryOverSeed = (transaction: I_CreateTransactionForm): T_FormSeed => ({
  date: transaction.date,
  movement_type: transaction.movement_type,
  account_id: transaction.account_id,
  credit_card_id: transaction.credit_card_id,
  tag_ids: transaction.tag_ids,
  is_paid: transaction.is_paid,
});

/**
 * Preselect where the money goes: the card or account page the drawer was opened from,
 * then the last destination used, then the first account.
 */
const getDefaultDestination = (
  route: { accountId?: string; creditCardId?: string },
  accounts: I_Account[],
  creditCards: T_CreditCardOption[]
): T_Destination => {
  if (route.creditCardId && creditCards.some(card => card.id === route.creditCardId)) {
    return { credit_card_id: route.creditCardId };
  }
  if (route.accountId && accounts.some(account => account.id === route.accountId)) {
    return { account_id: route.accountId };
  }

  const last = readLastDestination();
  if (last?.credit_card_id && creditCards.some(card => card.id === last.credit_card_id)) {
    return { credit_card_id: last.credit_card_id };
  }
  if (last?.account_id && accounts.some(account => account.id === last.account_id)) {
    return { account_id: last.account_id };
  }

  return accounts[0] ? { account_id: accounts[0].id } : {};
};

const readLastDestination = (): T_Destination | null => {
  try {
    const stored = localStorage.getItem(LAST_DESTINATION_KEY);
    return stored ? (JSON.parse(stored) as T_Destination) : null;
  } catch {
    // In case localStorage is disabled or the value is malformed
    return null;
  }
};

const rememberDestination = ({ account_id, credit_card_id }: I_CreateTransactionForm) => {
  try {
    localStorage.setItem(LAST_DESTINATION_KEY, JSON.stringify({ account_id, credit_card_id }));
  } catch {
    // Ignore localStorage errors
  }
};
