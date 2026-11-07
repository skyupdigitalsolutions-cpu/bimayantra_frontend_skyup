// Screens for this section. Each entry: { id, name, figma, path, Component }
import NewLead from './NewLead'
import ConvertLead from './ConvertLead'
import NewCustomer from './NewCustomer'

export default [
  { id: 'F1', name: 'F1 · New lead', figma: '39:3634', path: '/x/f1-new-lead', Component: NewLead },
  { id: 'F2', name: 'F2 · Convert lead to customer', figma: '39:3892', path: '/x/f2-convert-lead-to-customer', Component: ConvertLead },
  { id: 'F3', name: 'F3 · New customer', figma: '39:4123', path: '/x/f3-new-customer', Component: NewCustomer },
]
