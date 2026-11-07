// Figma 40:4974 · Q5 · Quotation — Product
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Radio, Note, choice } from './_parts'
import { products, STEPS } from '../../data/quotation-flow'

function VariantSelect({ value, options, onChange, active }) {
  return (
    <span className={cx('relative inline-flex h-[38px] shrink-0 items-center rounded-[14px] border bg-white px-3', active ? 'border-blue' : 'border-line')} onClick={(e) => e.stopPropagation()}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-[23px] text-[12px] font-bold text-ink outline-none"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <Icon name="chev-down" size={15} className="pointer-events-none absolute right-3 text-muted" />
    </span>
  )
}

export default function QuotationProduct() {
  const [sel, setSel] = useState('carefirst')
  const [variants, setVariants] = useState({ carefirst: 'Gold · Family floater', arogya: 'Standard' })
  return (
    <QuoteWizard step={4}>
      <StepCard index={4} title="Product and variant" subtitle="Active products only. Pick the variant you are quoting." next={{ label: 'Next: Details', to: STEPS[5].path }}>
        {products.map((p) => {
          const on = sel === p.key
          return (
            <div
              key={p.key}
              role="radio"
              aria-checked={on}
              onClick={() => !p.withdrawn && setSel(p.key)}
              className={cx('flex w-full items-center gap-3.5 p-3.5', choice(on, p.withdrawn), p.withdrawn ? 'opacity-60' : 'cursor-pointer')}
            >
              <Radio on={on} />
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-pink-100">
                <Icon name="heart" size={18} className="text-[#b4325a]" />
              </span>
              <span className="flex min-w-px flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink">{p.name}</span>
                <span className={cx('text-[12px] font-medium', p.withdrawn ? 'text-[#b4323c]' : 'text-muted')}>{p.meta}</span>
              </span>
              {p.withdrawn ? (
                <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#fbebec] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#b4323c]">
                  <Icon name="x" size={13} />
                  Withdrawn
                </span>
              ) : (
                <VariantSelect value={variants[p.key]} options={p.variants} onChange={(v) => setVariants((s) => ({ ...s, [p.key]: v }))} active={on} />
              )}
            </div>
          )
        })}
        <Note icon="sparkle">
          Not sure which one? <Link to="/best-fit" className="underline-offset-2 hover:underline">Run Best fit</Link> for Kavya to rank them with reasons.
        </Note>
      </StepCard>
      <LiveSummary filled={4} />
    </QuoteWizard>
  )
}
