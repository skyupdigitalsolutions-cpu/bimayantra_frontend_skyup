// Figma 283:30549 · QS5 · Quotation — Expired
import { QuoteDetailBase, CHIPS, Toast } from './_parts'
import { closedActions } from './QuotationRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function QuotationExpired() {
  return (
    <QuoteDetailBase chip={CHIPS.expired} actions={closedActions} activity={sharedActivity} link="expired">
      <Toast>Expired: no payment was recorded within 15 days. The payment link stays open.</Toast>
    </QuoteDetailBase>
  )
}
