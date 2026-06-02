import { cn } from '@/domains/ui-system/utils';

interface TransactionInfoProps {
  description: string;
}

export const TransactionInfo = ({ description }: TransactionInfoProps) => {
  return <p className="leading-tight text-xl truncate line-height-[1]">{description}</p>;
};
