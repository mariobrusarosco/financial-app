import { useState } from 'react';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { TransactionRow } from '@/domains/transactions/components/transaction/transaction-row';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import {
  DrawerLayout,
  DrawerLayoutBody,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { ArrowLeft, Check, Link as LinkIcon, Loader2, Search } from 'lucide-react';
import { useLinkPayment } from '@/domains/subscriptions/hooks/index';
import type { I_Subscription } from '@/domains/subscriptions/types/types-and-interfaces';
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
    No paid transactions found matching &quot;{searchTerm}&quot;.
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
          <ul>
            <TransactionRow transaction={transaction} variant="picker" />
          </ul>
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
    <DrawerLayout data-ui="subscription-link-payment">
      <DrawerLayoutHeader
        icon={LinkIcon}
        title="Link a payment"
        description={`Select the transaction that paid ${subscription.name}`}
      />

      <div className="shrink-0 border-b border-border px-5 py-4 md:px-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions…"
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search transactions"
          />
        </div>
      </div>

      <DrawerLayoutBody className="space-y-2">
        <TransactionListContent
          isLoading={isLoading}
          isError={isError}
          transactions={transactions}
          searchTerm={debouncedSearchTerm}
          selectedTransactionId={selectedTransactionId}
          onSelect={setSelectedTransactionId}
        />
      </DrawerLayoutBody>

      <DrawerLayoutFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
          Back to subscription
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedTransactionId || isLinking}>
          {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isLinking ? 'Linking…' : 'Confirm link'}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};
