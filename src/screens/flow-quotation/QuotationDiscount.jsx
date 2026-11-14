// Figma 41:5220 · Q9 · Quotation — Discount
import { useState } from 'react'
import { Field, Toggle, cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Note, TextField } from './_parts'
import { GST, inr, STEPS, SUBTITLE_VARIANT } from '../../data/quotation-flow'

const PRE = 15800

export default function QuotationDiscount() {
  const [give, setGive] = useState(true)
  const [mode, setMode] = useState('amount')
  const [value, setValue] = useState('500')
  const [ref, setRef] = useState('NB-DIWALI-26')
  const n = Number(value.replace(/[^\d.]/g, '')) || 0
  const off = give ? Math.round(mode === 'amount' ? n : (PRE * n) / 100) : 0
  const total = Math.round((PRE - off) * (1 + GST))

  return (
    <QuoteWizard step={8} numbered subtitle={SUBTITLE_VARIANT}>
      <StepCard index={8} title="Discount" subtitle="Optional. Needs a reference." next={{ label: 'Next: Review', to: STEPS[9].path }}>
        <div className="flex items-center gap-3.5">
          <Toggle checked={give} onChange={setGive} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-ink">Give a discount</span>
            <span className="text-[12px] font-medium text-muted">Advisor only</span>
          </span>
        </div>
        {give && (
          <div className="flex items-end gap-3.5 max-md:flex-col max-md:items-stretch max-md:gap-3">
            <div className="flex w-[190px] shrink-0 flex-col gap-2 max-md:w-full">
              <span className="text-[13px] font-semibold text-ink">Type</span>
              <div className="flex h-11 items-center gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
                {[['amount', 'Amount ₹'], ['percent', 'Percent']].map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMode(k)}
                    className={cx(
                      'h-[34px] rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap',
                      mode === k ? 'bg-navy text-white' : 'text-slate hover:text-ink',
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Discount *" className="w-[247px] flex-none gap-2 max-md:w-full">
              <TextField prefix={mode === 'amount' ? '₹' : undefined} value={value} onChange={setValue} />
            </Field>
            <Field label="Reference *" hint="For example the insurer’s published offer code." className="w-[247px] flex-none gap-2 max-md:w-full [&>span:last-child]:w-[260px] max-md:[&>span:last-child]:w-full">
              <TextField value={ref} onChange={setRef} />
            </Field>
          </div>
        )}
        <Note tone="amber" icon="alert" className="w-[714px] shrink-0 max-md:w-full">
          Discounts are pending legal confirmation (DEC-23). Passing your commission to the customer is rebating.
        </Note>
      </StepCard>
      <LiveSummary
        filled={6}
        extraRows={[
          ['Override', inr(PRE)],
          ['Discount', off ? `− ${inr(off)}${ref ? ` · ${ref}` : ''}` : null],
        ]}
        total={inr(total)}
      />
    </QuoteWizard>
  )
}