// Figma 219:17686 · CQ7 · Comparison — Recommend
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary, Note, Radio, Pill } from './_parts'
import { CQ, cqOptions, WHY_GOLD } from '../../data/flow-comparative'

export default function ComparisonRecommend() {
  const [rec, setRec] = useState('gold')
  const [why, setWhy] = useState(WHY_GOLD)
  const recOpt = cqOptions.find((o) => o.key === rec)

  return (
    <CqPage
      step={6}
      panelClass="pb-[60px]"
      summary={
        <LiveSummary
          insurance="Health"
          options="3 options"
          people="3 people · ₹10 lakh"
          listTitle="OPTIONS · TOTAL INCL. GST"
          list={cqOptions.map((o) => ({ label: `${o.product} · ${o.variant}`, value: o.total, recommended: o.key === rec }))}
        />
      }
    >
      <StepCard
        title="7 · Recommend"
        subtitle="Pick one and say why. The reason is printed on the comparison."
        back={CQ.premiums}
        next={CQ.review}
        nextLabel="Next: Review"
      >
        {cqOptions.map((o) => {
          const on = o.key === rec
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setRec(o.key)}
              className={cx(
                'flex items-center gap-3.5 rounded-[20px] p-4 text-left',
                on ? 'h-20 border-2 border-[#1f5fd6] bg-[#f3f7ff]' : 'h-[78px] border border-line bg-white hover:bg-panel-2',
              )}
            >
              <Radio on={on} />
              <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-full', o.tint)}>
                <Icon name="heart" size={20} className="text-ink" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink">{o.product} · {o.variant}</span>
                <span className="text-[12px] font-medium text-muted">{o.insurer}</span>
              </span>
              {o.lowest && <Pill tone="green" icon="check">Lowest</Pill>}
              <span className="text-[16px] font-bold text-ink">{o.total}</span>
            </button>
          )
        })}
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Why you recommend {recOpt.variant} *</span>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            className="h-24 resize-none rounded-[16px] border-2 border-[#1f5fd6] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none"
          />
        </label>
        <Note icon="alert">“Lowest” is shown only among options that cover everyone selected.</Note>
      </StepCard>
    </CqPage>
  )
}
