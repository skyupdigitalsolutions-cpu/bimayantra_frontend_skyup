// Screens for this section. Each entry: { id, name, figma, path, Component }
import QuotationLinkExpired from './QuotationLinkExpired'
import ReferralLinkExpired from './ReferralLinkExpired'
import BrochureReadingFailed from './BrochureReadingFailed'
import ComparisonExpired from './ComparisonExpired'

export default [
  { id: 'QX1', name: 'QX1 · Public quotation — Link expired or invalid', figma: '291:37862', path: '/x/qx1-public-quotation-link-expired-or-invalid', Component: QuotationLinkExpired },
  { id: 'RX1', name: 'RX1 · Referral link — Expired or revoked', figma: '291:37961', path: '/x/rx1-referral-link-expired-or-revoked', Component: ReferralLinkExpired },
  { id: 'OC1', name: 'OC1 · Add product — Brochure reading failed', figma: '291:38031', path: '/x/oc1-add-product-brochure-reading-failed', Component: BrochureReadingFailed },
  { id: 'CX1', name: 'CX1 · Comparison — Expired', figma: '291:38329', path: '/x/cx1-comparison-expired', Component: ComparisonExpired },
]
