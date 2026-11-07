// Figma 289:37981 · AA5 · Admin — Reject KYC
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KycBase } from '../admin/AdvisorKyc'
import { PanelScrim, ADialog, DialogIcon, DialogTitle, DialogText, AField, ASelect, DialogButtons, DangerButton } from './_parts'

export default function RejectKyc() {
  const nav = useNavigate()
  const [note, setNote] = useState('Please upload a clear photo in daylight.')
  return (
    <KycBase
      overlay={
        <PanelScrim onClose={() => nav('/x/24-skyup-admin-advisor-kyc')}>
          <ADialog top={120}>
            <DialogIcon icon="shield" />
            <DialogTitle>Reject Suresh Rao’s KYC?</DialogTitle>
            <DialogText>He’ll see your reason and can resubmit.</DialogText>
            <AField label="Reason *">
              <ASelect options={['PAN photo is blurred and the name is not readable.', 'Licence number does not match IRDAI records.', 'Licence has expired.']} />
            </AField>
            <AField label="Note to advisor">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-24 resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none"
              />
            </AField>
            <DialogButtons cancelTo="/x/24-skyup-admin-advisor-kyc">
              <DangerButton to="/x/24-skyup-admin-advisor-kyc" icon="x">Reject KYC</DangerButton>
            </DialogButtons>
          </ADialog>
        </PanelScrim>
      }
    />
  )
}
