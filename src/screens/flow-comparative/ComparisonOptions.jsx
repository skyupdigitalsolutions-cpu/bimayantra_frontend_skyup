// Figma 218:17359 · CQ4 · Comparison — Options
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import CqPage, { StepCard, LiveSummary, Note } from './_parts'
import { CQ, cqOptions } from '../../data/flow-comparative'

export default function ComparisonOptions() {
  const [opts, setOpts] = useState(cqOptions)
  const full = opts.length >= 3
  const update = (key, variant) => setOpts((s) => s.map((o) => (o.key === key ? { ...o, variant } : o)))
  const addBack = () => {
    const missing = cqOptions.find((o) => !opts.some((x) => x.key === o.key))
    if (missing) setOpts((s) => [...s, missing])
  }

  return (
    <CqPage
      step={3}
      summary={
        <LiveSummary
          insurance="Health"
          options={`${opts.length} options`}
          list={opts.map((o) => ({ label: `${o.product} · ${o.variant}` }))}
        />
      }
    >
      <StepCard
        title="4 · Options"
        subtitle="Pick 2 to 3 products or variants. Insurers with an active agent code only."
        back={CQ.insurance}
        next={CQ.details}
        nextLabel="Next: Details"
      >
        {opts.map((o, i) => (
          <div key={o.key} className="flex h-[72px] items-center gap-3.5 rounded-[20px] bg-panel p-3.5">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">{i + 1}</span>
            <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-full', o.tint)}>
              <Icon name="heart" size={20} className="text-ink" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[14px] font-bold text-ink">{o.product}</span>
              <span className="text-[12px] font-medium text-muted">{o.insurer}</span>
            </span>
            <label className="relative flex h-[38px] shrink-0 items-center gap-2 rounded-[14px] border border-line bg-white px-3 text-[12px] font-bold text-ink">
              <span>Variant: {o.variant}</span>
              <Icon name="chev-down" size={15} className="text-muted" />
              <select
                value={o.variant}
                onChange={(e) => update(o.key, e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Variant"
              >
                {o.variants.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
            <button
              type="button"
              aria-label="Remove option"
              disabled={opts.length <= 2}
              onClick={() => setOpts((s) => s.filter((x) => x.key !== o.key))}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#b4323c] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile disabled:cursor-not-allowed"
            >
              <Icon name="x" size={13.4} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={full}
          onClick={addBack}
          className={cx(
            'flex h-[46px] items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#c3ccd8] text-[13px] font-bold',
            full ? 'cursor-not-allowed text-muted opacity-60' : 'text-[#1f5fd6] hover:bg-[#f3f7ff]',
          )}
        >
          <Icon name="plus" size={16} />
          Add option · {opts.length} of 3 used
        </button>
        <Note icon="compare">Variants of the same product count as separate options.</Note>
      </StepCard>
    </CqPage>
  )
}
