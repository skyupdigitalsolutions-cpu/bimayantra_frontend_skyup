// Figma 45:5821 · R1 · Proposal — Members
import Icon from '../../components/Icon'
import { Btn, Note } from '../flow-policy/_kit'
import { proposal as p, members, R } from '../../data/flow-proposal'
import { ProposalWizard } from './_parts'

export default function Members() {
  return (
    <ProposalWizard
      step={0}
      title="Members"
      sub="Locked for this proposal. Revise the quotation to change them."
      next={<Btn icon="arrow" to={R.declarations}>Next: Declarations</Btn>}
    >
      <Note icon="lock">Covered members come from {p.quote}.</Note>
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
