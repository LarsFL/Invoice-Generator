/** Locale-aware formatting via the native Intl API (no extra deps). */

export function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(iso: string, locale: string): string {
  if (!iso) return ''
  const date = new Date(iso + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
