import LeadChangeStatus from './LeadChangeStatus'
import LeadLogContact from './LeadLogContact'
import LeadMarkAsLost from './LeadMarkAsLost'
import LeadLost from './LeadLost'
import LeadReopen from './LeadReopen'
import LeadConverted from './LeadConverted'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'LS1', name: 'LS1 · Lead — Change status', figma: '282:28800', path: '/x/ls1-lead-change-status', Component: LeadChangeStatus },
  { id: 'LS2', name: 'LS2 · Lead — Log contact', figma: '282:29000', path: '/x/ls2-lead-log-contact', Component: LeadLogContact },
  { id: 'LS3', name: 'LS3 · Lead — Mark as lost', figma: '282:29230', path: '/x/ls3-lead-mark-as-lost', Component: LeadMarkAsLost },
  { id: 'LS4', name: 'LS4 · Lead — Lost', figma: '282:29416', path: '/x/ls4-lead-lost', Component: LeadLost },
  { id: 'LS5', name: 'LS5 · Lead — Reopen', figma: '282:29717', path: '/x/ls5-lead-reopen', Component: LeadReopen },
  { id: 'LS6', name: 'LS6 · Lead — Converted', figma: '282:29893', path: '/x/ls6-lead-converted', Component: LeadConverted },
]
