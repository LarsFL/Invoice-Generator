export interface Address {
  line1: string
  line2?: string
  postalCode: string
  city: string
  country: string
}

/** Reusable company details — the "preferences" we persist. */
export interface CompanyProfile {
  name: string
  address: Address
  email: string
  phone: string
  website: string
  logoDataUrl?: string
  vatId: string // BTW-nummer / VAT registration number
  cocNumber: string // KvK number (NL)
  iban: string
  bic: string
}

export interface Client {
  name: string
  address: Address
  vatId: string
  email: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  taxRate: number // percentage, e.g. 21
}

export interface Invoice {
  number: string
  issueDate: string // ISO yyyy-mm-dd
  supplyDate: string
  dueDate: string
  client: Client
  items: LineItem[]
  reverseCharge: boolean // "BTW verlegd" / reverse charge
  notes: string
}

export type TaxRegion = 'NL' | 'EN'

export interface Settings {
  uiLanguage: string // 'nl' | 'en'
  documentLanguage: string // 'nl' | 'en'
  currency: string // ISO 4217
  taxRegion: TaxRegion
  theme: 'light' | 'dark' | 'system'
}
