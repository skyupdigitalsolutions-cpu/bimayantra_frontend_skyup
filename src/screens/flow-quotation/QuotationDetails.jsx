// Figma 41:4496 · Q6 · Quotation — Details
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Field, cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, RowAvatar, Note, PlainSelect, MoneyInput } from './_parts'
import { people, sumInsuredOptions, termOptions, GST, inr, STEPS, SUBTITLE_PRODUCT } from '../../data/quotation-flow'

export default function QuotationDetails() {
  const [on, setOn] = useState(() => Object.fromEntries(people.map((p) => [p.key, !!p.on])))
  const [sum, setSum] = useState('₹10 lakh')
  const [term, setTerm] = useState('1 year')
  const [start, setStart] = useState('10-11-2026')
  const [base, setBase] = useState('14,900')
  const count = Object.values(on).filter(Boolean).length
  const baseNum = Number(base.replace(/\D/g, '')) || 0
  const gst = Math.round(baseNum * GST)

  return (
    <QuoteWizard step={5} numbered subtitle={SUBTITLE_PRODUCT} chip="Draft saved 10:42">
      <StepCard
        index={5}
        title="Details"
        subtitle="Who to cover, how much, and from when"
        saved="Draft saved 10:42"
        backChevron
        gap={22}
        next={{ label: 'Next: Riders', to: STEPS[6].path }}
      >
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-ink">People to cover *</span>
          <div className="flex flex-wrap gap-3">
            {people.map((p) => {
              const sel = on[p.key]
              return (
                <button
                  key={p.key}
                  type="button"
                  disabled={p.noDob}
                  onClick={() => setOn((s) => ({ ...s, [p.key]: !s[p.key] }))}
                  className={cx(
                    'flex w-[344px] items-center gap-3 rounded-[20px] py-3.5 pr-4 pl-3.5 text-left',
                    sel ? 'h-[75px] border-[1.5px] border-blue bg-[#f3f7ff]' : 'h-[74px] border border-line bg-white',
                    p.noDob && 'cursor-not-allowed',
                  )}
                >
                  <RowAvatar initials={p.initials} tone={p.tone} size={44} />
                  <span className="flex min-w-px flex-1 flex-col gap-0.5">
                    <span className={cx('text-[14px] font-bold', p.noDob ? 'text-faint' : 'text-ink')}>{p.name}</span>
                    <span className={cx('text-[12px] font-medium', p.noDob ? 'text-[#b4323c]' : 'text-muted')}>{p.meta}</span>
                  </span>
                  <span className={cx('flex size-6 shrink-0 items-center justify-center rounded-[8px]', sel ? 'bg-blue text-white' : 'border border-[#c3ccd8] bg-white')}>
                    {sel && <Icon name="check" size={16} />}
                  </span>
                </button>
              )
            })}
          </div>
          <Note tone="green" icon="check" className="rounded-[14px] px-3.5 py-2.5">
            All {count} are within the age limits: adults 18–65, children 0–25.
          </Note>
        </div>
        <div className="flex gap-4">
          <Field label="Sum insured *" className="gap-2">
            <PlainSelect value={sum} onChange={setSum} options={sumInsuredOptions} />
          </Field>
          <Field label="Policy term *" className="gap-2">
            <PlainSelect value={term} onChange={setTerm} options={termOptions} />
          </Field>
          <Field label="Planned start date *" className="gap-2">
            <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] border-2 border-blue bg-panel px-4">
              <input value={start} onChange={(e) => setStart(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none" />
              <Icon name="calendar" size={18} className="text-muted" />
            </span>
          </Field>
        </div>
      </StepCard>

      <LiveSummary filled={6} rowGap={10}>
        <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-ink">Premium for {count} people</span>
            <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#fbf1e1] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#8a5a12]">
              <Icon name="edit" size={13} />
              Enter manually
            </span>
          </div>
          <p className="text-[12px] leading-[18px] font-medium text-muted">
            With more than one person, the price depends on the insurer’s floater rules. Copy it from the Niva Bupa portal.
          </p>
          <Field label="Base premium before GST *" className="gap-2">
            <MoneyInput value={base} onChange={setBase} focused />
          </Field>
          <div className="flex h-4 items-center gap-2">
            <span className="flex-1 text-[12px] font-medium text-muted">GST 18%</span>
            <span className="text-[13px] font-bold text-ink">{inr(gst)}</span>
          </div>
          <span className="h-px bg-line" />
          <div className="flex items-center gap-2">
            <span className="flex-1 text-[14px] font-bold text-ink">Total</span>
            <span className="text-[20px] font-bold text-ink">{inr(baseNum + gst)}</span>
          </div>
        </div>
      </LiveSummary>
    </QuoteWizard>
  )
}
