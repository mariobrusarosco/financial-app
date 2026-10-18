import type * as React from 'react';
import { parseCurrencyAmount } from '@/domains/global/utils/formatting';
import { cn } from '@/domains/ui-system/utils';

interface MoneyValueProps extends React.ComponentProps<'span'> {
  amount: string | number;
  currency?: string;
  locale?: string;
}

/**
 * Formats an amount with the currency symbol set as a small superscript ("R$" above the
 * baseline, the number at full size), as used by large KPI figures.
 */
export const MoneyValue = ({
  amount,
  currency = 'BRL',
  locale = 'pt-BR',
  className,
  ...props
}: MoneyValueProps) => {
  const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(
    parseCurrencyAmount(amount)
  );
  const label = parts.map(part => part.value).join('');

  return (
    <span className={cn('financial-value whitespace-nowrap', className)} {...props}>
      {/* Screen readers get the plain formatted amount instead of the split parts */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {parts.map((part, index) =>
          part.type === 'currency' ? (
            <sup key={index} className="mr-0.5 align-super text-[0.45em] font-semibold">
              {part.value}
            </sup>
          ) : part.type === 'literal' && parts[index - 1]?.type === 'currency' ? null : (
            <span key={index}>{part.value}</span>
          )
        )}
      </span>
    </span>
  );
};
