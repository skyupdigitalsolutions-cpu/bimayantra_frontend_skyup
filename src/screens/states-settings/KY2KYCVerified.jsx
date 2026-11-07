// Figma 287:34905 · KY2 · KYC — Verified
import Icon from '../../components/Icon'
import { KycPage, Chip } from './_parts'

export default function KY2KYCVerified() {
  return (
    <KycPage chip={<Chip tone="green" icon="check">Verified</Chip>}>
      <section className="flex h-[110px] items-center gap-4 rounded-[28px] bg-[linear-gradient(to_bottom,#d4f1e7,#b9e8d7)] px-[26px] py-[22px]">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="shield" size={26} /></span>
        <div className="flex flex-col gap-[3px]">
          <p className="text-[18px] font-bold text-ink">KYC verified</p>
          <p className="w-[640px] text-[13px] leading-[20px] font-medium text-[#2f6b55]">
            Verified by Arvind Shetty on 25 Oct 2026. Changing PAN, licence number or documents sends it for review again.
          </p>
        </div>
      </section>
    </KycPage>
  )
}
