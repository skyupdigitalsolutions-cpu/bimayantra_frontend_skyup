// Figma 299:41223 · CN5 · Connect Meta Ads — Connected
import { connections, metaSteps } from '../../data/campaigns'
import { Icon, Overview, WizardOverlay, ModalHead, Steps, WizardFooter } from './_parts'

export default function ConnectMetaConnected() {
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead conn={connections.meta} title="Meta Ads connected" sub="2 lead forms · new leads arrive within a minute" />
          <Steps steps={metaSteps} current={4} />
          <div className="flex flex-col items-center gap-2.5 rounded-[20px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] p-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-white text-[#127650]">
              <Icon name="check" size={30} />
            </span>
            <p className="text-[18px] font-bold text-ink">You’re all set</p>
            <p className="w-[560px] text-[13px] font-medium text-[#2f6b55]">Test it: submit your own form on Facebook. It should appear in Leads with source Meta Ads.</p>
          </div>
          <WizardFooter backTo="/x/cn4-connect-meta-ads-lead-settings" nextLabel="Go to campaigns" nextTo="/x/cc1-meta-ads-campaign-leads-and-answers" />
        </WizardOverlay>
      }
    />
  )
}
