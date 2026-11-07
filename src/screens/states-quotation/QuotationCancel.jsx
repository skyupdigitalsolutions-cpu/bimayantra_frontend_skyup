// Figma 283:30872 · QS6 · Quotation — Cancel
import { QuoteDetailBase, CHIPS, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, DangerButton, TextField } from './_parts'
import { sharedActions } from './QuotationMarkRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function QuotationCancel() {
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity}>
      <Scrim to="/quotations/1" />
      <Dialog top={150}>
        <DialogIcon icon="alert" />
        <DialogTitle>Cancel QT-202610-00012 R2?</DialogTitle>
        <DialogText>The customer link stops working and the open payment link is cancelled.</DialogText>
        <TextField label="Reason *" defaultValue="Customer bought a different product" />
        <DialogActions cancelTo="/quotations/1" confirm={<DangerButton to="/x/qs7-quotation-cancelled">Cancel quotation</DangerButton>} />
      </Dialog>
    </QuoteDetailBase>
  )
}
