// Shared building blocks for flow-proposal / flow-policy / flow-renewal-quotation.
// Values transcribed from the Figma outlines (Button/*, Chip/*, Field/*, Card head, Scrim …).
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SelectCompat } from '../../components/pickers'
import { FixedScrim } from '../catalogue/_overlay'
import { useHeaderSearch } from '../customer-tabs/_search'

export const SH_CARD = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
export const SH_SOFT = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'

/* ───────── Shell ───────── */

/** AppLayout + optional overlay rendered inside the workspace panel (scrim covers only the panel, as in Figma). */
export function Shell({ active, panelClass = '', overlay, children }) {
  return (
    <AppLayout active={active} panelClass={panelClass}>
      {children}
      {overlay}
    </AppLayout>
  )
}

export function Scrim({ onClick }) {
  return <FixedScrim onClick={onClick} />
}

/* ───────── Header ───────── */

export function Heading({ crumb, title, chips, sub }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre-wrap xl:whitespace-pre text-muted uppercase">{crumb}</p>
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] md:text-[30px] leading-[38px] font-bold tracking-[-0.6px] xl:whitespace-nowrap text-ink">{title}</h1>
        {chips}
      </div>
      <p className="text-[14px] font-medium whitespace-nowrap text-muted">{sub}</p>
    </div>
  )
}

export function Search() {
  useHeaderSearch() // Ctrl/Cmd+K focuses this pill; list pages subscribe with useHeaderSearch(setQuery)
  return (
    <label className={cx('flex h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px]', 'shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]')}>
      <Icon name="search" size={18} className="text-muted" />
      <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
      <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
    </label>
  )
}

export function Bell() {
  return (
    <button type="button" aria-label="Notifications" className={cx('flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT)}>
      <Icon name="bell" size={18.5} />
    </button>
  )
}

/** Page header row: heading left, actions right (search + bell optional). */
export function Header({ search = false, actions, ...heading }) {
  return (
    <header className="flex flex-col items-start gap-3 xl:flex-row xl:justify-between xl:gap-6">
      <Heading {...heading} />
      <div className="mt-1 flex shrink-0 items-center gap-3">
        {search && <Search />}
        <Bell />
        {actions}
      </div>
    </header>
  )
}

/* ───────── Buttons / chips ───────── */

const BTN = {
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700',
  white: 'border border-line bg-white text-ink hover:bg-tile',
  danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fdf6f6]',
}

/** Figma Button/*: h46, r24, pl16 pr20, gap8, 14 semibold. `to` = Link, `back` = navigate(-1). */
export function Btn({ variant = 'navy', icon, to, back, className = '', children, onClick, ...rest }) {
  const nav = useNavigate()
  const cls = cx(
    'inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] pr-5 text-[14px] font-semibold whitespace-nowrap transition',
    icon ? 'pl-4' : 'pl-5',
    BTN[variant], className,
  )
  const inner = (<>{icon && <Icon name={icon} size={18} />}{children}</>)
  if (to) return <Link to={to} className={cls} onClick={onClick} {...rest}>{inner}</Link>
  return <button type="button" className={cls} onClick={back ? () => nav(-1) : onClick} {...rest}>{inner}</button>
}

const CHIP = {
  gray: 'bg-[#eef1f5] text-ink-2',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  green: 'bg-[#e7f4ee] text-[#127650]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  blue: 'bg-[#e8f0fd] text-blue',
  pink: 'bg-[#fde8ec] text-[#b4325a]',
}
export function Pill({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', CHIP[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/* ───────── Cards ───────── */

export function Card({ className = '', children, ...rest }) {
  return <div className={cx('flex flex-col rounded-[28px] bg-white p-6', SH_CARD, className)} {...rest}>{children}</div>
}

export function CardHead({ title, sub, right, className = '' }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] leading-[21px] font-bold text-ink">{title}</p>
        {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export const Divider = ({ className = '' }) => <div className={cx('h-px shrink-0 bg-line', className)} />

/** Inline note strip (Figma "Note"): hug width, r16, px16 py12, 13 semibold */
const NOTE = { blue: 'bg-[#e8f0fd] text-blue', amber: 'bg-[#fbf1e1] text-[#8a5a12]', green: 'bg-[#e7f4ee] text-[#127650]' }
export function Note({ tone = 'blue', icon, className = '', children }) {
  return (
    <div className={cx('inline-flex items-center gap-2.5 self-start rounded-[16px] px-4 py-3 text-[13px] leading-4 font-semibold', NOTE[tone], className)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** Big status hero (green / violet / amber) with round white icon. */
const HERO = {
  green: 'bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]',
  violet: 'bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb]',
}
export function Hero({ tone = 'green', icon, iconColor = '#127650', iconSize = 34, title, sub, subColor = '#2f6b55', right, className = '' }) {
  return (
    <div className={cx('flex h-[132px] items-center gap-[22px] rounded-[34px] px-8', HERO[tone], className)}>
      <span className="flex size-[76px] shrink-0 items-center justify-center rounded-full bg-white">
        <Icon name={icon} size={iconSize} style={{ color: iconColor }} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-[24px] leading-[30px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        <p className="text-[13px] leading-5 font-medium" style={{ color: subColor }}>{sub}</p>
      </div>
      {right}
    </div>
  )
}

/* ───────── Form ───────── */

export function Field({ label, hint, className = '', children }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      <span className="text-[13px] leading-4 font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] leading-[15px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

const shell = (bg, focused) => cx(
  'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] px-4 text-[14px] font-semibold text-ink',
  bg === 'white' ? 'bg-white' : 'bg-panel',
  focused ? 'ring-2 ring-blue ring-inset' : 'focus-within:ring-2 focus-within:ring-blue focus-within:ring-inset',
)

/** Text input. prefix: "₹" / "%"; icon: leading icon; trailing: icon name (calendar …) */
export function TextBox({ bg, focused, prefix, icon, trailing, className = '', ...rest }) {
  return (
    <div className={cx(shell(bg, focused), (prefix || icon) && focused && 'pl-[18px]', className)}>
      {icon && <Icon name={icon} size={18} className="text-muted" />}
      {prefix && <span className="w-2.5 text-muted">{prefix}</span>}
      <input className="min-w-0 flex-1 bg-transparent font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint" {...rest} />
      {trailing && <Icon name={trailing} size={18} className="text-muted" />}
    </div>
  )
}

export function SelectBox({ bg, options = [], className = '', ...rest }) {
  return (
    <SelectCompat options={options} className={className} buttonClassName={bg === 'white' ? 'bg-white' : ''} {...rest} />
  )
}

export function TextArea({ className = '', ...rest }) {
  return (
    <textarea
      className={cx('h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] leading-[18px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint focus:ring-2 focus:ring-blue focus:ring-inset', className)}
      {...rest}
    />
  )
}

/** Figma Radio 22px: on = white with 6px navy ring; off = 1.5px #c3ccd8 */
export function Radio({ on }) {
  return (
    <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
  )
}

/** Figma Checkbox 24px r7 */
export function Check({ on, onChange, size = 24, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!on}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(!on) }}
      className={cx('flex shrink-0 items-center justify-center rounded-[7px]', on ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white', className)}
      style={{ width: size, height: size }}
    >
      {on && <Icon name="check" size={size === 24 ? 15 : 14} />}
    </button>
  )
}

/** Segmented control (Figma "Tabs": white r26 p5 gap4, 34h pills) */
export function Segmented({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('inline-flex shrink-0 items-center gap-1 self-start rounded-[26px] bg-white p-[5px]', SH_SOFT, className)}>
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onChange(it)}
          className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap transition', value === it ? 'bg-navy text-white' : 'text-slate hover:text-ink')}
        >
          {it}
        </button>
      ))}
    </div>
  )
}

/* ───────── Wizard bits ───────── */

export function DraftSaved() {
  return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
      <Icon name="check" size={16} className="text-[#127650]" />
      Draft saved
    </span>
  )
}

/** Divider + footer: [Back] ✓ Draft saved ……… [Next] */
export function StepFooter({ backTo, next }) {
  return (
    <>
      <Divider />
      <div className="flex h-[46px] items-center gap-3">
        {backTo && <Btn variant="white" to={backTo}>Back</Btn>}
        <DraftSaved />
        <span className="flex-1" />
        {next}
      </div>
    </>
  )
}

/** Bottom action bar (Figma "Action bar": h70 r30, pl24 pr12) */
export function ActionBar({ className = '', children }) {
  return (
    <div className={cx('flex h-[70px] items-center gap-3 rounded-[30px] bg-white pr-3 pl-6 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1)]', className)}>
      {children}
    </div>
  )
}

/** Completed-journey strip (L2 "Sale complete", N4 "How this renewal went"). Last step is green. */
export function Journey({ steps, itemW }) {
  return (
    <div className="flex items-center gap-2.5">
      {steps.map((s, i) => (
        <div key={s.label} className="contents">
          {i > 0 && <span className="h-0.5 flex-1 bg-navy" />}
          <div className="flex shrink-0 flex-col items-center gap-1.5" style={{ width: itemW }}>
            <span className={cx('flex size-10 items-center justify-center rounded-full text-white', i === steps.length - 1 ? 'bg-[#16845b]' : 'bg-navy')}>
              <Icon name="check" size={18} />
            </span>
            <span className="text-[12px] leading-[15px] font-bold whitespace-nowrap text-ink">{s.label}</span>
            {s.date && <span className="text-[11px] leading-[14px] font-medium text-muted">{s.date}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Key/value line (12 medium label · 13 bold value) */
export function KV({ k, v, kClass = 'text-muted', className = '' }) {
  return (
    <div className={cx('flex items-center justify-between gap-2', className)}>
      <span className={cx('text-[12px] font-medium', kClass)}>{k}</span>
      <span className="text-[13px] font-bold whitespace-nowrap text-ink">{v}</span>
    </div>
  )
}