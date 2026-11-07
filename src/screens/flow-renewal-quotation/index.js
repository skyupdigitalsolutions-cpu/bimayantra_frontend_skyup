// Screens for this section. Each entry: { id, name, figma, path, Component }
import RenewalHowToRenew from './RenewalHowToRenew'
import NewQuotationProduct from './NewQuotationProduct'
import NewQuotationDetails from './NewQuotationDetails'
import NewQuotationReview from './NewQuotationReview'
import NewQuotationReady from './NewQuotationReady'

export default [
  { id: 'RN0', name: 'RN0 · Renewal — How to renew', figma: '255:21407', path: '/x/rn0-renewal-how-to-renew', Component: RenewalHowToRenew },
  { id: 'RNB1', name: 'RNB1 · Renewal — New quotation · Product', figma: '255:21703', path: '/x/rnb1-renewal-new-quotation-product', Component: NewQuotationProduct },
  { id: 'RNB2', name: 'RNB2 · Renewal — New quotation · Details and premium', figma: '255:21917', path: '/x/rnb2-renewal-new-quotation-details-and-premium', Component: NewQuotationDetails },
  { id: 'RNB3', name: 'RNB3 · Renewal — New quotation · Review', figma: '255:22144', path: '/x/rnb3-renewal-new-quotation-review', Component: NewQuotationReview },
  { id: 'RNB4', name: 'RNB4 · Renewal — New quotation ready', figma: '255:22330', path: '/x/rnb4-renewal-new-quotation-ready', Component: NewQuotationReady },
]
