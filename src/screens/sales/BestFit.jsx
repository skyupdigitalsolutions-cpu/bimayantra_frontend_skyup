// Figma 9:1127 · 06 · Best fit
import { useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, Field, Select, Input, cx } from '../../components/ui'
import { PillButton, SCard, SCardHead, Dot, NOWRAP } from './_parts'
import { bestFitPeople, bestFitPriorities, bestFitResults } from '../../data/sales'
import { useCtrlK } from '../tasks/_filter'

function ScoreRow({ label, weight, value, reason, muted }) {
  return (
    <div className="flex items-center gap-3 text-[12px]">
      <p className="flex w-[150px] shrink-0 items-baseline gap-1 font-semibold text-ink">
        {label} <span className="text-[11px] font-medium text-muted">{weight}</span>
      </p>
      <div className="h-2 w-[300px] shrink-0 overflow-hidden rounded-[4px] bg-[#e8f0fd]">
        <div className={cx('h-full rounded-[4px]', muted ? 'bg-faint' : 'bg-blue')} style={{ width: `${value}%` }} />
      </div>
      <p className="flex-1 font-medium text-muted">{reason}</p>
      <p className="font-bold text-ink">{value}</p>
    </div>
  )
}

function ResultCard({ r, picked, onPick }) {
  return (
    <section className={cx('flex flex-col gap-3.5 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', r.rank === 1 && 'border border-[#c9daf8]')}>
      <div className="flex items-center gap-3.5">
        <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold', r.rank === 1 ? 'bg-navy text-white' : 'bg-panel text-ink')}>
          #{r.rank}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[17px] font-bold text-ink">{r.name}</p>
          <p className="text-[12px] font-medium text-muted">Per year incl. GST</p>
        </div>
        <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">{r.price}</p>
        <span className={cx('flex h-[34px] items-center rounded-[16px] px-3.5 text-[14px] font-bold', r.score >= 80 ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#e8f0fd] text-blue')}>
          Score {r.score}
        </span>
      </div>
      {r.rows && <div className="flex flex-col gap-2">{r.rows.map((x) => <ScoreRow key={x[0]} label={x[0]} weight={x[1]} value={x[2]} reason={x[3]} muted={x[4]} />)}</div>}
      {r.warning && (
        <div className="flex h-9 items-center gap-2.5 rounded-[14px] bg-[#fbf1e1] px-3.5 text-[13px] font-semibold text-[#8a5a12]">
          <Icon name="alert" size={16} />
          {r.warning}
        </div>
      )}
      <div className="flex items-center gap-2.5">
        <PillButton variant={r.rank === 1 ? 'navy' : 'outline'} size="sm" icon="quote" className={r.rank === 1 ? 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]' : 'pl-[13px] pr-[15px]'} to="/x/q6-quotation-details">Create quotation</PillButton>
        <label className="flex cursor-pointer items-center gap-2 pl-2 text-[13px] font-semibold text-ink">
          <button type="button" role="checkbox" aria-checked={!!picked} onClick={() => onPick(!picked)}
            className={cx('flex size-5 items-center justify-center rounded-[6px]', picked ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white')}>
            {picked && <Icon name="check" size={14} />}
          </button>
          Add to comparison
        </label>
      </div>
    </section>
  )
}

// "What matters most" → ordering applied when you press Rank products (ties fall back to the score).
const ORDER = {
  'Best coverage': (a, b) => b.score - a.score,
  'Lowest premium': (a, b) => a.premium - b.premium || b.score - a.score,
  'Claim reliability': (a, b) => b.claims - a.claims || b.score - a.score,
  'Pre-existing condition': (a, b) => a.pedYears - b.pedYears || b.score - a.score,
}

export default function BestFit() {
  useCtrlK()
  const [people, setPeople] = useState(bestFitPeople)
  const [prio, setPrio] = useState('Best coverage')
  const [picked, setPicked] = useState(() => Object.fromEntries(bestFitResults.map((r) => [r.name, r.compare])))
  const [ranked, setRanked] = useState(true)
  const [rankedBy, setRankedBy] = useState('Best coverage')
  const results = [...bestFitResults].sort(ORDER[rankedBy]).map((r, i) => ({ ...r, rank: i + 1 }))

  return (
    <AppLayout active="bestfit" panelClass="pb-2!">
      <PageHeader
        className={NOWRAP}
        breadcrumb={'SELL  /  BEST FIT'}
        title="Best fit"
        subtitle="Ranks the products you can quote with fixed rules. Every score shows its reason."
        actions={
          <PillButton variant="outline" icon="compare" className="pl-[17px]" to="/x/10b-products-compare-variants">
            Compare selected
          </PillButton>
        }
      />

      <div className="mt-[13px] flex items-start gap-5">
        {/* Needs form */}
        <SCard className="w-[380px] shrink-0" gap="gap-5">
          <SCardHead title="What does Kavya need?" subtitle="Health · 3 people" />
          <Field label="Customer">
            <div className="relative flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel pr-4 pl-4">
              <Dot initials="KH" bg="#fbd5dd" size={30} font={10} border={0} />
              <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0">
                <option>Kavya Hegde (CU-000318)</option>
                <option>Faizal Khan Sr (CU-000319)</option>
              </SelectCompat>
            </div>
          </Field>
          <Field label="Insurance type">
            <div className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4">
              <Icon name="heart" size={18} className="text-muted" />
              <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0">
                <option>Health</option><option>Motor</option><option>Life and Term</option>
              </SelectCompat>
            </div>
          </Field>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">People to cover *</p>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  disabled={p.disabled}
                  onClick={() => setPeople((xs) => xs.map((x) => (x.key === p.key ? { ...x, on: !x.on } : x)))}
                  className={cx(
                    'flex h-[34px] items-center gap-1.5 rounded-[17px] border text-[13px] font-semibold',
                    p.on ? 'border-blue bg-[#e8f0fd] pr-3.5 pl-[11px] text-blue' : 'border-line bg-white px-[15px] text-faint',
                    p.disabled && 'cursor-not-allowed opacity-70',
                  )}
                >
                  {p.on && <Icon name="check" size={14} />}
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <Field label="Sum insured"><Select options={['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh']} defaultValue="₹10 lakh" /></Field>
          <Field label="Yearly budget"><Input prefix="₹" defaultValue="25,000" /></Field>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-ink">What matters most *</p>
            <div className="grid grid-cols-[160px_160px] gap-2">
              {bestFitPriorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrio(p)}
                  className={cx(
                    'h-10 rounded-[16px] px-3.5 text-left text-[13px] font-semibold whitespace-nowrap',
                    prio === p ? 'bg-navy text-white' : 'bg-panel text-ink hover:bg-[#edf1f8]',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
           <PillButton variant="navy" icon="sparkle" className="w-full justify-center shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]" onClick={() => { setRanked(true); setRankedBy(prio) }}>Rank products</PillButton>
        </SCard>

        {/* Results */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex h-20 items-center gap-3.5 rounded-[24px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] px-[22px]">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/70 text-[#5b3fb8]">
              <Icon name="sparkle" size={20} />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] leading-5 font-semibold text-ink">{results[0].name} ranks first for “{rankedBy.toLowerCase()}”, ahead of {results[1].short}.</p>
              <p className="text-[12px] font-medium text-[#5b3fb8]">Written summary · never changes the order</p>
            </div>
          </div>
          {ranked && results.map((r) => (
            <ResultCard key={r.name} r={r} picked={picked[r.name]} onPick={(v) => setPicked((s) => ({ ...s, [r.name]: v }))} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
