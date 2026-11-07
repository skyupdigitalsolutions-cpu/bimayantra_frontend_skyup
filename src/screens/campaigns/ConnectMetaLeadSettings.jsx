// Figma 299:40797 · CN4 · Connect Meta Ads — Lead settings
import { useState } from 'react'
import { connections, metaSteps, metaLeadSettings } from '../../data/campaigns'
import { Overview, WizardOverlay, ModalHead, Steps, SelectField, CheckRow, NoteBar, WizardFooter, useToggles } from './_parts'

export default function ConnectMetaLeadSettings() {
  const [pipeline, setPipeline] = useState('Health (Motor form → Motor)')
  const [on, toggle] = useToggles(metaLeadSettings.map((s) => s.on))
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead conn={connections.meta} title="How new leads come in" sub="Applies to every lead from these forms" />
          <Steps steps={metaSteps} current={3} />
          <div className="flex gap-3">
            <SelectField label="Pipeline *" value={pipeline} onChange={setPipeline} options={['Health (Motor form → Motor)', 'Health', 'Motor', 'Life and Term']} />
            <SelectField label="Lead source" value="Meta Ads (set automatically)" locked />
          </div>
          <p className="text-[13px] font-semibold text-ink">When a lead arrives</p>
          {metaLeadSettings.map((s, i) => (
            <CheckRow key={s.title} {...s} checked={on[i]} onToggle={() => toggle(i)} />
          ))}
          <NoteBar tone="blue" icon="users">Same mobile as an open lead or policy holder? It’s linked, not duplicated.</NoteBar>
          <WizardFooter backTo="/x/cn3-connect-meta-ads-map-fields" nextLabel="Connect" nextTo="/x/cn5-connect-meta-ads-connected" />
        </WizardOverlay>
      }
    />
  )
}
