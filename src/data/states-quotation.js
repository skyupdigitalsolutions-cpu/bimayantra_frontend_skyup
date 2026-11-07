// Mock copy for the Quotation / Payment lifecycle states (QS1–QS9, PY1–PY5).
import { quotation as Q } from './sales'

export const revisionEvent = Q.activity[Q.activity.length - 1]
export const sharedActivity = Q.activity
export const paidActivity = [Q.paymentEvent, ...Q.activity]

export const rejectReasons = ['Premium too high', 'Chose another insurer', 'Not interested now', 'Other']

export const shareChannels = [
  { key: 'email', icon: 'mail', title: 'Email', sub: 'kavya.hegde@example.in', consent: true, cta: 'Send by email' },
  { key: 'whatsapp', icon: 'chat', title: 'WhatsApp', sub: 'Opens your WhatsApp with the link', consent: true, cta: 'Open WhatsApp' },
  { key: 'sms', icon: 'phone', title: 'SMS', sub: 'No SMS consent recorded', blocked: true },
  { key: 'copy', icon: 'link', title: 'Copy link', sub: 'Customer page link', cta: 'Copy link' },
]

export const reverseOptions = [
  { key: 'mistake', title: 'Recorded by mistake', sub: 'The payment returns to Awaiting' },
  { key: 'refund', title: 'Insurer refunded the premium', sub: 'The linked policy becomes Cancelled' },
]
