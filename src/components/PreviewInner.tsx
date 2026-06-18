import { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import i18n from '../i18n'
import { useStore } from '../store'
import { InvoiceDocument } from '../pdf/InvoiceDocument'

/**
 * Heavy preview body — lazy-loaded so react-pdf stays out of the initial bundle.
 * Debounced so rapid edits don't thrash the PDF renderer.
 */
export default function PreviewInner() {
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
    <PDFViewer showToolbar={false} width="100%" height="100%">
      <InvoiceDocument
        company={debounced.company}
        invoice={debounced.invoice}
        settings={debounced.settings}
        t={docT}
      />
    </PDFViewer>
  )
}
