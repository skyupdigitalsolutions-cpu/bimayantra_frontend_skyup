// Shared wizard shell for Flow · Proposal (Figma 45:5821 … 45:6881)
// Page heading · "Proposal steps" card (300w, vertical list) · "Step body" card (840w).
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, Header, Btn, Pill, Card, CardHead, StepFooter } from '../flow-policy/_kit'
import { proposal as p, PROPOSAL_STEPS, R } from '../../data/flow-proposal'

function StepList({ current }) {
  return (
    <Card className="w-[300px] shrink-0 gap-1.5">
      <div className="flex flex-col gap-[3px]">
        <p className="text-[17px] leading-[21px] font-bold text-ink">Proposal</p>
        <p className="w-[240px] text-[12px] leading-[15px] font-medium text-muted">Submit on the insurer portal, then record it here</p>
      </div>
      {PROPOSAL_STEPS.map((s, i) => {
        const done = i < current
        const on = i === current
        return (
          <Link key={s.label} to={s.to} className={cx('flex h-14 items-center gap-3 rounded-[18px] px-3', on ? 'bg-[#f3f7ff]' : 'hover:bg-panel-2')}>
            <span
              className={cx(
                'flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                done && 'bg-navy text-white',
                on && 'border-2 border-blue bg-white text-blue',
                !done && !on && 'bg-panel text-muted',
              )}
            >
              {done ? <Icon name="check" size={15} /> : i + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className={cx('text-[13px] leading-4 font-bold', done || on ? 'text-ink' : 'text-muted')}>{s.label}</span>
              <span className="text-[11px] leading-[14px] font-medium text-muted">{s.sub}</span>
            </span>
          </Link>
        )
      })}
    </Card>
  )
}

export function ProposalHeader() {
  return (
    <Header
      search
      crumb={`PROPOSALS  /  ${p.id}`}
      title={p.id}
      chips={<Pill>Draft</Pill>}
      sub={p.sub}
      actions={<Btn variant="danger" icon="x" to={R.cancel}>Cancel proposal</Btn>}
    />
  )
}

/** step: 0-based. next: <Btn/>. backTo: route of previous step. */
export function ProposalWizard({ step, title, sub, backTo, next, overlay, gap = 18, children }) {
  return (
    <Shell active="proposals" overlay={overlay}>
      <ProposalHeader />
      <div className="mt-[21px] flex items-start gap-10">
        <StepList current={step} />
        <Card className="w-[840px]" style={{ gap }}>
          <CardHead title={`${step + 1} · ${title}`} sub={sub} />
          {children}
          <StepFooter backTo={backTo} next={next} />
        </Card>
      </div>
    </Shell>
  )
}

/** Green tick circle */
export function Tick({ size = 28, iconSize = 14 }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]" style={{ width: size, height: size }}>
      <Icon name="check" size={iconSize} />
    </span>
  )
}
