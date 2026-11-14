// Figma 40:4476 · Q3 · Quotation — Insurance
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Note } from './_parts'
import { insuranceTypes, STEPS } from '../../data/quotation-flow'

export default function QuotationInsurance() {
  const [sel, setSel] = useState('health')
  return (
    <QuoteWizard step={2}>
      <StepCard index={2} title="Insurance type" subtitle="Only the categories on your licence" next={{ label: 'Next: Insurer', to: STEPS[3].path }}>
        <div className="flex items-start gap-3.5 max-md:flex-wrap max-md:gap-2.5">
          {insuranceTypes.map((t) => {
            const on = sel === t.key
            return (
              <button
                key={t.key}
                type="button"
                disabled={t.disabled}
                onClick={() => setSel(t.key)}
                className={cx(
                  'flex flex-col items-center justify-center gap-2.5 rounded-[24px] p-[18px] transition max-md:rounded-[18px] max-md:p-3',
                  t.bg,
                  on ? 'h-[145px] w-[171.3px] shrink-0 border-[2.5px] border-blue max-md:h-auto max-md:w-[calc(50%-6px)]' : 'h-[140px] min-w-px flex-1 max-md:h-auto max-md:min-w-[calc(50%-6px)] max-md:flex-none',
                  t.disabled ? 'cursor-not-allowed opacity-50' : !on && 'hover:brightness-[0.98]',
                )}
              >
                <span className="flex size-[52px] items-center justify-center rounded-full bg-white/80 max-md:size-10">
                  <Icon name={t.icon} size={24} className="text-ink" />
                </span>
                <span className="text-[14px] font-bold whitespace-nowrap text-ink max-md:text-[13px]">{t.title}</span>
                <span className="text-[11px] font-medium whitespace-nowrap text-slate max-md:text-[10px]">{t.sub}</span>
              </button>
            )
          })}
        </div>
        <Note icon="lock">Life and Term is not on your licence. Update your profile to add it.</Note>
      </StepCard>
      <LiveSummary filled={2} />
    </QuoteWizard>
  )
}