// Figma 285:32252 · PRC · Proposal — Cancel
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { Btn, Note } from '../flow-policy/_kit'
import { ProposalWizard } from '../flow-proposal/_parts'
import { proposal as pr, members, R } from '../../data/flow-proposal'
import { Scrim, Dialog, DialogButton, DialogActions, DField } from './_parts'
import { S } from '../../data/states-proposal-policy'

function CancelDialog() {
  const nav = useNavigate()
  return (
    <>
      <Scrim onClick={() => nav(S.r1)} />
      <Dialog
        top={150}
        icon="alert"
        iconBg="bg-[#fbebec]"
        iconColor="text-[#b4323c]"
        title={`Cancel ${pr.id}?`}
        body="Only drafts can be cancelled. The accepted quotation stays as it is."
      >
        <DField label="Reason *" defaultValue="Customer wants to change the sum insured first" />
        <DialogActions>
          <DialogButton to={S.r1}>Cancel</DialogButton>
          <DialogButton variant="danger" icon="x" to={S.proposals} className="w-[233px] flex-none">Cancel proposal</DialogButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function ProposalCancel() {
  return (
    <ProposalWizard
      step={0}
      title="Members"
      sub="Locked for this proposal. Revise the quotation to change them."
      next={<Btn icon="arrow" to={R.declarations}>Next: Declarations</Btn>}
      overlay={<CancelDialog />}
    >
      <Note icon="lock">Covered members come from {pr.quote}.</Note>
      {members.map((m) => (
        <div key={m.name} className="flex h-[72px] items-center gap-3.5 rounded-[20px] bg-panel px-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white text-[14px] font-bold text-navy" style={{ background: m.bg }}>{m.initials}</span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-[14px] leading-[18px] font-bold text-ink">{m.name}</p>
            <p className="text-[12px] leading-[15px] font-medium text-muted">{m.sub}</p>
          </div>
          <Icon name="lock" size={16} className="text-muted" />
        </div>
      ))}
    </ProposalWizard>
  )
}
