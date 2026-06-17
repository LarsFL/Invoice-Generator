import { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import i18n from '../i18n'
import { useStore } from '../store'
import { InvoiceDocument } from '../pdf/InvoiceDocument'

/** Debounced live preview driven by the same document the download produces. */
export function Preview() {
  const company = useStore((s) => s.company)
  const invoice = useStore((s) => s.invoice)
  const settings = useStore((s) => s.settings)

  const [debounced, setDebounced] = useState({ company, invoice, settings })

  useEffect(() => {
    const id = setTimeout(() => setDebounced({ company, invoice, settings }), 500)
    return () => clearTimeout(id)
  }, [company, invoice, settings])

  const docT = i18n.getFixedT(debounced.settings.documentLanguage)

  return (
    <div className="preview">
      <PDFViewer showToolbar={false} width="100%" height="100%">
        <InvoiceDocument
          company={debounced.company}
          invoice={debounced.invoice}
          settings={debounced.settings}
          t={docT}
        />
      </PDFViewer>
    </div>
  )
}
