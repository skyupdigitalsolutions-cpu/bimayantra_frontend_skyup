import AddTaskEmpty from './AddTaskEmpty'
import AddTaskErrors from './AddTaskErrors'
import EditTask from './EditTask'
import TaskCreated from './TaskCreated'
import TaskCompleted from './TaskCompleted'
import RescheduleTask from './RescheduleTask'
import LeadsList from './LeadsList'
import LeadsListFiltered from './LeadsListFiltered'
import NewLeadSourceOptions from './NewLeadSourceOptions'
import EditLead from './EditLead'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'F1b', name: 'F1b · New lead — Lead source options', figma: '263:25648', path: '/x/f1b-new-lead-lead-source-options', Component: NewLeadSourceOptions },
  { id: 'LE1', name: 'LE1 · Edit lead', figma: '263:25992', path: '/x/le1-edit-lead', Component: EditLead },
  { id: '02b', name: '02b · Leads — List', figma: '263:26243', path: '/x/02b-leads-list', Component: LeadsList },
  { id: '02c', name: '02c · Leads — List filtered by source', figma: '263:26660', path: '/x/02c-leads-list-filtered-by-source', Component: LeadsListFiltered },
  { id: 'TK1', name: 'TK1 · Add task — empty', figma: '272:26780', path: '/x/tk1-add-task-empty', Component: AddTaskEmpty },
  { id: 'TK2', name: 'TK2 · Add task — validation errors', figma: '272:27214', path: '/x/tk2-add-task-validation-errors', Component: AddTaskErrors },
  { id: 'TK4', name: 'TK4 · Edit task', figma: '272:27657', path: '/x/tk4-edit-task', Component: EditTask },
  { id: 'TK3', name: 'TK3 · Task created', figma: '272:28100', path: '/x/tk3-task-created', Component: TaskCreated },
  { id: 'TK5', name: 'TK5 · Task completed', figma: '272:29079', path: '/x/tk5-task-completed', Component: TaskCompleted },
  { id: 'TK6', name: 'TK6 · Reschedule task', figma: '272:30032', path: '/x/tk6-reschedule-task', Component: RescheduleTask },
]
