// Figma 218:16885 · CQ2 · Comparison — Type
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary, Note, Radio } from './_parts'
import { CQ } from '../../data/flow-comparative'

function TypeCard({ on, to, icon, tint, title, text }) {
  const cls = cx(
    'flex flex-1 flex-col gap-3 rounded-[24px] p-5',
    on ? 'h-[176px] border-2 border-[#1f5fd6] bg-[#f3f7ff]' : 'h-[174px] border border-line bg-white hover:bg-panel-2',
  )
  const inner = (
    <>
      <span className="flex items-center justify-between">
        <span className={cx('flex size-12 items-center justify-center rounded-full', tint)}>
          <Icon name={icon} size={22} className="text-ink" />
        </span>
        <Radio on={on} />
      </span>
      <span className="text-[16px] font-bold text-ink">{title}</span>
      <span className="w-[300px] text-[13px] leading-[20px] font-medium text-muted">{text}</span>
    </>
  )
  return on ? <div className={cls}>{inner}</div> : <Link to={to} className={cls}>{inner}</Link>
}

export default function ComparisonType() {
  return (
    <CqPage step={1} summary={<LiveSummary />}>
      <StepCard
        title="2 · Quotation type"
        subtitle="Single, or 2 to 3 products side by side"
        back={CQ.customer}
        next={CQ.insurance}
        nextLabel="Next: Insurance type"
      >
        <div className="flex items-start gap-4">
          <TypeCard to={CQ.singleType} icon="quote" tint="bg-[#fde8c9]" title="Single quotation" text="One product. Can carry the insurer’s payment link." />
          <TypeCard on icon="compare" tint="bg-[#d4f1e7]" title="Comparative quotation" text="2 to 3 products or variants side by side. No payment link." />
        </div>
        <Note icon="alert">The customer chooses one option later. That becomes its own quotation with a payment link.</Note>
      </StepCard>
    </CqPage>
  )
}
