// Figma 287:35164 · KY3 · KYC — Rejected
import { KycPage, Chip, Btn } from './_parts'

export default function KY3KYCRejected() {
  return (
    <KycPage chip={<Chip tone="red" icon="x">Rejected</Chip>}>
      <section className="flex flex-col items-start gap-3 rounded-[28px] border border-[#f2c4c8] bg-[#fff7f7] px-[26px] py-[22px]">
        <p className="text-[18px] font-bold text-[#b4323c]">KYC was not accepted</p>
        <p className="text-[13px] font-semibold text-[#b4323c]">Reason from SkyUp: PAN photo is blurred and the name is not readable.</p>
        <p className="text-[13px] font-medium text-muted">Upload a clear photo and submit again. Everything else is kept.</p>
        <Btn icon="refresh" to="/x/ky1-kyc-not-submitted">Fix and resubmit</Btn>
      </section>
    </KycPage>
  )
}
