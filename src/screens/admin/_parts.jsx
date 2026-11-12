// Shared SkyUp Admin shell (rail + header) and building blocks used by the
// admin, flow-skyup and states-admin folders.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import logo from '../../assets/logo-mark.png'
import { PANEL_SCRIM, PANEL_X, DIALOG_MAX, useFitTop, useLockScroll } from '../sales/_overlay'

/* ───────────── Rail ───────────── */

export const ADMIN_NAV = [
  { key: 'home', icon: 'grid', to: '/admin', label: 'Home' },
  { key: 'accounts', icon: 'users', to: '/admin/accounts', label: 'Advisor accounts' },
  { key: 'support', icon: 'eye', to: '/admin/support', label: 'Support access' },
  { key: 'approvals', icon: 'check', to: '/admin/approvals', label: 'Waiting from before' },
  { key: 'kyc', icon: 'shield', to: '/admin/kyc', label: 'Advisor KYC' },
  { key: 'flags', icon: 'alert', to: '/admin/flags', label: 'Agent-code flags' },
  { key: 'corrections', icon: 'edit', to: '/admin/corrections', label: 'Product corrections' },
  { key: 'catalogue', icon: 'box', to: '/admin/catalogue', label: 'Catalogue' },
  { key: 'templates', icon: 'chat', to: '/admin/templates', label: 'Message templates' },
  { key: 'users', icon: 'user-plus', to: '/admin/users', label: 'SkyUp users' },
  { key: 'config', icon: 'list', to: '/admin/config', label: 'Configuration' },
  { key: 'audit', icon: 'clock', to: '/admin/audit', label: 'Audit log' },
]

/* Keeps the rail list position across admin pages, like the main Sidebar. */
let railScroll = 0

/** Scrollable rail list: brings the active item into view and reports whether more items sit above / below. */
function useRailScroll(active) {
  const ref = useRef(null)
  const [more, setMore] = useState({ up: false, down: false })
  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setMore({ up: el.scrollTop > 2, down: el.scrollTop + el.clientHeight < el.scrollHeight - 2 })
    railScroll = el.scrollTop
  }, [])
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = railScroll
    const item = el.querySelector('[data-active="true"]')
    if (item) {
      const top = item.offsetTop - el.offsetTop
      const pad = 36 // keep clear of the arrow buttons
      if (top - pad < el.scrollTop) el.scrollTop = Math.max(0, top - pad)
      else if (top + item.offsetHeight + pad > el.scrollTop + el.clientHeight) el.scrollTop = top + item.offsetHeight + pad - el.clientHeight
    }
    measure()
  }, [active, measure])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', measure)
    }
  }, [measure])
  const scrollBy = (dir) => ref.current?.scrollBy({ top: dir * 140, behavior: 'smooth' })
  return { ref, more, scrollBy }
}

function RailArrow({ dir, show, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'More pages above' : 'More pages below'}
      tabIndex={show ? 0 : -1}
      className={cx(
        'absolute inset-x-0 z-10 flex h-9 items-center justify-center text-white transition-opacity duration-200',
        dir < 0 ? 'top-0 bg-linear-to-b from-[#271d57] via-[#271d57]/90' : 'bottom-0 bg-linear-to-t from-[#18123a] via-[#18123a]/90',
        'to-transparent',
        show ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <span className={cx('flex size-6 items-center justify-center rounded-full bg-white/15 hover:bg-white/25', show && dir > 0 && 'animate-bounce')}>
        <Icon name="chev-down" size={16} strokeWidth={2} className={dir < 0 ? 'rotate-180' : ''} />
      </span>
    </button>
  )
}

/** Figma "Sidebar (Admin)": 84px icon rail on a violet gradient. 868px tall per Figma; on short
 *  viewports it shrinks and the icon list scrolls, with up/down arrows when more items exist. */
export function AdminRail({ active }) {
  const { ref, more, scrollBy } = useRailScroll(active)
  return (
    <aside className="flex w-[100px] shrink-0 flex-col gap-4">
      <Link
        to="/admin"
        aria-label="SkyUp Admin home"
        className="flex size-[84px] items-center justify-center rounded-[42px] bg-white shadow-[0px_14px_30px_-8px_rgba(19,41,75,0.3)]"
      >
        <img src={logo} alt="BimaYantra" className="h-[46px] w-auto" />
      </Link>
      <nav className="relative flex h-[min(868px,calc(100vh-156px))] min-h-[420px] w-[84px] flex-col rounded-[42px] bg-linear-to-b from-[#2a1f5c] to-[#14102f] pt-[30px] pb-7 shadow-[0px_20px_40px_-10px_rgba(42,31,92,0.2)]">
        <div className="relative flex min-h-0 flex-col">
          <RailArrow dir={-1} show={more.up} onClick={() => scrollBy(-1)} />
          <ul ref={ref} className="flex min-h-0 flex-col gap-[18px] overflow-y-auto pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ADMIN_NAV.map((n) => {
              const on = n.key === active
              return (
                <li key={n.key} className="relative shrink-0" data-active={on || undefined}>
                  {on && <span className="absolute top-[23px] -left-[11px] size-1.5 rounded-full bg-[#f7b9c4]" />}
                  <NavLink
                    to={n.to}
                    title={n.label}
                    aria-label={n.label}
                    className={cx('flex size-[52px] items-center justify-center rounded-[26px]', on ? 'bg-white/10' : 'hover:bg-white/5')}
                  >
                    <Icon name={n.icon} size={24} className={on ? 'text-white' : 'text-white/60'} />
                  </NavLink>
                </li>
              )
            })}
          </ul>
          <RailArrow dir={1} show={more.down} onClick={() => scrollBy(1)} />
        </div>
        <div className="mt-auto flex shrink-0 flex-col items-center gap-5 pt-4">
          <span className="flex size-12 items-center justify-center rounded-[24px] border-2 border-white bg-violet-100 text-[15px] font-bold text-navy">
            MI
          </span>
          <Link to="/login" aria-label="Log out" className="text-white/60 hover:text-white">
            <Icon name="logout" size={24} />
          </Link>
        </div>
      </nav>
    </aside>
  )
}

/** Page frame for every SkyUp Admin screen (same geometry as AppLayout). */
/** Phones: logo and the admin menu as one row that scrolls sideways (the rail is for tablets and desktops). */
function AdminMobileBar({ active }) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 bg-white px-4 pt-4 pb-3 shadow-[0px_6px_16px_-10px_rgba(19,41,75,0.15)]">
      <Link to="/admin" aria-label="SkyUp Admin home" className="flex items-center gap-2">
        <img src={logo} alt="BimaYantra" className="h-[28px] w-auto" />
      </Link>
      <nav className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-2">
          {ADMIN_NAV.map((n) => {
            const on = n.key === active
            return (
              <li key={n.key} className="shrink-0">
                <NavLink to={n.to} aria-label={n.label} className={cx('flex h-9 items-center gap-1.5 rounded-[18px] px-3 text-[12px] font-semibold', on ? 'bg-[#2a1f5c] text-white' : 'bg-panel text-ink')}>
                  <Icon name={n.icon} size={16} />{n.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export function AdminLayout({ active, children, panelClass = '', overlay }) {
  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row md:gap-5 md:py-5 md:pr-5 md:pl-5 xl:min-w-[1280px] xl:gap-7 xl:py-6 xl:pr-6 xl:pl-7">
      <div className="md:hidden"><AdminMobileBar active={active} /></div>
      <div className="sticky top-7 hidden h-fit self-start md:block">
        <AdminRail active={active} />
      </div>
      <main className={cx('relative min-w-0 flex-1 bg-panel px-4 pt-4 pb-10 md:rounded-[32px] md:p-6 xl:min-h-[976px] xl:rounded-[40px] xl:px-10 xl:pt-9 xl:pb-10', panelClass)}>{children}</main>
      {overlay}
    </div>
  )
}

/* ───────────── Header ───────────── */

export function BellButton({ className = '' }) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className={cx('flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}
    >
      <Icon name="bell" size={18.5} />
    </button>
  )
}

export function AdminBadge() {
  return (
    <span className="flex h-[31px] shrink-0 items-center gap-2 rounded-[20px] bg-violet-50 px-3.5 text-[12px] font-bold text-violet">
      <Icon name="lock" size={14} />
      Admin · Meena Iyer
    </span>
  )
}

/** Violet breadcrumb · 30px title · muted subtitle + admin badge, bell, actions */
export function AdminHeader({ crumb = 'SKYUP ADMIN', crumbClass = 'text-violet', title, titleExtra, subtitle, actions, badge = true }) {
  return (
    <header className="flex flex-col items-start gap-3 xl:flex-row xl:justify-between xl:gap-6">
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className={cx('text-[12px] font-semibold tracking-[0.2px] whitespace-pre', crumbClass)}>{crumb}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[24px] font-bold tracking-[-0.6px] text-ink md:text-[30px] xl:whitespace-nowrap">{title}</h1>
          {titleExtra}
        </div>
        {subtitle && <p className="text-[14px] font-medium text-muted xl:whitespace-nowrap">{subtitle}</p>}
      </div>
      <div className="mt-1 flex max-w-full flex-wrap items-center gap-3 xl:shrink-0 xl:flex-nowrap">
        {badge && <AdminBadge />}
        <BellButton />
        {actions}
      </div>
    </header>
  )
}

/* ───────────── Buttons ───────────── */

const HB = {
  pink: 'bg-linear-to-b from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] pl-4 pr-5',
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] pl-4 pr-5',
  outline: 'border border-line bg-white text-ink pl-4 pr-5',
  danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] pl-4 pr-5',
}

/** Header-size button: h46, r24, 14/semibold. */
export function HButton({ variant = 'outline', icon, to, onClick, className = '', children }) {
  const cls = cx('inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] text-[14px] font-semibold whitespace-nowrap', HB[variant], className)
  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  )
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

const SB = {
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]',
  outline: 'border border-line bg-white text-ink',
  ghost: 'text-ink',
  pink: 'bg-linear-to-b from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]',
  danger: 'bg-[#b4323c] text-white shadow-[0px_10px_20px_-6px_rgba(180,50,60,0.3)]',
  dangerOutline: 'border border-[#f2c4c8] bg-white text-[#b4323c]',
}

/** Small button: h36, r18, 13/semibold. */
export function SButton({ variant = 'outline', icon, to, onClick, className = '', children, ...rest }) {
  const cls = cx(
    'inline-flex h-9 shrink-0 items-center gap-2 rounded-[18px] text-[13px] font-semibold whitespace-nowrap',
    icon ? 'pr-3.5 pl-3' : 'px-3.5',
    SB[variant],
    className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  )
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <button type="button" onClick={onClick} className={cls} {...rest}>{inner}</button>
}

/* ───────────── Surfaces ───────────── */

export const CARD_SHADOW = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

export function ACard({ className = '', children, ...rest }) {
  return (
    <div className={cx('rounded-[28px] bg-white p-6', CARD_SHADOW, className)} {...rest}>
      {children}
    </div>
  )
}

export function ACardHead({ title, subtitle, right, className = '' }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {subtitle && <p className="text-[12px] font-medium text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

const PILL = {
  violet: 'bg-violet-50 text-violet',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  green: 'bg-[#e7f4ee] text-[#127650]',
  blue: 'bg-[#e8f0fd] text-blue',
  red: 'bg-[#fdecee] text-[#b4323c]',
  gray: 'bg-chip text-slate',
  pink: 'bg-pink-100 text-[#b4325a]',
  white: 'bg-white text-ink',
}

/** 25px status chip: r14, pad 5/12 (8 with icon), 12/semibold. */
export function Pill({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', PILL[tone] ?? tone, className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Round tinted icon disc */
export function IconDisc({ icon, size = 44, iconSize = 20, className = 'bg-tile', iconClass = 'text-ink' }) {
  return (
    <span className={cx('flex shrink-0 items-center justify-center rounded-full', className)} style={{ width: size, height: size }}>
      <Icon name={icon} size={iconSize} className={iconClass} />
    </span>
  )
}

/** Modal scrim covering the whole page */
export function Scrim({ children, className = '' }) {
  useLockScroll()
  return <div data-overlay="scrim" className={cx('fixed inset-0 z-50 bg-[rgba(19,41,75,0.35)]', className)}>{children}</div>
}

/* ───────────── Tabs / overlays ───────────── */

/** White pill track with navy active segment and count badges. items: [{key,label,count,to}] */
export function SegTabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('inline-flex gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]', className)}>
      {items.map((t) => {
        const on = t.key === value
        const cls = cx('inline-flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap', on ? 'bg-navy text-white' : 'text-slate hover:text-ink')
        const inner = (
          <>
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </>
        )
        return t.to ? (
          <Link key={t.key} to={t.to} className={cls}>{inner}</Link>
        ) : (
          <button key={t.key} type="button" onClick={() => onChange?.(t.key)} className={cls}>{inner}</button>
        )
      })}
    </div>
  )
}

/** Scrim over the workspace panel only (Figma "Scrim" 1260×976 #0e1f3b/0.4). Children are positioned inside. */
export function PanelScrim({ children, onClose }) {
  useLockScroll()
  return (
    <div data-overlay="scrim" className={cx(PANEL_SCRIM, 'z-40 bg-[rgba(14,31,59,0.4)]')} onClick={onClose}>
      {children}
    </div>
  )
}

/** White dialog card at its Figma spot (top/left measured from the panel), viewport-fixed and kept on screen. */
export function Dialog({ top = 0, left = 0, className = '', style, children }) {
  const ref = useFitTop(top)
  return (
    <div
      ref={ref}
      data-overlay="dialog"
      role="dialog"
      className={cx('fixed rounded-[28px] bg-white p-8 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', DIALOG_MAX, className)}
      style={{ top: top + 24, left: PANEL_X + left, ...style }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

/** 6 OTP boxes 52×58; the first empty box is focused (blue ring). */
export function OtpBoxes({ initial = ['3', '9', '1', '', '', ''] }) {
  const [digits, setDigits] = useState(initial)
  const refs = useRef([])
  const firstEmpty = digits.findIndex((d) => !d)
  return (
    <div className="flex gap-2.5">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1)
            const next = [...digits]
            next[i] = v
            setDigits(next)
            if (v) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i]) refs.current[i - 1]?.focus()
          }}
          className={cx(
            'h-[58px] w-[52px] rounded-[14px] text-center text-[20px] font-bold text-ink outline-none',
            i === firstEmpty ? 'border-2 border-blue bg-white' : 'bg-panel focus:border-2 focus:border-blue focus:bg-white',
          )}
        />
      ))}
    </div>
  )
}