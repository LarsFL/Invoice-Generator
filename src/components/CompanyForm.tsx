import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { Field, FieldRow, Section } from './Field'

export function CompanyForm() {
  const { t } = useTranslation()
  const company = useStore((s) => s.company)
  const setCompany = useStore((s) => s.setCompany)
  const setAddress = useStore((s) => s.setCompanyAddress)

  function onLogo(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCompany({ logoDataUrl: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <Section title={t('company.heading')}>
      <Field label={t('company.name')} value={company.name} onChange={(v) => setCompany({ name: v })} />
      <FieldRow>
        <Field label={t('company.email')} type="email" value={company.email} onChange={(v) => setCompany({ email: v })} />
        <Field label={t('company.phone')} value={company.phone} onChange={(v) => setCompany({ phone: v })} />
      </FieldRow>
      <Field label={t('company.website')} value={company.website} onChange={(v) => setCompany({ website: v })} />

      <Field label={t('address.line1')} value={company.address.line1} onChange={(v) => setAddress({ line1: v })} />
      <FieldRow>
        <Field label={t('address.postalCode')} value={company.address.postalCode} onChange={(v) => setAddress({ postalCode: v })} />
        <Field label={t('address.city')} value={company.address.city} onChange={(v) => setAddress({ city: v })} />
      </FieldRow>
      <Field label={t('address.country')} value={company.address.country} onChange={(v) => setAddress({ country: v })} />

      <FieldRow>
        <Field label={t('company.vatId')} value={company.vatId} onChange={(v) => setCompany({ vatId: v })} />
        <Field label={t('company.cocNumber')} value={company.cocNumber} onChange={(v) => setCompany({ cocNumber: v })} />
      </FieldRow>
      <FieldRow>
        <Field label={t('company.iban')} value={company.iban} onChange={(v) => setCompany({ iban: v })} />
        <Field label={t('company.bic')} value={company.bic} onChange={(v) => setCompany({ bic: v })} />
      </FieldRow>

      <div className="field">
        <span>{t('company.logo')}</span>
        <div className="logo-row">
          {company.logoDataUrl ? (
            <img className="logo-preview" src={company.logoDataUrl} alt="logo" />
          ) : null}
          <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} />
          {company.logoDataUrl ? (
            <button type="button" onClick={() => setCompany({ logoDataUrl: undefined })}>
              {t('company.logoRemove')}
            </button>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
