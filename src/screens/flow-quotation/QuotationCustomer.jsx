// Figma 40:3995 · Q1 · Quotation — Customer
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import QuoteWizard, { StepCard, LiveSummary, Radio, RowAvatar, GreenChip, choice } from './_parts'
import { customers, STEPS } from '../../data/quotation-flow'
import { matches, NoMatches } from '../customer-tabs/_search'

export default function QuotationCustomer() {
  const [q, setQ] = useState('Kav')
  const [typed, setTyped] = useState(false)
  const [sel, setSel] = useState('CU-000318')
  const term = q.trim().toLowerCase()
  // As loaded (Figma): "Kav" prefilled, matches first and the rest underneath.
  // Once the advisor types, the list filters live on name, phone or CU number.
  const list = typed
    ? customers.filter((c) => matches(q, c.name, c.meta, c.id))
    : [...customers].sort((a, b) => (b.name.toLowerCase().includes(term) ? 1 : 0) - (a.name.toLowerCase().includes(term) ? 1 : 0))

  return (
    <QuoteWizard step={0} subtitle="Start with the customer">
      <StepCard index={0} title="Customer" subtitle="Only active customers can be quoted" next={{ label: 'Next: Type', to: STEPS[1].path }}>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Search customers</span>
          <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] border-2 border-blue bg-panel px-4">
            <Icon name="search" size={18} className="text-muted" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setTyped(true) }}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint"
              placeholder="Name, phone or CU number"
            />
          </span>
        </label>
        {!list.length && <NoMatches label={`No customers match “${q}”`} onClear={() => setQ('')} />}
        {list.map((c) => {
          const on = sel === c.id
          return (
            <button key={c.id} type="button" onClick={() => setSel(c.id)} className={`flex w-full items-center gap-3.5 p-3.5 max-md:gap-2.5 max-md:p-3 ${choice(on)}`}>
              <Radio on={on} />
              <RowAvatar initials={c.initials} tone={c.tone} />
              <span className="flex min-w-px flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink max-md:text-[13px]">{c.name}</span>
                <span className="text-[12px] font-medium text-muted max-md:text-[11px]">{c.meta}</span>
              </span>
              {c.consent && <GreenChip className="max-md:hidden">Consent given</GreenChip>}
            </button>
          )
        })}
        <Link to="/x/f3-new-customer" className="flex items-center gap-2 self-start text-[13px] font-bold text-blue hover:underline">
          <Icon name="plus" size={16} strokeWidth={2} />
          Not here? Add a new customer
        </Link>
      </StepCard>
      <LiveSummary filled={0} />
    </QuoteWizard>
  )
}