// Figma 40:4241 · Q2 · Quotation — Type
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Radio } from './_parts'
import { quoteTypes, STEPS } from '../../data/quotation-flow'

export default function QuotationType() {
  // Single is the selected path; Comparative jumps to the comparison flow (prototype link).
  const sel = 'single'
  return (
    <QuoteWizard step={1}>
      <StepCard index={1} title="Quotation type" subtitle="Single, or 2 to 3 products side by side" next={{ label: 'Next: Insurance type', to: STEPS[2].path }}>
        <div className="flex items-start gap-4 max-md:flex-col max-md:gap-3">
          {quoteTypes.map((t) => {
            const on = sel === t.key
            const cls = cx(
              'flex min-w-px flex-1 flex-col gap-3 rounded-[24px] p-5 text-left transition max-md:!w-full max-md:min-w-0 max-md:flex-none max-md:rounded-[20px] max-md:p-4',
              on ? 'border-2 border-blue bg-[#f3f7ff]' : 'border border-line bg-white hover:bg-panel-2',
            )
            const inner = (
              <>
                <span className="flex w-full items-center">
                  <span className={cx('flex size-12 items-center justify-center rounded-full max-md:size-10', t.iconBg)}>
                    <Icon name={t.icon} size={22} className="text-ink" />
                  </span>
                  <span className="flex-1" />
                  <Radio on={on} />
                </span>
                <span className="text-[16px] font-bold text-ink max-md:text-[15px]">{t.title}</span>
                <span className="w-[300px] text-[13px] leading-[20px] font-medium text-muted max-md:w-full">{t.text}</span>
              </>
            )
            return t.to ? (
              <Link key={t.key} to={t.to} className={cx(cls, 'h-[174px] max-md:h-auto')}>{inner}</Link>
            ) : (
              <div key={t.key} role="radio" aria-checked={on} className={cx(cls, 'h-[176px] max-md:h-auto')}>{inner}</div>
            )
          })}
        </div>
      </StepCard>
      <LiveSummary filled={1} />
    </QuoteWizard>
  )
}