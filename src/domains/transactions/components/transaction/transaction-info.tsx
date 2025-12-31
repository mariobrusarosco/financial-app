import { cn } from '@/domains/ui-system/utils';
import {
  formatDateLong,
  formatDateShort,
  formatDateMedium,
} from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionInfoProps } from './types';
import { Badge } from '@/domains/ui-system/components/badge';
import { Repeat } from 'lucide-react';

export const TransactionInfo = ({
  description,
  date,
  ignored,
  subscription, // New prop
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
    <div className="md:w-full md:max-w-[450px] flex flex-col">
      <div className="flex items-center gap-2">
        <p className={cn('leading-tight text-primary', ignored && 'opacity-50')}>{description}</p>
        {subscription && (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700">
            <Repeat className="h-3 w-3" />
            Recurring
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{formatDate()}</p>
    </div>
  );
};
