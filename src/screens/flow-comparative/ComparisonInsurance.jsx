// Figma 218:17111 · CQ3 · Comparison — Insurance
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary } from './_parts'
import { CQ, insuranceTypes } from '../../data/flow-comparative'

export default function ComparisonInsurance() {
  const [type, setType] = useState('Health')
  return (
    <CqPage step={2} summary={<LiveSummary insurance={type} />}>
      <StepCard
        title="3 · Insurance type"
        subtitle="All options must be the same type"
        back={CQ.type}
        next={CQ.options}
        nextLabel="Next: Options"
      >
        <div className="flex items-start gap-3">
          {insuranceTypes.map((t) => {
            const on = t.key === type
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={cx(
                  'flex flex-col items-center justify-center gap-2.5 rounded-[22px] p-4',
                  t.bg,
                  on ? 'h-[113px] w-[136.8px] border-[2.5px] border-[#1f5fd6]' : 'h-[108px] w-[131.8px]',
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white/90">
                  <Icon name={t.icon} size={22} className="text-ink" />
                </span>
                <span className="text-[14px] font-bold text-ink">{t.key}</span>
              </button>
            )
          })}
        </div>
      </StepCard>
    </CqPage>
  )
}
