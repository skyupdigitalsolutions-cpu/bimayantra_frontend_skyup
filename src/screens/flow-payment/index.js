// Screens for this section. Each entry: { id, name, figma, path, Component }
import AddPaymentLink from './AddPaymentLink'
import RecordPayment from './RecordPayment'
import PaymentRecorded from './PaymentRecorded'

export default [
  { id: 'P1', name: 'P1 · Payment — Add payment link', figma: '42:5774', path: '/x/p1-payment-add-payment-link', Component: AddPaymentLink },
  { id: 'P2', name: 'P2 · Payment — Record payment', figma: '42:5954', path: '/x/p2-payment-record-payment', Component: RecordPayment },
  { id: 'P3', name: 'P3 · Payment — Recorded', figma: '42:6143', path: '/x/p3-payment-recorded', Component: PaymentRecorded },
]
