// Local building blocks shared by the catalogue / after-sale frames.
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { FixedScrim, FixedDialog, useScrollLock } from './_overlay'
import { useCtrlK, NoMatches } from '../tasks/_filter'

/** Header CTA (h46, r24, pl16 pr20). variant: pink | navy | white */
const HEAD = {
  pink: 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]',
  navy: 'bg-navy text-white shadow-navy hover:bg-navy-700',
  white: 'bg-white text-ink border border-line hover:bg-tile',
  danger: 'bg-white text-[#b4323c] border border-[#f2c4c8] hover:bg-[#fdf6f7]',
  disabled: 'bg-[#eef1f5] text-faint',
}
export function HeadButton({ variant = 'pink', icon, to, className = '', children, ...rest }) {
  const cls = cx('inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] pr-5 pl-4 text-[14px] font-semibold whitespace-nowrap transition', HEAD[variant], className)
  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  )
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Small button (h36, r18) — "Policy PDF", "Open renewal" */
export function SmallButton({ variant = 'ghost', icon, to, className = '', children, ...rest }) {
  const v = {
    ghost: 'text-ink hover:bg-tile',
    navy: 'bg-navy text-white shadow-navy hover:bg-navy-700',
    white: 'bg-white text-ink shadow-soft hover:bg-tile',
    outline: 'bg-white text-ink border border-line hover:bg-tile',
    danger: 'bg-white text-[#b4323c] border border-[#f2c4c8] hover:bg-[#fdf6f7]',
    pink: 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]',
    disabled: 'bg-[#eef1f5] text-faint',
  }[variant]
  const cls = cx('inline-flex h-9 shrink-0 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold whitespace-nowrap transition', v, className)
  const inner = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  )
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Status chip with the exact catalogue palette (pl8 pr12 py5 r14, 12/semibold, 13px icon) */
export const STATUS = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  red: 'bg-[#fdeaea] text-[#b42318]',
  rose: 'bg-[#fbebec] text-[#b4323c]',
  sky: 'bg-[#e8f0fd] text-blue',
  neutral: 'bg-[#eef1f5] text-ink-2',
  purple: 'bg-[#f0ecfb] text-[#5b3fb8]',
  blue: 'bg-blue-50 text-blue',
  violet: 'bg-violet-50 text-violet',
  gray: 'bg-chip text-slate',
  pink: 'bg-pink-100 text-rose',
}
export function StatusChip({ tone = 'green', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-[5px] rounded-[14px] py-[5px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', STATUS[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Coloured stat tile (r26, p22, 280 wide): icon circle + label, big value, note */
export function StatTile({ bg, icon, label, value, note, className = '' }) {
  return (
    <div className={cx('flex w-[280px] shrink-0 flex-col gap-1.5 rounded-[26px] p-[22px]', bg, className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-[20px] bg-white/70">
          <Icon name={icon} size={20} className="text-ink" />
        </span>
        <p className="text-[13px] font-semibold whitespace-nowrap text-ink-2">{label}</p>
      </div>
      <p className="text-[30px] font-bold tracking-[-0.6px] text-ink">{value}</p>
      <p className="text-[12px] font-medium whitespace-nowrap text-slate">{note}</p>
    </div>
  )
}

/** Segmented tabs in a white pill (p5 gap4 r26); tab px16 py9 r21; count chip */
export function SegTabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('inline-flex shrink-0 items-start gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}>
      {items.map((t) => {
        const on = t.key === value
        // t.dim: an option with nothing in it (e.g. a category with no products) stays clickable but looks quieter
        const cls = cx('flex items-center gap-2 rounded-[21px] px-4 py-[9px] text-[13px] font-semibold whitespace-nowrap transition', on ? 'bg-navy text-white' : t.dim ? 'text-muted/70 hover:text-ink' : 'text-slate hover:text-ink')
        const inner = (
          <>
            {t.icon && <Icon name={t.icon} size={15} />}
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </>
        )
        if (t.to && !on) return <Link key={t.key} to={t.to} className={cls}>{inner}</Link>
        return <button key={t.key} type="button" onClick={() => onChange?.(t.key)} className={cls}>{inner}</button>
      })}
    </div>
  )
}

/** White table card: header row on #fafbfd, 1px #e8ecf3 dividers, px24 py16, gap20 */
export function DataTable({ columns, rows, rowTo, highlight, empty = 'Nothing here yet.', emptyTitle, onClear, className = '' }) {
  return (
    <div className={cx('overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)]', className)}>
      <div className="flex gap-5 bg-[#fafbfd] px-6 py-4">
        {columns.map((c) => (
          <div key={c.key} className={cx('shrink-0 text-[12px] font-semibold whitespace-nowrap text-muted', c.className)} style={{ width: c.width }}>
            {c.label}
          </div>
        ))}
      </div>
      {rows.length === 0 && (
        <NoMatches className="border-t border-line" text={emptyTitle ?? (onClear ? 'No matches' : 'Nothing here yet')} sub={empty} onClear={onClear} />
      )}
      {rows.map((r, i) => {
        const hot = highlight ? highlight(r, i) : false
        const content = columns.map((c) => (
          <div key={c.key} className={cx('flex shrink-0 items-center text-[14px] font-medium whitespace-nowrap text-ink', c.className)} style={{ width: c.width }}>
            {c.render ? c.render(r, hot) : r[c.key]}
          </div>
        ))
        const cls = cx('flex items-center gap-5 border-t border-line px-6 py-4 transition', hot ? 'bg-[#f7f9ff]' : 'hover:bg-[#f7f9ff]')
        const to = rowTo?.(r)
        return to ? <Link key={r.id ?? i} to={to} className={cls}>{content}</Link> : <div key={r.id ?? i} className={cls}>{content}</div>
      })}
    </div>
  )
}

/** Round 36px chevron button used at the end of table rows */
export function RowChevron({ on }) {
  return (
    <span className={cx('flex size-9 items-center justify-center rounded-[18px]', on ? 'bg-navy text-white' : 'bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.06)]')}>
      <Icon name="chev-right" size={15} />
    </span>
  )
}

/** Avatar with white ring (border-2) and given bg */
export function RingAvatar({ initials, bg = 'bg-pink-200', size = 40, text = 13, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-navy', bg, className)}
      style={{ width: size, height: size, fontSize: text }}
    >
      {initials}
    </span>
  )
}

/** Avatar + two-line identity (bold 14 / medium 12) */
export function IdCell({ initials, bg, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <RingAvatar initials={initials} bg={bg} />
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="text-[12px] font-medium text-muted">{sub}</p>
      </div>
    </div>
  )
}

/** White card r28 p24 with soft shadow */
export function Panel({ className = '', children, ...rest }) {
  return (
    <div className={cx('rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)]', className)} {...rest}>
      {children}
    </div>
  )
}

export function PanelHead({ title, subtitle, right, className = '', titleClass = 'text-ink', subClass = 'text-muted' }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
        <p className={cx('text-[17px] font-bold', titleClass)}>{title}</p>
        {subtitle && <p className={cx('text-[12px] font-medium', subClass)}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/* ───────── Page header (search + bell placement varies per frame) ───────── */

export function Search() {
  useCtrlK()
  return (
    <label className="flex h-[50px] w-[240px] shrink-0 items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
      <Icon name="search" size={18} className="text-muted" />
      <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
      <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
    </label>
  )
}

export function Bell() {
  return (
    <Link to="/notifications" aria-label="Notifications" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
      <Icon name="bell" size={18.5} />
    </Link>
  )
}

/**
 * Round back button (same 44px white circle as the bell). Goes to the previous page when the app has history,
 * otherwise to `to` (e.g. the page was opened from a shared link or a new tab).
 */
export function BackButton({ to = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate()
  const go = () => {
    const idx = typeof window !== 'undefined' ? window.history.state?.idx : 0
    if (idx > 0) navigate(-1)
    else navigate(to)
  }
  return (
    <button type="button" onClick={go} aria-label={label} title={label}
      className={cx('flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] transition hover:bg-tile focus-visible:outline-2 focus-visible:outline-blue', className)}>
      <Icon name="arrow" size={18} className="rotate-180" />
    </button>
  )
}

/**
 * Heading block + right actions. `before` sits between search and bell; `search={false}` drops the pill.
 * `back` (optional): a fallback path — shows a back button left of the heading. Pages that don't pass it are unchanged.
 */
export function Header({ breadcrumb, title, titleExtra, subtitle, actions, before, search = true, back }) {
  return (
    <header className="relative flex min-h-[83px] items-start gap-4">
      {back && <BackButton to={back} className="mt-[22px]" />}
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre text-muted uppercase">{breadcrumb}</p>
        <div className="flex items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-[-0.6px] whitespace-nowrap text-ink">{title}</h1>
          {titleExtra}
        </div>
        <p className="text-[14px] font-medium whitespace-nowrap text-muted">{subtitle}</p>
      </div>
      {/* Actions are pinned right and may overlap a long title, exactly as in the Figma frames */}
      <div className="absolute top-1 right-0 flex items-center gap-3">
        {search && <Search />}
        {before}
        <Bell />
        {actions}
      </div>
    </header>
  )
}

/* ───────── Overlays (viewport-fixed over the workspace panel, see ./_overlay) ───────── */

export function Scrim({ to, onClick }) {
  return <FixedScrim to={to} onClick={onClick} />
}

/** Centered-ish dialog: 540 wide, r30, p30, gap16. `top` = y offset in the panel. */
export function Dialog({ top = 140, icon, iconBg, iconColor, title, body, children }) {
  return (
    <FixedDialog
      top={top}
      left={360}
      width={540}
      className="flex flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]"
    >
      <span className={cx('flex size-[60px] items-center justify-center rounded-[30px]', iconBg)}>
        <Icon name={icon} size={26} className={iconColor} />
      </span>
      <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{title}</p>
      {body && <p className="text-[13px] leading-[20px] font-medium text-muted">{body}</p>}
      {children}
    </FixedDialog>
  )
}

/** Two equal dialog buttons (h46 r24). */
export function DialogButton({ variant = 'white', icon, to, onClick, children, className = '' }) {
  const v = {
    white: 'border border-line bg-white text-ink hover:bg-tile',
    danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fdf6f7]',
    navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700',
  }[variant]
  const cls = cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] px-5 text-[14px] font-semibold whitespace-nowrap', v, className)
  const inner = (<>{icon && <Icon name={icon} size={18} />}{children}</>)
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

/** Right drawer: 500×928 at (736,24), r32. */
export function Drawer({ title, subtitle, closeTo, children }) {
  useScrollLock()
  return (
    <aside data-overlay="drawer" className="fixed top-12 right-12 bottom-12 overflow-y-auto overscroll-contain z-40 flex w-[500px] flex-col gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</p>
          <p className="text-[12px] font-medium text-muted">{subtitle}</p>
        </div>
        <Link to={closeTo} aria-label="Close" className="flex size-9 items-center justify-center rounded-[18px] bg-panel text-ink hover:bg-chip">
          <Icon name="x" size={16} />
        </Link>
      </div>
      {children}
    </aside>
  )
}

/** Navy toast at the bottom-left of the panel. */
export function Toast({ children }) {
  return (
    <div data-overlay="toast" className="fixed bottom-[52px] left-[196px] z-30 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]">
      <span className="flex size-6 items-center justify-center rounded-[12px] bg-[#16845b]">
        <Icon name="check" size={13} className="text-white" />
      </span>
      <p className="text-[13px] font-semibold whitespace-nowrap text-white">{children}</p>
    </div>
  )
}

/** 22px checkbox used in tables / product cards (r7). */
export function Tick({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(!checked) }}
      className={cx('flex size-[22px] shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white', className)}
    >
      {checked && <Icon name="check" size={14} />}
    </button>
  )
}