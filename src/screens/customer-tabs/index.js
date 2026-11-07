// Screens for this section. Each entry: { id, name, figma, path, Component }
import CustomerFamily from './CustomerFamily'
import CustomerConsent from './CustomerConsent'
import CustomerDocuments from './CustomerDocuments'
import CustomerVehicles from './CustomerVehicles'
import CustomerQuotations from './CustomerQuotations'
import CustomerPolicies from './CustomerPolicies'
import CustomerPayments from './CustomerPayments'
import CustomerRenewals from './CustomerRenewals'
import CustomerActivities from './CustomerActivities'

export default [
  { id: '05a', name: '05a · Customer — Family', figma: '55:8054', path: '/x/05a-customer-family', Component: CustomerFamily },
  { id: '05b', name: '05b · Customer — Consent', figma: '55:8353', path: '/x/05b-customer-consent', Component: CustomerConsent },
  { id: '05c', name: '05c · Customer — Documents', figma: '55:8652', path: '/x/05c-customer-documents', Component: CustomerDocuments },
  { id: '05d', name: '05d · Customer — Vehicles', figma: '55:8898', path: '/x/05d-customer-vehicles', Component: CustomerVehicles },
  { id: '05e', name: '05e · Customer — Quotations', figma: '55:9116', path: '/x/05e-customer-quotations', Component: CustomerQuotations },
  { id: '05f', name: '05f · Customer — Policies', figma: '56:8633', path: '/x/05f-customer-policies', Component: CustomerPolicies },
  { id: '05g', name: '05g · Customer — Payments', figma: '56:8884', path: '/x/05g-customer-payments', Component: CustomerPayments },
  { id: '05h', name: '05h · Customer — Renewals', figma: '56:9120', path: '/x/05h-customer-renewals', Component: CustomerRenewals },
  { id: '05i', name: '05i · Customer — Activities', figma: '56:9324', path: '/x/05i-customer-activities', Component: CustomerActivities },
]
