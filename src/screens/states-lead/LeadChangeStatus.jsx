// Figma 282:28800 · LS1 · Lead — Change status
import { useState } from 'react'
import Icon from '../../components/Icon'
import { LeadDetailBase, Scrim, Dialog, DialogTitle, DialogText, RadioOption, TextField, FootButton } from './_parts'

const OPTIONS = [
  { key: 'contacted', title: 'Contacted', sub: 'You spoke to him' },
  { key: 'qualified', title: 'Qualified', sub: 'Needs and budget confirmed' },
  { key: 'followup', title: 'Follow-up', sub: 'Current status', disabled: true },
  { key: 'lost', title: 'Lost', sub: 'Asks for a reason', to: '/x/ls3-lead-mark-as-lost' },
]

export default function LeadChangeStatus() {
  const [sel, setSel] = useState('contacted')
  const [note, setNote] = useState('Spoke after Diwali, wants quotes this week.')
  return (
    <LeadDetailBase
      overlay={
        <>
          <Scrim to="/leads/1" />
          <Dialog top={90}>
            <DialogTitle>Change status</DialogTitle>
            <DialogText>Ramesh Gowda is in Follow-up. Only allowed moves are shown.</DialogText>
            {OPTIONS.map((o) => (
              <RadioOption key={o.key} {...o} selected={sel === o.key} onSelect={() => setSel(o.key)} />
            ))}
            <TextField label="Note (optional)" value={note} onChange={setNote} />
            <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3 text-blue">
              <Icon name="user-plus" size={16} />
              <p className="text-[13px] font-semibold">To convert, use Convert to policy holder.</p>
            </div>
            <div className="flex gap-2.5">
              <FootButton to="/leads/1">Cancel</FootButton>
              <FootButton variant="navy" icon="check" to="/leads/1">Change status</FootButton>
            </div>
          </Dialog>
        </>
      }
    />
  )
}
