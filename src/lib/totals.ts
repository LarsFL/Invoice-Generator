import type { Invoice, LineItem } from '../types'

export interface TaxGroup {
  rate: number
  net: number
  tax: number
}

export interface Totals {
  net: number
  taxGroups: TaxGroup[]
  taxTotal: number
  gross: number
}

export function lineNet(item: LineItem): number {
  return round2(item.quantity * item.unitPrice)
}

/** Derive all totals from an invoice. Reverse charge zeroes the VAT. */
export function computeTotals(invoice: Invoice): Totals {
  const groups = new Map<number, TaxGroup>()
  let net = 0

  for (const item of invoice.items) {
    const itemNet = lineNet(item)
    net += itemNet
    const rate = invoice.reverseCharge ? 0 : item.taxRate
    const existing = groups.get(rate) ?? { rate, net: 0, tax: 0 }
    existing.net = round2(existing.net + itemNet)
    existing.tax = round2((existing.net * rate) / 100)
    groups.set(rate, existing)
  }

  const taxGroups = [...groups.values()].sort((a, b) => b.rate - a.rate)
  const taxTotal = round2(taxGroups.reduce((sum, g) => sum + g.tax, 0))
  net = round2(net)

  return { net, taxGroups, taxTotal, gross: round2(net + taxTotal) }
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
