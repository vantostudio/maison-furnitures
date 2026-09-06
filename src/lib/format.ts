/**
 * Prices render as `$1,234`. Kept as one helper so every surface — cards,
 * cart lines, order summaries — formats identically.
 */
export const formatPrice = (amount: number): string =>
  `$${amount.toLocaleString()}`;
