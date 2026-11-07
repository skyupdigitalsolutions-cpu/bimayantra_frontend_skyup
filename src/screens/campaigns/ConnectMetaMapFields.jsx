// Figma 299:40330 · CN3 · Connect Meta Ads — Map fields
import { connections, metaSteps, metaMapping, leadFieldOptions } from '../../data/campaigns'
import { Overview, WizardOverlay, ModalHead, Steps, MappingTable, NoteBar, WizardFooter } from './_parts'

export default function ConnectMetaMapFields() {
  return (
    <Overview
      variant="backdrop"
      overlay={
        <WizardOverlay>
          <ModalHead conn={connections.meta} title="Map form fields" sub="Form “Family cover quote”" />
          <Steps steps={metaSteps} current={2} />
          <MappingTable rows={metaMapping} options={leadFieldOptions} />
          <NoteBar icon="lock">Consent is recorded only if the form has a consent question and the person ticked it.</NoteBar>
          <WizardFooter backTo="/x/cn2-connect-meta-ads-account-and-forms" nextLabel="Next: Lead settings" nextTo="/x/cn4-connect-meta-ads-lead-settings" />
        </WizardOverlay>
      }
    />
  )
}
