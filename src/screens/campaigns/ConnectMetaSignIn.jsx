// Figma 299:39522 · CN1 · Connect Meta Ads — Sign in
import { Link } from 'react-router-dom'
import { connections, metaSteps } from '../../data/campaigns'
import { Icon, Overview, WizardOverlay, ModalHead, Steps, WizardFooter } from './_parts'

export default function ConnectMetaSignIn() {
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead guide="meta" conn={connections.meta} title="Connect Meta Ads" sub="Facebook and Instagram lead ads" />
          <Steps steps={metaSteps} current={0} />
          <div className="flex flex-col items-center gap-3 rounded-[20px] bg-[#f3f7ff] p-6 text-center">
            <p className="text-[14px] font-semibold text-ink">Sign in with the Facebook account that manages your ads.</p>
            <Link to="/x/cn2-connect-meta-ads-account-and-forms" className="flex h-[54px] items-center gap-2 rounded-[24px] bg-[#1f5fd6] pr-5 pl-4 text-[15px] font-semibold text-white hover:brightness-110">
              <Icon name="link" size={18} />
              Continue with Facebook
            </Link>
            <p className="text-[12px] font-medium text-muted">We ask for: ads read, lead forms read, pages list. We never post anything.</p>
          </div>
          <WizardFooter backLabel="Cancel" backTo="/campaigns" nextLabel="Next" nextTo="/x/cn2-connect-meta-ads-account-and-forms" />
        </WizardOverlay>
      }
    />
  )
}
