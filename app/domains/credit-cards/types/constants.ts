import type { T_CreditCardBrand } from './types-and-interfaces';

export const CREDIT_CARD_BRANDS: { value: T_CreditCardBrand; label: string }[] = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'other', label: 'Other' },
];

export const DUE_DATE_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `Day ${i + 1}`,
}));
