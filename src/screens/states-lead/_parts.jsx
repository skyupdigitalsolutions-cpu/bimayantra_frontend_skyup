// Overlays for the lead-lifecycle states (LS1–LS6). The underlying screen is the shared
// Lead detail layout from ../sales/_lead.jsx.
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { PANEL_SCRIM, DRAWER_BOX, DIALOG_MAX, useFitTop, useLockScroll } from '../sales/_overlay'

export { default as LeadDetailBase, Toast } from '../sales/_lead'

/** Scrim over the workspace panel only (Figma "Scrim" 1260×976, #0e1f3b @ 40%). Click → `to`. */
export function Scrim({ to, onClose }) {
  const nav = useNavigate()
  useLockScroll()
  return <div data-overlay="scrim" className={cx(PANEL_SCRIM, 'z-30 bg-[#0e1f3b]/40')} onClick={() => (onClose ? onClose() : to && nav(to))} />
}

/** Centered dialog (540 wide, r30, p30, gap16) positioned like the frame. */
export function Dialog({ top, className = '', children }) {
  const ref = useFitTop(top)
  return (
    <div
      ref={ref}
      role="dialog"
      data-overlay="dialog"
      className={cx('fixed left-[516px] z-40 flex w-[540px] flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', DIALOG_MAX, className)}
      style={{ top: top + 24 }}
    >
      {children}
    </div>
  )
}

/** Right drawer (500×928 @ 736,24, r32). */
export function Drawer({ children }) {
  return (
    <div role="dialog" data-overlay="drawer" className={cx(DRAWER_BOX, 'z-40 flex w-[500px] flex-col gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]')}>
      {children}
    </div>
  )
}

export function DialogTitle({ children }) {
  return <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{children}</p>
}

export function DialogText({ children }) {
  return <p className="w-full text-[13px] leading-5 font-medium text-muted">{children}</p>
}

/** 60px tinted icon disc above dialog titles */
export function DialogIcon({ icon, bg, color }) {
  return (
    <span className="flex size-[60px] items-center justify-center rounded-full" style={{ background: bg, color }}>
      <Icon name={icon} size={26} />
    </span>
  )
}

/** Radio card (selected: #f3f7ff + blue stroke, navy 6px ring) */
export function RadioOption({ title, sub, selected, disabled, onSelect, to }) {
  const nav = useNavigate()
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => (to ? nav(to) : onSelect?.())}
      className={cx(
        'flex w-full items-center gap-3 rounded-[14px] p-3 text-left transition',
        selected ? 'border border-blue bg-[#f3f7ff]' : 'bg-panel hover:bg-[#edf1f8]',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-panel',
      )}
    >
      <span
        className={cx('size-[22px] shrink-0 rounded-full bg-white', selected ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[13px] font-bold text-ink">{title}</span>
        {sub && <span className="text-[11px] font-medium text-muted">{sub}</span>}
      </span>
    </button>
  )
}

export function FieldLabel({ children }) {
  return <span className="text-[13px] font-semibold text-ink">{children}</span>
}

/** Label + 50px input on #f4f6fb */
export function TextField({ label, value, onChange, trailing, className = '', type = 'text', error, min }) {
  return (
    <label className={cx('flex flex-col gap-2', className)}>
      <FieldLabel>{label}</FieldLabel>
      <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 focus-within:ring-2 focus-within:ring-blue/30">
        <input
          type={type}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none"
        />
        {trailing && <Icon name={trailing} size={18} className="text-muted" />}
      </span>
      {error && <span className="text-[12px] font-medium text-[#b4323c]">{error}</span>}
    </label>
  )
}

/** Label + 50px native select styled like the inputs */
export function SelectField({ label, value, onChange, options, hint, className = '', error }) {
  return (
    <label className={cx('flex flex-col gap-2', className)}>
      <FieldLabel>{label}</FieldLabel>
      <span className="relative flex h-[50px] items-center rounded-[16px] bg-panel px-4 focus-within:ring-2 focus-within:ring-blue/30">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 appearance-none bg-transparent text-[14px] font-semibold text-ink outline-none"
        >
          {options.map((o) => (typeof o === 'object' ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o}>{o}</option>))}
        </select>
        <Icon name="chev-down" size={18} className="pointer-events-none text-muted" />
      </span>
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
      {error && <span className="text-[12px] font-medium text-[#b4323c]">{error}</span>}
    </label>
  )
}

/** Label + 96px textarea */
export function AreaField({ label, value, onChange, className = '', error }) {
  return (
    <label className={cx('flex flex-col gap-2', className)}>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24 resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none focus:ring-2 focus:ring-blue/30"
      />
      {error && <span className="text-[12px] font-medium text-[#b4323c]">{error}</span>}
    </label>
  )
}

const FOOT = {
  outline: 'border border-line bg-white text-ink hover:bg-tile',
  navy: 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700',
  danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fbebec]',
}

/** Full-width 46px dialog footer button */
export function FootButton({ variant = 'outline', icon, to, onClick, disabled, className = '', children }) {
  const cls = cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] px-5 text-[14px] font-semibold whitespace-nowrap transition disabled:opacity-60', FOOT[variant], className)
  const inner = (<>{icon && <Icon name={icon} size={18} />}{children}</>)
  if (!to || onClick) return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{inner}</button>
  return <Link to={to} className={cls}>{inner}</Link>
}