import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@ui-system/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';
import { Badge } from '@/domains/ui-system/components/badge';
import { Trash2, TrendingUp } from 'lucide-react';
import CreateInvestmentMovement from './create-investment-movement';
import CreateInvestmentBalance from './create-investment-balance';
import { useCreateInvestmentMovement, useCreateInvestmentBalance } from '../hooks/use-investments';
import type {
  I_CreateInvestmentMovementRequest,
  I_CreateInvestmentBalanceRequest,
} from '../types/types-and-interfaces';
import { DrawerHeader } from '@/domains/global/components/drawer-header';

export const CreateInvestmentDataDrawer = () => {
  const navigate = useNavigate();
  const [pendingMovements, setPendingMovements] = useState<I_CreateInvestmentMovementRequest[]>([]);
  const [pendingBalances, setPendingBalances] = useState<I_CreateInvestmentBalanceRequest[]>([]);

  const { mutate: createMovement, isPending: isSavingMovements } = useCreateInvestmentMovement();
  const { mutate: createBalance, isPending: isSavingBalances } = useCreateInvestmentBalance();

  const handleClose = () => {
    navigate({ search: {} });
  };

  const handleAddMovement = (movement: I_CreateInvestmentMovementRequest) => {
    setPendingMovements(prev => [...prev, movement]);
  };

  const handleAddBalance = (balance: I_CreateInvestmentBalanceRequest) => {
    setPendingBalances(prev => [...prev, balance]);
  };

  const handleRemoveMovement = (index: number) => {
    setPendingMovements(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveBalance = (index: number) => {
    setPendingBalances(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAllMovements = () => {
    pendingMovements.forEach(movement => {
      createMovement(movement);
    });
    setPendingMovements([]);
  };

  const handleSaveAllBalances = () => {
    pendingBalances.forEach(balance => {
      createBalance(balance);
    });
    setPendingBalances([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex justify-between items-center">
        <DrawerHeader
          title="Add Investment Data"
          icon={TrendingUp}
        />
        {(pendingMovements.length > 0 || pendingBalances.length > 0) && (
            <Badge variant="secondary">
              {pendingMovements.length + pendingBalances.length} pending
            </Badge>
          )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="movements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="movements">
              Movements {pendingMovements.length > 0 && `(${pendingMovements.length})`}
            </TabsTrigger>
            <TabsTrigger value="balances">
              Balances {pendingBalances.length > 0 && `(${pendingBalances.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movements" className="space-y-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Form */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add Movement</h3>
                  <Button size="lg" form="investment-movement-create-form">
                    Add Movement
                  </Button>
                </div>
                <CreateInvestmentMovement onAddMovement={handleAddMovement} />
              </div>

              {/* Pending List */}
              <div className="border-l pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Pending Movements</h3>
                  {pendingMovements.length > 0 && (
                    <Button size="sm" onClick={handleSaveAllMovements} disabled={isSavingMovements}>
                      {isSavingMovements ? 'Saving...' : `Save All (${pendingMovements.length})`}
                    </Button>
                  )}
                </div>

                {pendingMovements.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No movements added yet</p>
                ) : (
                  <div className="space-y-3">
                    {pendingMovements.map((movement, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {movement.movement_type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(movement.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">{movement.date}</p>
                            {movement.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {movement.description}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMovement(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="balances" className="space-y-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Form */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add Balance</h3>
                  <Button size="lg" form="investment-balance-create-form">
                    Add Balance
                  </Button>
                </div>
                <CreateInvestmentBalance onAddBalance={handleAddBalance} />
              </div>

              {/* Pending List */}
              <div className="border-l pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Pending Balances</h3>
                  {pendingBalances.length > 0 && (
                    <Button size="sm" onClick={handleSaveAllBalances} disabled={isSavingBalances}>
                      {isSavingBalances ? 'Saving...' : `Save All (${pendingBalances.length})`}
                    </Button>
                  )}
                </div>

                {pendingBalances.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No balances added yet</p>
                ) : (
                  <div className="space-y-3">
                    {pendingBalances.map((balance, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">Balance Entry</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(balance.balance)}
                            </p>
                            <p className="text-xs text-muted-foreground">{balance.date}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveBalance(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
