// Figma 41:4960 · Q8 · Quotation — Premium
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Field, Toggle } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Ledger, GreenChip, Check, TextField, MoneyInput } from './_parts'
import { benefits, BASE_PREMIUM, GST, inr, STEPS, SUBTITLE_VARIANT } from '../../data/quotation-flow'

const ADDONS = 2000
const CALC = BASE_PREMIUM + ADDONS

function SmallIconBtn({ icon, onClick, label }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
      <Icon name={icon} size={12.6} className={icon === 'x' ? 'text-muted' : 'text-ink'} />
    </button>
  )
}

export default function QuotationPremium() {
  const [override, setOverride] = useState(true)
  const [amount, setAmount] = useState('15,800')
  const [reason, setReason] = useState('Insurer portal shows lower premium')
  const [items, setItems] = useState(benefits)
  const amt = Number(amount.replace(/[^\d]/g, '')) || 0
  const pre = override && amt ? amt : CALC
  const total = Math.round(pre * (1 + GST))

  const addBenefit = () =>
    setItems((s) => [...s, { key: `b${s.length + 1}`, title: 'New benefit', sub: 'Describe what you offer', onPdf: true }])

  return (
    <QuoteWizard step={7} numbered subtitle={SUBTITLE_VARIANT}>
      <StepCard index={7} title="Premium" subtitle="Calculated from rate table PV-3. Order: base → riders → override → discount → GST." next={{ label: 'Next: Discount', to: STEPS[8].path }}>
        <Ledger
          rows={[
            ['Base premium (entered by you)', inr(BASE_PREMIUM, true)],
            ['Add-ons: Daily hospital cash, Air ambulance', inr(ADDONS, true)],
          ]}
          total={['Calculated before tax', inr(CALC, true)]}
        />
        <div className="flex items-center gap-3.5">
          <Toggle checked={override} onChange={setOverride} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-ink">Override the premium</span>
            <span className="text-[12px] font-medium text-muted">Advisor only. The calculated amount stays on record.</span>
          </span>
        </div>
        {override && (
          <div className="flex gap-3.5 max-md:flex-col max-md:gap-3">
            <Field label="Premium to use before tax *" className="gap-2">
              <MoneyInput value={amount} onChange={setAmount} focused />
            </Field>
            <Field label="Reason *" className="gap-2">
              <TextField value={reason} onChange={setReason} />
            </Field>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[14px] font-bold text-ink">Additional benefits</span>
              <span className="text-[12px] font-medium text-muted">Your own value-adds, printed on the quotation. Not part of the insurer’s cover.</span>
            </span>
            <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-pink-100 py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#b4325a]">
              <Icon name="star" size={13} />
              Custom
            </span>
          </div>
          {items.map((b) => (
            <div key={b.key} className="flex h-[60px] items-center gap-3 rounded-[16px] bg-panel px-3.5 max-md:h-auto max-md:flex-wrap max-md:gap-2 max-md:py-3 max-md:px-3 max-md:rounded-[14px]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-100">
                <Icon name="sparkle" size={16} className="text-[#b4325a]" />
              </span>
              <span className="flex min-w-px flex-1 flex-col gap-px">
                <span className="text-[13px] font-bold text-ink">{b.title}</span>
                <span className="text-[11px] font-medium text-muted">{b.sub}</span>
              </span>
              <GreenChip icon={null}>Free</GreenChip>
              <button
                type="button"
                onClick={() => setItems((s) => s.map((x) => (x.key === b.key ? { ...x, onPdf: !x.onPdf } : x)))}
                className="flex items-center gap-1.5"
              >
                <Check on={b.onPdf} />
                <span className="text-[11px] font-semibold text-muted">On PDF</span>
              </button>
              <SmallIconBtn icon="edit" label="Edit" />
              <SmallIconBtn icon="x" label="Remove" onClick={() => setItems((s) => s.filter((x) => x.key !== b.key))} />
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="flex h-[42px] items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#c3ccd8] text-[13px] font-bold text-blue hover:bg-blue-50"
          >
            <Icon name="plus" size={16} />
            Add custom benefit
          </button>
        </div>
      </StepCard>
      <LiveSummary
        filled={6}
        extraRows={[
          ['Riders', '2 add-ons'],
          ['Override', override ? `${inr(pre)} (was ${inr(CALC)})` : null],
          ['Additional benefits', items.length ? `${items.length} custom · free` : null],
        ]}
        total={inr(total)}
      />
    </QuoteWizard>
  )
}