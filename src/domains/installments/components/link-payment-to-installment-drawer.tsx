import { useState } from 'react';
import { useAllTransactions } from '@/domains/transactions/hooks/use-all-transactions';
import { useLinkInstallmentTransaction, useInstallmentPlan } from '../hooks/use-installments';
import { UnifiedTransactionItem } from '@/domains/transactions/components/transaction/unified-transaction-item';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { DrawerFooter } from '@/domains/ui-system/components/drawer';
import { Loader2, Search, Link as LinkIcon, X, Check, ArrowLeft } from 'lucide-react';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { cn } from '@/domains/ui-system/utils';
import { getStatusStyle } from '../utils/get-status-style';
import { useRouter } from '@tanstack/react-router';
import { Route } from '@/routes/(auth)/route';

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

export const LinkPaymentToInstallmentDrawer = () => {
  const router = useRouter();
  const { planId, installmentId } = Route.useSearch();

  const { data: plan, isLoading: isPlanLoading, isError: isPlanError } = useInstallmentPlan(planId);
  const installment = plan?.installments.find(i => i.id === installmentId);

  const [searchTerm, setSearchTerm] = useState(plan?.name || '');
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const {
    data,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useAllTransactions({
    description_contains: debouncedSearchTerm || undefined,
    is_paid: false,
    sort_by: 'date',
    sort_order: 'desc',
    per_page: 20,
  });

  const { mutate: linkTransaction, isPending: isLinking } = useLinkInstallmentTransaction();

  const handleClose = router.history.back;

  const handleConfirm = () => {
    if (!selectedTransactionId || !installment) return;

    linkTransaction(
      {
        installmentId: installment.id,
        transactionId: selectedTransactionId,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (isPlanLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isPlanError || !plan || !installment) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <p>Failed to load installment details.</p>
        <Button variant="outline" onClick={handleClose} className="mt-4">
          Back to Plan
        </Button>
      </div>
    );
  }

  const transactions = data?.data || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        <Button variant="ghost" size="sm" onClick={handleClose} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
      </div>

      <div className="px-6 pb-0">
        <DrawerHeader title={`Link Payment to ${plan.name}`} icon={LinkIcon} />
      </div>

      <div className="px-6 py-2">
        <p className="text-muted-foreground text-sm mb-2">
          Select a transaction to link to installment <strong>#{installment.number}</strong>
        </p>

        <div className="flex gap-2 text-sm border-b pb-4">
          <p className="text-muted-foreground bg-primary/10 rounded-lg p-2">
            Amount: <span className="font-semibold">{installment.amount}</span>
          </p>
          <p className="text-muted-foreground bg-primary/10 rounded-lg p-2">
            Due Date: <span className="font-semibold"> {installment.due_date}</span>
          </p>
          <p
            className={cn(
              'text-muted-foreground bg-primary/10 rounded-lg p-2',
              getStatusStyle(installment.status)
            )}
          >
            Status: <span className="font-semibold"> {installment.status}</span>
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col pt-0">
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
            isLoading={isTransactionsLoading}
            isError={isTransactionsError}
            transactions={transactions}
            searchTerm={debouncedSearchTerm}
            selectedTransactionId={selectedTransactionId}
            onSelect={setSelectedTransactionId}
          />
        </div>
      </div>

      <DrawerFooter className="border-t flex-row gap-2">
        <Button variant="outline" className="flex-1" onClick={handleClose}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
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
