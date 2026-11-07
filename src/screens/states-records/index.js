// Screens for this section. Each entry: { id, name, figma, path, Component }
import HolderDeactivateBlocked from './HolderDeactivateBlocked'
import HolderInactive from './HolderInactive'
import FamilyMemberInactive from './FamilyMemberInactive'
import DocumentChangeLabel from './DocumentChangeLabel'
import VehicleMarkInactive from './VehicleMarkInactive'
import AllTasks from './AllTasks'
import Notifications from './Notifications'
import CommsScheduled from './CommsScheduled'
import CommsSent from './CommsSent'
import MessageDetail from './MessageDetail'
import CancelScheduledMessage from './CancelScheduledMessage'

export default [
  { id: 'CU1', name: 'CU1 · Policy holder — Deactivate (blocked)', figma: '286:33182', path: '/x/cu1-policy-holder-deactivate-blocked', Component: HolderDeactivateBlocked },
  { id: 'CU2', name: 'CU2 · Policy holder — Inactive', figma: '286:33411', path: '/x/cu2-policy-holder-inactive', Component: HolderInactive },
  { id: 'FM1', name: 'FM1 · Family — member inactive', figma: '286:33736', path: '/x/fm1-family-member-inactive', Component: FamilyMemberInactive },
  { id: 'DL1', name: 'DL1 · Document — Change label', figma: '286:34110', path: '/x/dl1-document-change-label', Component: DocumentChangeLabel },
  { id: 'VH1', name: 'VH1 · Vehicle — Mark inactive', figma: '286:34407', path: '/x/vh1-vehicle-mark-inactive', Component: VehicleMarkInactive },
  { id: 'TSK', name: 'TSK · All tasks', figma: '286:34658', path: '/tasks', Component: AllTasks },
  { id: 'NTF', name: 'NTF · Notifications', figma: '286:35009', path: '/notifications', Component: Notifications },
  { id: 'CM1', name: 'CM1 · Communications — Scheduled', figma: '286:35199', path: '/x/cm1-communications-scheduled', Component: CommsScheduled },
  { id: 'CM2', name: 'CM2 · Communications — Sent', figma: '286:35386', path: '/x/cm2-communications-sent', Component: CommsSent },
  { id: 'CM3', name: 'CM3 · Message detail', figma: '286:35593', path: '/x/cm3-message-detail', Component: MessageDetail },
  { id: 'CM4', name: 'CM4 · Cancel scheduled message', figma: '286:35745', path: '/x/cm4-cancel-scheduled-message', Component: CancelScheduledMessage },
]
