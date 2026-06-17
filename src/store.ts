import { create } from 'zustand'
import type { CompanyProfile, Invoice, Settings } from './types'
import { defaultCompany, defaultInvoice, defaultSettings } from './lib/defaults'
import { load, save } from './lib/storage'

interface AppState {
  company: CompanyProfile
  invoice: Invoice
  settings: Settings
  setCompany: (patch: Partial<CompanyProfile>) => void
  setCompanyAddress: (patch: Partial<CompanyProfile['address']>) => void
  setInvoice: (patch: Partial<Invoice>) => void
  setClient: (patch: Partial<Invoice['client']>) => void
  setClientAddress: (patch: Partial<Invoice['client']['address']>) => void
  setSettings: (patch: Partial<Settings>) => void
  /** Replace everything (used by JSON import). */
  hydrate: (data: ExportBundle) => void
}

export interface ExportBundle {
  company: CompanyProfile
  invoice: Invoice
  settings: Settings
}

const COMPANY_KEY = 'company'
const SETTINGS_KEY = 'settings'
const INVOICE_KEY = 'invoice'

export const useStore = create<AppState>((set) => ({
  company: load(COMPANY_KEY, defaultCompany()),
  invoice: load(INVOICE_KEY, defaultInvoice()),
  settings: load(SETTINGS_KEY, defaultSettings()),

  setCompany: (patch) =>
    set((s) => {
      const company = { ...s.company, ...patch }
      save(COMPANY_KEY, company)
      return { company }
    }),

  setCompanyAddress: (patch) =>
    set((s) => {
      const company = { ...s.company, address: { ...s.company.address, ...patch } }
      save(COMPANY_KEY, company)
      return { company }
    }),

  setInvoice: (patch) =>
    set((s) => {
      const invoice = { ...s.invoice, ...patch }
      save(INVOICE_KEY, invoice)
      return { invoice }
    }),

  setClient: (patch) =>
    set((s) => {
      const invoice = { ...s.invoice, client: { ...s.invoice.client, ...patch } }
      save(INVOICE_KEY, invoice)
      return { invoice }
    }),

  setClientAddress: (patch) =>
    set((s) => {
      const invoice = {
        ...s.invoice,
        client: {
          ...s.invoice.client,
          address: { ...s.invoice.client.address, ...patch },
        },
      }
      save(INVOICE_KEY, invoice)
      return { invoice }
    }),

  setSettings: (patch) =>
    set((s) => {
      const settings = { ...s.settings, ...patch }
      save(SETTINGS_KEY, settings)
      return { settings }
    }),

  hydrate: (data) =>
    set(() => {
      save(COMPANY_KEY, data.company)
      save(INVOICE_KEY, data.invoice)
      save(SETTINGS_KEY, data.settings)
      return { company: data.company, invoice: data.invoice, settings: data.settings }
    }),
}))
