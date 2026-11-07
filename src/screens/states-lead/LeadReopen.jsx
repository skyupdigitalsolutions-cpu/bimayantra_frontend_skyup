// Figma 282:29717 · LS5 · Lead — Reopen
import { useState } from 'react'
import { LeadDetailBase, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, TextField, FootButton } from './_parts'

export default function LeadReopen() {
  const [reason, setReason] = useState('He called back; bank policy fell through.')
  return (
    <LeadDetailBase
      state="lost"
      lostChip="overdue"
      toast="Lead marked lost · 1 follow-up task cancelled"
      overlay={
        <>
          <Scrim to="/x/ls4-lead-lost" />
          <Dialog top={140}>
            <DialogIcon icon="refresh" bg="#e8f0fd" color="#1f5fd6" />
            <DialogTitle>Reopen this lead?</DialogTitle>
            <DialogText>It moves back to Contacted and appears on the board again.</DialogText>
            <TextField label="Reason *" value={reason} onChange={setReason} />
            <div className="flex gap-2.5">
              <FootButton to="/x/ls4-lead-lost">Cancel</FootButton>
              <FootButton variant="navy" icon="refresh" to="/leads/1">Reopen</FootButton>
            </div>
          </Dialog>
        </>
      }
    />
  )
}
