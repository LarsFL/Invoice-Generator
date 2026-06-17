import type { CompanyProfile, Invoice, Settings } from '../types'

export function emptyAddress() {
  return { line1: '', line2: '', postalCode: '', city: '', country: '' }
}

export function defaultCompany(): CompanyProfile {
  return {
    name: '',
    address: emptyAddress(),
    email: '',
    phone: '',
    website: '',
    vatId: '',
    cocNumber: '',
    iban: '',
    bic: '',
  }
}

let idSeq = 0
export function newId(): string {
  // Avoids Math.random/Date for deterministic behaviour in this module.
  idSeq += 1
  return `item-${idSeq}-${performance.now().toString(36).replace('.', '')}`
}

export function newLineItem() {
  return {
    id: newId(),
    description: '',
    quantity: 1,
    unit: '',
    unitPrice: 0,
    taxRate: 21,
  }
}

/** Local-time yyyy-mm-dd (avoids the UTC shift of toISOString). */
function toISODate(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export function defaultInvoice(): Invoice {
  const today = new Date()
  const due = new Date(today)
  due.setDate(due.getDate() + 30) // 30-day payment term
  return {
    number: '2026-001',
    issueDate: toISODate(today),
    supplyDate: '',
    dueDate: toISODate(due),
    client: { name: '', address: emptyAddress(), vatId: '', email: '' },
    items: [newLineItem()],
    reverseCharge: false,
    notes: '',
  }
}

/** Default to English; use the system language only when it's one we support. */
export function detectLanguage(): string {
  const sys = navigator.language?.slice(0, 2).toLowerCase()
  return sys === 'nl' ? 'nl' : 'en'
}

export function defaultSettings(): Settings {
  const lng = detectLanguage()
  const isNL = lng === 'nl'
  return {
    uiLanguage: lng,
    documentLanguage: lng,
    currency: isNL ? 'EUR' : 'GBP',
    taxRegion: isNL ? 'NL' : 'EN',
    theme: 'system',
  }
}
