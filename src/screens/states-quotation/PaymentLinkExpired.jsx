// Figma 283:32399 · PY3 · Payment — Link expired
import { QuoteDetailBase, CHIPS } from './_parts'
import { sharedActions } from './QuotationMarkRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function PaymentLinkExpired() {
  return <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity} payment="linkExpired" />
}
