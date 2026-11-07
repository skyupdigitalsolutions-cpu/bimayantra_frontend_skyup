// Figma 12:1261 · 13 · Renewals
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { RenewalCard } from '../../components/cards'
import { Header, HeadButton, SmallButton, SegTabs, Panel, PanelHead, StatusChip, RingAvatar } from './_parts'
import { renewalTabs, renewalCards, reminderSteps, lapsedRenewals, renewalRanges } from '../../data/catalogue'
import { matchesQuery, useHeaderSearch, useDismiss, NoMatches } from '../tasks/_filter'
import { cx } from '../../components/ui'

function RangeMenu({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, setOpen)
  const cur = renewalRanges.find((r) => r.key === (value ?? '60'))
  return (
    <div ref={ref} className="relative">
      <HeadButton variant="white" icon="calendar" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cx(value && value !== 'all' && 'border-blue text-blue')}>
        {cur.label}
      </HeadButton>
      {open && (
        <div role="listbox" className="absolute top-[54px] right-0 z-30 flex w-[200px] flex-col gap-0.5 rounded-[18px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
          <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">RENEWS WITHIN</p>
          {renewalRanges.map((r) => (
            <button key={r.key} type="button" role="option" aria-selected={r.key === cur.key} onClick={() => { onChange(r.key); setOpen(false) }} className={cx('flex h-9 items-center gap-2 rounded-[10px] px-2.5 text-left text-[13px] font-semibold text-ink hover:bg-[#f3f7ff]', r.key === cur.key && 'bg-[#f3f7ff]')}>
              <span className="flex-1">{r.label}</span>{r.key === cur.key && <Icon name="check" size={14} className="text-blue" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Renewals() {
  const [tab, setTab] = useState('due')
  // As loaded, the page shows the Figma overview (all open renewals + the lapsed one) under the Due tab.
  // Picking a tab or a date range switches to the strictly filtered list.
  const [touched, setTouched] = useState(false)
  const [range, setRange] = useState(null) // null = "Next 60 days" label, not applied until picked
  const [q, clearQ] = useHeaderSearch()
  const all = [...renewalCards, ...lapsedRenewals]
  const tabs = renewalTabs.map((t) => ({ ...t, count: all.filter((r) => r.stage === t.key).length }))
  const maxDays = range ? renewalRanges.find((r) => r.key === range).days : Infinity
  const hit = (r) => matchesQuery(q, r.name, r.insurer, r.plan, r.premium, r.renews)
  const cards = renewalCards.filter((r) => (!touched || r.stage === tab) && r.days <= maxDays && hit(r))
  const lapsed = lapsedRenewals.filter((r) => (!touched || r.stage === tab) && hit(r))
  const pickTab = (k) => { setTab(k); setTouched(true) }
  const pickRange = (k) => { setRange(k); setTouched(true) }
  const clearAll = () => { clearQ(); setRange('all') }
  const label = tabs.find((t) => t.key === tab).label.toLowerCase()
  return (
    <AppLayout active="renewals">
      <Header
        breadcrumb={'AFTER-SALE  /  RENEWALS'}
        title="Renewals"
        subtitle="The system moves each renewal by date. You close each one."
        actions={<RangeMenu value={range} onChange={pickRange} />}
      />

      <SegTabs items={tabs} value={tab} onChange={pickTab} className="mt-[13px]" />

      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-col">
          {cards.length > 0 && (
            <div className="flex flex-wrap gap-5">
              {cards.map((r) => (
                <RenewalCard key={r.name} r={r} to="/x/n1-renewal-detail" />
              ))}
            </div>
          )}
          {lapsed.map((r) => (
            <div key={r.name} className={cx('flex items-center gap-3.5 rounded-[26px] bg-white px-[22px] py-[18px] shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', cards.length > 0 && 'mt-[49px]')}>
              <RingAvatar initials={r.initials} bg="bg-[#eef1f5]" size={44} text={14} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{r.name} · {r.insurer} {r.plan}</p>
                <p className="text-[12px] font-medium text-muted">{r.note}</p>
              </div>
              <StatusChip tone="red" icon="x" className="bg-[#fbebec] text-[#b4323c]">Lapsed</StatusChip>
            </div>
          ))}
          {cards.length === 0 && lapsed.length === 0 && (
            <NoMatches
              className="rounded-[26px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]"
              text={q.trim() || (range && range !== 'all') ? 'No matches' : 'Nothing here'}
              sub={q.trim() ? `No renewals match “${q.trim()}”.` : range && range !== 'all' ? `No ${label} renewals in the ${renewalRanges.find((r) => r.key === range).label.toLowerCase()}.` : `No renewals are ${label} right now.`}
              onClear={q.trim() || (range && range !== 'all') ? clearAll : undefined}
            />
          )}
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-3.5">
            <PanelHead
              title="Customer reminders"
              subtitle="Kavya Hegde · only on channels with consent"
              right={<StatusChip tone="blue" icon="clock" className="bg-[#e8f0fd]">Auto</StatusChip>}
            />
            {reminderSteps.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-[14px] ${s.done ? 'bg-[#16845b] text-white' : 'bg-panel text-[11px] font-bold text-muted'}`}>
                  {s.done ? <Icon name="check" size={14} /> : i + 1}
                </span>
                <div className="flex flex-col gap-px">
                  <p className={`text-[13px] leading-[16px] font-bold ${s.done ? 'text-ink' : 'text-ink-2'}`}>{s.title}</p>
                  <p className="text-[11px] leading-[14px] font-medium text-muted">{s.sub}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2.5">
              <SmallButton variant="outline" icon="clock" to="/x/rs5-renewal-pause-reminders">Pause reminders</SmallButton>
              <SmallButton variant="navy" icon="phone" to="/x/n2-renewal-log-contact">Log contact</SmallButton>
            </div>
          </Panel>

          <div className="flex flex-col items-start gap-2.5 rounded-[28px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <p className="text-[16px] font-bold text-ink">How to renew</p>
            <p className="text-[13px] leading-[20px] font-medium text-ink-2">
              Create the renewal quotation, share it, record payment, submit the proposal, then record the new policy. That closes this renewal and starts the next.
            </p>
            <SmallButton variant="navy" icon="quote" to="/x/rn0-renewal-how-to-renew">Create renewal quotation</SmallButton>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
