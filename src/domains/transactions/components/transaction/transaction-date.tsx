import {
  formatDateLong,
  formatDateShort,
  formatDateMedium,
} from '@/domains/transactions/utils/transaction-formatting';

interface TransactionDateProps {
  date: string;
  dateFormat?: 'short' | 'long' | 'medium';
}

export const TransactionDate = ({ date, dateFormat = 'medium' }: TransactionDateProps) => {
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

  return <p className="text-sm text-neutral-grey/50  truncate">{formatDate()}</p>;
};
