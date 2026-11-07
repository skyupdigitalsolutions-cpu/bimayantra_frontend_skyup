// Figma 283:31061 · QS7 · Quotation — Cancelled
import { QuoteDetailBase, CHIPS, Btn, Toast } from './_parts'
import { sharedActivity } from '../../data/states-quotation'

export default function QuotationCancelled() {
  return (
    <QuoteDetailBase chip={CHIPS.cancelled} actions={[Btn.duplicate()]} activity={sharedActivity} payment="cancelled">
      <Toast>Cancelled · reason: customer bought a different product</Toast>
    </QuoteDetailBase>
  )
}
