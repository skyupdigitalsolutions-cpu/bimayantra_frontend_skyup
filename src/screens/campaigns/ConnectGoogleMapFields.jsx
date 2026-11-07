// Figma 299:42028 · CN7 · Connect Google Ads — Map fields
import { useState } from 'react'
import { connections, googleSteps, googleMapping, leadFieldOptions } from '../../data/campaigns'
import { Overview, WizardOverlay, ModalHead, Steps, MappingTable, SelectField, WizardFooter } from './_parts'

export default function ConnectGoogleMapFields() {
  const [pipeline, setPipeline] = useState('Term')
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead conn={connections.google} title="Map form fields" sub="Form “Term insurance quote”" />
          <Steps steps={googleSteps} current={2} />
          <MappingTable rows={googleMapping} options={leadFieldOptions} />
          <div className="flex gap-3">
            <SelectField label="Pipeline" value={pipeline} onChange={setPipeline} options={['Term', 'Health', 'Motor', 'Life and Term']} />
            <SelectField label="Lead source" value="Google Ads (automatic)" locked />
          </div>
          <WizardFooter backTo="/x/cn6-connect-google-ads-sign-in-and-account" nextLabel="Connect" nextTo="/x/cc2-google-ads-campaign-leads-and-answers" />
        </WizardOverlay>
      }
    />
  )
}
