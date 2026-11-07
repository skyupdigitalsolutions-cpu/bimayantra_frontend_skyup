import DashboardTablet from './DashboardTablet'
import DashboardMobile from './DashboardMobile'
import AddTaskMobile from './AddTaskMobile'
import LeadsMobile from './LeadsMobile'
import NewLeadMobile from './NewLeadMobile'

// Responsive frames (R1–R5). Each route renders the matching responsive screen.
export default [
  { id: 'R1', name: 'R1 · Dashboard — Tablet (834)', figma: '264:26241', path: '/x/r1-dashboard-tablet-834', Component: DashboardTablet },
  { id: 'R2', name: 'R2 · Dashboard — Mobile (390)', figma: '266:26531', path: '/x/r2-dashboard-mobile-390', Component: DashboardMobile },
  { id: 'R3', name: 'R3 · Add task — Mobile bottom sheet', figma: '266:26833', path: '/x/r3-add-task-mobile-bottom-sheet', Component: AddTaskMobile },
  { id: 'R4', name: 'R4 · Leads — Mobile list', figma: '266:27118', path: '/x/r4-leads-mobile-list', Component: LeadsMobile },
  { id: 'R5', name: 'R5 · New lead — Mobile form', figma: '266:27267', path: '/x/r5-new-lead-mobile-form', Component: NewLeadMobile },
]
