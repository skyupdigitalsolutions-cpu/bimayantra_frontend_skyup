// Screens for this section. Each entry: { id, name, figma, path, Component }
import AdvisorAccounts from './AdvisorAccounts'
import AccountDetail from './AccountDetail'
import SuspendAccount from './SuspendAccount'
import RecordPayment from './RecordPayment'
import RejectKyc from './RejectKyc'
import ProductCorrections from './ProductCorrections'
import SuggestCorrection from './SuggestCorrection'
import MessageTemplates from './MessageTemplates'
import SkyupUsers from './SkyupUsers'
import Configuration from './Configuration'
import AuditLog from './AuditLog'
import AgentCodeFlags from './AgentCodeFlags'
import SupportAccess from './SupportAccess'

export default [
  { id: 'AA1', name: 'AA1 · Admin — Advisor accounts', figma: '289:37046', path: '/x/aa1-admin-advisor-accounts', Component: AdvisorAccounts },
  { id: 'AA2', name: 'AA2 · Admin — Account detail', figma: '289:37431', path: '/x/aa2-admin-account-detail', Component: AccountDetail },
  { id: 'AA3', name: 'AA3 · Admin — Suspend account', figma: '289:37632', path: '/x/aa3-admin-suspend-account', Component: SuspendAccount },
  { id: 'AA4', name: 'AA4 · Admin — Record subscription payment', figma: '289:37787', path: '/x/aa4-admin-record-subscription-payment', Component: RecordPayment },
  { id: 'AA5', name: 'AA5 · Admin — Reject KYC', figma: '289:37981', path: '/x/aa5-admin-reject-kyc', Component: RejectKyc },
  { id: 'AA6', name: 'AA6 · Admin — Product corrections', figma: '290:37369', path: '/x/aa6-admin-product-corrections', Component: ProductCorrections },
  { id: 'AA7', name: 'AA7 · Advisor — Suggest correction', figma: '290:37622', path: '/x/aa7-advisor-suggest-correction', Component: SuggestCorrection },
  { id: 'AA8', name: 'AA8 · Admin — Message templates', figma: '290:37945', path: '/x/aa8-admin-message-templates', Component: MessageTemplates },
  { id: 'AA9', name: 'AA9 · Admin — SkyUp users', figma: '290:38242', path: '/x/aa9-admin-skyup-users', Component: SkyupUsers },
  { id: 'AA10', name: 'AA10 · Admin — Configuration', figma: '290:38503', path: '/x/aa10-admin-configuration', Component: Configuration },
  { id: 'AA11', name: 'AA11 · Admin — Audit log', figma: '290:38759', path: '/x/aa11-admin-audit-log', Component: AuditLog },
  { id: 'AA12', name: 'AA12 · Admin — Agent-code flags', figma: '290:38974', path: '/x/aa12-admin-agent-code-flags', Component: AgentCodeFlags },
  { id: 'AA13', name: 'AA13 · Admin — Support access', figma: '290:39177', path: '/x/aa13-admin-support-access', Component: SupportAccess },
]
