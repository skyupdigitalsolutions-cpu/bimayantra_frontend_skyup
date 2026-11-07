// Figma 283:30360 · QS4 · Quotation — Rejected
import { QuoteDetailBase, CHIPS, Btn, Toast } from './_parts'
import { sharedActivity } from '../../data/states-quotation'

export const closedActions = [Btn.cancel(), Btn.reviseNavy()]

export default function QuotationRejected() {
  return (
    <QuoteDetailBase chip={CHIPS.rejected} actions={closedActions} activity={sharedActivity}>
      <Toast>Marked rejected · reason: premium too high</Toast>
    </QuoteDetailBase>
  )
}
