import { useState } from 'react';
import { useEditableTransactions } from '@/domains/transactions/hooks/use-editable-transactions';
import type { I_Transaction } from '@/domains/transactions/types/types-and-interfaces';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/domains/ui-system/components/table';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { Card } from '@/domains/ui-system/components/card';
import { Badge } from '@/domains/ui-system/components/badge';
import { Edit, Trash2, Save, X } from 'lucide-react';

interface EditableTransactionsTableProps {
  initialTransactions: I_Transaction[];
  onSave?: (transactions: I_Transaction[]) => Promise<void>;
}

export const EditableTransactionsTable = ({
  initialTransactions,
  onSave: _onSave,
}: EditableTransactionsTableProps) => {
  const {
    editableTransactions,
    selectedTransactions,
    setSelectedTransactions,
    editTransaction,
    removeSelected,
    removeTransaction,
  } = useEditableTransactions(initialTransactions);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<I_Transaction>>({});

  // Start editing a transaction
  const startEdit = (transaction: I_Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save edit
  const saveEdit = () => {
    if (editingId && editForm) {
      editTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Editable Transactions</h2>
          {selectedTransactions.size > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {selectedTransactions.size} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedTransactions.size > 0 && (
            <Button variant="outline" size="sm" onClick={removeSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Selected
            </Button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  checked={selectedTransactions.size === transactions.length && transactions.length > 0}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedTransactions(new Set(transactions.map(t => t.id)));
                    } else {
                      setSelectedTransactions(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedTransactions.has(transaction.id)}
                    onChange={e => {
                      const newSelected = new Set(selectedTransactions);
                      if (e.target.checked) {
                        newSelected.add(transaction.id);
                      } else {
                        newSelected.delete(transaction.id);
                      }
                      setSelectedTransactions(newSelected);
                    }}
                  />
                </TableCell>
                {editingId === transaction.id ? (
                  // Edit mode
                  <>
                    <TableCell>
                      <Input
                        type="date"
                        value={editForm.date || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm.description || ''}
                        onChange={e =>
                          setEditForm(prev => ({ ...prev, description: e.target.value }))
                        }
                        className="w-full"
                        placeholder="Transaction description"
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        value={editForm.is_paid ? 'true' : 'false'}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            is_paid: e.target.value === 'true',
                          }))
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="true">Paid</option>
                        <option value="false">Unpaid</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.amount || ''}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        className="w-full text-right"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEdit} variant="outline">
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={cancelEdit} variant="outline">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  // View mode with improved formatting
                  <>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.is_paid ? 'default' : 'destructive'}
                        className={
                          transaction.is_paid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {transaction.is_paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold tabular-nums text-gray-900">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(transaction)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
