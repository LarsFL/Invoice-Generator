import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { Field, FieldRow, Section } from './Field'

export function ClientForm() {
  const { t } = useTranslation()
  const client = useStore((s) => s.invoice.client)
  const setClient = useStore((s) => s.setClient)
  const setAddress = useStore((s) => s.setClientAddress)

  return (
    <Section title={t('client.heading')}>
      <Field label={t('client.name')} value={client.name} onChange={(v) => setClient({ name: v })} />
      <Field label={t('client.email')} type="email" value={client.email} onChange={(v) => setClient({ email: v })} />
      <Field label={t('address.line1')} value={client.address.line1} onChange={(v) => setAddress({ line1: v })} />
      <FieldRow>
        <Field label={t('address.postalCode')} value={client.address.postalCode} onChange={(v) => setAddress({ postalCode: v })} />
        <Field label={t('address.city')} value={client.address.city} onChange={(v) => setAddress({ city: v })} />
      </FieldRow>
      <Field label={t('address.country')} value={client.address.country} onChange={(v) => setAddress({ country: v })} />
      <Field label={t('client.vatId')} value={client.vatId} onChange={(v) => setClient({ vatId: v })} />
    </Section>
  )
}
