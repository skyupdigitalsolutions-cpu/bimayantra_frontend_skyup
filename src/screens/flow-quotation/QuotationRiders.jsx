// Figma 41:4710 · Q7 · Quotation — Riders
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Field, cx } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Check, TextField, MoneyInput } from './_parts'
import { riders, includedFeatures, GST, inr, STEPS, SUBTITLE_VARIANT } from '../../data/quotation-flow'

const BASE = 14900
const num = (s) => Number(String(s).replace(/\D/g, '')) || 0

function SummaryLabel({ children }) {
  return <p className="text-[10px] font-bold tracking-[0.6px] text-muted">{children}</p>
}
function SummaryRow({ k, v, muted }) {
  return (
    <div className="flex h-4 items-center gap-2">
      <span className={cx('min-w-px flex-1 text-[12px] font-medium', muted ? 'text-muted' : 'text-ink-2')}>{k}</span>
      <span className="text-[13px] font-bold whitespace-nowrap text-ink">{v}</span>
    </div>
  )
}

export default function QuotationRiders() {
  const [rows, setRows] = useState(riders)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const update = (key, patch) => setRows((s) => s.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  const picked = rows.filter((r) => r.on)
  const subtotal = BASE + picked.reduce((s, r) => s + num(r.price), 0)
  const gst = Math.round(subtotal * GST)

  const add = () => {
    if (!newName.trim()) return
    setRows((s) => [...s, { key: `c${s.length}`, name: newName.trim(), meta: 'Added by you', price: newPrice, on: true, custom: true }])
    setNewName('')
    setNewPrice('')
  }

  return (
    <QuoteWizard step={6} numbered subtitle={SUBTITLE_VARIANT}>
      <StepCard index={6} title="Riders and add-ons" subtitle="Tick what Kavya wants and type each price from the insurer portal." next={{ label: 'Next: Premium', to: STEPS[7].path }}>
        <div className="flex h-3.5 items-start gap-3 px-3.5 text-[11px] font-bold tracking-[0.4px] text-muted max-md:hidden">
          <span className="w-[22px]" />
          <span className="w-[400px]">ADD-ON</span>
          <span>PRICE (YOU ENTER)</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.key}
            className={cx(
              'flex items-center gap-3 rounded-[18px] px-3.5 py-3 max-md:flex-wrap max-md:gap-2 max-md:rounded-[14px] max-md:px-3 max-md:py-2.5',
              r.on ? 'border-[1.5px] border-blue bg-[#f3f7ff]' : 'border border-line bg-white',
              r.disabled && 'opacity-50',
            )}
          >
            <button type="button" disabled={r.disabled} onClick={() => update(r.key, { on: !r.on })} className="disabled:cursor-not-allowed">
              <Check on={r.on} size={24} />
            </button>
            <span className="flex w-[400px] flex-col gap-0.5 max-md:w-auto max-md:min-w-0 max-md:flex-1">
              <span className="flex items-center gap-2 max-md:flex-wrap">
                <span className="text-[14px] font-bold text-ink max-md:text-[13px]">{r.name}</span>
                {r.custom && (
                  <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-blue-50 py-[5px] pr-3 pl-2 text-[12px] font-semibold text-blue">
                    <Icon name="edit" size={13} />
                    Your add-on
                  </span>
                )}
              </span>
              <span className="text-[12px] font-medium text-muted max-md:text-[11px]">{r.meta}</span>
            </span>
            <span className={cx('flex h-10 w-[150px] items-center gap-1.5 rounded-[12px] px-3 max-md:ml-8 max-md:w-[120px]', r.on ? 'border border-line bg-white' : 'bg-panel')}>
              <span className="text-[13px] font-semibold text-muted">₹</span>
              <input
                value={r.price}
                disabled={r.disabled}
                placeholder="0"
                onChange={(e) => update(r.key, { price: e.target.value, on: r.on || !!e.target.value })}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-ink outline-none placeholder:font-medium placeholder:text-faint"
              />
            </span>
            <span className="flex-1 max-md:hidden" />
            {r.custom && (
              <button
                type="button"
                aria-label="Remove add-on"
                onClick={() => setRows((s) => s.filter((x) => x.key !== r.key))}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile"
              >
                <Icon name="x" size={13.4} className="text-[#b4323c]" />
              </button>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-3 rounded-[18px] border border-dashed border-[#9db8ee] bg-[#f7f9ff] p-4 max-md:rounded-[14px] max-md:p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-white">
              <Icon name="plus" size={15} className="text-blue" />
            </span>
            <span className="text-[14px] font-bold text-ink max-md:text-[13px]">Add a new add-on</span>
          </div>
          <div className="flex items-end gap-3 max-md:flex-col max-md:items-stretch">
            <Field label="Add-on name *" className="w-[413px] flex-none gap-2 max-md:w-full">
              <TextField value={newName} onChange={setNewName} placeholder="e.g. Critical illness rider" className="bg-white" />
            </Field>
            <Field label="Price *" className="w-[150px] flex-none gap-2 max-md:w-full">
              <MoneyInput value={newPrice} onChange={setNewPrice} placeholder="0" className="bg-white" />
            </Field>
            <button
              type="button"
              onClick={add}
              className="inline-flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700 max-md:h-10 max-md:rounded-[20px] max-md:text-[13px]"
            >
              <Icon name="plus" size={18} />
              Add
            </button>
          </div>
        </div>
      </StepCard>

      <LiveSummary filled={6} rowGap={10}>
        <div className="flex flex-col gap-2.5 rounded-[20px] bg-white p-4">
          <SummaryLabel>BASE</SummaryLabel>
          <SummaryRow k="Base premium (entered by you)" v={inr(BASE)} />
          <SummaryLabel>ADDITIONAL FEATURES · INCLUDED</SummaryLabel>
          <div className="flex w-[300px] flex-wrap gap-1.5 max-md:w-full">
            {includedFeatures.map((f) => (
              <span key={f} className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#127650]">
                <Icon name="check" size={13} />
                {f}
              </span>
            ))}
            <span className="rounded-[14px] bg-[#eef1f5] px-3 py-[5px] text-[12px] font-semibold text-ink-2">+3 more</span>
          </div>
          <SummaryLabel>ADD-ONS</SummaryLabel>
          {picked.map((r) => <SummaryRow key={r.key} k={r.name} v={inr(num(r.price))} />)}
          <span className="h-px bg-line" />
          <SummaryRow k="Subtotal" v={inr(subtotal)} muted />
          <SummaryRow k="GST 18%" v={inr(gst)} muted />
          <span className="h-px bg-line" />
          <div className="flex items-center gap-2">
            <span className="flex-1 text-[14px] font-bold text-ink">Total</span>
            <span className="text-[20px] font-bold text-ink">{inr(subtotal + gst)}</span>
          </div>
        </div>
      </LiveSummary>
    </QuoteWizard>
  )
}