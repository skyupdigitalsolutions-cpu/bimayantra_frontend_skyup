// Figma 283:31577 · QS9 · Quotation — Delete draft
// Underlying screen is the Quotations list (07L); the dialog is portalled into its workspace panel.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import QuotationsList from '../sales/QuotationsList'
import { Scrim, Dialog, DialogIcon, DialogTitle, DialogText, DialogActions, DangerButton } from './_parts'

export default function QuotationDeleteDraft() {
  const [panel, setPanel] = useState(null)
  useEffect(() => setPanel(document.querySelector('main')), [])
  return (
    <>
      <QuotationsList />
      {panel && createPortal(
        <>
          <Scrim to="/quotations" />
          <Dialog top={180}>
            <DialogIcon icon="x" />
            <DialogTitle>Delete draft QT-202610-00011?</DialogTitle>
            <DialogText>It was never shared. Its number won’t be reused.</DialogText>
            <DialogActions cancelTo="/quotations" confirm={<DangerButton to="/quotations">Delete draft</DangerButton>} />
          </Dialog>
        </>,
        panel,
      )}
    </>
  )
}
