import QuotationReady from './QuotationReady'
import QuotationShare from './QuotationShare'
import QuotationMarkRejected from './QuotationMarkRejected'
import QuotationRejected from './QuotationRejected'
import QuotationExpired from './QuotationExpired'
import QuotationCancel from './QuotationCancel'
import QuotationCancelled from './QuotationCancelled'
import QuotationRevise from './QuotationRevise'
import QuotationDeleteDraft from './QuotationDeleteDraft'
import PaymentMarkFailed from './PaymentMarkFailed'
import PaymentFailed from './PaymentFailed'
import PaymentLinkExpired from './PaymentLinkExpired'
import PaymentReverse from './PaymentReverse'
import PaymentReversed from './PaymentReversed'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'QS1', name: 'QS1 · Quotation — Ready (not shared)', figma: '283:29629', path: '/x/qs1-quotation-ready-not-shared', Component: QuotationReady },
  { id: 'QS2', name: 'QS2 · Quotation — Share', figma: '283:29950', path: '/x/qs2-quotation-share', Component: QuotationShare },
  { id: 'QS3', name: 'QS3 · Quotation — Mark rejected', figma: '283:30164', path: '/x/qs3-quotation-mark-rejected', Component: QuotationMarkRejected },
  { id: 'QS4', name: 'QS4 · Quotation — Rejected', figma: '283:30360', path: '/x/qs4-quotation-rejected', Component: QuotationRejected },
  { id: 'QS5', name: 'QS5 · Quotation — Expired', figma: '283:30549', path: '/x/qs5-quotation-expired', Component: QuotationExpired },
  { id: 'QS6', name: 'QS6 · Quotation — Cancel', figma: '283:30872', path: '/x/qs6-quotation-cancel', Component: QuotationCancel },
  { id: 'QS7', name: 'QS7 · Quotation — Cancelled', figma: '283:31061', path: '/x/qs7-quotation-cancelled', Component: QuotationCancelled },
  { id: 'QS8', name: 'QS8 · Quotation — Revise', figma: '283:31388', path: '/x/qs8-quotation-revise', Component: QuotationRevise },
  { id: 'QS9', name: 'QS9 · Quotation — Delete draft', figma: '283:31577', path: '/x/qs9-quotation-delete-draft', Component: QuotationDeleteDraft },
  { id: 'PY1', name: 'PY1 · Payment — Mark failed', figma: '283:31892', path: '/x/py1-payment-mark-failed', Component: PaymentMarkFailed },
  { id: 'PY2', name: 'PY2 · Payment — Failed', figma: '283:32081', path: '/x/py2-payment-failed', Component: PaymentFailed },
  { id: 'PY3', name: 'PY3 · Payment — Link expired', figma: '283:32399', path: '/x/py3-payment-link-expired', Component: PaymentLinkExpired },
  { id: 'PY4', name: 'PY4 · Payment — Reverse (undo)', figma: '283:32712', path: '/x/py4-payment-reverse-undo', Component: PaymentReverse },
  { id: 'PY5', name: 'PY5 · Payment — Reversed', figma: '283:32914', path: '/x/py5-payment-reversed', Component: PaymentReversed },
]
