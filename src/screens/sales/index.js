import LeadsBoard from './LeadsBoard'
import LeadDetail from './LeadDetail'
import PolicyHolders from './PolicyHolders'
import CustomerProfile from './CustomerProfile'
import BestFit from './BestFit'
import QuotationWizardStep6 from './QuotationWizardStep6'
import QuotationDetail from './QuotationDetail'
import ProposalNominees from './ProposalNominees'
import QuotationsList from './QuotationsList'
import QuotationRecordPayment from './QuotationRecordPayment'
import QuotationPaymentSuccessful from './QuotationPaymentSuccessful'
import QuotationAccepted from './QuotationAccepted'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: '02', name: '02 · Leads — Board', figma: '8:503', path: '/leads', Component: LeadsBoard },
  { id: '03', name: '03 · Lead detail', figma: '8:809', path: '/leads/1', Component: LeadDetail },
  { id: '04', name: '04 · Policy Holders', figma: '9:562', path: '/customers', Component: PolicyHolders },
  { id: '05', name: '05 · Customer profile', figma: '9:845', path: '/customers/1', Component: CustomerProfile },
  { id: '06', name: '06 · Best fit', figma: '9:1127', path: '/best-fit', Component: BestFit },
  { id: '07', name: '07 · Quotation wizard — Step 6', figma: '10:803', path: '/x/07-quotation-wizard-step-6', Component: QuotationWizardStep6 },
  { id: '08', name: '08 · Quotation detail', figma: '10:1093', path: '/quotations/1', Component: QuotationDetail },
  { id: '09', name: '09 · Proposal — Nominees', figma: '10:1354', path: '/x/09-proposal-nominees', Component: ProposalNominees },
  { id: '07L', name: '07L · Quotations list', figma: '71:9067', path: '/quotations', Component: QuotationsList },
  { id: '08a', name: '08a · Quotation detail — Record payment', figma: '71:9417', path: '/x/08a-quotation-detail-record-payment', Component: QuotationRecordPayment },
  { id: '08b', name: '08b · Quotation detail — Payment successful', figma: '71:9783', path: '/x/08b-quotation-detail-payment-successful', Component: QuotationPaymentSuccessful },
  { id: '08c', name: '08c · Quotation detail — Accepted', figma: '71:10022', path: '/x/08c-quotation-detail-accepted', Component: QuotationAccepted },
]
