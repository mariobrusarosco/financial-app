import { cn } from '@/domains/ui-system/utils';
import {
  formatDateLong,
  formatDateShort,
  formatDateMedium,
} from '@/domains/transactions/utils/transaction-formatting';
import type { TransactionInfoProps } from './types';
import { Repeat, Calendar } from 'lucide-react';

export const TransactionInfo = ({
  description,
  date,
  subscription,
  installment_info,
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
    <div className="w-full max-w-[200px] flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <p className={cn('leading-tight text-xl truncate')}>{description}</p>
        {subscription && (
          <div
            variant="outline"
            className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700"
          >
            <Repeat className="h-3 w-3" />
            Recurring
          </div>
        )}
        {installment_info && (
          <div
            variant="outline"
            className="flex items-center gap-1 border-gray-200 bg-gray-50 text-sea-blue"
          >
            <Calendar className="h-3 w-3" />
            {installment_info.number}/{installment_info.total}
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-grey/50  truncate">{formatDate()}</p>
    </div>
  );
};
