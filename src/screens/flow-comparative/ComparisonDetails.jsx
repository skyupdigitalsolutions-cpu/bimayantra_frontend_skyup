// Figma 218:17642 · CQ5 · Comparison — Details
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary } from './_parts'
import { CQ, cqOptions, cqPeople } from '../../data/flow-comparative'

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="flex w-[228px] shrink-0 flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <span className="relative flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4">
        <span className="flex-1 text-[14px] font-semibold text-ink">{value}</span>
        <Icon name="chev-down" size={18} className="text-muted" />
        <select value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </span>
    </label>
  )
}

export default function ComparisonDetails() {
  const [people, setPeople] = useState(() => Object.fromEntries(cqPeople.map((p) => [p.key, p.on])))
  const [sum, setSum] = useState('₹10 lakh')
  const [term, setTerm] = useState('1 year')
  const [start, setStart] = useState('10-11-2026')
  const count = Object.values(people).filter(Boolean).length

  return (
    <CqPage
      step={4}
      summary={
        <LiveSummary
          insurance="Health"
          options="3 options"
          people={`${count} ${count === 1 ? 'person' : 'people'} · ${sum}`}
          list={cqOptions.map((o) => ({ label: `${o.product} · ${o.variant}` }))}
        />
      }
    >
      <StepCard title="5 · Details" subtitle="Applies to every option" back={CQ.options} next={CQ.premiums} nextLabel="Next: Premiums">
        <div className="flex flex-col gap-2.5">
          <span className="text-[13px] font-semibold text-ink">People to cover *</span>
          <div className="flex flex-wrap gap-2.5">
            {cqPeople.map((p) => {
              const on = people[p.key]
              return (
                <button
                  key={p.key}
                  type="button"
                  disabled={p.disabled}
                  onClick={() => setPeople((s) => ({ ...s, [p.key]: !s[p.key] }))}
                  className={cx(
                    'flex h-[58px] w-[344px] items-center gap-2.5 rounded-[18px] border py-2.5 pr-3.5 pl-2.5 text-left',
                    on ? 'border-[#1f5fd6] bg-[#f3f7ff]' : 'border-line bg-white',
                    p.disabled && 'cursor-not-allowed',
                  )}
                >
                  <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-[12px] font-bold text-navy', p.avatar)}>{p.initials}</span>
                  <span className={cx('flex-1 text-[13px] font-bold', p.disabled ? 'text-faint' : 'text-ink')}>{p.label}</span>
                  <span className={cx('flex size-[22px] shrink-0 items-center justify-center rounded-[7px]', on ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white')}>
                    {on && <Icon name="check" size={14} />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-3.5">
          <SelectField label="Sum insured *" value={sum} onChange={setSum} options={['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh']} />
          <SelectField label="Policy term *" value={term} onChange={setTerm} options={['1 year', '2 years', '3 years']} />
          <label className="flex w-[228px] shrink-0 flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink">Planned start date *</span>
            <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 focus-within:ring-2 focus-within:ring-blue/30">
              <input value={start} onChange={(e) => setStart(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none" />
              <Icon name="calendar" size={18} className="text-muted" />
            </span>
          </label>
        </div>
      </StepCard>
    </CqPage>
  )
}
