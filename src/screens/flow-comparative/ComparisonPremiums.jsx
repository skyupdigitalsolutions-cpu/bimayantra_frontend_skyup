// Figma 219:17371 · CQ6 · Comparison — Premiums
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary, Note } from './_parts'
import { CQ, cqOptions } from '../../data/flow-comparative'

const num = (s) => Number(String(s).replace(/[^\d.]/g, '')) || 0
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
const EXTRA_ADDON = { name: 'Daily hospital cash', price: '₹1,200' }

function OptionPremium({ index, o, value, onValue, addons, onAddons, focused, onFocus }) {
  const before = num(value) + addons.reduce((t, a) => t + num(a.price), 0)
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">{index + 1}</span>
        <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full', o.tint)}>
          <Icon name="heart" size={16} className="text-ink" />
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-[14px] font-bold text-ink">{o.product} · {o.variant}</span>
          <span className="text-[11px] font-medium text-muted">{o.insurer}</span>
        </span>
      </div>
      <div className="flex items-end gap-3">
        <label className="flex w-[368px] shrink-0 flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Base premium before GST *</span>
          <span className={cx('flex h-[50px] items-center gap-2.5 rounded-[16px] bg-white px-4 text-[14px] font-semibold', focused ? 'border-2 border-[#1f5fd6]' : 'border-2 border-transparent')}>
            <span className="text-muted">₹</span>
            <input value={value} onFocus={onFocus} onChange={(e) => onValue(e.target.value)} className="min-w-0 flex-1 bg-transparent text-ink outline-none" />
          </span>
        </label>
        <div className="flex w-[300px] flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Add-ons</span>
          <div className="flex items-center gap-1.5">
            {addons.map((a) => (
              <span key={a.name} className="flex h-[29px] items-center gap-1.5 rounded-[12px] border border-line bg-white px-2.5 text-[12px]">
                <span className="font-semibold text-ink">{a.name}</span>
                <span className="font-bold text-[#1f5fd6]">{a.price}</span>
                <button type="button" aria-label={`Remove ${a.name}`} onClick={() => onAddons(addons.filter((x) => x !== a))} className="text-muted hover:text-ink">
                  <Icon name="x" size={11} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => !addons.some((a) => a.name === EXTRA_ADDON.name) && onAddons([...addons, EXTRA_ADDON])}
              className="flex h-[29px] items-center gap-1 rounded-[12px] border border-[#9db8ee] px-2.5 text-[12px] font-bold text-[#1f5fd6] hover:bg-[#f3f7ff]"
            >
              <Icon name="plus" size={12} />
              Add-on
            </button>
          </div>
        </div>
      </div>
      <p className="text-[12px] font-medium text-muted">Before GST {inr(before)} · GST 18% added on review</p>
    </div>
  )
}

export default function ComparisonPremiums() {
  const [values, setValues] = useState(() => Object.fromEntries(cqOptions.map((o) => [o.key, o.base])))
  const [addons, setAddons] = useState(() => Object.fromEntries(cqOptions.map((o) => [o.key, o.addons])))
  const [focus, setFocus] = useState('gold')
  const total = (o) => inr((num(values[o.key]) + addons[o.key].reduce((t, a) => t + num(a.price), 0)) * 1.18)

  return (
    <CqPage
      step={5}
      panelClass="pb-[60px]"
      summary={
        <LiveSummary
          insurance="Health"
          options="3 options"
          people="3 people · ₹10 lakh"
          listTitle="OPTIONS · TOTAL INCL. GST"
          list={cqOptions.map((o) => ({ label: `${o.product} · ${o.variant}`, value: total(o) }))}
        />
      }
    >
      <StepCard
        title="6 · Premiums and add-ons"
        subtitle="Type each premium from the insurer portal. Add-ons are per option."
        back={CQ.details}
        next={CQ.recommend}
        nextLabel="Next: Recommend"
      >
        {cqOptions.map((o, i) => (
          <OptionPremium
            key={o.key}
            index={i}
            o={o}
            value={values[o.key]}
            onValue={(v) => setValues((s) => ({ ...s, [o.key]: v }))}
            addons={addons[o.key]}
            onAddons={(a) => setAddons((s) => ({ ...s, [o.key]: a }))}
            focused={focus === o.key}
            onFocus={() => setFocus(o.key)}
          />
        ))}
        <Note tone="amber" icon="edit">With more than one person, prices depend on each insurer’s floater rules, so they’re entered by you.</Note>
      </StepCard>
    </CqPage>
  )
}
