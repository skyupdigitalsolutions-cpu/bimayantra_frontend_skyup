// Figma 42:5439 · C2 · Comparison — Shared
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import ComparisonPage, { Btn, Pill, SharedChip, card } from './_parts'
import { C, sharedOptions, activity, WHY_GOLD } from '../../data/comparison'

export default function ComparisonShared() {
  const [shared, setShared] = useState(false)
  return (
    <ComparisonPage
      chip={<SharedChip />}
      subtitle="Kavya Hegde · 3 options at ₹10 lakh · valid until 11 Nov 2026"
      actions={
        <>
          <Btn variant="outline" icon="send" onClick={() => setShared(true)}>{shared ? 'Shared again' : 'Share again'}</Btn>
          <Btn icon="check" to={C.chose}>Customer chose this</Btn>
        </>
      }
    >
      <div className="mt-[21px] flex items-start gap-5">
        {sharedOptions.map((o) => (
          <article
            key={o.key}
            className={cx(card, 'flex w-[380px] shrink-0 flex-col overflow-hidden', o.recommended ? 'h-[290px] border-2 border-[#1f5fd6]' : 'h-[286px]')}
          >
            <div className={cx('flex h-[109px] shrink-0 flex-col gap-1.5 px-5 py-[18px]', o.tint)}>
              {o.recommended ? (
                <Pill tone="green" icon="star" className="self-start">Recommended</Pill>
              ) : (
                <Pill tone="gray" className="self-start">Option</Pill>
              )}
              <p className="text-[17px] font-bold text-ink">{o.name}</p>
              <p className="text-[12px] font-medium text-slate">{o.insurer}</p>
            </div>
            <div className="flex flex-col gap-2.5 p-5">
              <p className="flex items-end gap-1.5">
                <span className="text-[26px] font-bold tracking-[-0.3px] text-ink">{o.premium}</span>
                <span className="pb-px text-[12px] font-medium text-muted">/ year</span>
              </p>
              {o.rows.map(([k, v]) => (
                <div key={k} className="flex h-4 items-center text-[13px]">
                  <span className="flex-1 font-medium text-muted">{k}</span>
                  <span className="font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex h-20 items-center gap-3.5 rounded-[24px] bg-violet-cta px-[22px]">
        <span className="flex size-11 items-center justify-center rounded-full bg-white/70">
          <Icon name="star" size={20} className="text-[#5b3fb8]" />
        </span>
        <p className="text-[14px] font-semibold text-ink">Why Gold is recommended: {WHY_GOLD}</p>
      </div>

      <section className={cx(card, 'mt-5 flex flex-col gap-3 p-6')}>
        <p className="text-[17px] leading-[21px] font-bold text-ink">Activity</p>
        {activity.map((a) => (
          <div key={a.title} className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-panel">
              <Icon name={a.icon} size={16} className="text-ink" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-ink">{a.title}</span>
              <span className="text-[12px] font-medium text-muted">{a.time}</span>
            </span>
          </div>
        ))}
      </section>
    </ComparisonPage>
  )
}
