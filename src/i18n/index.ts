import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import nl from './nl.json'
import { detectLanguage } from '../lib/defaults'

export const SUPPORTED_LANGUAGES = ['en', 'nl'] as const

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
