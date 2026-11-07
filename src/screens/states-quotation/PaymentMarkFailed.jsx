// Figma 283:31892 · PY1 · Payment — Mark failed
import { QuoteDetailBase, CHIPS, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, DangerButton, TextField } from './_parts'
import { sharedActions } from './QuotationMarkRejected'
import { sharedActivity } from '../../data/states-quotation'

export default function PaymentMarkFailed() {
  return (
    <QuoteDetailBase chip={CHIPS.shared} actions={sharedActions} activity={sharedActivity}>
      <Scrim to="/quotations/1" />
      <Dialog top={150}>
        <DialogIcon icon="card" />
        <DialogTitle>Mark payment as failed?</DialogTitle>
        <DialogText>The payment link stays on record. Add a new link or method to try again.</DialogText>
        <TextField label="Reason *" defaultValue="Card declined on insurer portal" />
        <DialogActions cancelTo="/quotations/1" confirm={<DangerButton to="/x/py2-payment-failed">Mark failed</DangerButton>} />
      </Dialog>
    </QuoteDetailBase>
  )
}
