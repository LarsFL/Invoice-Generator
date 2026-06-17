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
