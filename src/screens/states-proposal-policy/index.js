// Screens for this section. Each entry: { id, name, figma, path, Component }
import ProposalsList from './ProposalsList'
import ProposalMarkDeclined from './ProposalMarkDeclined'
import ProposalDeclined from './ProposalDeclined'
import ProposalCancel from './ProposalCancel'
import PolicyRecordCancellation from './PolicyRecordCancellation'
import PolicyCancelled from './PolicyCancelled'
import PolicyExpired from './PolicyExpired'
import PolicyRenewed from './PolicyRenewed'
import RenewalInFollowUp from './RenewalInFollowUp'
import RenewalNotRenewing from './RenewalNotRenewing'
import RenewalReopen from './RenewalReopen'
import RenewalLapsed from './RenewalLapsed'
import RenewalPauseReminders from './RenewalPauseReminders'

export default [
  { id: 'PRL', name: 'PRL · Proposals list', figma: '285:31639', path: '/proposals', Component: ProposalsList },
  { id: 'PRD', name: 'PRD · Proposal — Mark declined', figma: '285:31926', path: '/x/prd-proposal-mark-declined', Component: ProposalMarkDeclined },
  { id: 'PRD2', name: 'PRD2 · Proposal — Declined', figma: '285:32087', path: '/x/prd2-proposal-declined', Component: ProposalDeclined },
  { id: 'PRC', name: 'PRC · Proposal — Cancel', figma: '285:32252', path: '/x/prc-proposal-cancel', Component: ProposalCancel },
  { id: 'PO1', name: 'PO1 · Policy — Record cancellation', figma: '285:32464', path: '/x/po1-policy-record-cancellation', Component: PolicyRecordCancellation },
  { id: 'PO2', name: 'PO2 · Policy — Cancelled', figma: '285:32611', path: '/x/po2-policy-cancelled', Component: PolicyCancelled },
  { id: 'PO3', name: 'PO3 · Policy — Expired', figma: '285:32846', path: '/x/po3-policy-expired', Component: PolicyExpired },
  { id: 'PO4', name: 'PO4 · Policy — Renewed', figma: '285:33076', path: '/x/po4-policy-renewed', Component: PolicyRenewed },
  { id: 'RS1', name: 'RS1 · Renewal — In follow-up', figma: '285:33305', path: '/x/rs1-renewal-in-follow-up', Component: RenewalInFollowUp },
  { id: 'RS2', name: 'RS2 · Renewal — Not renewing', figma: '285:33452', path: '/x/rs2-renewal-not-renewing', Component: RenewalNotRenewing },
  { id: 'RS3', name: 'RS3 · Renewal — Reopen', figma: '285:33618', path: '/x/rs3-renewal-reopen', Component: RenewalReopen },
  { id: 'RS4', name: 'RS4 · Renewal — Lapsed', figma: '285:33778', path: '/x/rs4-renewal-lapsed', Component: RenewalLapsed },
  { id: 'RS5', name: 'RS5 · Renewal — Pause reminders', figma: '285:33944', path: '/x/rs5-renewal-pause-reminders', Component: RenewalPauseReminders },
]
