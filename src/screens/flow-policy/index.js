// Screens for this section. Each entry: { id, name, figma, path, Component }
import RecordIssuedPolicy from './RecordIssuedPolicy'
import PolicyIssued from './PolicyIssued'
import RenewalDetail from './RenewalDetail'
import RenewalLogContact from './RenewalLogContact'
import RenewalNotRenewing from './RenewalNotRenewing'
import RenewalRenewed from './RenewalRenewed'
import RenewalQuotation from './RenewalQuotation'
import RenewalQuotationReady from './RenewalQuotationReady'

export default [
  { id: 'L1', name: 'L1 · Record issued policy', figma: '46:6554', path: '/x/l1-record-issued-policy', Component: RecordIssuedPolicy },
  { id: 'L2', name: 'L2 · Policy issued', figma: '46:6773', path: '/x/l2-policy-issued', Component: PolicyIssued },
  { id: 'N1', name: 'N1 · Renewal detail', figma: '46:6992', path: '/x/n1-renewal-detail', Component: RenewalDetail },
  { id: 'N2', name: 'N2 · Renewal — Log contact', figma: '46:7154', path: '/x/n2-renewal-log-contact', Component: RenewalLogContact },
  { id: 'N3', name: 'N3 · Renewal — Not renewing', figma: '46:7366', path: '/x/n3-renewal-not-renewing', Component: RenewalNotRenewing },
  { id: 'N4', name: 'N4 · Renewal — Renewed', figma: '46:7544', path: '/x/n4-renewal-renewed', Component: RenewalRenewed },
  { id: 'N1b', name: 'N1b · Renewal quotation', figma: '72:9670', path: '/x/n1b-renewal-quotation', Component: RenewalQuotation },
  { id: 'N1c', name: 'N1c · Renewal quotation — Ready', figma: '72:9902', path: '/x/n1c-renewal-quotation-ready', Component: RenewalQuotationReady },
]
