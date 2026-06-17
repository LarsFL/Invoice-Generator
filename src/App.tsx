import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from './i18n'
import { useStore } from './store'
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
  useTheme()

  useEffect(() => {
    if (i18n.language !== uiLanguage) void i18n.changeLanguage(uiLanguage)
  }, [uiLanguage])

  return (
    <div className="app">
      <Header />
      <main className="layout">
        <div className="editor">
          <CompanyForm />
          <ClientForm />
          <InvoiceForm />
          <p className="disclaimer">{t('disclaimer')}</p>
          <p className="privacy">{t('app.privacyNote')}</p>
        </div>
        <Preview />
      </main>
    </div>
  )
}
