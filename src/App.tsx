import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from './i18n'
import { useStore } from './store'
import { useMediaQuery } from './hooks/useMediaQuery'
import { Header } from './components/Header'
import { CompanyForm } from './components/CompanyForm'
import { ClientForm } from './components/ClientForm'
import { InvoiceForm } from './components/InvoiceForm'
import { Preview } from './components/Preview'

function useTheme() {
  const theme = useStore((s) => s.settings.theme)
  useEffect(() => {
    const root = document.documentElement
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolved = theme === 'system' ? (mql.matches ? 'dark' : 'light') : theme
      root.dataset.theme = resolved
    }
    apply()
    if (theme === 'system') {
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }
  }, [theme])
}

export default function App() {
  const { t } = useTranslation()
  const uiLanguage = useStore((s) => s.settings.uiLanguage)
  const isMobile = useMediaQuery('(max-width: 880px)')
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  useTheme()

  useEffect(() => {
    if (i18n.language !== uiLanguage) void i18n.changeLanguage(uiLanguage)
  }, [uiLanguage])

  const showEditor = !isMobile || mobileTab === 'edit'
  const showPreview = !isMobile || mobileTab === 'preview'

  return (
    <div className="app">
      <Header />

      {isMobile && (
        <div className="segmented" role="tablist" aria-label={t('app.title')}>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'edit'}
            className={mobileTab === 'edit' ? 'active' : ''}
            onClick={() => setMobileTab('edit')}
          >
            {t('nav.edit')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'preview'}
            className={mobileTab === 'preview' ? 'active' : ''}
            onClick={() => setMobileTab('preview')}
          >
            {t('nav.preview')}
          </button>
        </div>
      )}

      <main className="layout">
        {showEditor && (
          <div className="editor">
            <CompanyForm />
            <ClientForm />
            <InvoiceForm />
            <p className="disclaimer">{t('disclaimer')}</p>
            <p className="privacy">{t('app.privacyNote')}</p>
          </div>
        )}
        {/* Preview is only mounted while visible, so the PDF isn't re-rendered
            in the background while editing on mobile. */}
        {showPreview && <Preview />}
      </main>
    </div>
  )
}
