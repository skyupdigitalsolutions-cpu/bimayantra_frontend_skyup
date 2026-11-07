// Figma 283:32914 · PY5 · Payment — Reversed
import { QuoteDetailBase, CHIPS, Btn, Toast } from './_parts'
import { paidActivity } from '../../data/states-quotation'

export default function PaymentReversed() {
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={[Btn.acceptLocked()]} activity={paidActivity} payment="reversed">
      <Toast>Payment reversed · you can record it again</Toast>
    </QuoteDetailBase>
  )
}
