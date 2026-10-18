// Cashflow shows amounts in BRL, matching the expenses analysis and views
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatCashflowCurrency = (amount: number) => currencyFormatter.format(amount);

// Short form for chart axes, e.g. "R$ 8,5 mil"
export const formatCompactCashflowCurrency = (amount: number) =>
  compactCurrencyFormatter.format(amount);
