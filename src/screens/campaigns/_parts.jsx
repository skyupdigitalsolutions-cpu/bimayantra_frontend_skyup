// Shared building blocks for the Campaigns module (Figma CA*, CN*, CL1, CC*).
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import BaseIcon from '../../components/Icon'
import { cx } from '../../components/ui'
import {
  connections, overviewKpis, channelTabs, statusTabs, campaignRows, statusMatch, sourcePages,
} from '../../data/campaigns'
import { FixedScrim, FixedDialog } from '../catalogue/_overlay'

/* ───────────────────────── Primitives ───────────────────────── */

/** Figma icons keep a 1.6px stroke at any size, so scale the viewBox stroke accordingly. */
export function Icon({ size = 24, ...rest }) {
  return <BaseIcon size={size} strokeWidth={(1.6 * 24) / size} {...rest} />
}

export const TONES = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  gray: 'bg-[#eef1f5] text-[#44526a]',
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  pink: 'bg-[#fde8ec] text-[#b4325a]',
}

/** Status pill: h25, r14, 12/semibold. */
export function Pill({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] px-3 text-[12px] font-semibold whitespace-nowrap', icon && 'pl-2', TONES[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

const BTN_V = {
  outline: 'border border-[#e8ecf3] bg-white text-ink hover:bg-tile',
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700',
  pink: 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]',
  fb: 'bg-[#1f5fd6] text-white hover:brightness-110',
}
const BTN_S = {
  lg: 'h-[46px] rounded-[24px] gap-2 pr-5 pl-4 text-[14px]',
  sm: 'h-9 rounded-[18px] gap-2 pr-3.5 pl-3 text-[13px]',
}

/** Button matching the Figma "Button/…" instances. variant outline|navy|pink, size lg (46) | sm (36). */
export function Btn({ variant = 'outline', size = 'lg', icon, to, onClick, className = '', children }) {
  const cls = cx(
    'inline-flex shrink-0 items-center font-semibold whitespace-nowrap transition',
    BTN_S[size], BTN_V[variant], variant === 'outline' && (size === 'lg' ? 'pr-[19px] pl-4' : 'pr-[13px] pl-3'), className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === 'lg' ? 18 : 16} />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

export function Bell() {
  return (
    <button type="button" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
      <Icon name="bell" size={18.5} />
    </button>
  )
}

/** Page heading (crumb / title + chip / subtitle) on the left, bell + actions on the right. */
export function PageHead({ crumb, title, chip, sub, actions, aside }) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre text-muted">{crumb}</p>
        <div className="flex h-[38px] items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-[-0.6px] whitespace-nowrap text-ink">{title}</h1>
          {chip}
        </div>
        <p className="text-[14px] font-medium whitespace-nowrap text-muted">{sub}</p>
      </div>
      <div className="mt-1 flex shrink-0 flex-col items-end gap-3.5">
        <div className="flex items-center gap-3">
          <Bell />
          {actions}
        </div>
        {aside}
      </div>
    </header>
  )
}

/** White pill tab group (r26, pad5, tabs h34). items: [{key,label,count}] */
export function PillTabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('flex shrink-0 gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}>
      {items.map((t) => {
        const on = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            className={cx('flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap', on ? 'bg-navy text-white' : 'text-slate hover:text-ink')}
          >
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Avatar({ initials, bg, size = 36, text = 12 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-navy"
      style={{ width: size, height: size, background: bg, fontSize: text }}
    >
      {initials}
    </span>
  )
}

export function CardHead({ title, sub, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] leading-[21px] font-bold text-ink">{title}</p>
        {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export const cardCls = 'rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

const CHANNEL = {
  meta: { label: 'Meta Ads', icon: 'chart', cls: 'bg-[#e8f0fd] text-[#1f5fd6]' },
  website: { label: 'Website', icon: 'grid', cls: 'bg-[#f0ecfb] text-[#5b3fb8]' },
  google: { label: 'Google Ads', icon: 'search', cls: 'bg-[#fde8ec] text-[#b4325a]' },
}

export function ChannelBadge({ channel, className = '' }) {
  const c = CHANNEL[channel]
  return (
    <span className={cx('inline-flex h-[22px] items-center gap-[5px] rounded-[12px] pr-2.5 pl-2 text-[11px] font-bold', c.cls, className)}>
      <Icon name={c.icon} size={12} />
      {c.label}
    </span>
  )
}

/** Small "No matches" row with a clear-filters link, styled like the surrounding list. */
export function EmptyRow({ text = 'No matches', onClear, className = '' }) {
  return (
    <div className={cx('flex h-[64px] items-center gap-3 px-6 text-[13px] font-medium text-muted', className)}>
      <Icon name="search" size={15} />
      <span>{text}</span>
      {onClear && (
        <button type="button" onClick={onClear} className="font-bold text-[#1f5fd6] hover:underline">Clear filters</button>
      )}
    </div>
  )
}

/** Case-insensitive "every word appears in one of the fields" match. */
export function matchesQuery(q, ...fields) {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = fields.filter(Boolean).join(' ').toLowerCase()
  return words.every((w) => hay.includes(w))
}

/** Small "How to connect" link shown in the connect wizards. */
export function GuideLink({ tab, className = '' }) {
  return (
    <Link to={`/campaigns/guide${tab ? `?tab=${tab}` : ''}`} className={cx('inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1f5fd6] hover:underline', className)}>
      <Icon name="quote" size={13} />
      How to connect
    </Link>
  )
}

/* ───────────────────────── Overview (CA1 and every wizard backdrop) ───────────────────────── */

function ConnectionCard({ conn, chip, action, warn }) {
  return (
    <div className={cx('flex h-[76px] min-w-0 flex-1 items-center gap-3 rounded-[22px] border px-4 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', warn ? 'border-[#f1d9a8] bg-[#fff9ef]' : 'border-[#e8ecf3] bg-white')}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: conn.bg }}>
        <Icon name={conn.icon} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[14px] font-bold text-ink">{conn.name}</p>
        <div>{chip}</div>
      </div>
      {action}
    </div>
  )
}

/**
 * Campaigns overview. `variant`: 'ca1' (default links) | 'ca1b' (Meta reconnect state) | 'backdrop' (behind a wizard).
 * `overlay` is rendered over the workspace (scrim + modal) — see <WizardOverlay/>.
 */
export function Overview({ variant = 'ca1', overlay, backdropLinks = false }) {
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('active')
  const reconnect = variant === 'ca1b'
  const live = variant === 'ca1'
  const SOURCE_TO = { meta: '/x/cc1-meta-ads-campaign-leads-and-answers', google: '/x/cc2-google-ads-campaign-leads-and-answers', website: '/x/cc3-website-form-leads-and-answers' }
  const rowTo = (r) => (live ? SOURCE_TO[r.channel] : '/x/ca2-campaign-detail')
  const headLinks = live || backdropLinks
  // Status tab narrows first; channel tab counts are derived from what the status tab leaves.
  const byStatus = campaignRows.filter(statusMatch[status])
  const tabs = channelTabs.map((t) => ({ ...t, count: t.key === 'all' ? byStatus.length : byStatus.filter((r) => r.channel === t.key).length }))
  const rows = byStatus.filter((r) => channel === 'all' || r.channel === channel)
  const clear = () => { setChannel('all'); setStatus('active') }

  return (
    <AppLayout active="campaigns">
      <PageHead
        crumb="CAMPAIGNS"
        title="Campaigns"
        sub="Leads from your ads and website arrive here and go straight into Leads."
        aside={
          <Link to="/campaigns/guide" className="mr-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1f5fd6] hover:underline">
            <Icon name="quote" size={14} />
            Connection guide: what you need and how to connect
          </Link>
        }
        actions={
          <>
            <Btn icon="chart" to={headLinks || reconnect ? '/x/cn1-connect-meta-ads-sign-in' : undefined}>Connect Meta Ads</Btn>
            <Btn icon="search" to={headLinks || reconnect ? '/x/cn6-connect-google-ads-sign-in-and-account' : undefined}>Connect Google Ads</Btn>
            <Btn variant="pink" icon="grid" to={live ? '/x/cn8-connect-website-choose-method' : undefined}>Connect website</Btn>
          </>
        }
      />

      <div className="mt-[9px] flex gap-4">
        <ConnectionCard
          conn={connections.meta}
          warn={reconnect}
          chip={reconnect ? <Pill tone="amber" icon="alert">Reconnect needed</Pill> : <Pill tone="green" icon="check">Connected · 2 lead forms</Pill>}
          action={
            reconnect
              ? <Btn variant="navy" size="sm" icon="refresh" to="/x/cn1-connect-meta-ads-sign-in">Reconnect</Btn>
              : <Btn size="sm" icon="settings" to={live ? '/x/cc1-meta-ads-campaign-leads-and-answers' : backdropLinks ? '/x/cn2-connect-meta-ads-account-and-forms' : undefined}>Manage</Btn>
          }
        />
        <ConnectionCard
          conn={connections.google}
          chip={<Pill tone="gray">Not connected</Pill>}
          action={<Btn variant="navy" size="sm" icon="link" to={headLinks || reconnect ? '/x/cn6-connect-google-ads-sign-in-and-account' : undefined}>Connect Google Ads</Btn>}
        />
        <ConnectionCard
          conn={connections.website}
          chip={<Pill tone="green" icon="check">Connected · 1 form</Pill>}
          action={<Btn size="sm" icon="settings" to={live ? '/x/cc3-website-form-leads-and-answers' : undefined}>Manage</Btn>}
        />
      </div>

      <div className="mt-5 flex gap-4">
        {overviewKpis.map((k) => (
          <div key={k.label} className="flex h-[138px] flex-1 flex-col gap-1.5 rounded-[24px] p-5" style={{ background: k.bg }}>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/70 text-ink">
                <Icon name={k.icon} size={17} />
              </span>
              <p className="text-[13px] font-semibold text-ink-2">{k.label}</p>
            </div>
            <p className="h-[35px] text-[28px] font-bold tracking-[-0.6px] text-ink">{k.value}</p>
            <p className="text-[12px] font-medium text-slate">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <PillTabs items={tabs} value={channel} onChange={setChannel} />
        <PillTabs items={statusTabs} value={status} onChange={setStatus} />
      </div>

      <div className={cx('mt-5 overflow-hidden', cardCls)}>
        <div className="flex h-[43px] gap-2 bg-[#fafbfd] px-6 pt-3.5 text-[12px] font-semibold text-muted">
          <span className="w-[290px]">Campaign</span>
          <span className="w-[130px]">Channel</span>
          <span className="w-[110px]">Status</span>
          <span className="w-[80px]">Leads</span>
          <span className="w-[90px]">New today</span>
          <span className="w-[90px]">Converted</span>
          <span className="w-[100px]">Spend</span>
          <span className="w-[100px]">Cost / lead</span>
          <span className="w-[100px]">Last lead</span>
        </div>
        {rows.map((r) => (
          <Link key={r.name} to={rowTo(r)} className="flex h-[64px] items-center gap-2 border-t border-[#e8ecf3] px-6 text-[13px] font-semibold text-ink hover:bg-panel-2">
            <div className="flex w-[290px] flex-col gap-0.5">
              <p className="text-[14px] font-bold">{r.name}</p>
              <p className="text-[12px] font-medium text-muted">{r.sub}</p>
            </div>
            <div className="w-[130px]"><ChannelBadge channel={r.channel} /></div>
            <div className="w-[110px]"><Pill tone={r.status === 'Active' ? 'green' : 'amber'}>{r.status}</Pill></div>
            <span className="w-[80px] font-bold">{r.leads}</span>
            <span className={cx('w-[90px]', r.todayHot && 'text-[#127650]')}>{r.today}</span>
            <span className="w-[90px]">{r.converted}</span>
            <span className="w-[100px]">{r.spend}</span>
            <span className="w-[100px]">{r.cpl}</span>
            <span className="w-[100px]">{r.last}</span>
          </Link>
        ))}
        {rows.length === 0 && (
          <EmptyRow
            className="border-t border-[#e8ecf3]"
            text={`No ${statusTabs.find((t) => t.key === status).label.toLowerCase()} ${channel === 'all' ? '' : `${channelTabs.find((t) => t.key === channel).label} `}campaigns`}
            onClear={clear}
          />
        )}
      </div>
      <p className="mt-3.5 text-[12px] font-medium text-muted">Spend and cost per lead come from Meta and Google. Lead counts come from Bimayantra.</p>

      {reconnect && (
        <div data-overlay="toast" className="fixed bottom-[52px] left-[196px] z-30 flex h-12 w-[753px] items-center gap-2.5 rounded-[18px] bg-navy px-4 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#16845b] text-white">
            <Icon name="check" size={13} />
          </span>
          <p className="text-[13px] font-semibold whitespace-nowrap text-white">Meta stopped sending leads 2 hours ago: permission expired. Reconnect to resume; missed leads are fetched.</p>
        </div>
      )}

      {overlay}
    </AppLayout>
  )
}

/* ───────────────────────── Wizard modal ───────────────────────── */

/** Scrim over the workspace panel + a dialog positioned like the Figma frame. */
export function WizardOverlay({ children, left = 250, top = 60, width = 760, className = '' }) {
  const navigate = useNavigate()
  return (
    <>
      <FixedScrim onClick={() => navigate('/campaigns')} />
      <FixedDialog
        top={top}
        left={left}
        width={width}
        className={cx('flex flex-col gap-[18px] rounded-[32px] bg-white p-7 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', className)}
      >
        {children}
      </FixedDialog>
    </>
  )
}

export function ModalHead({ conn, title, sub, guide }) {
  return (
    <div className="flex h-12 items-center gap-3.5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full text-white" style={{ background: conn.bg }}>
        <Icon name={conn.icon} size={22} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        <p className="text-[12px] font-medium text-muted">{sub}</p>
      </div>
      {guide && <GuideLink tab={guide} className="mr-1" />}
      <Link to="/campaigns" aria-label="Close" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink hover:bg-chip">
        <Icon name="x" size={16} />
      </Link>
    </div>
  )
}

/** Inline wizard step indicator. current: 0-based; current === steps.length → all done. */
export function Steps({ steps, current }) {
  return (
    <div className="flex h-[26px] items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current
        const on = i === current
        return (
          <div key={s} className="contents">
            {i > 0 && <span className={cx('h-0.5 w-[30px]', i <= current ? 'bg-navy' : 'bg-[#e8ecf3]')} />}
            <span
              className={cx(
                'flex size-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                done && 'bg-navy text-white',
                on && 'border-2 border-[#1f5fd6] bg-white text-[#1f5fd6]',
                !done && !on && 'bg-panel text-muted',
              )}
            >
              {done ? <Icon name="check" size={12} /> : i + 1}
            </span>
            <span className={cx('text-[12px] whitespace-nowrap', on ? 'font-bold text-ink' : done ? 'font-semibold text-ink' : 'font-semibold text-muted')}>{s}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Labelled select on #f4f6fb (h50, r16). */
export function SelectField({ label, value, options, onChange, locked = false, className = '' }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <div className="relative flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4">
        {locked ? (
          <span className="flex-1 truncate text-[14px] font-semibold text-ink">{value}</span>
        ) : (
          <>
            <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="min-w-0 flex-1 cursor-pointer appearance-none truncate bg-transparent text-[14px] font-semibold text-ink outline-none"
            >
              {(options ?? [value]).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <Icon name="chev-down" size={18} className="pointer-events-none text-muted" />
          </>
        )}
      </div>
    </label>
  )
}

export function Box({ checked }) {
  return (
    <span className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white')}>
      {checked && <Icon name="check" size={15} />}
    </span>
  )
}

/** Checkbox option row (selected: #f3f7ff + blue border). */
export function CheckRow({ title, sub, chip, tone, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cx('flex w-full items-center gap-3 rounded-[14px] p-3 text-left', checked ? 'border border-[#1f5fd6] bg-[#f3f7ff]' : 'bg-panel')}
    >
      <Box checked={checked} />
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <p className="text-[13px] leading-4 font-bold text-ink">{title}</p>
        {sub && <p className="text-[11px] leading-[14px] font-medium text-muted">{sub}</p>}
      </div>
      {chip && <Pill tone={tone}>{chip}</Pill>}
    </button>
  )
}

export function useToggles(initial) {
  const [on, setOn] = useState(initial)
  return [on, (i) => setOn((s) => s.map((v, j) => (j === i ? !v : v)))]
}

/** FORM FIELD → LEAD FIELD mapping table. rows: [formField, leadField, warn] */
export function MappingTable({ rows, options }) {
  const [vals, setVals] = useState(rows.map((r) => r[1]))
  return (
    <div className="flex flex-col gap-1 rounded-[18px] bg-panel p-2">
      <div className="flex h-[25px] items-start gap-3 px-2.5 pt-1.5 text-[10px] font-bold tracking-[0.6px] text-muted">
        <span className="w-[260px]">FORM FIELD</span>
        <span className="w-10" />
        <span>LEAD FIELD IN BIMAYANTRA</span>
      </div>
      {rows.map(([field, , warn], i) => (
        <div key={field} className={cx('flex items-center gap-3 rounded-[12px] bg-white px-3 py-2.5', warn && 'border border-[#f1d9a8]')}>
          <span className="w-[248px] shrink-0 text-[13px] font-semibold whitespace-nowrap text-ink">{field}</span>
          <span className="flex w-10 shrink-0"><Icon name="arrow" size={15} className="text-muted" /></span>
          <div className={cx('relative flex h-8 flex-1 items-center gap-2 rounded-[10px] px-3', warn ? 'bg-[#fff9ef]' : 'bg-panel')}>
            <select
              value={vals[i]}
              onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              className={cx('min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[13px] font-bold outline-none', warn ? 'text-[#8a5a12]' : 'text-ink')}
            >
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <Icon name="chev-down" size={14} className="pointer-events-none text-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NoteBar({ tone = 'amber', icon, children }) {
  const t = { amber: 'bg-[#fbf1e1] text-[#8a5a12]', blue: 'bg-[#e8f0fd] text-[#1f5fd6]' }[tone]
  return (
    <div className={cx('flex h-10 items-center gap-2.5 rounded-[16px] px-4 text-[13px] font-semibold', t)}>
      <Icon name={icon} size={16} />
      <p>{children}</p>
    </div>
  )
}

/** Back/Cancel ⟷ primary next. */
export function WizardFooter({ backLabel = 'Back', backTo, nextLabel, nextTo, nextIcon = 'arrow' }) {
  return (
    <div className="flex h-[46px] items-center justify-between">
      <Btn to={backTo} className="px-5">{backLabel}</Btn>
      <Btn variant="navy" icon={nextIcon} to={nextTo}>{nextLabel}</Btn>
    </div>
  )
}

/* ───────────────────────── Per-source campaign leads (CC1–CC3) ───────────────────────── */

const DATE_TABS = [{ key: 'today', label: 'Today' }, { key: '7d', label: '7 days' }, { key: '30d', label: '30 days' }]
const DATE_MAX = { today: 0, '7d': 6, '30d': 29 }

/** Detail panel content for a lead: the Figma-authored one, or one built from the row. */
function leadDetail(p, l, campaign) {
  if (l.name === p.detail.name) return p.detail
  const [nameLabel, phoneLabel, formLabel] = p.answerLabels
  const [srcKey, ...rest] = l.src.split(': ')
  return {
    initials: l.initials, bg: l.bg, name: l.name, chip: l.chip, tone: l.tone,
    sub: `Submitted ${/^\d/.test(l.when) ? 'on ' : ''}${l.when.replace(/^Today, /, 'today at ')} · ${campaign}`,
    facts: [['Campaign', campaign], [srcKey, rest.join(': ')], ['Received', l.when], ['Status', l.chip]],
    answers: [[nameLabel, l.name], [phoneLabel, `+91 ${l.phone}`], [formLabel, campaign]],
    consent: p.defaultConsent,
    openTo: '/leads/1',
  }
}

export function SourceLeads({ source }) {
  const p = sourcePages[source]
  const [tab, setTab] = useState(0)
  const [range, setRange] = useState('7d')
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selName, setSelName] = useState(p.detail.name)
  const searchRef = useRef(null)
  useEffect(() => { if (searchOpen) searchRef.current?.focus() }, [searchOpen])

  const campaign = p.tabs[tab][0]
  const summary = tab === 0 ? p.summary : { ...p.summary, ...p.summaries[tab] }
  // Tab badges = all leads of that campaign (derived from data).
  const tabs = p.tabs.map(([label], i) => ({ key: i, label, count: p.leads.filter((l) => l.c === i).length }))
  const rows = useMemo(
    () => p.leads
      .filter((l) => l.c === tab && l.days <= DATE_MAX[range])
      .filter((l) => matchesQuery(q, l.name, l.phone, l.when, l.src, l.chip)),
    [p, tab, range, q],
  )
  const sel = rows.find((l) => l.name === selName) ?? rows[0]
  const d = sel && leadDetail(p, sel, campaign)
  const filtered = range !== '7d' || q || tab !== 0
  const clear = () => { setTab(0); setRange('7d'); setQ(''); setSearchOpen(false) }
  const ok = d?.consent.ok

  return (
    <AppLayout active="campaigns">
      <PageHead
        crumb={p.crumb}
        title={p.title}
        chip={<Pill tone="green" icon="check">Connected</Pill>}
        sub={p.sub}
        actions={
          <>
            <Btn icon="settings" to={p.mappingTo}>Field mapping</Btn>
            <Btn icon="refresh">Sync now</Btn>
            <Btn icon="link">{p.openLabel}</Btn>
          </>
        }
      />

      <div className="mt-[13px] flex items-center gap-3">
        <span className="text-[13px] font-semibold text-muted">{p.filterLabel}</span>
        <PillTabs items={tabs} value={tab} onChange={setTab} />
        <span className="flex-1" />
        <PillTabs items={DATE_TABS} value={range} onChange={setRange} />
      </div>

      <div className="mt-3 flex h-[78px] items-center gap-3.5 rounded-[20px] px-[18px]" style={{ background: summary.bg }}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white" style={{ color: summary.iconColor }}>
          <Icon name={summary.icon} size={18} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[15px] font-bold text-ink">{summary.title}</p>
          <p className="text-[12px] font-medium text-ink-2">{summary.sub}</p>
        </div>
        {summary.stats.map(([k, v]) => (
          <div key={k} className="flex h-[50px] flex-col gap-px rounded-[14px] bg-white/80 px-3.5 py-2">
            <p className="text-[11px] font-semibold whitespace-nowrap text-muted">{k}</p>
            <p className="text-[15px] font-bold text-ink">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-5">
        <div className={cx('flex w-[470px] shrink-0 flex-col gap-1.5 p-4', cardCls)}>
          <div className="flex h-[43px] items-start px-1 pb-1.5">
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[16px] leading-5 font-bold text-ink">Leads</p>
              <p className="text-[12px] font-medium text-muted">{rows.length} shown · newest first</p>
            </div>
            <button
              type="button"
              aria-label="Search leads"
              onClick={() => { if (searchOpen) setQ(''); setSearchOpen((o) => !o) }}
              className={cx('mt-[2.5px] flex size-8 items-center justify-center rounded-full shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', searchOpen ? 'bg-navy text-white' : 'bg-white text-ink hover:bg-tile')}
            >
              <Icon name={searchOpen ? 'x' : 'search'} size={13.4} />
            </button>
          </div>
          {searchOpen && (
            <label className="mx-1 mb-1 flex h-10 items-center gap-2 rounded-[14px] bg-panel px-3">
              <Icon name="search" size={14} className="text-muted" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') { setQ(''); setSearchOpen(false) } }}
                placeholder="Search name, mobile, ad or status"
                className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted"
              />
            </label>
          )}
          {rows.map((l) => {
            const on = sel && l.name === sel.name
            return (
              <button
                key={l.name}
                type="button"
                onClick={() => setSelName(l.name)}
                className={cx('flex items-center gap-3 rounded-[16px] p-3 text-left', on ? 'border-[1.5px] border-[#1f5fd6] bg-[#f3f7ff]' : 'bg-white hover:bg-panel-2')}
              >
                <Avatar initials={l.initials} bg={l.bg} size={38} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[14px] leading-[18px] font-bold text-ink">{l.name}</p>
                  <p className="text-[11px] leading-[14px] font-medium text-muted">{l.meta}</p>
                  <p className="text-[11px] leading-[14px] font-semibold" style={{ color: p.sourceColor }}>{l.src}</p>
                </div>
                <Pill tone={l.tone}>{l.chip}</Pill>
              </button>
            )
          })}
          {rows.length === 0 && (
            <EmptyRow
              className="h-14 rounded-[16px] bg-panel px-4"
              text={q ? `No leads match “${q}”` : `No leads ${range === 'today' ? 'today' : `in the last ${range === '7d' ? '7' : '30'} days`}`}
              onClear={filtered ? clear : undefined}
            />
          )}
        </div>

        {d ? (
          <div className={cx('flex min-w-0 flex-1 flex-col gap-3.5 p-6', cardCls)}>
            <div className="flex h-12 items-center gap-3">
              <Avatar initials={d.initials} bg={d.bg} size={48} text={15} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[18px] leading-[23px] font-bold tracking-[-0.2px] text-ink">{d.name}</p>
                <p className="text-[12px] font-medium text-muted">{d.sub}</p>
              </div>
              <Pill tone={d.tone}>{d.chip}</Pill>
            </div>
            <div className="flex flex-wrap gap-2">
              {d.facts.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-px rounded-[12px] bg-panel px-3 py-2">
                  <p className="text-[10px] leading-[13px] font-semibold text-muted">{k}</p>
                  <p className="text-[12px] leading-[15px] font-bold whitespace-nowrap text-ink">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] leading-[13px] font-bold tracking-[0.6px] text-muted">FORM ANSWERS · EXACTLY AS SUBMITTED</p>
            <div className="flex flex-col gap-1.5">
              {d.answers.map(([k, v], i) => (
                <div key={k} className={cx('flex gap-4 rounded-[12px] px-3.5 py-2.5 text-[13px] leading-[18px]', i % 2 === 0 ? 'bg-[#fafbfd]' : 'bg-white')}>
                  <span className="w-[270px] shrink-0 font-medium text-muted">{k}</span>
                  <span className="flex-1 font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <div className={cx('flex items-center gap-2.5 rounded-[14px] border px-3.5 py-3 text-[13px] font-semibold', ok ? 'border-[#c7ebda] bg-[#f5fbf8] text-[#127650]' : 'border-[#f1d9a8] bg-[#fff9ef] text-[#8a5a12]')}>
              <Icon name="lock" size={15} className="shrink-0" />
              <p className="w-[587px]">{d.consent.text}</p>
            </div>
            <div className="flex gap-2.5">
              <Btn variant="navy" size="sm" icon="arrow" to={d.openTo}>Open lead</Btn>
              <Btn size="sm" icon="phone">Log contact</Btn>
              <Btn size="sm" icon="phone">Call</Btn>
              <Btn size="sm" icon="chat">WhatsApp</Btn>
            </div>
          </div>
        ) : (
          <div className={cx('flex min-w-0 flex-1 flex-col items-center justify-center gap-2 p-10 text-center', cardCls)}>
            <span className="flex size-11 items-center justify-center rounded-full bg-panel text-muted"><Icon name="users" size={18} /></span>
            <p className="text-[15px] font-bold text-ink">No lead selected</p>
            <p className="text-[12px] font-medium text-muted">Change the {p.filterLabel.toLowerCase()} or date range to see leads.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
