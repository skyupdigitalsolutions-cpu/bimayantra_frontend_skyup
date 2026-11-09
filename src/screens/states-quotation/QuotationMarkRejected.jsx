// Figma 283:30164 · QS3 · Quotation — Mark rejected
import { useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import { QuoteDetailBase, CHIPS, Btn, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, DangerButton, FieldLabel, fieldShell } from './_parts'
import { sharedActivity, rejectReasons } from '../../data/states-quotation'

export const sharedActions = [Btn.reject(), Btn.reviseOutline(), Btn.acceptLocked()]

export default function QuotationMarkRejected() {
  const [reason, setReason] = useState(rejectReasons[0])
  const [note, setNote] = useState('Wants a lower sum insured option.')
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity}>
      <Scrim to="/quotations/1" />
      <Dialog top={120}>
        <DialogIcon icon="x" />
        <DialogTitle>Mark as rejected?</DialogTitle>
        <DialogText>Kavya said no to this quotation. You can still revise it later.</DialogText>
        <label className="flex flex-col gap-2">
          <FieldLabel>Reason *</FieldLabel>
          <span className={`${fieldShell} relative`}>
            <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0" value={reason} onChange={(e) => setReason(e.target.value)}>
              {rejectReasons.map((r) => <option key={r}>{r}</option>)}
            </SelectCompat>
          </span>
          <span className="text-[12px] font-medium text-muted">{rejectReasons.join(' · ')}</span>
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Note (optional)</FieldLabel>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="h-24 resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none focus:ring-2 focus:ring-blue/30" />
        </label>
        <DialogActions cancelTo="/quotations/1" confirm={<DangerButton to="/x/qs4-quotation-rejected">Mark rejected</DangerButton>} />
      </Dialog>
    </QuoteDetailBase>
  )
}
