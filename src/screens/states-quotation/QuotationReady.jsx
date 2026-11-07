// Figma 283:29629 · QS1 · Quotation — Ready (not shared)
import { QuoteDetailBase, CHIPS, Btn } from './_parts'
import { revisionEvent } from '../../data/states-quotation'

export const readyActions = [Btn.edit(), Btn.cancel(), Btn.share()]

export default function QuotationReady() {
  return <QuoteDetailBase chip={CHIPS.ready} actions={readyActions} activity={[revisionEvent]} link="notShared" />
}
