// Figma 245:19854 · CS4 · Withdraw consent
import { useState } from 'react'
import { ConsentPage, Dialog, DialogIcon, Btn, Label, RadioCard, EffectsBox } from './_parts'

const REASONS = ['Kavya asked to stop', 'Replied STOP on WhatsApp', 'Other']

export default function WithdrawConsent() {
  const [reason, setReason] = useState(REASONS[0])
  return (
    <ConsentPage
      overlay={
        <Dialog top={90}>
          <DialogIcon />
          <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">Withdraw WhatsApp consent for Kavya?</p>
          <p className="text-[13px] leading-5 font-medium text-muted">WhatsApp messages to Kavya stop straight away.</p>
          <div className="flex flex-col gap-2">
            <Label>Reason *</Label>
            {REASONS.map((r) => (
              <RadioCard key={r} on={reason === r} onClick={() => setReason(r)} title={r} />
            ))}
          </div>
          <EffectsBox
            title="What changes"
            items={['2 scheduled WhatsApp messages are cancelled', 'Renewal reminders go by email only', 'You can record consent again later']}
          />
          <div className="flex gap-2.5">
            <Btn to="/x/05b-customer-consent">Cancel</Btn>
            <Btn variant="danger" icon="x" to="/x/cs5-consent-withdrawn">Withdraw consent</Btn>
          </div>
        </Dialog>
      }
    />
  )
}
