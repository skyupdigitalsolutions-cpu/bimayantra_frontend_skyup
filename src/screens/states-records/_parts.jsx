// Shared layouts for the records / tasks / messages state frames.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, StatusChip, Panel, PanelHead, RingAvatar } from '../catalogue/_parts'
import { commsStatusTabs, commsChannelTabs, occasions, holder, customerTabs, notSentMessages, scheduledMessages, sentMessages } from '../../data/states-records'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

const COMMS_BY_STATUS = { scheduled: scheduledMessages, sent: sentMessages, notsent: notSentMessages, greetings: [] }
const CHANNEL_KIND = { whatsapp: 'chat', email: 'mail', sms: 'sms' }

export const SH8 = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/* ═════════════════════════ Communications ═════════════════════════ */

const KIND = {
  chat: { icon: 'chat', bg: 'bg-[#d4f1e7]' },
  mail: { icon: 'mail', bg: 'bg-[#e9e3fc]' },
}
const NOTE = { red: 'text-[#b4323c]', amber: 'text-[#8a5a12]' }

/** One message row (r24, px22 py18, gap16). */
export function MessageRow({ m, to, cancelTo }) {
  const k = KIND[m.kind]
  const three = m.note || m.sub
  const body = (
    <>
      <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-[24px]', k.bg)}>
        <Icon name={k.icon} size={22} className="text-ink" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
        <p className="text-[14px] font-bold text-ink">{m.title}</p>
        <p className="text-[12px] font-medium text-muted">{m.when}</p>
        {m.note && (
          <p className={cx('flex items-center gap-1.5 text-[12px] font-semibold', NOTE[m.noteTone])}>
            <Icon name="alert" size={13} />
            {m.note}
          </p>
        )}
        {m.sub && <p className={cx('text-[12px] font-semibold', m.subClass)}>{m.sub}</p>}
      </div>
      <StatusChip tone={m.chipTone}>{m.chip}</StatusChip>
      {m.resend && <SmallButton variant="outline" icon="refresh">Resend</SmallButton>}
      {m.cancel && <SmallButton variant="danger" to={cancelTo} className="px-3.5">Cancel</SmallButton>}
    </>
  )
  const cls = cx('flex items-center gap-4 rounded-[24px] bg-white px-[22px]', three ? 'py-[18px]' : 'py-[18px] min-h-[84px]', SH8)
  return to ? <Link to={to} className={cx(cls, 'transition hover:bg-[#fbfcff]')}>{body}</Link> : <div className={cls}>{body}</div>
}

function GreetingsCard() {
  return (
    <div className={cx('flex flex-col gap-3.5 rounded-[28px] bg-rail p-6', SH8)}>
      <div className="flex items-center gap-2.5">
        <p className="flex-1 text-[17px] font-bold text-white">Occasion greetings</p>
        <span className="rounded-[12px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-navy">Premium</span>
      </div>
      <p className="text-[13px] leading-[20px] font-medium text-[#c9d6ea]">
        Birthdays and anniversaries go out automatically from your dedicated WhatsApp number, only to people with consent.
      </p>
      <div className="flex items-center gap-3 rounded-[20px] bg-white/10 p-4">
        <span className="flex size-11 items-center justify-center rounded-[22px] bg-white/10">
          <Icon name="wallet" size={20} className="text-[#f7b9c4]" />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[12px] font-medium text-[#c9d6ea]">Wallet balance</p>
          <p className="text-[20px] font-bold text-white">₹342.00</p>
        </div>
        <p className="text-[12px] font-semibold text-[#f7b9c4]">₹1 / message</p>
      </div>
      <SmallButton variant="pink" icon="sparkle" className="self-start">Set up greetings</SmallButton>
    </div>
  )
}

function OccasionsCard() {
  return (
    <Panel className={cx('flex flex-col gap-3', SH8)}>
      <PanelHead title="This week" subtitle="Eligible to receive a greeting" />
      {occasions.map((o) => (
        <div key={o.name} className="flex items-center gap-3">
          <RingAvatar initials={o.initials} bg={o.bg} size={38} text={12} />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">{o.name}</p>
            <p className="text-[12px] font-medium text-muted">{o.sub}</p>
          </div>
          <StatusChip tone={o.tone}>{o.chip}</StatusChip>
        </div>
      ))}
    </Panel>
  )
}

/**
 * Communications base. `status` = active status tab.
 * floatStatus: the CM state frames have the status tabs detached at the panel's top-left corner (as drawn in Figma).
 */
export function CommsLayout({ status, floatStatus = false, items, rowProps, children, overlay }) {
  const navigate = useNavigate()
  const [channel, setChannel] = useState('all')
  const [view, setView] = useState(status)
  const [q, clearQ] = useHeaderSearch()
  const tabs = commsStatusTabs.map((t) => ({ ...t, to: undefined, count: t.key === 'greetings' ? undefined : COMMS_BY_STATUS[t.key].length }))
  const pickStatus = (k) => {
    if (k === view) return
    const to = commsStatusTabs.find((t) => t.key === k).to
    if (to) navigate(to)
    setView(k)
  }
  const list = view === 'greetings' ? [] : (items ?? [])
  const shown = list.filter((m) => (channel === 'all' || m.kind === CHANNEL_KIND[channel]) && matchesQuery(q, m.title, m.when, m.chip, m.note, m.sub))
  const filteredOut = list.length > 0 && shown.length === 0
  const statusTabs = <SegTabs items={tabs} value={view} onChange={pickStatus} />
  const chLabel = commsChannelTabs.find((t) => t.key === channel).label
  return (
    <AppLayout active="communications">
      <Header
        breadcrumb="COMMUNICATIONS"
        title="Communications"
        subtitle="Every message sent or tried, with its status."
        actions={<HeadButton variant="white" icon="list">Templates</HeadButton>}
      />
      <div className="mt-[13px] flex items-center gap-3">
        {!floatStatus && statusTabs}
        <SegTabs items={commsChannelTabs} value={channel} onChange={setChannel} />
      </div>
      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-3">
          {items ? shown.map((m, i) => <MessageRow key={m.title + i} m={m} {...rowProps} />) : children}
          {items && view === 'greetings' && (
            <NoMatches className={cx('rounded-[24px] bg-white', SH8)} text="No greetings sent yet" sub="Birthday and anniversary greetings you send will show here." />
          )}
          {items && filteredOut && (
            <NoMatches
              className={cx('rounded-[24px] bg-white', SH8)}
              sub={q.trim() ? `No messages match “${q.trim()}”${channel !== 'all' ? ` on ${chLabel}` : ''}.` : `No ${chLabel} messages in this list.`}
              onClear={() => { setChannel('all'); clearQ() }}
            />
          )}
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <GreetingsCard />
          <OccasionsCard />
        </div>
      </div>
      {floatStatus && <div className="absolute top-0 left-0 z-10">{statusTabs}</div>}
      {overlay}
    </AppLayout>
  )
}

/* ═════════════════════════ Policy holder ═════════════════════════ */

function Mini({ label, value, big }) {
  return (
    <div className={cx('flex shrink-0 flex-col gap-0.5 bg-white/80', big ? 'rounded-[20px] px-5 py-3.5' : 'rounded-[18px] px-[18px] py-3')}>
      <p className="text-[12px] font-semibold whitespace-nowrap text-rose-ink">{label}</p>
      <p className={cx('font-bold whitespace-nowrap text-ink', big ? 'text-[20px]' : 'text-[18px]')}>{value}</p>
    </div>
  )
}

/** Pink profile hero. big=true → Overview (144 tall, chips); false → sub-tab compact (120 tall). */
export function ProfileHero({ big, minis }) {
  return (
    <section
      className={cx(
        'flex w-[1180px] items-center rounded-[32px] bg-pink-hero shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]',
        big ? 'h-[144px] gap-6 px-8' : 'h-[120px] gap-[22px] px-[30px]',
      )}
    >
      <span
        className={cx('flex shrink-0 items-center justify-center rounded-full border-4 border-white bg-white font-bold text-navy', big ? 'size-[92px] text-[29px]' : 'size-[76px] text-[24px]')}
      >
        {holder.initials}
      </span>
      <div className={cx('flex min-w-0 flex-1 flex-col', big ? 'gap-2' : 'gap-1.5')}>
        <p className={cx('font-bold tracking-[-0.2px] text-ink', big ? 'text-[24px]' : 'text-[22px]')}>{holder.name}</p>
        <p className="text-[13px] font-medium text-rose-ink">{holder.tagline}</p>
        {big && (
          <div className="flex gap-2">
            <StatusChip tone="green" icon="check">WhatsApp consent</StatusChip>
            <StatusChip tone="neutral" icon="link">Referred by Shanthi Rao</StatusChip>
          </div>
        )}
      </div>
      {minis.map(([k, v]) => <Mini key={k} label={k} value={v} big={big} />)}
    </section>
  )
}

export function CustomerTabs({ active, counts, className }) {
  const items = customerTabs.map((t) => ({ ...t, count: counts[t.key] }))
  return <SegTabs items={items} value={active} className={className} />
}

const BIG_MINIS = [['Policies', '1'], ['Open quotes', '1'], ['Renewal in', '38 days']]
const SMALL_MINIS = [['Policies', '2'], ['Open quotes', '2'], ['Renewal in', '38 days']]

/**
 * Policy holder page shell (heading, hero, tabs). Children are the tab body.
 * variant 'overview' (CU1/CU2) or a sub-tab key (family/documents/vehicles).
 */
export function HolderShell({ tab, crumb, statusChip, before, actions, counts, children, overlay }) {
  const overview = tab === 'overview'
  return (
    <AppLayout active="customers">
      <Header
        breadcrumb={`POLICY HOLDERS  /  KAVYA HEGDE${crumb ? `  /  ${crumb}` : ''}`}
        title={holder.name}
        titleExtra={statusChip}
        subtitle={holder.sub}
        before={before}
        actions={actions}
      />
      <div className="mt-[13px]">
        <ProfileHero big={overview} minis={overview ? BIG_MINIS : SMALL_MINIS} />
      </div>
      <CustomerTabs active={tab} counts={counts} className={overview ? 'mt-5' : 'mt-6'} />
      {children}
      {overlay}
    </AppLayout>
  )
}

export const HOLDER_ACTIONS = (
  <>
    <HeadButton variant="white" icon="target" to="/best-fit">Best fit</HeadButton>
    <HeadButton icon="quote" to="/x/q1-quotation-customer">New quotation</HeadButton>
  </>
)

/** Overview tab body (CU1 / CU2). */
export function HolderOverview() {
  return (
    <div className="mt-7 flex items-start gap-5">
      <div className="flex w-[760px] flex-col gap-5">
        <Panel className={cx('flex flex-col gap-4', SH8)}>
          <PanelHead title="Details" subtitle="Contact, address and dates" right={<SmallButton icon="edit" to="/x/pe1-edit-details">Edit</SmallButton>} />
          <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
            {holder.details.map(([k, v]) => <KVBox key={k} k={k} v={v} />)}
          </div>
          <KVBox k="Address" v={holder.address} className="w-auto" />
        </Panel>
        <Panel className={cx('flex flex-col gap-4', SH8)}>
          <PanelHead title="Household" subtitle="3 members · default nominee Arjun Hegde" />
          <div className="flex gap-3.5">
            {holder.household.map((m) => (
              <div key={m.name} className="flex w-[224px] items-center gap-3 rounded-[22px] bg-panel py-3 pr-4 pl-3">
                <RingAvatar initials={m.initials} bg={m.bg} size={44} text={14} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[14px] font-bold whitespace-nowrap text-ink">{m.name}</p>
                  <p className={cx('text-[12px] font-medium whitespace-nowrap', m.warn ? 'text-[#b4323c]' : 'text-muted')}>{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="flex w-[400px] flex-col gap-5">
        <Panel className={cx('flex flex-col gap-4', SH8)}>
          <PanelHead title="Identity numbers" subtitle="From confirmed documents" right={<StatusChip tone="green" icon="check">Consent given</StatusChip>} />
          {holder.ids.map((d) => (
            <div key={d.label} className="flex items-center gap-3 rounded-[18px] bg-panel py-3 pr-3 pl-4">
              <Icon name="lock" size={18} className="text-muted" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[12px] leading-[15px] font-medium text-muted">{d.label}</p>
                <p className="text-[16px] leading-[20px] font-bold tracking-[0.6px] text-ink">{d.value}</p>
              </div>
              <SmallButton variant="outline" icon="eye" to="/x/pe2-pan-shown-30-seconds">Show</SmallButton>
            </div>
          ))}
          <p className="text-[12px] leading-[18px] font-medium text-muted">Showing a full number is recorded. It hides again after 30 seconds.</p>
        </Panel>
        <Panel className={cx('flex flex-col gap-4', SH8)}>
          <PanelHead title="Open items" />
          {holder.openItems.map((it) => {
            const inner = (
              <>
                <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-[20px]', it.bg)}>
                  <Icon name={it.icon} size={18} className="text-ink" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[13px] leading-[16px] font-bold text-ink">{it.title}</p>
                  <p className="text-[12px] leading-[15px] font-medium text-muted">{it.sub}</p>
                </div>
                <StatusChip tone={it.tone}>{it.chip}</StatusChip>
              </>
            )
            return it.to
              ? <Link key={it.title} to={it.to} className="flex items-center gap-3">{inner}</Link>
              : <div key={it.title} className="flex items-center gap-3">{inner}</div>
          })}
        </Panel>
      </div>
    </div>
  )
}

export function KVBox({ k, v, className = '' }) {
  return (
    <div className={cx('flex w-[220px] flex-col gap-1 whitespace-nowrap', className)}>
      <p className="text-[12px] font-medium text-muted">{k}</p>
      <p className="text-[14px] font-semibold text-ink">{v}</p>
    </div>
  )
}
