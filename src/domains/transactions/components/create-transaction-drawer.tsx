import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@ui-system/components/button';
import { DrawerHeader } from '@/domains/global/components/drawer-header';
import { Badge } from '@ui-system/components/badge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { TransactionForm } from './transaction-form';
import type { I_TransactionPayload } from '../types/types-and-interfaces';
import { useCreateBulkTransactions } from '../hooks/use-create-bulk-transactions';
import { findCategoryById } from '../utils/categories';

export const CreateTransactionDrawer = () => {
  const navigate = useNavigate();
  const [pendingTransactions, setPendingTransactions] = useState<I_TransactionPayload[]>([]);
  const { mutate: createBulkTransactions, isPending: isSaving } = useCreateBulkTransactions();

  const handleClose = () => {
    navigate({ search: {} });
  };

  const handleAddTransaction = (transaction: I_TransactionPayload) => {
    setPendingTransactions(prev => [...prev, transaction]);
  };

  const handleRemoveTransaction = (index: number) => {
    setPendingTransactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAllTransactions = () => {
    if (pendingTransactions.length > 0) {
      createBulkTransactions(pendingTransactions as any, {
        onSuccess: () => {
          setPendingTransactions([]);
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Create Transactions"
          icon={Plus}
        />
        {pendingTransactions.length > 0 && (
          <Badge variant="secondary">{pendingTransactions.length} pending</Badge>
        )}
        <div className="flex gap-2">
          <Button size="lg" form="transaction-form">
            Add Transaction
          </Button>
          {pendingTransactions.length > 0 && (
            <Button
              size="lg"
              onClick={handleSaveAllTransactions}
              variant="default"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : `Save All (${pendingTransactions.length})`}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6 h-full">
          {/* Column 1 & 2: Form Content */}
          <div className="col-span-2">
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>

          <div className="border-l pl-6">
            <h3 className="text-lg font-semibold mb-4">Pending Transactions</h3>
            {pendingTransactions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No transactions added yet</p>
            ) : (
              <div className="space-y-3">
                {pendingTransactions.map((transaction, index) => {
                  const category = findCategoryById(transaction.category_id || '');
                  return (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm truncate">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            ${transaction.amount?.toFixed(2)} • {transaction.movement_type}
                          </p>
                          {category && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>{category.icon}</span>
                              {category.name}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {typeof transaction.date === 'string'
                              ? transaction.date
                              : new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveTransaction(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

