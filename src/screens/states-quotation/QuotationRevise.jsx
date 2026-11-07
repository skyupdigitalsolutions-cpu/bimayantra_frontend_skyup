// Figma 283:31388 · QS8 · Quotation — Revise
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { QuoteDetailBase, CHIPS, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, PillButton, NAVY_SH } from './_parts'
import { sharedActions } from './QuotationMarkRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function QuotationRevise() {
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity}>
      <Scrim to="/quotations/1" />
      <Dialog top={160}>
        <DialogIcon icon="edit" bg="#e8f0fd" color="#1f5fd6" />
        <DialogTitle>Create revision R3?</DialogTitle>
        <DialogText>R2 becomes Superseded. The new revision is priced again with every check.</DialogText>
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 text-[13px] font-semibold text-blue">
          <Icon name="refresh" size={16} />
          3 of 20 revisions used for this quotation.
        </div>
        <DialogActions
          cancelTo="/quotations/1"
          confirm={<PillButton variant="navy" icon="edit" className={cx('flex-1 justify-center', NAVY_SH)} to="/x/q6-quotation-details">Create R3</PillButton>}
        />
      </Dialog>
    </QuoteDetailBase>
  )
}
