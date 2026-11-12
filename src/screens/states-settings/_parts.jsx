// Shared parts for Settings state frames (KY/IN/PV/SA/EX/WL/RF/AS families).
// Own settings shell — intentionally independent of src/screens/settings.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { FixedScrim, FixedDialog } from '../catalogue/_overlay'
import { useHeaderSearch, clearHeaderSearch, matches, NoMatches } from '../admin/_filter'
import {
  settingsNav, insurers, priceVersions, supportRecords, rechargeAmounts, walletTxns,
  referrerStats, referrers, assistant, assistantCan, assistantCannot,
} from '../../data/states-settings'

const SH_CARD = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const SH_NAVY = 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]'
const SH_PINK = 'shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]'
const SH_SOFT = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'

/* ───────────── Header ───────────── */

function HeaderActions({ action }) {
  return (
    <div className="mt-1 flex shrink-0 items-center gap-3 max-xl:flex-wrap">
      <label className="flex h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
        <Icon name="search" size={18} className="text-muted" />
        <input
          placeholder="Search anything"
          className="w-[131px] min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint"
        />
        <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
      </label>
      <button type="button" className={cx('flex size-11 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT)}>
        <Icon name="bell" size={18.5} />
      </button>
      {action}
    </div>
  )
}

export function PageHead({ crumb, title, chip, subtitle, action }) {
  return (
    <header className="flex items-start justify-between gap-6 max-xl:flex-col max-xl:gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre max-xl:whitespace-pre-wrap text-muted">{crumb}</p>
        <div className="flex h-[38px] items-center gap-3">
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">{title}</h1>
          {chip}
        </div>
        <p className="text-[14px] font-medium text-muted">{subtitle}</p>
      </div>
      <HeaderActions action={action} />
    </header>
  )
}

/* ───────────── Buttons ───────────── */

/** 46px pill: navy | pink | outline | danger (white with rose border) */
export function Btn({ variant = 'navy', icon, to, onClick, center, className = '', children }) {
  const cls = cx(
    'inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] pr-5 pl-4 text-[14px] font-semibold whitespace-nowrap transition',
    variant === 'navy' && cx('bg-navy text-white hover:bg-navy-700', SH_NAVY),
    variant === 'pink' && cx('bg-[linear-gradient(to_right,#f9c6d0,#f29db0)] text-navy hover:brightness-[1.03]', SH_PINK),
    variant === 'outline' && 'border border-line bg-white text-ink hover:bg-tile',
    variant === 'danger' && 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fff7f7]',
    center && 'justify-center',
    className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

/** 36px small button used inside list rows. */
export function SmallBtn({ variant = 'outline', icon, to, onClick, className = '', children }) {
  const cls = cx(
    'inline-flex h-9 shrink-0 items-center gap-2 rounded-[18px] px-3.5 text-[13px] font-semibold whitespace-nowrap transition',
    icon && 'pl-3',
    variant === 'outline' && 'border border-line bg-white text-ink hover:bg-tile',
    variant === 'danger' && 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fff7f7]',
    variant === 'ghost' && 'text-ink hover:bg-white',
    variant === 'navy' && cx('bg-navy text-white hover:bg-navy-700', SH_NAVY),
    className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

export function IconBtn36({ icon = 'more' }) {
  return (
    <button type="button" className={cx('flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT)}>
      <Icon name={icon} size={15.1} />
    </button>
  )
}

/* ───────────── Chips / surfaces ───────────── */

const CHIP = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  gray: 'bg-[#eef1f5] text-ink-2',
  red: 'bg-[#fbebec] text-[#b4323c]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  blue: 'bg-[#e8f0fd] text-blue',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  pink: 'bg-[#fde8ec] text-[#b4325a]',
}

export function Chip({ tone = 'gray', icon, children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', CHIP[tone])}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

export function SCard({ className = '', children }) {
  return <section className={cx('flex flex-col gap-2.5 rounded-[28px] bg-white p-6', SH_CARD, className)}>{children}</section>
}

export function CardHead({ title, sub }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <h2 className="text-[17px] leading-[21px] font-bold text-ink">{title}</h2>
      {sub && <p className="text-[12px] leading-[15px] font-medium text-muted">{sub}</p>}
    </div>
  )
}

const NOTE = {
  blue: 'bg-[#e8f0fd] text-blue',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
}
export function Note({ icon, tone = 'blue', className = '', children }) {
  return (
    <div className={cx('flex items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', NOTE[tone], className)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** 22px checkbox (navy when checked, white + #c3ccd8 border when not). */
export function Check({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cx(
        'flex size-[22px] shrink-0 items-center justify-center rounded-[7px]',
        checked ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white',
      )}
    >
      {checked && <Icon name="check" size={14} />}
    </button>
  )
}

/* ───────────── Form fields ───────────── */

export function Field({ label, hint, className = '', children }) {
  return (
    <label className={cx('flex flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

/** 50px panel input; `focus` draws the 2px blue ring from the frames. */
export function TextInput({ leading, trailing, focus, defaultValue, className = '', inputClass = '', ...rest }) {
  const [v, setV] = useState(defaultValue ?? '')
  return (
    <span className={cx('flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4', focus && 'border-2 border-blue', className)}>
      {leading && <Icon name={leading} size={18} className={cx('text-muted', focus && 'ml-0.5')} />}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        className={cx('min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none', focus && !leading && 'pl-0.5', inputClass)}
        {...rest}
      />
      {trailing && <Icon name={trailing} size={18} className="text-muted" />}
    </span>
  )
}

/* ───────────── Settings nav + page shell ───────────── */

export function SettingsNav({ active }) {
  return (
    <nav className={cx('flex w-[260px] shrink-0 flex-col gap-0.5 self-start rounded-[28px] bg-white p-2.5', SH_CARD)}>
      {settingsNav.map((n) => {
        const on = n.key === active
        return (
          <Link
            key={n.key}
            to={n.to}
            className={cx(
              'flex h-10 items-center gap-3 rounded-[16px] px-3.5 text-[13px] font-semibold',
              on ? 'bg-navy text-white' : 'text-ink-2 hover:bg-panel',
            )}
          >
            <Icon name={n.icon} size={18} className={on ? 'text-white' : 'text-muted'} />
            {n.label}
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Settings page: heading + 260px settings nav + 900px content column.
 * `overlay` renders above everything inside the workspace panel (scrim, drawer, dialog, toast).
 */
export function SettingsPage({ nav, crumb, title, chip, subtitle, action, overlay, children, onSearch }) {
  // Header "Search anything": Ctrl/Cmd+K focuses it; pages with a list pass onSearch to filter it.
  useHeaderSearch(onSearch)
  return (
    <AppLayout active="settings">
      <PageHead crumb={crumb} title={title} chip={chip} subtitle={subtitle} action={action} />
      <div className="mt-[21px] flex gap-5">
        <SettingsNav active={nav} />
        <div className="flex w-[900px] flex-col gap-[18px]">{children}</div>
      </div>
      {overlay}
    </AppLayout>
  )
}

/* ───────────── Overlays ───────────── */

export function Scrim() {
  return <FixedScrim />
}

/** Right drawer inside the workspace (500×928, 24px inset). */
export function Drawer({ title, sub, closeTo, footer, children }) {
  return (
    <>
      <Scrim />
      <aside data-overlay="drawer" className="fixed top-12 right-12 bottom-12 z-50 flex w-[500px] flex-col overflow-y-auto overscroll-contain gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-[3px]">
            <h2 className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</h2>
            <p className="text-[12px] font-medium text-muted">{sub}</p>
          </div>
          <Link to={closeTo} aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line">
            <Icon name="x" size={16} />
          </Link>
        </div>
        {children}
        <div className="sticky bottom-0 mt-auto flex gap-2.5 bg-white">{footer}</div>
      </aside>
    </>
  )
}

const DIALOG_ICON = { red: 'bg-[#fbebec] text-[#b4323c]', blue: 'bg-[#e8f0fd] text-blue' }

/** Centered confirm dialog inside the workspace (540 wide). */
export function Dialog({ top = 170, icon, tone = 'red', title, body, children, actions }) {
  return (
    <>
      <Scrim />
      <FixedDialog
        top={top}
        left={360}
        width={540}
        className="flex flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]"
      >
        <div className={cx('flex size-[60px] items-center justify-center rounded-full', DIALOG_ICON[tone])}>
          <Icon name={icon} size={26} />
        </div>
        <h2 className="text-[21px] font-bold tracking-[-0.2px] text-ink">{title}</h2>
        <p className="text-[13px] leading-[20px] font-medium text-muted">{body}</p>
        {children}
        <div className="flex gap-2.5 [&>*]:flex-1 [&>*]:justify-center">{actions}</div>
      </FixedDialog>
    </>
  )
}

export function Toast({ children }) {
  return (
    <div data-overlay="toast" className="fixed bottom-[52px] left-[196px] z-50 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 py-3 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]">
      <span className="flex size-6 items-center justify-center rounded-full bg-[#16845b] text-white">
        <Icon name="check" size={13} />
      </span>
      <span className="text-[13px] font-semibold text-white">{children}</span>
    </div>
  )
}

/* ───────────── Family bases ───────────── */

export const ROUTES = {
  kyc: '/x/s03-settings-kyc',
  insurers: '/x/s04-settings-my-insurers',
  support: '/x/s08-settings-support-access',
  referrers: '/x/s07-settings-referrers',
  assistants: '/x/s06-settings-assistants',
  pv1: '/x/pv1-product-my-price-versions',
  pv2: '/x/pv2-product-add-price-version',
}

function Initials({ size = 42, bg = '#ffffff', ring, className = '', children }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full font-bold', ring && 'border-2 border-white', className)}
      style={{ width: size, height: size, background: bg }}
    >
      {children}
    </span>
  )
}

/* KYC (KY1–KY3) */
export function KycPage({ chip, children }) {
  return (
    <SettingsPage
      nav="kyc"
      crumb="SETTINGS  /  KYC"
      title="KYC"
      chip={chip}
      subtitle="SkyUp verifies you once. Changes to PAN or licence send it back for review."
    >
      {children}
    </SettingsPage>
  )
}

/** Header-search state for a list page: [q, setQ, clear]. */
function useListSearch() {
  const [q, setQ] = useState('')
  return [q, setQ, () => { clearHeaderSearch(); setQ('') }]
}

/* My insurers (IN1–IN3) */
export function InsurersPage({ inactive, overlay }) {
  const [q, setQ, clear] = useListSearch()
  const rows = insurers.filter((r) => matches(q, r.name, r.meta, r.chip, r.status))
  return (
    <SettingsPage
      nav="insurers"
      crumb="SETTINGS  /  MY INSURERS"
      title="My insurers"
      subtitle="Quotations need an active agent code for the insurer."
      action={<Btn variant="pink" icon="plus" to="/x/in1-my-insurers-add-insurer">Add insurer</Btn>}
      overlay={overlay}
      onSearch={setQ}
    >
      <SCard>
        <CardHead title="Insurers and agent codes" sub="5 added · 4 active" />
        {rows.length === 0 && <NoMatches onClear={clear} hint={`No insurers match “${q}”.`} />}
        {rows.map((r) => {
          const off = inactive && r.status === 'expiring'
          const expired = r.status === 'expired'
          return (
            <div
              key={r.name}
              className={cx(
                'flex h-[70px] items-center gap-3.5 rounded-[20px] p-3.5',
                expired ? 'h-[72px] border border-[#f2c4c8] bg-[#fff7f7]' : 'bg-panel',
                off && 'opacity-60',
              )}
            >
              <Initials className="text-[13px] text-ink">{r.initials}</Initials>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{r.name}</p>
                <p className="text-[12px] font-medium text-muted">{r.meta}</p>
              </div>
              {off ? (
                <>
                  <Chip tone="gray" icon="x">Inactive</Chip>
                  <SmallBtn icon="refresh" to="/x/s04-settings-my-insurers">Reactivate</SmallBtn>
                </>
              ) : r.status === 'active' ? (
                <>
                  <Chip tone="green" icon="check">Active</Chip>
                  <SmallBtn>Edit</SmallBtn>
                </>
              ) : r.status === 'expiring' ? (
                <>
                  <Chip tone="amber" icon="clock">{r.chip}</Chip>
                  <SmallBtn to="/x/in2-my-insurers-deactivate">Edit</SmallBtn>
                </>
              ) : (
                <>
                  <Chip tone="red" icon="x">Expired</Chip>
                  <SmallBtn>Update code</SmallBtn>
                </>
              )}
            </div>
          )
        })}
      </SCard>
      <Note icon="alert" className="w-fit">
        Deactivating an insurer stops new quotations for it. Existing quotations and policies stay.
      </Note>
    </SettingsPage>
  )
}

/* Product price versions (PV1–PV2) — Products shell, no settings nav */
const PV_ROW = {
  scheduled: { chip: <Chip tone="blue" icon="clock">Scheduled</Chip>, cancel: true },
  current: { chip: <Chip tone="green" icon="check">Current</Chip>, current: true },
  closed: { chip: <Chip tone="gray">Closed</Chip> },
  cancelled: { chip: <Chip tone="gray" icon="x">Cancelled</Chip> },
}

export function PriceVersionsPage({ overlay }) {
  const [q, setQ, clear] = useListSearch()
  useHeaderSearch(setQ)
  const rows = priceVersions.filter((v) => matches(q, v.code, v.title, v.sub, v.status))
  return (
    <AppLayout active="products">
      <PageHead
        crumb="PRODUCTS  /  CAREFIRST FAMILY  /  PRICES"
        title="My price versions"
        subtitle="CareFirst Family · Gold · private to your account"
        action={<Btn variant="pink" icon="plus" to={ROUTES.pv2}>Add price version</Btn>}
      />
      <SCard className="mt-[13px]">
        <CardHead title="Price versions" sub="Exactly one is current at any time" />
        {rows.length === 0 && <NoMatches onClear={clear} hint={`No price versions match “${q}”.`} />}
        {rows.map((v) => {
          const cfg = PV_ROW[v.status]
          return (
            <div
              key={v.code}
              className={cx(
                'flex h-[76px] items-center gap-3.5 rounded-[18px] p-4',
                cfg.current ? 'h-[78px] border border-[#c7ebda] bg-[#f5fbf8]' : 'bg-panel',
              )}
            >
              <Initials size={44} className="text-[11px] text-ink">{v.code}</Initials>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{v.title}</p>
                <p className="text-[12px] font-medium text-muted">{v.sub}</p>
              </div>
              {cfg.chip}
              <SmallBtn variant="ghost" icon="download" className="pr-3.5">Rate table</SmallBtn>
              {cfg.cancel && <SmallBtn variant="danger">Cancel</SmallBtn>}
            </div>
          )
        })}
      </SCard>
      {overlay}
    </AppLayout>
  )
}

/* Support access (SA1) */
export function SupportPage({ overlay }) {
  const [q, setQ, clear] = useListSearch()
  const records = supportRecords.filter((r) => matches(q, r.label, r.at))
  return (
    <SettingsPage
      nav="support"
      crumb="SETTINGS  /  SUPPORT ACCESS"
      title="Support access"
      chip={<Chip tone="green" icon="eye">Active now</Chip>}
      subtitle="SkyUp sees your customers only if you allow it. Read only, up to 24 hours."
      action={<Btn icon="eye" to="/x/sa1-support-access-give-access">Give access</Btn>}
      overlay={overlay}
      onSearch={setQ}
    >
      <section className={cx('flex items-center gap-4 rounded-[28px] bg-[linear-gradient(to_right,#e9e3fc,#dcd2fb)] p-6', SH_CARD)}>
        <div className="flex size-[76px] shrink-0 flex-col items-center justify-center rounded-full bg-white text-[#5b3fb8]">
          <span className="text-[20px] leading-[25px] font-bold">22h</span>
          <span className="text-[10px] font-semibold">left</span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[17px] font-bold text-ink">Rahul N (SkyUp support) can view your customers</p>
          <p className="text-[13px] leading-[20px] font-medium text-[#5b3fb8]">
            Reason: Ticket #4471, quotation PDF shows wrong name · ends 27 Oct 2026, 09:30
          </p>
        </div>
        <Btn variant="danger" icon="x" to={ROUTES.support}>End access now</Btn>
      </section>
      <SCard>
        <CardHead title="Records they opened" sub="Updated live · also in your activity log" />
        {records.length === 0 && <NoMatches onClear={clear} hint={`No records match “${q}”.`} />}
        {records.map((r) => (
          <div key={r.label} className="flex h-16 items-center gap-3 rounded-[18px] bg-panel p-3.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-ink">
              <Icon name="eye" size={16} />
            </span>
            <p className="flex-1 text-[13px] font-bold text-ink">{r.label}</p>
            <p className="text-[12px] font-medium text-muted">{r.at}</p>
          </div>
        ))}
      </SCard>
      <SCard>
        <CardHead title="Past access" />
        <div className="flex h-[61px] items-center gap-3 rounded-[18px] bg-panel p-3.5">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">Divya P (SkyUp support)</p>
            <p className="text-[12px] font-medium text-muted">12 Sep, 10:00 to 12 Sep, 12:00 · 3 records opened</p>
          </div>
          <Chip tone="gray">Ended</Chip>
        </div>
      </SCard>
    </SettingsPage>
  )
}

/* WhatsApp wallet (WL1–WL2) */
export function WalletPage({ failed, overlay }) {
  const [amt, setAmt] = useState(1)
  const [q, setQ, clear] = useListSearch()
  const pendingRow = { title: 'Recharge · payment gateway', sub: failed ? '26 Oct, 11:20 · bank declined' : 'Started 26 Oct, 11:20 · waiting for the bank', status: failed ? 'Failed' : 'Pending' }
  const showPending = matches(q, pendingRow.title, pendingRow.sub, pendingRow.status, '₹1,000.00')
  const txns = walletTxns.filter((t) => matches(q, t.title, t.sub, t.amount))
  const label = rechargeAmounts[amt] === 'Custom' ? 'Pay custom amount + GST' : `Pay ${rechargeAmounts[amt]} + GST`
  return (
    <SettingsPage
      nav="wallet"
      crumb="SETTINGS  /  WHATSAPP WALLET"
      title="WhatsApp wallet"
      chip={<Chip tone="pink" icon="star">Premium</Chip>}
      subtitle="Pays for automated WhatsApp greetings and reminders. Premium only."
      overlay={overlay}
      onSearch={setQ}
    >
      <div className="flex items-start gap-[18px]">
        <section className="flex h-[159px] w-[440px] flex-col gap-3 rounded-[28px] bg-[linear-gradient(to_bottom,#1a3460,#0e1f3b)] p-6 shadow-[0px_24px_44px_-14px_rgba(19,41,75,0.3)]">
          <div className="flex h-6 items-center gap-2.5">
            <p className="flex-1 text-[14px] font-semibold text-[#c9d6ea]">Balance</p>
            <span className="flex h-6 items-center rounded-[12px] bg-[#f3f0fa] px-2.5 text-[11px] font-bold text-[#5b3fb8]">Paid to SkyUp</span>
          </div>
          <p className="text-[38px] font-bold tracking-[-0.8px] text-white">₹342.00</p>
          <p className="text-[12px] font-medium text-[#c9d6ea]">About 342 messages at ₹1.00 each · alert below ₹100</p>
        </section>
        <section className={cx('flex w-[442px] flex-col gap-3.5 rounded-[28px] bg-white p-6', SH_CARD)}>
          <CardHead title="Recharge" sub="Smallest recharge ₹500" />
          <div className="flex gap-2">
            {rechargeAmounts.map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmt(i)}
                className={cx('h-9 flex-1 rounded-[16px] text-[13px] font-bold', i === amt ? 'bg-navy text-white' : 'bg-panel text-ink hover:bg-line')}
              >
                {a}
              </button>
            ))}
          </div>
          <Btn icon="card" center to={failed ? '/x/wl1-wallet-recharge-pending' : undefined} className="w-full">{label}</Btn>
        </section>
      </div>
      <SCard>
        <CardHead title="Transactions" />
        {!showPending && txns.length === 0 && <NoMatches onClear={clear} hint={`No transactions match “${q}”.`} />}
        {showPending && <div className="flex h-[66px] items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
          <span className="flex size-[38px] items-center justify-center rounded-full bg-white text-ink">
            <Icon name="chat" size={16} />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">Recharge · payment gateway</p>
            <p className="text-[12px] font-medium text-muted">
              {failed ? '26 Oct, 11:20 · bank declined' : 'Started 26 Oct, 11:20 · waiting for the bank'}
            </p>
          </div>
          <p className="text-[14px] font-bold text-ink">{failed ? '₹1,000.00' : '+ ₹1,000.00'}</p>
          {failed ? (
            <>
              <Chip tone="red" icon="x">Failed</Chip>
              <SmallBtn icon="refresh" to="/x/wl1-wallet-recharge-pending">Try again</SmallBtn>
            </>
          ) : (
            <Chip tone="violet" icon="clock">Pending</Chip>
          )}
        </div>}
        {txns.map((t) => (
          <div key={t.title} className="flex h-[66px] items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
            <span className={cx('flex size-[38px] items-center justify-center rounded-full', t.credit ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-white text-ink')}>
              <Icon name={t.icon} size={16} />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">{t.title}</p>
              <p className="text-[12px] font-medium text-muted">{t.sub}</p>
            </div>
            <p className={cx('text-[14px] font-bold', t.credit ? 'text-[#127650]' : 'text-ink')}>{t.amount}</p>
          </div>
        ))}
      </SCard>
    </SettingsPage>
  )
}

/* Referrers (RF1–RF3) */
export function ReferrersPage({ disabled, overlay }) {
  const [q, setQ, clear] = useListSearch()
  return (
    <SettingsPage
      nav="referrers"
      crumb="SETTINGS  /  REFERRERS"
      title="Referrers"
      subtitle="People who send you leads. Each link is valid for 365 days."
      action={<Btn variant="pink" icon="plus">Add referrer</Btn>}
      overlay={overlay}
      onSearch={setQ}
    >
      <section className="flex gap-5 rounded-[26px] bg-[linear-gradient(to_right,#e9e3fc,#dcd2fb)] px-[26px] py-5">
        {referrerStats.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col gap-0.5">
            <p className="text-[26px] font-bold tracking-[-0.5px] text-ink">{s.value}</p>
            <p className="text-[12px] font-semibold text-[#5b3fb8]">{s.label}</p>
          </div>
        ))}
      </section>
      <SCard>
        <CardHead title="Referrers" sub="3 of 25" />
        {!referrers.some((r) => matches(q, r.name, r.meta, r.status)) && <NoMatches onClear={clear} hint={`No referrers match “${q}”.`} />}
        {referrers.map((r, i) => {
          if (!matches(q, r.name, r.meta, r.status)) return null
          const off = disabled && i === 0
          return (
            <div key={r.name} className={cx('flex h-[72px] items-center gap-3.5 rounded-[20px] bg-panel p-3.5', off && 'opacity-60')}>
              <Initials size={44} bg={r.bg} ring className="text-[14px] text-navy">{r.initials}</Initials>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{r.name}</p>
                <p className="text-[12px] font-medium text-muted">{r.meta}</p>
              </div>
              {off ? (
                <Chip tone="gray" icon="x">Disabled</Chip>
              ) : r.status === 'active' ? (
                <Chip tone="green">Active</Chip>
              ) : (
                <Chip tone="blue">Invited</Chip>
              )}
              <SmallBtn icon="chat" to={i === 0 && !disabled ? '/x/rf1-referrer-new-link' : undefined}>Share invite</SmallBtn>
              {i === 0 ? (
                <Link to="/x/rf2-referrer-disable" className={cx('flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT)}>
                  <Icon name="more" size={15.1} />
                </Link>
              ) : (
                <IconBtn36 />
              )}
            </div>
          )
        })}
      </SCard>
    </SettingsPage>
  )
}

/* Assistants (AS1–AS2) */
export function AssistantsPage({ disabled, overlay }) {
  return (
    <SettingsPage
      nav="assistants"
      crumb="SETTINGS  /  ASSISTANTS"
      title="Assistants"
      chip={<Chip tone="blue">1 of 2</Chip>}
      subtitle="Up to 2 on Premium. Included in your trial."
      action={<Btn variant="pink" icon="user-plus">Add assistant</Btn>}
      overlay={overlay}
    >
      <SCard className="gap-3.5">
        <CardHead title="Assistants" />
        <div className="flex h-[87px] items-center gap-3.5 rounded-[22px] bg-panel p-4">
          <Initials size={52} bg="#e9e3fc" ring className="text-[17px] text-navy">{assistant.initials}</Initials>
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[15px] font-bold text-ink">{assistant.name}</p>
            <p className="text-[12px] font-medium text-muted">{assistant.meta}</p>
            <p className="text-[12px] font-medium text-slate">{assistant.recent}</p>
          </div>
          {disabled ? (
            <>
              <Chip tone="gray" icon="x">Disabled</Chip>
              <SmallBtn icon="refresh" to={ROUTES.assistants}>Enable</SmallBtn>
            </>
          ) : (
            <>
              <Chip tone="green" icon="check">Active</Chip>
              <SmallBtn variant="danger" to="/x/as1-assistant-disable">Disable</SmallBtn>
            </>
          )}
        </div>
        <button
          type="button"
          className="flex h-14 items-center justify-center gap-3 rounded-[22px] border border-dashed border-[#c3ccd8] text-[13px] font-semibold text-muted hover:bg-panel"
        >
          <Icon name="user-plus" size={18} />
          Add a second assistant
        </button>
      </SCard>
      <div className="flex gap-[18px]">
        <PermCard title="Assistants can" items={assistantCan} ok />
        <PermCard title="Assistants cannot" items={assistantCannot} />
      </div>
    </SettingsPage>
  )
}

function PermCard({ title, items, ok }) {
  return (
    <section className={cx('flex flex-1 flex-col gap-2.5 rounded-[28px] p-6', ok ? 'bg-[#f5fbf8]' : 'bg-[#fff7f7]', SH_CARD)}>
      <h3 className={cx('text-[15px] font-bold', ok ? 'text-[#127650]' : 'text-[#b4323c]')}>{title}</h3>
      {items.map((t) => (
        <div key={t} className="flex items-center gap-2.5">
          <span className={cx('flex size-[22px] items-center justify-center rounded-full', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbebec] text-[#b4323c]')}>
            <Icon name={ok ? 'check' : 'x'} size={12} />
          </span>
          <span className="text-[13px] font-medium text-ink">{t}</span>
        </div>
      ))}
    </section>
  )
}
