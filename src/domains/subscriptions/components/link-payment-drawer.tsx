import { useState } from 'react';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { useLinkPayment } from '../hooks';
import { UnifiedTransactionItem } from '@/domains/transactions/components/transaction/unified-transaction-item';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { DrawerFooter, DrawerClose } from '@/domains/ui-system/components/drawer';
import { Loader2, Search, Link as LinkIcon, X, Check } from 'lucide-react';
import { useDebouncedValue } from '@tanstack/react-pacer';
import type { I_Subscription } from '../types/types-and-interfaces';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';

interface LinkPaymentDrawerProps {
  subscription: I_Subscription;
  onClose: () => void;
}

interface TransactionListContentProps {
  isLoading: boolean;
  isError: boolean;
  transactions: I_TransactionResponse[];
  searchTerm: string;
  selectedTransactionId: string | null;
  onSelect: (id: string) => void;
}

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const ErrorState = () => (
  <div className="text-center py-12 text-destructive">Failed to load transactions.</div>
);

const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
  <div className="text-center py-12 text-muted-foreground">
    No paid transactions found matching "{searchTerm}".
  </div>
);

const TransactionListContent = ({
  isLoading,
  isError,
  transactions,
  searchTerm,
  selectedTransactionId,
  onSelect,
}: TransactionListContentProps) => {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (transactions.length === 0) return <EmptyState searchTerm={searchTerm} />;

  return (
    <>
      {transactions.map((transaction: I_TransactionResponse) => (
        <div
          key={transaction.id}
          onClick={() => onSelect(transaction.id)}
          className={`relative cursor-pointer transition-all ${
            selectedTransactionId === transaction.id
              ? 'ring-2 ring-primary ring-inset rounded-lg'
              : ''
          }`}
        >
          <UnifiedTransactionItem transaction={transaction} mode="compact" />
          {selectedTransactionId === transaction.id && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export const LinkPaymentDrawer = ({ subscription, onClose }: LinkPaymentDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState(subscription.name);
  // Destructure because useDebouncedValue returns [debouncedValue, debouncer]
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAllTransactions({
    description_contains: debouncedSearchTerm || undefined,
    is_paid: false,
    sort_by: 'date',
    sort_order: 'desc',
    per_page: 20,
  });

  const { mutate: linkPayment, isPending: isLinking } = useLinkPayment();

  const handleConfirm = () => {
    if (!selectedTransactionId) return;

    linkPayment(
      {
        subscriptionId: subscription.id,
        transactionId: selectedTransactionId,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const transactions = data?.data || [];

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader
        title="Link Payment"
        description={`Select a transaction to link to ${subscription.name}`}
        icon={LinkIcon}
      />

      <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          <TransactionListContent
            isLoading={isLoading}
            isError={isError}
            transactions={transactions}
            searchTerm={debouncedSearchTerm}
            selectedTransactionId={selectedTransactionId}
            onSelect={setSelectedTransactionId}
          />
        </div>
      </div>

      <DrawerFooter className="border-t flex-row gap-2">
        <DrawerClose asChild>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </DrawerClose>
        <Button
          onClick={handleConfirm}
          disabled={!selectedTransactionId || isLinking}
          className="flex-1"
        >
          {isLinking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Linking...
            </>
          ) : (
            'Confirm Link'
          )}
        </Button>
      </DrawerFooter>
    </div>
  );
};