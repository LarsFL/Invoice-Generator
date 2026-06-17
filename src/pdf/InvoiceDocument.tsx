import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import type { TFunction } from 'i18next'
import type { CompanyProfile, Invoice, Settings } from '../types'
import { computeTotals, lineNet } from '../lib/totals'
import { formatCurrency, formatDate } from '../lib/format'

interface Props {
  company: CompanyProfile
  invoice: Invoice
  settings: Settings
  t: TFunction
}

const styles = StyleSheet.create({
  page: { padding: 40, paddingBottom: 90, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  logo: { maxWidth: 140, maxHeight: 70, objectFit: 'contain' },
  title: { fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  companyName: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  parties: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  block: { maxWidth: '48%' },
  label: { fontFamily: 'Helvetica-Bold', marginBottom: 3, color: '#555' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  table: { marginTop: 8 },
  tr: { flexDirection: 'row', borderBottom: '1px solid #e2e2e2', paddingVertical: 5 },
  thRow: { flexDirection: 'row', borderBottom: '1.5px solid #888', paddingBottom: 4 },
  th: { fontFamily: 'Helvetica-Bold', color: '#555' },
  cDesc: { flex: 4 },
  cNum: { flex: 1.2, textAlign: 'right' },
  cTax: { flex: 1, textAlign: 'right' },
  cTotal: { flex: 1.5, textAlign: 'right' },
  totals: { marginTop: 16, alignSelf: 'flex-end', width: '50%' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 4,
    borderTop: '1.5px solid #888',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  notes: { marginTop: 24, color: '#444' },
  reverseNote: { marginTop: 8, fontStyle: 'italic', color: '#444' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #e2e2e2',
    paddingTop: 8,
    fontSize: 8,
    color: '#666',
  },
  footerCol: { maxWidth: '48%' },
  footerLabel: { fontFamily: 'Helvetica-Bold', marginBottom: 2, color: '#555' },
})

function AddressBlock({ lines }: { lines: (string | undefined)[] }) {
  return (
    <>
      {lines.filter(Boolean).map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </>
  )
}

export function InvoiceDocument({ company, invoice, settings, t }: Props) {
  const { currency, documentLanguage: lng } = settings
  const totals = computeTotals(invoice)
  const money = (n: number) => formatCurrency(n, currency, lng)
  const addr = company.address
  const caddr = invoice.client.address

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {company.logoDataUrl ? (
              <Image src={company.logoDataUrl} style={styles.logo} />
            ) : (
              <Text style={styles.companyName}>{company.name || ' '}</Text>
            )}
          </View>
          <Text style={styles.title}>{t('doc.invoice')}</Text>
        </View>

        <View style={styles.parties}>
          <View style={styles.block}>
            <Text style={styles.label}>{t('doc.from')}</Text>
            <Text style={styles.companyName}>{company.name}</Text>
            <AddressBlock
              lines={[
                addr.line1,
                addr.line2,
                [addr.postalCode, addr.city].filter(Boolean).join(' '),
                addr.country,
              ]}
            />
            {company.vatId ? (
              <Text>
                {t('doc.vatId')} {company.vatId}
              </Text>
            ) : null}
            {company.cocNumber ? (
              <Text>
                {t('doc.cocNumber')} {company.cocNumber}
              </Text>
            ) : null}
          </View>

          <View style={styles.block}>
            <Text style={styles.label}>{t('doc.billTo')}</Text>
            <Text style={styles.companyName}>{invoice.client.name}</Text>
            <AddressBlock
              lines={[
                caddr.line1,
                caddr.line2,
                [caddr.postalCode, caddr.city].filter(Boolean).join(' '),
                caddr.country,
              ]}
            />
            {invoice.client.email ? <Text>{invoice.client.email}</Text> : null}
            {invoice.client.vatId ? (
              <Text>
                {t('doc.vatId')} {invoice.client.vatId}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={styles.metaRow}>
            <Text style={styles.th}>{t('doc.number')}</Text>
            <Text>{invoice.number}</Text>
          </View>
          {invoice.issueDate ? (
            <View style={styles.metaRow}>
              <Text style={styles.th}>{t('doc.issueDate')}</Text>
              <Text>{formatDate(invoice.issueDate, lng)}</Text>
            </View>
          ) : null}
          {invoice.dueDate ? (
            <View style={styles.metaRow}>
              <Text style={styles.th}>{t('doc.dueDate')}</Text>
              <Text>{formatDate(invoice.dueDate, lng)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.table}>
          <View style={styles.thRow}>
            <Text style={[styles.cDesc, styles.th]}>{t('invoice.description')}</Text>
            <Text style={[styles.cNum, styles.th]}>{t('invoice.quantity')}</Text>
            <Text style={[styles.cNum, styles.th]}>{t('invoice.unitPrice')}</Text>
            <Text style={[styles.cTax, styles.th]}>{t('invoice.taxRate')}</Text>
            <Text style={[styles.cTotal, styles.th]}>{t('invoice.lineTotal')}</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tr}>
              <Text style={styles.cDesc}>{item.description}</Text>
              <Text style={styles.cNum}>
                {item.quantity}
                {item.unit ? ` ${item.unit}` : ''}
              </Text>
              <Text style={styles.cNum}>{money(item.unitPrice)}</Text>
              <Text style={styles.cTax}>{invoice.reverseCharge ? '—' : `${item.taxRate}%`}</Text>
              <Text style={styles.cTotal}>{money(lineNet(item))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>{t('totals.net')}</Text>
            <Text>{money(totals.net)}</Text>
          </View>
          {!invoice.reverseCharge &&
            totals.taxGroups.map((g) => (
              <View key={g.rate} style={styles.totalRow}>
                <Text>
                  {t('totals.vat')} {g.rate}%
                </Text>
                <Text>{money(g.tax)}</Text>
              </View>
            ))}
          <View style={styles.grandTotal}>
            <Text>{t('totals.total')}</Text>
            <Text>{money(totals.gross)}</Text>
          </View>
        </View>

        {invoice.reverseCharge ? (
          <Text style={styles.reverseNote}>{t('totals.reverseChargeNote')}</Text>
        ) : null}

        {invoice.notes ? <Text style={styles.notes}>{invoice.notes}</Text> : null}

        {(company.email || company.phone || company.website || company.iban || company.bic) && (
          <View style={styles.footer} fixed>
            <View style={styles.footerCol}>
              {company.email || company.phone || company.website ? (
                <Text style={styles.footerLabel}>{t('doc.contact')}</Text>
              ) : null}
              {company.email ? <Text>{company.email}</Text> : null}
              {company.phone ? <Text>{company.phone}</Text> : null}
              {company.website ? <Text>{company.website}</Text> : null}
            </View>
            <View style={styles.footerCol}>
              {company.iban || company.bic ? (
                <Text style={styles.footerLabel}>{t('doc.payTo')}</Text>
              ) : null}
              {company.iban ? <Text>IBAN: {company.iban}</Text> : null}
              {company.bic ? <Text>BIC: {company.bic}</Text> : null}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
