import { I_GroupedEntity } from '../../utils/grouping-utils';

interface ExpensesByCreditCardProps {
  groupedData: I_GroupedEntity[];
  overallTotal: number;
}

export const ExpensesByCreditCard = ({ groupedData, overallTotal }: ExpensesByCreditCardProps) => {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="p-6 border rounded-3xl bg-neutral-white space-y-6 h-fit shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-primary">By Credit Card</h3>
        <p className="text-sm text-muted-foreground">
          Expenses charged to credit cards
        </p>
      </div>

      <div className="space-y-4">
        {groupedData.map(card => {
          const percentage = overallTotal > 0 ? (card.total / overallTotal) * 100 : 0;

          return (
            <div key={card.id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-primary">
                <span>{card.name}</span>
                <span className="text-rose-600 font-bold">{currencyFormatter.format(card.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{card.count} transactions</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden border">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {groupedData.length === 0 && (
          <p className="text-sm text-center py-4 text-muted-foreground italic">
            No credit card expenses found
          </p>
        )}
      </div>
    </div>
  );
};
