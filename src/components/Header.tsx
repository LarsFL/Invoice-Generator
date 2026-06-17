import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { pdf } from '@react-pdf/renderer'
import { Languages, FileText, Coins, SunMoon, Download, Upload, FileDown } from 'lucide-react'
import i18n from '../i18n'
import { useStore } from '../store'
import type { ExportBundle } from '../store'
import { InvoiceDocument } from '../pdf/InvoiceDocument'

const CURRENCIES = ['EUR', 'GBP', 'USD', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN']

export function Header() {
  const { t } = useTranslation()
  const { company, invoice, settings, setSettings, hydrate } = useStore()
  const importRef = useRef<HTMLInputElement>(null)

  function changeUiLanguage(lng: string) {
    setSettings({ uiLanguage: lng })
    void i18n.changeLanguage(lng)
  }

  async function downloadPdf() {
    const docT = i18n.getFixedT(settings.documentLanguage)
    const blob = await pdf(
      <InvoiceDocument company={company} invoice={invoice} settings={settings} t={docT} />,
    ).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.number || 'invoice'}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportData() {
    const bundle: ExportBundle = { company, invoice, settings }
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoice-generator-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as ExportBundle
        hydrate(data)
        if (data.settings?.uiLanguage) void i18n.changeLanguage(data.settings.uiLanguage)
      } catch {
        alert('Invalid file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <header className="app-header">
      <div className="brand">
        <strong>{t('app.title')}</strong>
        <span className="tagline">{t('app.tagline')}</span>
      </div>

      <div className="controls">
        <a
          className="icon-link"
          href="https://github.com/LarsFL/Invoice-Generator"
          target="_blank"
          rel="noreferrer"
          title="View source on GitHub"
          aria-label="View source on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        <label className="control" title={t('settings.uiLanguage')} aria-label={t('settings.uiLanguage')}>
          <Languages size={16} aria-hidden />
          <select value={settings.uiLanguage} onChange={(e) => changeUiLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="nl">NL</option>
          </select>
        </label>

        <label className="control" title={t('settings.documentLanguage')} aria-label={t('settings.documentLanguage')}>
          <FileText size={16} aria-hidden />
          <select
            value={settings.documentLanguage}
            onChange={(e) => setSettings({ documentLanguage: e.target.value, taxRegion: e.target.value === 'nl' ? 'NL' : 'EN' })}
          >
            <option value="en">EN</option>
            <option value="nl">NL</option>
          </select>
        </label>

        <label className="control" title={t('settings.currency')} aria-label={t('settings.currency')}>
          <Coins size={16} aria-hidden />
          <select value={settings.currency} onChange={(e) => setSettings({ currency: e.target.value })}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="control" title={t('settings.theme')} aria-label={t('settings.theme')}>
          <SunMoon size={16} aria-hidden />
          <select value={settings.theme} onChange={(e) => setSettings({ theme: e.target.value as never })}>
            <option value="system">{t('settings.themeSystem')}</option>
            <option value="light">{t('settings.themeLight')}</option>
            <option value="dark">{t('settings.themeDark')}</option>
          </select>
        </label>

        <button type="button" onClick={exportData} title={t('app.exportData')}>
          <Download size={16} aria-hidden /> JSON
        </button>
        <button type="button" onClick={() => importRef.current?.click()} title={t('app.importData')}>
          <Upload size={16} aria-hidden /> JSON
        </button>
        <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => importData(e.target.files?.[0])} />

        <button type="button" className="primary" onClick={downloadPdf}>
          <FileDown size={16} aria-hidden /> {t('app.download')}
        </button>
      </div>
    </header>
  )
}
