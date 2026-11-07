// Figma 282:29230 · LS3 · Lead — Mark as lost
import { useState } from 'react'
import { LeadDetailBase, Scrim, Dialog, DialogIcon, DialogTitle, DialogText, SelectField, AreaField, FootButton } from './_parts'

const REASONS = ['Bought from another advisor', 'Not interested', 'Bought elsewhere', 'Price too high', 'Not reachable', 'Duplicate', 'Other']

export default function LeadMarkAsLost() {
  const [reason, setReason] = useState(REASONS[0])
  const [note, setNote] = useState('Took a policy through his bank.')
  return (
    <LeadDetailBase
      overlay={
        <>
          <Scrim to="/leads/1" />
          <Dialog top={110}>
            <DialogIcon icon="x" bg="#fbebec" color="#b4323c" />
            <DialogTitle>Mark Ramesh Gowda as lost?</DialogTitle>
            <DialogText>Open follow-up tasks are cancelled. You can reopen the lead later.</DialogText>
            <SelectField
              label="Reason *"
              value={reason}
              onChange={setReason}
              options={REASONS}
              hint={<>Not interested · Bought elsewhere · Price too high · Not reachable · Duplicate ·<br />Other</>}
            />
            <AreaField label="Note (optional)" value={note} onChange={setNote} />
            <div className="flex gap-2.5">
              <FootButton to="/leads/1">Cancel</FootButton>
              <FootButton variant="danger" icon="x" to="/x/ls4-lead-lost">Mark as lost</FootButton>
            </div>
          </Dialog>
        </>
      }
    />
  )
}
