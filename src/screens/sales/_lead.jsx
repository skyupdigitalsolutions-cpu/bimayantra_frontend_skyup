// Shared Lead detail layout (Figma 8:809) — reused by the LS1–LS6 lead-lifecycle states.
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { PillButton, CircleBtn, SChip, SCard, SCardHead, KVItem, NOWRAP } from './_parts'
import { leadDetail as MOCK } from '../../data/sales'
import { useCtrlK } from '../tasks/_filter'

/**
 * state: 'open' (default, Follow-up) | 'lost' | 'converted'
 * links: when true the header/card buttons carry the prototype links (03 · Lead detail, LS4)
 * lostChip: chip shown on the "Lost on 26 Oct" card ('closed' | 'overdue')
 * overlay / toast: rendered inside the workspace panel
 */
/**
 * Live mode (src/live/LeadDetail.jsx): `data` is the lead view model (same keys as the mock plus status chip,
 * follow-up / lost / converted cards) and `on` holds the action handlers. Without them the Figma mock renders.
 */
export default function LeadDetailBase({ state: stateProp = 'open', links = false, lostChip = 'closed', overlay, toast, data, on, extra }) {
  useCtrlK()
  const [doneMock, setDone] = useState(false)
  const L = data ?? MOCK
  const state = data ? data.state : stateProp
  const done = data ? !!data.follow?.done : doneMock
  const lost = state === 'lost'
  const converted = state === 'converted'
  const L2 = (to) => (links ? to : undefined)
  const act = (key, to) => (on?.[key] ? { onClick: on[key] } : { to: L2(to) })

  const stageChip = data ? (
    <SChip tone={data.statusChip.tone} icon={data.statusChip.icon}>{data.statusChip.label}</SChip>
  ) : lost ? (
    <SChip tone="gray" icon="x">Lost</SChip>
  ) : converted ? (
    <SChip tone="green" icon="check">Converted</SChip>
  ) : (
    <SChip tone="amber" icon="clock">Follow-up</SChip>
  )

  const actions = lost ? (
    <PillButton variant="navy" icon="refresh" {...act('reopen', '/leads')}>Reopen lead</PillButton>
  ) : converted ? (
    <PillButton variant="navy" icon="arrow" to={data?.customerTo ?? '/customers/1'}>Open policy holder</PillButton>
  ) : (
    <>
      <PillButton variant="outline" icon="refresh" {...act('status', '/leads')}>Change status</PillButton>
      {(!data || data.canConvert) && <PillButton variant="pink" icon="user-plus" {...(on?.convert ? { onClick: on.convert } : { to: '/leads' })}>Convert to customer</PillButton>}
      <PillButton variant="navy" icon="phone" {...act('contact', '/leads')}>Log contact</PillButton>
    </>
  )

  const overdue = data ? (data.follow?.chip ? <SChip tone={data.follow.chip.tone} icon={data.follow.chip.icon}>{data.follow.chip.label}</SChip> : null) : <SChip tone="red" icon="alert">Overdue 2 days</SChip>

  return (
    <AppLayout active="leads">
      <PageHeader
        className={NOWRAP}
        breadcrumb={`LEADS  /  ${L.name.toUpperCase()}`}
        title={L.name}
        titleExtra={stageChip}
        subtitle={L.meta}
        actions={actions}
      />

      <div className="mt-[53px] flex items-start gap-5">
        {/* Main column */}
        <div className="flex w-[760px] flex-col gap-5">
          <div className="flex h-[144px] items-center gap-6 rounded-[32px] bg-linear-to-r from-[#fbd3dc] to-[#f6b3c3] p-7 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
            <span className="flex size-[88px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-[28px] font-bold text-navy">
              {L.initials}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">{L.name}</p>
              <p className="text-[13px] font-medium text-rose-ink">{L.summary}</p>
              <div className="flex gap-2">
                <SChip tone={data?.priorityChip?.tone ?? 'high'}>{data?.priorityChip?.label ?? 'High priority'}</SChip>
                <SChip tone="gray" icon="link">{data?.sourceLabel ?? 'Referral · Manjunath K'}</SChip>
              </div>
            </div>
            <div className="flex gap-2.5">
              <CircleBtn icon="phone" aria-label="Call" onClick={() => data?.tel && window.open(`tel:${data.tel}`)} />
              <CircleBtn icon="chat" aria-label="WhatsApp" onClick={() => data?.tel && window.open(`https://wa.me/91${data.tel}`, '_blank', 'noopener')} />
              <CircleBtn icon="mail" dark={false} aria-label="Email" onClick={() => data?.email && window.open(`mailto:${data.email}`)} />
            </div>
          </div>

          <SCard>
            <SCardHead
              title="Details"
              subtitle="Contact and source"
              right={!converted && <PillButton variant="ghost" size="sm" icon="edit" {...act('edit', '/leads')}>Edit</PillButton>}
            />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {L.details.map(([k, v]) => <KVItem key={k} k={k} v={v} />)}
            </div>
          </SCard>

          <SCard>
            <SCardHead title="Activity" subtitle="Contacts and stage changes" />
            {L.activity.length === 0 && <p className="text-[13px] font-medium text-muted">No activity yet.</p>}
            {L.activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink" style={{ background: a.bg }}>
                  <Icon name={a.icon} size={18} />
                </span>
                <div className="flex flex-col items-start gap-[3px]">
                  <p className="text-[14px] font-semibold text-ink">{a.title}</p>
                  <p className="text-[12px] font-medium text-muted">{a.meta}</p>
                  {a.note && <p className="rounded-[12px] bg-panel px-3 py-2 text-[12px] font-medium text-ink-2">{a.note}</p>}
                </div>
              </div>
            ))}
          </SCard>
        </div>

        {/* Side column */}
        <div className="flex w-[400px] flex-col gap-5">
          <SCard className={cx("bg-linear-to-r from-[#fde8c9] to-[#fbd9b0]", converted && "h-[197px]")}>
            {lost ? (
              <>
                <SCardHead title={data?.lostCard?.title ?? 'Lost on 26 Oct'} right={data || lostChip === 'closed' ? <SChip tone="gray">Closed</SChip> : overdue} />
                <FollowRow icon="calendar" big={data?.lostCard?.big ?? 'Bought elsewhere'} small={data?.lostCard?.small ?? 'Took a policy through his bank'} />
              </>
            ) : converted ? (
              <>
                <SCardHead title={data?.convertedCard?.title ?? 'Converted on 26 Oct'} right={data ? <SChip tone="green" icon="check">Closed</SChip> : overdue} />
                <FollowRow icon="calendar" big={data?.convertedCard?.big ?? 'CU-000323'} small={data?.convertedCard?.small ?? 'Ramesh Gowda · policy holder'} />
              </>
            ) : (
              <>
                <SCardHead title="Next follow-up" right={done ? <SChip tone="green" icon="check">Done</SChip> : overdue} />
                <FollowRow icon="calendar" big={data ? data.follow?.big ?? 'Not set' : '24 Oct 2026'} small={data ? data.follow?.small ?? 'Set one with Change status or Log contact' : '11:00 AM · Call back'} strike={done} />
              </>
            )}
            {!converted && (
              <div className={cx('flex gap-2.5', lost && 'pointer-events-none opacity-30')}>
                <PillButton variant="navy" size="sm" icon="calendar" className="shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]" onClick={on?.reschedule}>Reschedule</PillButton>
                <PillButton variant="outline" size="sm" icon="check" disabled={data && !data.follow?.taskId} onClick={on?.followUpDone ?? (() => setDone((d) => !d))}>
                  {done ? 'Undo' : 'Mark done'}
                </PillButton>
              </div>
            )}
          </SCard>

          {extra}

          <SCard>
            <SCardHead title="Stage history" subtitle="Every move is saved" />
            {L.stages.map((s, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <span className="size-3.5 shrink-0 rounded-full" style={{ background: s.dot }} />
                <div className="flex flex-col items-start gap-1">
                  <SChip tone={s.tone}>{s.label}</SChip>
                  <p className="text-[12px] font-medium text-muted">{s.meta}</p>
                </div>
              </div>
            ))}
          </SCard>

          <SCard>
            <SCardHead title="Close this lead" subtitle="Lost needs a reason. You can reopen it later." />
            {!converted && (
              <PillButton
                variant="danger"
                size="sm"
                icon="x"
                {...act('lost', '/leads')}
                className={cx('self-start', lost && 'pointer-events-none opacity-30')}
              >
                Mark as lost
              </PillButton>
            )}
          </SCard>
        </div>
      </div>

      {toast && <Toast>{toast}</Toast>}
      {overlay}
    </AppLayout>
  )
}

function FollowRow({ icon, big, small, strike }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex size-14 items-center justify-center rounded-full bg-white text-ink">
        <Icon name={icon} size={24} />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className={cx('text-[22px] font-bold text-ink', strike && 'line-through opacity-60')}>{big}</p>
        <p className="text-[13px] font-medium text-[#8a5a12]">{small}</p>
      </div>
    </div>
  )
}

/** Navy toast pinned bottom-left of the workspace (Figma "Toast" @40,900 → viewport 196,924), viewport-fixed */
export function Toast({ children }) {
  return (
    <div data-overlay="toast" role="status" className="fixed bottom-[52px] left-[196px] z-20 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 py-3 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]">
      <span className="flex size-6 items-center justify-center rounded-full bg-[#16845b] text-white">
        <Icon name="check" size={13} />
      </span>
      <p className="text-[13px] font-semibold whitespace-nowrap text-white">{children}</p>
    </div>
  )
}