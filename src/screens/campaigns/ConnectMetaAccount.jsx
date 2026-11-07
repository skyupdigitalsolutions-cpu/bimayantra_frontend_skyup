// Figma 299:39909 · CN2 · Connect Meta Ads — Account and forms
import { useState } from 'react'
import { connections, metaSteps, metaForms } from '../../data/campaigns'
import { Overview, WizardOverlay, ModalHead, Steps, SelectField, CheckRow, WizardFooter, useToggles } from './_parts'

export default function ConnectMetaAccount() {
  const [account, setAccount] = useState('Rao Insurance Services · act_2841…')
  const [page, setPage] = useState('Rao Insurance Services')
  const [on, toggle] = useToggles(metaForms.map((f) => f.on))
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead conn={connections.meta} title="Connect Meta Ads" sub="Signed in as Suresh Rao" />
          <Steps steps={metaSteps} current={1} />
          <SelectField label="Ad account *" value={account} onChange={setAccount} options={['Rao Insurance Services · act_2841…', 'Rao Insurance (old) · act_1093…']} />
          <SelectField label="Facebook page *" value={page} onChange={setPage} options={['Rao Insurance Services', 'Suresh Rao · Advisor']} />
          <p className="text-[13px] font-semibold text-ink">Lead forms to bring in</p>
          {metaForms.map((f, i) => (
            <CheckRow key={f.title} {...f} checked={on[i]} onToggle={() => toggle(i)} />
          ))}
          <WizardFooter backTo="/x/cn1-connect-meta-ads-sign-in" nextLabel="Next: Map fields" nextTo="/x/cn3-connect-meta-ads-map-fields" />
        </WizardOverlay>
      }
    />
  )
}
