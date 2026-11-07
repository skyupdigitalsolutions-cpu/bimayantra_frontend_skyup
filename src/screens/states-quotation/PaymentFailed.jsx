// Figma 283:32081 · PY2 · Payment — Failed
import { QuoteDetailBase, CHIPS, Toast } from './_parts'
import { sharedActions } from './QuotationMarkRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function PaymentFailed() {
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity} payment="failed">
      <Toast>Payment marked failed · card declined</Toast>
    </QuoteDetailBase>
  )
}
