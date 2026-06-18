import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const PreviewInner = lazy(() => import('./PreviewInner'))

export function Preview() {
  const { t } = useTranslation()
  return (
    <div className="preview">
      <Suspense fallback={<div className="preview-loading">{t('app.loadingPreview')}</div>}>
        <PreviewInner />
      </Suspense>
    </div>
  )
}
