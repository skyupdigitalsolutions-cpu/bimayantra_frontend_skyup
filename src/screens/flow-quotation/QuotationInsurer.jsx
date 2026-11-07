// Figma 40:4729 · Q4 · Quotation — Insurer
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Radio, RowAvatar, choice } from './_parts'
import { insurers, STEPS } from '../../data/quotation-flow'

export default function QuotationInsurer() {
  const [sel, setSel] = useState('nb')
  return (
    <QuoteWizard step={3}>
      <StepCard index={3} title="Insurer" subtitle="Only insurers where your agent code is active" next={{ label: 'Next: Product', to: STEPS[4].path }}>
        {insurers.map((x) => {
          const on = sel === x.key
          return (
            <div
              key={x.key}
              role="radio"
              aria-checked={on}
              aria-disabled={x.expired}
              onClick={() => !x.expired && setSel(x.key)}
              className={cx('flex w-full items-center gap-3.5 p-3.5', choice(on, x.expired), x.expired ? 'opacity-60' : 'cursor-pointer')}
            >
              <Radio on={on} />
              <RowAvatar initials={x.initials} tone={x.tone} className="border-0 text-ink" />
              <span className="flex min-w-px flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink">{x.name}</span>
                <span className={cx('text-[12px] font-medium', x.expired ? 'text-[#8a5a12]' : 'text-muted')}>{x.meta}</span>
              </span>
              {x.expired && (
                <Link to="/x/s04-settings-my-insurers" className="inline-flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">
                  Update code
                </Link>
              )}
            </div>
          )
        })}
      </StepCard>
      <LiveSummary filled={3} />
    </QuoteWizard>
  )
}
