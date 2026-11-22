import { useState } from 'react';
import { Check, ListPlus, Loader2, TrendingUp, X } from 'lucide-react';
import { formatDateMedium } from '@/domains/global/utils/formatting';
import {
  DrawerLayout,
  DrawerLayoutAside,
  DrawerLayoutBody,
  DrawerLayoutFooter,
  DrawerLayoutHeader,
} from '@/domains/global/components/drawer-layout';
import { Button } from '@ui-system/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/ui-system/components/tabs';
import { cn } from '@/domains/ui-system/utils';
import CreateInvestmentMovement from './create-investment-movement';
import CreateInvestmentBalance from './create-investment-balance';
import { useCreateInvestmentMovement, useCreateInvestmentBalance } from '../hooks/use-investments';
import type {
  I_CreateInvestmentMovementRequest,
  I_CreateInvestmentBalanceRequest,
} from '../types/types-and-interfaces';

type T_DataTab = 'movements' | 'balances';

export const CreateInvestmentDataDrawer = () => {
  const [activeTab, setActiveTab] = useState<T_DataTab>('movements');
  const [pendingMovements, setPendingMovements] = useState<I_CreateInvestmentMovementRequest[]>([]);
  const [pendingBalances, setPendingBalances] = useState<I_CreateInvestmentBalanceRequest[]>([]);

  const { mutate: createMovement, isPending: isSavingMovements } = useCreateInvestmentMovement();
  const { mutate: createBalance, isPending: isSavingBalances } = useCreateInvestmentBalance();

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

  const isMovementsTab = activeTab === 'movements';
  const pendingCount = isMovementsTab ? pendingMovements.length : pendingBalances.length;
  const isSaving = isMovementsTab ? isSavingMovements : isSavingBalances;
  const itemLabel = isMovementsTab ? 'movement' : 'balance';

  return (
    <DrawerLayout data-ui="create-investment-data-drawer">
      <DrawerLayoutHeader
        icon={TrendingUp}
        title="Add investment data"
        description="Record deposits and withdrawals, or the balance on a given date."
      />

      <DrawerLayoutBody
        aside={
          <DrawerLayoutAside aria-label={`Pending ${itemLabel}s`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">To be saved</h3>
              {pendingCount > 0 && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                  {pendingCount}
                </span>
              )}
            </div>

            {pendingCount === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-4 py-8 text-center">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-muted-foreground ring-1 ring-border">
                  <ListPlus className="h-5 w-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Add several {itemLabel}s, then save them all at once.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {isMovementsTab
                  ? pendingMovements.map((movement, index) => (
                      <PendingRow
                        key={index}
                        title={movement.movement_type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        details={[formatDateMedium(movement.date), movement.description]
                          .filter(Boolean)
                          .join(' · ')}
                        amount={movement.amount}
                        sign={movement.movement_type === 'deposit' ? '+' : '−'}
                        amountClassName={
                          movement.movement_type === 'deposit' ? 'text-positive' : 'text-foreground'
                        }
                        onRemove={() => handleRemoveMovement(index)}
                      />
                    ))
                  : pendingBalances.map((balance, index) => (
                      <PendingRow
                        key={index}
                        title="Balance"
                        details={formatDateMedium(balance.date)}
                        amount={balance.balance}
                        onRemove={() => handleRemoveBalance(index)}
                      />
                    ))}
              </ul>
            )}
          </DrawerLayoutAside>
        }
      >
        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as T_DataTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="movements">
              Movements {pendingMovements.length > 0 && `(${pendingMovements.length})`}
            </TabsTrigger>
            <TabsTrigger value="balances">
              Balances {pendingBalances.length > 0 && `(${pendingBalances.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movements">
            <CreateInvestmentMovement onAddMovement={handleAddMovement} />
          </TabsContent>
          <TabsContent value="balances">
            <CreateInvestmentBalance onAddBalance={handleAddBalance} />
          </TabsContent>
        </Tabs>
      </DrawerLayoutBody>

      <DrawerLayoutFooter>
        <Button
          type="submit"
          variant="outline"
          form={isMovementsTab ? 'investment-movement-create-form' : 'investment-balance-create-form'}
        >
          <ListPlus className="h-4 w-4" />
          Add to list
        </Button>
        <Button
          type="button"
          onClick={isMovementsTab ? handleSaveAllMovements : handleSaveAllBalances}
          disabled={pendingCount === 0 || isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isSaving
            ? 'Saving…'
            : pendingCount === 0
              ? 'Save'
              : `Save ${pendingCount} ${pendingCount === 1 ? itemLabel : `${itemLabel}s`}`}
        </Button>
      </DrawerLayoutFooter>
    </DrawerLayout>
  );
};

const PendingRow = ({
  title,
  details,
  amount,
  sign = '',
  amountClassName = 'text-foreground',
  onRemove,
}: {
  title: string;
  details: string;
  amount: number;
  sign?: string;
  amountClassName?: string;
  onRemove: () => void;
}) => (
  <li className="flex items-start gap-3 rounded-xl bg-card p-3 ring-1 ring-border">
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
      <p className="truncate text-xs text-muted-foreground">{details}</p>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1">
      <p className={cn('financial-value text-sm font-semibold', amountClassName)}>
        {sign}
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
        onClick={onRemove}
        aria-label={`Remove ${title.toLowerCase()}`}
        title="Remove"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  </li>
);
