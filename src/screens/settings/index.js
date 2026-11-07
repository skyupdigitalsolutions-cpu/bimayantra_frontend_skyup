// Screens for this section. Each entry: { id, name, figma, path, Component }
import Profile from './Profile'
import PlanBilling from './PlanBilling'
import Kyc from './Kyc'
import Insurers from './Insurers'
import Wallet from './Wallet'
import Assistants from './Assistants'
import Referrers from './Referrers'
import SupportAccess from './SupportAccess'
import ExportData from './ExportData'
import ActivityLog from './ActivityLog'
import Security from './Security'

export default [
  { id: '16', name: '16 · Settings — Profile', figma: '13:1595', path: '/settings', Component: Profile },
  { id: '17', name: '17 · Settings — Plan and billing', figma: '13:1854', path: '/x/17-settings-plan-and-billing', Component: PlanBilling },
  { id: 'S03', name: 'S03 · Settings — KYC', figma: '47:7203', path: '/x/s03-settings-kyc', Component: Kyc },
  { id: 'S04', name: 'S04 · Settings — My insurers', figma: '47:7464', path: '/x/s04-settings-my-insurers', Component: Insurers },
  { id: 'S05', name: 'S05 · Settings — WhatsApp wallet', figma: '47:7716', path: '/x/s05-settings-whatsapp-wallet', Component: Wallet },
  { id: 'S06', name: 'S06 · Settings — Assistants', figma: '47:7954', path: '/x/s06-settings-assistants', Component: Assistants },
  { id: 'S07', name: 'S07 · Settings — Referrers', figma: '47:8206', path: '/x/s07-settings-referrers', Component: Referrers },
  { id: 'S08', name: 'S08 · Settings — Support access', figma: '48:7887', path: '/x/s08-settings-support-access', Component: SupportAccess },
  { id: 'S09', name: 'S09 · Settings — Export my data', figma: '48:8102', path: '/x/s09-settings-export-my-data', Component: ExportData },
  { id: 'S10', name: 'S10 · Settings — Activity log', figma: '48:8364', path: '/x/s10-settings-activity-log', Component: ActivityLog },
  { id: 'S11', name: 'S11 · Settings — Security', figma: '48:8610', path: '/x/s11-settings-security', Component: Security },
]
