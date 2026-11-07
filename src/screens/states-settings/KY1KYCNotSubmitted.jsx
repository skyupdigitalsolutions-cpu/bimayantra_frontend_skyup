// Figma 287:34616 · KY1 · KYC — Not submitted
import { useState } from 'react'
import Icon from '../../components/Icon'
import { KycPage, Chip, SCard, CardHead, Field, TextInput, Check, Btn, ROUTES } from './_parts'

export default function KY1KYCNotSubmitted() {
  const [ok, setOk] = useState(true)
  return (
    <KycPage chip={<Chip tone="gray">Not submitted</Chip>}>
      <SCard className="gap-4">
        <CardHead title="Submit your KYC" sub="SkyUp checks it once, usually within 2 working days" />
        <div className="flex gap-3.5">
          <Field label="PAN *" className="flex-1"><TextInput defaultValue="ABCPR1234K" /></Field>
          <Field label="Name as on PAN *" className="flex-1"><TextInput defaultValue="Suresh Rao" /></Field>
        </div>
        <div className="flex gap-3.5">
          <label className="flex h-[74px] flex-1 cursor-pointer items-center gap-3 rounded-[18px] border border-dashed border-[#c3ccd8] bg-white p-4 hover:bg-panel">
            <input type="file" className="hidden" />
            <span className="flex size-10 items-center justify-center rounded-full bg-[#e8f0fd] text-blue"><Icon name="upload" size={18} /></span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-ink">PAN card</span>
              <span className="text-[11px] font-medium text-muted">Upload a photo or PDF</span>
            </span>
          </label>
          <div className="flex h-[74px] flex-1 items-center gap-3 rounded-[18px] border border-[#c7ebda] bg-[#f5fbf8] p-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]"><Icon name="check" size={18} /></span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-ink">IRDAI licence</span>
              <span className="text-[11px] font-medium text-[#127650]">licence.pdf · uploaded</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Check checked={ok} onChange={setOk} />
          <span className="text-[13px] font-semibold text-ink">I confirm these documents are mine and valid.</span>
        </div>
        <Btn icon="send" to={ROUTES.kyc} className="self-start">Submit for review</Btn>
      </SCard>
    </KycPage>
  )
}
