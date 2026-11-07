// Figma 245:20499 · CS6 · Withdraw personal-data consent
import { useState } from 'react'
import { ConsentPage, Dialog, DialogIcon, Btn, Label, InputBox, Check, EffectsBox } from './_parts'

export default function WithdrawPersonalDataConsent() {
  const [reason, setReason] = useState('Customer asked by email on 26 Oct')
  const [ok, setOk] = useState(false)
  return (
    <ConsentPage
      overlay={
        <Dialog top={80}>
          <DialogIcon icon="lock" />
          <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">Withdraw consent to store personal data?</p>
          <p className="text-[13px] leading-5 font-medium text-muted">This affects the whole household. Use it only if Kavya asked for it.</p>
          <EffectsBox
            tone="red"
            title="What happens"
            items={[
              'PAN and Aadhaar numbers are hidden and can’t be shown',
              'No new identity documents can be added',
              'Proposals that need KYC can’t be submitted',
              'Existing documents are kept as the law requires',
            ]}
          />
          <div className="flex flex-col gap-2">
            <Label>Reason *</Label>
            <InputBox value={reason} onChange={setReason} />
          </div>
          <label className="flex items-center gap-2.5">
            <Check checked={ok} onChange={setOk} />
            <span className="text-[13px] font-semibold text-ink">I understand the effects above.</span>
          </label>
          <div className="flex gap-2.5">
            <Btn to="/x/05b-customer-consent">Cancel</Btn>
            <Btn variant="danger" icon="x" to="/x/cs7-personal-data-consent-withdrawn">Withdraw</Btn>
          </div>
        </Dialog>
      }
    />
  )
}
