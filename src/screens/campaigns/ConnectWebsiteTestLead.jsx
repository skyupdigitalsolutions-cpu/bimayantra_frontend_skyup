// Figma 300:41170 · CN9 · Connect website — Test lead received
import { Icon, Overview, WizardOverlay, Avatar, Pill, Btn } from './_parts'

export default function ConnectWebsiteTestLead() {
  return (
    <Overview
      variant="backdrop"
      backdropLinks
      overlay={
        <WizardOverlay left={360} top={150} width={540} className="gap-4 rounded-[30px] p-[30px]">
          <span className="flex size-[60px] items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]">
            <Icon name="check" size={26} />
          </span>
          <p className="text-[21px] leading-[26px] font-bold tracking-[-0.2px] text-ink">Website connected</p>
          <p className="text-[13px] leading-5 font-medium text-muted">We received your test enquiry from raoinsurance.in/get-quote.</p>
          <div className="flex h-16 items-center gap-3 rounded-[16px] border border-[#c7ebda] bg-[#f5fbf8] px-3.5">
            <Avatar initials="TL" bg="#e9e3fc" size={34} text={11} />
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">Test Lead · 98450 12345</p>
              <p className="text-[11px] font-medium text-[#127650]">Just now · consent ticked for WhatsApp</p>
            </div>
            <Pill tone="gray">Test · not counted</Pill>
          </div>
          <div className="flex gap-2.5">
            <Btn to="/campaigns" className="flex-1 justify-center">Cancel</Btn>
            <Btn variant="navy" icon="check" to="/x/cc3-website-form-leads-and-answers" className="flex-1 justify-center">Done</Btn>
          </div>
        </WizardOverlay>
      }
    />
  )
}
