// Shared policy-holder profile shell + overlay primitives.
// Used by flow-consent (CS1–CS7) and flow-tab-actions (PE/PF/PD/PV/PP/PA frames).
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { holder, heroStats, tabCounts, consentRows, consentHistory } from '../../data/flow-consent'
import { FixedScrim, FixedDialog } from '../catalogue/_overlay'
import { useHeaderSearch } from '../customer-tabs/_search'

/* ───────────── Header ───────────── */

export function HeaderActions() {
  useHeaderSearch() // Ctrl/Cmd+K focuses the header search pill
  return (
    <div className="mt-1 flex shrink-0 items-center gap-3">
      <label className="flex h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
        <Icon name="search" size={18} className="text-muted" />
        <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
        <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
      </label>
      <button type="button" className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
        <Icon name="bell" size={18.5} />
      </button>
      <Link to="/best-fit" className="flex h-[46px] items-center gap-2 rounded-[24px] border border-line bg-white pr-5 pl-4 text-[14px] font-semibold text-ink">
        <Icon name="target" size={18} />Best fit
      </Link>
      <Link to="/x/q1-quotation-customer" className="flex h-[46px] items-center gap-2 rounded-[24px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] pr-5 pl-4 text-[14px] font-semibold text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]">
        <Icon name="quote" size={18} />New quotation
      </Link>
    </div>
  )
}

export function ActiveChip({ children = 'Active' }) {
  return (
    <span className="inline-flex h-[25px] items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] pr-3 pl-2 text-[12px] font-semibold text-[#127650]">
      <Icon name="check" size={13} />{children}
    </span>
  )
}

export function PageHeading({ crumb, title = holder.name, chip = <ActiveChip />, meta = holder.meta, actions = <HeaderActions /> }) {
  return (
    <header className="flex items-start justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre text-muted">{crumb}</p>
        <div className="flex items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-[-0.6px] text-ink">{title}</h1>
          {chip}
        </div>
        <p className="text-[14px] font-medium text-muted">{meta}</p>
      </div>
      {actions}
    </header>
  )
}

/* ───────────── Profile hero (compact, 120px) ───────────── */

export function ProfileHero({ stats = heroStats, className = '' }) {
  return (
    <section className={cx('flex h-[120px] items-center gap-[22px] rounded-[32px] bg-pink-hero px-[30px] shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]', className)}>
      <span className="flex size-[76px] items-center justify-center rounded-full border-4 border-white bg-white text-[24px] font-bold text-navy">{holder.initials}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">{holder.name}</p>
        <p className="text-[13px] font-medium text-rose-ink">{holder.about}</p>
      </div>
      {stats.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
          <p className="text-[12px] font-semibold text-rose-ink">{k}</p>
          <p className="text-[18px] font-bold text-ink">{v}</p>
        </div>
      ))}
    </section>
  )
}

/* ───────────── Customer tabs ───────────── */

export const CUSTOMER_TABS = [
  { key: 'overview', label: 'Overview', to: '/customers/1' },
  { key: 'family', label: 'Family', to: '/x/05a-customer-family' },
  { key: 'consent', label: 'Consent', to: '/x/05b-customer-consent' },
  { key: 'documents', label: 'Documents', to: '/x/05c-customer-documents' },
  { key: 'vehicles', label: 'Vehicles', to: '/x/05d-customer-vehicles' },
  { key: 'quotations', label: 'Quotations', to: '/x/05e-customer-quotations' },
  { key: 'policies', label: 'Policies', to: '/x/05f-customer-policies' },
  { key: 'payments', label: 'Payments', to: '/x/05g-customer-payments' },
  { key: 'renewals', label: 'Renewals', to: '/x/05h-customer-renewals' },
  { key: 'activities', label: 'Activities', to: '/x/05i-customer-activities' },
]

/** Pill tab bar. items: [{key,label,to?,count?}] — active tab is not a link. */
export function PillTabs({ items, active, onSelect, className = '' }) {
  return (
    <nav className={cx('flex w-fit items-start gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}>
      {items.map((t) => {
        const on = t.key === active
        const cls = cx('flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold', on ? 'bg-navy text-white' : 'text-slate hover:text-ink')
        const inner = (
          <>
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </>
        )
        if (t.to && !on) return <Link key={t.key} to={t.to} className={cls}>{inner}</Link>
        return <button key={t.key} type="button" onClick={() => onSelect?.(t.key)} className={cls}>{inner}</button>
      })}
    </nav>
  )
}

export function CustomerTabs({ active, counts = {}, className = '' }) {
  const c = { ...tabCounts, ...counts }
  return <PillTabs items={CUSTOMER_TABS.map((t) => ({ ...t, count: c[t.key] }))} active={active} className={className} />
}

/* ───────────── Shell ───────────── */

/**
 * Policy-holder profile page: heading, hero, customer tabs, body.
 * `overlay` renders inside the workspace panel (scrim / drawer / dialog / toast).
 */
export function ProfileShell({ crumb, tab, counts, hero, heading, children, overlay, panelClass = '', tabsClass = 'mt-6', bodyClass = 'mt-6' }) {
  return (
    <AppLayout active="customers" panelClass={panelClass}>
      {heading ?? <PageHeading crumb={crumb} />}
      {hero ?? <ProfileHero className="mt-[13px]" />}
      <CustomerTabs active={tab} counts={counts} className={tabsClass} />
      <div className={bodyClass}>{children}</div>
      {overlay}
    </AppLayout>
  )
}

/* ───────────── Overlays ───────────── */

export function Scrim() {
  return <FixedScrim />
}

/** Right drawer 500×928 at top/right 24 of the workspace. Footer pushed to the bottom. */
export function Drawer({ children, footer, className = '' }) {
  return (
    <>
      <Scrim />
      <aside data-overlay="drawer" className={cx('fixed top-12 right-12 bottom-12 z-50 flex w-[500px] flex-col overflow-y-auto overscroll-contain gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', className)}>
        {children}
        {footer && <div className="sticky bottom-0 mt-auto flex gap-2.5 bg-white">{footer}</div>}
      </aside>
    </>
  )
}

export function DrawerHead({ title, sub, close = '/x/05b-customer-consent' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
      </div>
      <Link to={close} aria-label="Close" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink">
        <Icon name="x" size={16} />
      </Link>
    </div>
  )
}

/** Centered dialog positioned like the Figma frame (left/top inside the workspace). */
export function Dialog({ left = 360, top, width = 540, children, className = '' }) {
  return (
    <>
      <Scrim />
      <FixedDialog
        top={top}
        left={left}
        width={width}
        className={cx('flex flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', className)}
      >
        {children}
      </FixedDialog>
    </>
  )
}

export function DialogIcon({ icon = 'alert', bg = '#fbebec', color = '#b4323c' }) {
  return (
    <span className="flex size-[60px] items-center justify-center rounded-full" style={{ background: bg, color }}>
      <Icon name={icon} size={26} />
    </span>
  )
}

export function Toast({ children, action, actionTo, to, className = '' }) {
  const inner = (
    <>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#16845b] text-white"><Icon name="check" size={13} /></span>
      <span className="text-[13px] font-semibold whitespace-nowrap text-white">{children}</span>
      {action && (actionTo
        ? <Link to={actionTo} className="text-[13px] font-bold whitespace-nowrap text-[#f7b9c4]">{action}</Link>
        : <span className="text-[13px] font-bold whitespace-nowrap text-[#f7b9c4]">{action}</span>)}
    </>
  )
  const cls = cx('fixed bottom-[52px] left-[196px] z-30 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]', className)
  if (to) return <Link to={to} data-overlay="toast" className={cls}>{inner}</Link>
  return <div data-overlay="toast" className={cls}>{inner}</div>
}

/* ───────────── Form bits ───────────── */

const BTN = {
  outline: 'border border-line bg-white text-ink',
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]',
  danger: 'border border-[#f2c4c8] bg-white text-[#b4323c]',
  pink: 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]',
  ghost: 'text-ink',
}

/** Footer / dialog button, h46 r24. */
export function Btn({ variant = 'outline', icon, to, onClick, className = '', children }) {
  const cls = cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] px-5 text-[14px] font-semibold whitespace-nowrap', BTN[variant], icon && 'pl-4', className)
  const inner = <>{icon && <Icon name={icon} size={18} />}{children}</>
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

/** Small button h36 r18 (Replace, View full size …). */
export function SmallBtn({ variant = 'ghost', icon, to, onClick, className = '', children }) {
  const cls = cx('flex h-9 shrink-0 items-center gap-2 rounded-[18px] px-3.5 text-[13px] font-semibold whitespace-nowrap', BTN[variant], icon && 'pl-3', variant === 'navy' && 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]', className)
  const inner = <>{icon && <Icon name={icon} size={16} />}{children}</>
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

export function Check({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(!checked) }}
      className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white', className)}
    >
      {checked && <Icon name="check" size={15} />}
    </button>
  )
}

export function Radio({ on }) {
  return <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
}

/** Radio option card. Selected: #f3f7ff + blue border; else #f4f6fb. */
export function RadioCard({ on, onClick, title, sub, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('flex w-full items-center gap-3 rounded-[14px] p-3 text-left', on ? 'border border-blue bg-[#f3f7ff]' : 'bg-panel', className)}
    >
      <Radio on={on} />
      {sub ? (
        <span className="flex flex-col gap-px">
          <span className="text-[13px] font-bold text-ink">{title}</span>
          <span className="text-[11px] font-medium text-muted">{sub}</span>
        </span>
      ) : (
        <span className="text-[13px] font-semibold text-ink">{title}</span>
      )}
    </button>
  )
}

export function Label({ children, className = '' }) {
  return <p className={cx('text-[13px] font-semibold text-ink', className)}>{children}</p>
}

/** Static input box h50 r16 #f4f6fb with editable value. */
export function InputBox({ value, onChange, placeholder, trailing, leading, className = '', inputClass = '' }) {
  return (
    <div className={cx('flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4', className)}>
      {leading}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cx('min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint', inputClass)}
      />
      {typeof trailing === 'string' ? <Icon name={trailing} size={18} className="text-muted" /> : trailing}
    </div>
  )
}

/** Amber / red bullet list box ("What changes"). */
export function EffectsBox({ title, items, tone = 'amber' }) {
  const t = tone === 'amber'
    ? 'border-[#f1d9a8] bg-[#fff9ef] text-[#8a5a12]'
    : 'border-[#f2c4c8] bg-[#fff7f7] text-[#b4323c]'
  return (
    <div className={cx('flex flex-col gap-2 rounded-[16px] border p-3.5', t)}>
      <p className="text-[12px] font-bold">{title}</p>
      {items.map((s) => (
        <p key={s} className="flex items-center gap-2 text-[12px] font-semibold">
          <Icon name="alert" size={13} />{s}
        </p>
      ))}
    </div>
  )
}

/* ───────────── Status chips ───────────── */

export function StatusChip({ status }) {
  if (status === 'given')
    return <span className="inline-flex h-[25px] w-fit items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] pr-3 pl-2 text-[12px] font-semibold text-[#127650]"><Icon name="check" size={13} />Given</span>
  if (status === 'withdrawn')
    return <span className="inline-flex h-[25px] w-fit items-center gap-[5px] rounded-[14px] bg-[#fbebec] pr-3 pl-2 text-[12px] font-semibold text-[#b4323c]"><Icon name="x" size={13} />Withdrawn</span>
  return <span className="inline-flex h-[25px] w-fit items-center rounded-[14px] bg-[#eef1f5] px-3 text-[12px] font-semibold text-ink-2">Not recorded</span>
}

/* ───────────── Consent tab body ───────────── */

function PersonalDataBanner({ withdrawn }) {
  if (withdrawn)
    return (
      <section className="flex h-[92px] items-center gap-4 rounded-[28px] bg-[#fff7f7] px-6">
        <span className="flex size-[52px] items-center justify-center rounded-full bg-[#fbebec] text-[#b4323c]"><Icon name="lock" size={24} /></span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[16px] font-bold text-[#b4323c]">Consent to store personal data: withdrawn</p>
          <p className="text-[12px] font-medium text-[#b4323c]">26 Oct 2026 · customer asked by email · by you · PAN and Aadhaar hidden</p>
        </div>
        <SmallBtn variant="navy" icon="check" to="/x/cs1-record-consent" className="pr-3.5 text-white">Record again</SmallBtn>
      </section>
    )
  return (
    <section className="flex h-[92px] items-center gap-4 rounded-[28px] bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] px-6">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="lock" size={24} /></span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[16px] font-bold text-ink">Consent to store personal data: given</p>
        <p className="text-[12px] font-medium text-[#2f6b55]">02 Sep 2026 · signed form · by you · allows PAN, Aadhaar and identity documents</p>
      </div>
      <SmallBtn variant="danger" to="/x/cs6-withdraw-personal-data-consent">Withdraw</SmallBtn>
    </section>
  )
}

const CH = ['whatsapp', 'email', 'sms']

function ConsentCell({ status, person, channel }) {
  const given = status === 'given'
  let to = '/x/cs1-record-consent'
  if (given) to = person === 'kavya' && channel === 'whatsapp' ? '/x/cs3-consent-proof' : '/x/cs4-withdraw-consent'
  return (
    <div className="flex w-[160px] flex-col gap-1">
      <StatusChip status={status} />
      <Link to={to} className="w-fit text-[11px] font-bold text-blue">{given ? 'Withdraw' : 'Record'}</Link>
    </div>
  )
}

/** overrides: { 'arjun.email': 'given', … } */
export function ConsentBody({ overrides = {}, personalWithdrawn = false }) {
  return (
    <div className="flex flex-col gap-6">
      <PersonalDataBanner withdrawn={personalWithdrawn} />
      <div className="flex items-start gap-5">
        <section className="w-[760px] overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <div className="flex gap-3 px-[22px] py-[18px] text-[12px] font-semibold text-muted">
            <span className="w-[220px]">Person</span>
            <span className="w-[160px]">WhatsApp</span>
            <span className="w-[160px]">Email</span>
            <span className="w-[160px]">SMS</span>
          </div>
          {consentRows.map((r) => (
            <div key={r.key} className="border-t border-line">
              <div className="flex h-[71px] items-center gap-3 px-[22px]">
                <div className="flex w-[220px] items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-white text-[12px] font-bold text-navy" style={{ background: r.av }}>{r.initials}</span>
                  <span className="flex flex-col gap-px">
                    <span className="text-[13px] font-bold text-ink">{r.name}</span>
                    <span className="text-[11px] font-medium text-muted">{r.rel}</span>
                  </span>
                </div>
                {CH.map((c) => (
                  <ConsentCell key={c} person={r.key} channel={c} status={overrides[`${r.key}.${c}`] ?? r[c]} />
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className="flex w-[400px] flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <div className="flex flex-col gap-[3px]">
            <p className="text-[17px] font-bold text-ink">History</p>
            <p className="text-[12px] font-medium text-muted">Who changed what, and how</p>
          </div>
          {consentHistory.map(([t, s]) => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="size-2.5 shrink-0 rounded-full bg-[#5b3fb8]" />
              <span className="flex flex-col gap-px">
                <span className="text-[13px] font-bold text-ink">{t}</span>
                <span className="text-[11px] font-medium text-muted">{s}</span>
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

/** Consent tab page with optional overlay. */
export function ConsentPage({ overlay, ...body }) {
  return (
    <ProfileShell crumb="POLICY HOLDERS  /  KAVYA HEGDE  /  CONSENT" tab="consent" overlay={overlay}>
      <ConsentBody {...body} />
    </ProfileShell>
  )
}
