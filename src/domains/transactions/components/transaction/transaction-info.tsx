interface TransactionInfoProps {
  description: string;
}

export const TransactionInfo = ({ description }: TransactionInfoProps) => {
  return (
    <p className="truncate text-sm font-medium leading-tight text-foreground">{description}</p>
  );
};
