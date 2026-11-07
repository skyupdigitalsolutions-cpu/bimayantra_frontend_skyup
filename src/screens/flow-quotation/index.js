// Screens for this section. Each entry: { id, name, figma, path, Component }
import QuotationCustomer from './QuotationCustomer'
import QuotationType from './QuotationType'
import QuotationInsurance from './QuotationInsurance'
import QuotationInsurer from './QuotationInsurer'
import QuotationProduct from './QuotationProduct'
import QuotationDetails from './QuotationDetails'
import QuotationRiders from './QuotationRiders'
import QuotationPremium from './QuotationPremium'
import QuotationDiscount from './QuotationDiscount'
import QuotationReview from './QuotationReview'
import QuotationGenerated from './QuotationGenerated'

export default [
  { id: 'Q1', name: 'Q1 · Quotation — Customer', figma: '40:3995', path: '/x/q1-quotation-customer', Component: QuotationCustomer },
  { id: 'Q2', name: 'Q2 · Quotation — Type', figma: '40:4241', path: '/x/q2-quotation-type', Component: QuotationType },
  { id: 'Q3', name: 'Q3 · Quotation — Insurance', figma: '40:4476', path: '/x/q3-quotation-insurance', Component: QuotationInsurance },
  { id: 'Q4', name: 'Q4 · Quotation — Insurer', figma: '40:4729', path: '/x/q4-quotation-insurer', Component: QuotationInsurer },
  { id: 'Q5', name: 'Q5 · Quotation — Product', figma: '40:4974', path: '/x/q5-quotation-product', Component: QuotationProduct },
  { id: 'Q6', name: 'Q6 · Quotation — Details', figma: '41:4496', path: '/x/q6-quotation-details', Component: QuotationDetails },
  { id: 'Q7', name: 'Q7 · Quotation — Riders', figma: '41:4710', path: '/x/q7-quotation-riders', Component: QuotationRiders },
  { id: 'Q8', name: 'Q8 · Quotation — Premium', figma: '41:4960', path: '/x/q8-quotation-premium', Component: QuotationPremium },
  { id: 'Q9', name: 'Q9 · Quotation — Discount', figma: '41:5220', path: '/x/q9-quotation-discount', Component: QuotationDiscount },
  { id: 'Q10', name: 'Q10 · Quotation — Review', figma: '41:5484', path: '/x/q10-quotation-review', Component: QuotationReview },
  { id: 'Q11', name: 'Q11 · Quotation — Generated', figma: '41:5739', path: '/x/q11-quotation-generated', Component: QuotationGenerated },
]
