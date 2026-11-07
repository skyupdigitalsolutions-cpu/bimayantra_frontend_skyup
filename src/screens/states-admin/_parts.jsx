// Shared pieces for the SkyUp Admin state frames (AA1–AA13).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AdminLayout, AdminHeader, ACard, ACardHead, HButton, Pill, PanelScrim } from '../admin/_parts'
import { accountCards, usage } from '../../data/states-admin'
import { PANEL_X, DIALOG_MAX, DRAWER_BOX, DRAWER_FOOT, useFitTop } from '../sales/_overlay'

export { PANEL_SCRIM, DRAWER_BOX, DRAWER_FOOT, useLockScroll } from '../sales/_overlay'

/** Right drawer card (500 wide, Figma 736,24 in the panel), viewport-fixed; stops clicks reaching the scrim */
export function ADrawer({ children }) {
  return (
    <div
      data-overlay="drawer"
      role="dialog"
      onClick={(e) => e.stopPropagation()}
      className={cx(DRAWER_BOX, 'flex w-[500px] flex-col gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]')}
    >
      {children}
    </div>
  )
}

/** Footer row pinned to the drawer bottom */
export function DrawerFoot({ children }) {
  return <div className={DRAWER_FOOT}>{children}</div>
}

export { AdminLayout, AdminHeader, ACard, ACardHead, HButton, Pill, PanelScrim }

/** Pill from a [tone, icon, text] tuple */
export const TPill = ({ t, className }) => (t ? <Pill tone={t[0]} icon={t[1]} className={className}>{t[2]}</Pill> : null)

/** Dialog card (r30 p30 gap16) placed inside the panel scrim */
export function ADialog({ top, left = 360, width = 540, className = '', children }) {
  const ref = useFitTop(top)
  return (
    <div
      ref={ref}
      data-overlay="dialog"
      role="dialog"
      className={cx('fixed flex flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', DIALOG_MAX, className)}
      style={{ top: top + 24, left: PANEL_X + left, width }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function DialogIcon({ icon, className = 'bg-[#fbebec] text-[#b4323c]' }) {
  return (
    <span className={cx('flex size-[60px] items-center justify-center rounded-full', className)}>
      <Icon name={icon} size={26} />
    </span>
  )
}

export function DialogTitle({ children }) {
  return <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{children}</p>
}

export function DialogText({ children }) {
  return <p className="text-[13px] leading-5 font-medium text-muted">{children}</p>
}

/** Label + 50px input (r16, #f4f6fb). */
export function AField({ label, hint, className = '', children }) {
  return (
    <div className={cx('flex min-w-0 flex-col gap-2', className)}>
      <p className="text-[13px] font-semibold text-ink">{label}</p>
      {children}
      {hint && <p className="text-[12px] font-medium text-muted">{hint}</p>}
    </div>
  )
}

export function AInput({ value: initial = '', placeholder, leading, prefix, trailing, focus, className = '', ...rest }) {
  const [v, setV] = useState(initial)
  return (
    <label className={cx('flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4', focus && 'border-2 border-blue', className)}>
      {leading && <Icon name={leading} size={18} className="shrink-0 text-muted" />}
      {prefix && <span className="text-[14px] font-semibold text-muted">{prefix}</span>}
      <input
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:text-faint"
        {...rest}
      />
      {trailing && <Icon name={trailing} size={18} className="shrink-0 text-muted" />}
    </label>
  )
}

export function ASelect({ options, value, className = '' }) {
  const [v, setV] = useState(value ?? options[0])
  return (
    <label className={cx('relative flex h-[50px] items-center rounded-[16px] bg-panel px-4', className)}>
      <select value={v} onChange={(e) => setV(e.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent pr-7 text-[14px] font-semibold text-ink outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <Icon name="chev-down" size={18} className="pointer-events-none absolute right-4 text-muted" />
    </label>
  )
}

/** Two equal-width footer buttons */
export function DialogButtons({ cancelTo, cancelLabel = 'Cancel', children }) {
  return (
    <div className="flex gap-2.5">
      <Link to={cancelTo} className="flex h-[46px] flex-1 items-center justify-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink">
        {cancelLabel}
      </Link>
      {children}
    </div>
  )
}

export function DangerButton({ to, icon, children, className = '' }) {
  return (
    <Link to={to} className={cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] border border-[#f2c4c8] bg-white pr-5 pl-4 text-[14px] font-semibold text-[#b4323c]', className)}>
      <Icon name={icon} size={18} />
      {children}
    </Link>
  )
}

export function NavyButton({ to, icon, children, className = '' }) {
  return (
    <Link to={to} className={cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]', className)}>
      <Icon name={icon} size={18} />
      {children}
    </Link>
  )
}

/* ───────────── AA2 Account detail (base of AA3 / AA4) ───────────── */

export function AccountDetailBase({ overlay, links = true }) {
  return (
    <AdminLayout active="accounts">
      <AdminHeader
        title="Rao Insurance Services"
        subtitle="Suresh Rao · since 12 Oct 2026"
        actions={
          <>
            <HButton variant="danger" icon="x">Close account</HButton>
            <HButton variant="outline" icon="alert" to={links ? '/x/aa3-admin-suspend-account' : undefined}>Suspend</HButton>
            <HButton variant="navy" icon="card" to={links ? '/x/aa4-admin-record-subscription-payment' : undefined}>Record payment</HButton>
          </>
        }
      />
      <div className="mt-[21px] flex gap-5">
        {accountCards.map((c) => (
          <ACard key={c.label} className="flex w-[280px] flex-col gap-1.5">
            <p className="text-[12px] font-semibold text-muted">{c.label}</p>
            <Pill tone={c.chip[0]} className="w-fit">{c.chip[1]}</Pill>
          </ACard>
        ))}
      </div>
      <div className="mt-[46px] flex items-start gap-5">
        <ACard className="flex w-[760px] flex-col gap-2.5">
          <ACardHead title="Usage" subtitle="Counts only, no personal data" />
          {usage.map(([k, v]) => (
            <div key={k} className="flex justify-between text-[13px]">
              <span className="font-medium text-muted">{k}</span>
              <span className="font-bold text-ink">{v}</span>
            </div>
          ))}
        </ACard>
        <ACard className="flex w-[400px] flex-col gap-2.5">
          <ACardHead title="Billing history" />
          <div className="flex w-fit items-center gap-2.5 rounded-[14px] bg-panel p-3">
            <span className="text-[13px] font-semibold text-ink">Trial started · 19 Oct 2026</span>
            <Pill tone="blue">Free</Pill>
          </div>
        </ACard>
      </div>
      {overlay}
    </AdminLayout>
  )
}

/* ───────────── Tables ───────────── */

/** White table card: #fafbfd header (py14 px24 gap16), 1px #e8ecf3 row dividers, rows py13. cols: [[label, widthClass]] */
export function ATable({ cols, children, className = '' }) {
  return (
    <div className={cx('rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', className)}>
      <div className="flex gap-4 rounded-t-[28px] bg-[#fafbfd] px-6 py-3.5">
        {cols.map(([l, w], i) => <p key={i} className={cx('shrink-0 text-[12px] font-semibold text-muted', w)}>{l}</p>)}
      </div>
      {children}
    </div>
  )
}

export function ARow({ to, children, className = '' }) {
  const cls = cx('flex items-center gap-4 border-t border-line px-6 py-[13px]', to && 'hover:bg-panel-2', className)
  return to ? <Link to={to} className={cls}>{children}</Link> : <div className={cls}>{children}</div>
}

/** Table cell; `strong` = first-column bold ink text */
export function ACell({ w, strong, children }) {
  return (
    <div className={cx('flex shrink-0 items-center gap-2 text-[13px]', strong ? 'font-bold text-ink' : 'font-medium text-ink-2', w)}>{children}</div>
  )
}

export function RowButton({ variant = 'outline', onClick, to, children }) {
  const v = {
    outline: 'border border-line bg-white text-ink',
    danger: 'border border-[#f2c4c8] bg-white text-[#b4323c]',
    navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]',
  }[variant]
  const cls = cx('inline-flex h-9 shrink-0 items-center rounded-[18px] px-3.5 text-[13px] font-semibold whitespace-nowrap', v)
  return to ? <Link to={to} className={cls}>{children}</Link> : <button type="button" onClick={onClick} className={cls}>{children}</button>
}

export function TinyAvatar({ initials, tint }) {
  return <span className={cx('flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy', tint)}>{initials}</span>
}
