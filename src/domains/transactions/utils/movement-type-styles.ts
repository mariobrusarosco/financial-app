import type { T_TransactionType } from '@/domains/transactions/types/types-and-interfaces';

interface MovementTypeStyle {
  label: string;
  /** Small color marker (list dots, legends) */
  dotClassName: string;
  /** Amount text; expenses stay neutral so only income/investment/transfer stand out */
  amountClassName: string;
  /** Selected pill: fill + text tokens that stay readable in light and dark themes */
  selectedClassName: string;
  idleClassName: string;
}

export const MOVEMENT_TYPES: T_TransactionType[] = ['expense', 'income', 'investment', 'transfer'];

/** One color per movement type: expense coral, income green, investment purple, transfer amber. */
export const MOVEMENT_TYPE_STYLES: Record<T_TransactionType, MovementTypeStyle> = {
  expense: {
    label: 'Expense',
    dotClassName: 'bg-chart-4',
    amountClassName: 'text-foreground',
    selectedClassName: 'border-brand bg-brand text-brand-foreground',
    idleClassName: 'border-brand/25 bg-brand/10 text-brand hover:bg-brand/15',
  },
  income: {
    label: 'Income',
    dotClassName: 'bg-positive',
    amountClassName: 'text-positive',
    selectedClassName: 'border-positive bg-positive text-background',
    idleClassName: 'border-positive/25 bg-positive/10 text-positive hover:bg-positive/15',
  },
  investment: {
    label: 'Investment',
    dotClassName: 'bg-chart-1',
    amountClassName: 'text-accent-foreground',
    selectedClassName: 'border-spotlight bg-spotlight text-spotlight-foreground',
    idleClassName:
      'border-accent-foreground/20 bg-accent text-accent-foreground hover:bg-accent/70',
  },
  transfer: {
    label: 'Transfer',
    dotClassName: 'bg-warning',
    amountClassName: 'text-warning',
    selectedClassName: 'border-warning bg-warning text-background',
    idleClassName: 'border-warning/25 bg-warning/10 text-warning hover:bg-warning/15',
  },
};
