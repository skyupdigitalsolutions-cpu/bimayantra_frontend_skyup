// Figma 285:31926 · PRD · Proposal — Mark declined
import { useNavigate } from 'react-router-dom'
import { Btn } from '../flow-policy/_kit'
import { SubmittedBase, CHIPS, Scrim, Dialog, DialogButton, DialogActions, DField } from './_parts'
import { S } from '../../data/states-proposal-policy'

export default function ProposalMarkDeclined() {
  const nav = useNavigate()
  return (
    <SubmittedBase
      chip={CHIPS.submitted}
      heroTitle="Waiting for the insurer"
      actions={<>
        <Btn variant="danger" icon="x" to={S.prd}>Mark declined</Btn>
        <Btn icon="shield" to={S.l1}>Record issued policy</Btn>
      </>}
      overlay={<>
        <Scrim onClick={() => nav(S.r7)} />
        <Dialog
          top={120}
          icon="x"
          iconBg="bg-[#fbebec]"
          iconColor="text-[#b4323c]"
          title="Record that Niva Bupa declined?"
          body="The policy record PL-000071 becomes Cancelled. You can reverse the payment if the insurer refunds it."
        >
          <DField label="Insurer’s reason *" defaultValue="Declared condition not accepted" />
          <DField label="Decline letter (optional)" icon="folder" defaultValue="decline-letter.pdf" />
          <DialogActions>
            <DialogButton to={S.r7}>Cancel</DialogButton>
            <DialogButton variant="danger" icon="x" to={S.prd2} className="w-[233px] flex-none">Record decline</DialogButton>
          </DialogActions>
        </Dialog>
      </>}
    />
  )
}
