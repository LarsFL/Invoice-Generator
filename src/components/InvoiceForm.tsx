import { useTranslation } from 'react-i18next'
import { useStore } from '../store'
import { newLineItem } from '../lib/defaults'
import type { LineItem } from '../types'
import { Field, FieldRow, Section } from './Field'

export function InvoiceForm() {
  const { t } = useTranslation()
  const invoice = useStore((s) => s.invoice)
  const setInvoice = useStore((s) => s.setInvoice)

  function updateItem(id: string, patch: Partial<LineItem>) {
    setInvoice({
      items: invoice.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    })
  }
  function removeItem(id: string) {
    setInvoice({ items: invoice.items.filter((it) => it.id !== id) })
  }
  function addItem() {
    setInvoice({ items: [...invoice.items, newLineItem()] })
  }

  return (
    <Section title={t('invoice.heading')}>
      <Field label={t('invoice.number')} value={invoice.number} onChange={(v) => setInvoice({ number: v })} />
      <FieldRow>
        <Field label={t('invoice.issueDate')} type="date" value={invoice.issueDate} onChange={(v) => setInvoice({ issueDate: v })} />
        <Field label={t('invoice.dueDate')} type="date" value={invoice.dueDate} onChange={(v) => setInvoice({ dueDate: v })} />
      </FieldRow>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={invoice.reverseCharge}
          onChange={(e) => setInvoice({ reverseCharge: e.target.checked })}
        />
        <span>{t('invoice.reverseCharge')}</span>
      </label>

      <h3>{t('invoice.items')}</h3>
      <div className="items">
        {invoice.items.map((item) => (
          <div key={item.id} className="item">
            <Field label={t('invoice.description')} value={item.description} onChange={(v) => updateItem(item.id, { description: v })} />
            <div className="item-numbers">
              <Field label={t('invoice.quantity')} type="number" value={item.quantity} onChange={(v) => updateItem(item.id, { quantity: Number(v) })} />
              <Field label={t('invoice.unit')} value={item.unit} onChange={(v) => updateItem(item.id, { unit: v })} />
              <Field label={t('invoice.unitPrice')} type="number" value={item.unitPrice} onChange={(v) => updateItem(item.id, { unitPrice: Number(v) })} />
              <Field label={t('invoice.taxRate')} type="number" value={item.taxRate} onChange={(v) => updateItem(item.id, { taxRate: Number(v) })} />
            </div>
            {invoice.items.length > 1 ? (
              <button type="button" className="link-danger" onClick={() => removeItem(item.id)}>
                {t('invoice.removeItem')}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem}>
        + {t('invoice.addItem')}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <label className="field">
          <span>{t('invoice.notes')}</span>
          <textarea value={invoice.notes} rows={3} onChange={(e) => setInvoice({ notes: e.target.value })} />
        </label>
      </div>
    </Section>
  )
}
