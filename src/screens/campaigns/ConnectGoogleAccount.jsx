// Figma 299:41617 · CN6 · Connect Google Ads — Sign in and account
import { useState } from 'react'
import { connections, googleSteps, googleForms } from '../../data/campaigns'
import { Icon, Overview, WizardOverlay, ModalHead, Steps, SelectField, CheckRow, WizardFooter, useToggles } from './_parts'

export default function ConnectGoogleAccount() {
  const [account, setAccount] = useState('Rao Insurance · 482-119-2201')
  const [on, toggle] = useToggles(googleForms.map((f) => f.on))
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead guide="google" conn={connections.google} title="Connect Google Ads" sub="Lead form assets on Search and YouTube" />
          <Steps steps={googleSteps} current={1} />
          <div className="flex h-[46px] items-center gap-3 rounded-[16px] border border-[#c7ebda] bg-[#f5fbf8] px-3.5 text-[13px] font-semibold text-[#127650]">
            <Icon name="check" size={16} />
            Signed in as suresh.rao@gmail.com
          </div>
          <SelectField label="Google Ads account *" value={account} onChange={setAccount} options={['Rao Insurance · 482-119-2201', 'Rao Insurance (MCC) · 310-552-0098']} />
          <p className="text-[13px] font-semibold text-ink">Lead forms</p>
          {googleForms.map((f, i) => (
            <CheckRow key={f.title} {...f} checked={on[i]} onToggle={() => toggle(i)} />
          ))}
          <WizardFooter backTo="/campaigns" nextLabel="Next: Map fields" nextTo="/x/cn7-connect-google-ads-map-fields" />
        </WizardOverlay>
      }
    />
  )
}
