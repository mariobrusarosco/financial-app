import { cn } from '@/domains/ui-system/utils';
import {
  formatDateLong,
  formatDateShort,
  formatDateMedium,
} from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionInfoProps } from './types';

export const TransactionInfo = ({
  description,
  date,
  ignored,
  dateFormat = 'medium',
}: TransactionInfoProps) => {
  const formatDate = () => {
    switch (dateFormat) {
      case 'short':
        return formatDateShort(date);
      case 'long':
        return formatDateLong(date);
      case 'medium':
      default:
        return formatDateMedium(date);
    }
  };

  return (
    <div className="md:min-w-[400px] flex flex-col">
      <p className={cn('leading-tight text-primary', ignored && 'opacity-50')}>{description}</p>
      <p className="text-xs text-muted-foreground">{formatDate()}</p>
    </div>
  );
};
