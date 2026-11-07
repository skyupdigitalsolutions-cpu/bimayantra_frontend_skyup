// Shared primitives distilled from the Bimayantra Figma file.
// Every screen should compose these instead of re-declaring styles.
import { Link } from 'react-router-dom'
import Icon from './Icon'

import { extendTailwindMerge } from 'tailwind-merge'
// cx merges Tailwind classes so a className passed to a primitive overrides its defaults.
// Custom theme tokens are registered so e.g. `text-ink` and `text-[13px]` don't clobber each other.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: ['navy', 'navy-700', 'navy-900', 'ink', 'ink-2', 'slate', 'muted', 'faint', 'panel', 'panel-2', 'chip', 'tile', 'line', 'line-2',
        'pink-50', 'pink-100', 'pink-200', 'pink-300', 'pink-400', 'rose', 'rose-ink', 'blue', 'blue-50', 'blue-100',
        'violet', 'violet-50', 'violet-100', 'violet-200', 'amber-100', 'mint-100'],
    },
    classGroups: { shadow: [{ shadow: ['soft', 'navy', 'pink', 'card'] }] },
  },
})
const cx = (...c) => twMerge(c.filter(Boolean).join(' '))
export { cx }

/* ───────────────────────── Header ───────────────────────── */

export function SearchPill({ className = 'w-[240px]', placeholder = 'Search anything' }) {
  return (
    <label className={cx('flex h-[50px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-soft', className)}>
      <Icon name="search" size={18} className="text-ink" />
      <input
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint"
      />
      <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
    </label>
  )
}

export function IconButton({ icon, size = 44, iconSize = 18, badge, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={cx('relative flex shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-soft hover:bg-tile', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
      {badge && <span className="absolute top-[11px] right-[11px] size-[9px] rounded-full border-2 border-white bg-rose" />}
    </button>
  )
}

/**
 * Page heading block used on nearly every screen.
 *  breadcrumb: "SETTINGS / MY PROFILE"  · title · titleExtra (chip next to title)
 *  subtitle · actions (right side, after search + bell) · hideSearch
 */
export function PageHeader({ breadcrumb, title, titleExtra, subtitle, actions, hideSearch, searchClass, className = '' }) {
  return (
    <header className={cx('flex items-start justify-between gap-6', className)}>
      <div className="flex flex-col gap-1.5">
        {breadcrumb && (
          <p className="text-[12px] font-semibold tracking-[0.24px] whitespace-pre text-muted uppercase">{breadcrumb}</p>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-[-0.6px] text-ink">{title}</h1>
          {titleExtra}
        </div>
        {subtitle && <p className="text-[14px] font-medium text-muted">{subtitle}</p>}
      </div>
      <div className="mt-1 flex shrink-0 items-center gap-3">
        {!hideSearch && <SearchPill className={searchClass} />}
        {!hideSearch && <IconButton icon="bell" />}
        {actions}
      </div>
    </header>
  )
}

/* ───────────────────────── Buttons ───────────────────────── */

const BTN = {
  primary: 'bg-navy text-white shadow-navy hover:bg-navy-700',
  pink: 'bg-pink-hero text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.45)] hover:brightness-[1.03]',
  white: 'bg-white text-ink shadow-soft hover:bg-tile',
  outline: 'bg-white text-ink border border-line hover:bg-tile',
  ghost: 'text-ink hover:bg-white',
  danger: 'bg-rose text-white hover:brightness-95',
}
const SIZE = {
  sm: 'h-9 rounded-[18px] pr-3.5 pl-3 text-[13px] gap-2',      // 36px — "Save section"
  md: 'h-11 rounded-[22px] px-[18px] text-[14px] gap-2',      // 44px
  lg: 'h-[50px] rounded-[25px] px-[22px] text-[14px] gap-2.5', // 50px — header CTA / wizard next
}

/** <Button variant="primary|pink|white|outline|ghost|danger" size="sm|md|lg" icon="plus" to="/x" /> */
export function Button({ variant = 'primary', size = 'md', icon, iconRight, to, className = '', children, ...rest }) {
  const cls = cx(
    'inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition disabled:opacity-50',
    BTN[variant], SIZE[size], className,
  )
  const iconSize = size === 'sm' ? 16 : 18
  const inner = (
    <>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Round navy action button (phone / chat / quote on renewal cards) */
export function RoundAction({ icon, size = 40, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={cx('flex shrink-0 items-center justify-center rounded-full bg-navy text-white hover:bg-navy-700', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={18} />
    </button>
  )
}

/* ───────────────────────── Surfaces ───────────────────────── */

/** White card, radius 28, soft shadow. */
export function Card({ className = '', as: As = 'div', children, ...rest }) {
  return (
    <As className={cx('rounded-[28px] bg-white px-6 py-5 drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)]', className)} {...rest}>
      {children}
    </As>
  )
}

/** Card heading row: title 17/bold + optional sub 12/medium + right slot */
export function CardHead({ title, subtitle, right, className = '' }) {
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

/* ───────────────────────── Data display ───────────────────────── */

const AV_BG = { pink: 'bg-pink-200', blue: 'bg-blue-100', violet: 'bg-violet-100', amber: 'bg-amber-100', mint: 'bg-mint-100', white: 'bg-white' }

export function Avatar({ initials, size = 36, tone = 'pink', ring = false, className = '' }) {
  return (
    <div
      className={cx('flex shrink-0 items-center justify-center rounded-full font-bold text-navy', AV_BG[tone] ?? tone, ring && 'border-[3px] border-white shadow-[0px_6px_14px_-4px_rgba(19,41,75,0.12)]', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.3) }}
    >
      {initials}
    </div>
  )
}

const CHIP = {
  gray: 'bg-chip text-slate',
  blue: 'bg-blue-50 text-blue',
  violet: 'bg-violet-50 text-violet',
  pink: 'bg-pink-100 text-rose',
  green: 'bg-[#e3f5ec] text-[#1d7a4f]',
  amber: 'bg-[#fdf1dc] text-[#9a5b0b]',
  red: 'bg-[#fde4e4] text-[#c0282d]',
  navy: 'bg-navy text-white',
  white: 'bg-white text-ink border border-line',
}

/** Small status pill. <Chip tone="violet" icon="clock">KYC pending review</Chip> */
export function Chip({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-[5px] rounded-[14px] px-3 py-[5px] text-[12px] font-semibold whitespace-nowrap', icon && 'pl-2', CHIP[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Selectable pill (Authorised categories, filters). */
export function ToggleChip({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[18px] border py-2 text-[13px] font-semibold whitespace-nowrap',
        selected ? 'border-blue bg-blue-50 pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted hover:text-ink',
        className,
      )}
    >
      {selected && <Icon name="check" size={14} />}
      {children}
    </button>
  )
}

/** Segmented tabs (Health 5 / Motor 2 …). items: [{key,label,count}] */
export function Tabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('flex flex-wrap items-center gap-2', className)}>
      {items.map((t) => {
        const on = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            className={cx(
              'inline-flex h-10 items-center gap-2 rounded-[20px] px-4 text-[13px] font-semibold',
              on ? 'bg-navy text-white' : 'bg-white text-ink shadow-soft hover:bg-tile',
            )}
          >
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[8px] px-1.5 py-px text-[11px]', on ? 'bg-white/20' : 'bg-chip text-muted')}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Label/value box (Renews / Premium) */
export function InfoBox({ label, value, className = '' }) {
  return (
    <div className={cx('flex min-w-0 flex-1 flex-col gap-1 rounded-[14px] bg-panel-2 px-3 py-2.5', className)}>
      <p className="text-[11px] font-medium text-blue">{label}</p>
      <p className="text-[13px] font-semibold whitespace-nowrap text-ink">{value}</p>
    </div>
  )
}

/** Key/value row used in summary cards */
export function KV({ k, v, className = '' }) {
  return (
    <div className={cx('flex items-center justify-between gap-4 py-1.5 text-[12px]', className)}>
      <span className="font-medium text-muted">{k}</span>
      <span className="font-semibold text-ink">{v}</span>
    </div>
  )
}

export function ProgressBar({ value, className = 'w-[420px]', track = 'bg-white/70', bar = 'bg-navy' }) {
  return (
    <div className={cx('h-2.5 overflow-hidden rounded-[5px]', track, className)}>
      <div className={cx('h-full rounded-[5px]', bar)} style={{ width: `${value}%` }} />
    </div>
  )
}

/* ───────────────────────── Forms ───────────────────────── */

/** Labelled field wrapper: label 13/semibold, gap 8, optional hint 12/medium */
export function Field({ label, hint, className = '', children }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      {label && <span className="text-[13px] font-semibold text-ink">{label}</span>}
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

const inputShell = 'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue/30'

/** Input on #f4f6fb, h50, radius 16. leading/trailing: icon name or node */
export function Input({ leading, trailing, prefix, className = '', ...rest }) {
  const render = (x) => (typeof x === 'string' ? <Icon name={x} size={18} className="text-ink" /> : x)
  return (
    <div className={cx(inputShell, className)}>
      {leading && render(leading)}
      {prefix && <span className="text-muted">{prefix}</span>}
      <input className="min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:font-medium placeholder:text-faint" {...rest} />
      {trailing && render(trailing)}
    </div>
  )
}

export function Select({ options = [], className = '', ...rest }) {
  return (
    <div className={cx(inputShell, 'relative', className)}>
      <select className="min-w-0 flex-1 appearance-none bg-transparent font-semibold outline-none" {...rest}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <Icon name="chev-down" size={18} className="pointer-events-none text-ink" />
    </div>
  )
}

export function Textarea({ className = '', ...rest }) {
  return (
    <textarea
      className={cx('min-h-[96px] w-full rounded-[16px] bg-panel px-4 py-3.5 text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint focus:ring-2 focus:ring-blue/30', className)}
      {...rest}
    />
  )
}

/** Figma: Components › Checkbox (24px, radius 7) */
export function Checkbox({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={() => onChange?.(!checked)}
      className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px] border-[1.5px]', checked ? 'border-navy bg-navy text-white' : 'border-[#c9d1de] bg-white', className)}
    >
      {checked && <Icon name="check" size={16} strokeWidth={2.2} />}
    </button>
  )
}

/** Figma: Components › Toggle (44×26 knob switch + label) */
export function Toggle({ checked, onChange, label, className = '' }) {
  return (
    <button type="button" role="switch" aria-checked={!!checked} onClick={() => onChange?.(!checked)} className={cx('inline-flex items-center gap-3', className)}>
      <span className={cx('relative h-[26px] w-[44px] rounded-full transition-colors', checked ? 'bg-navy' : 'bg-[#d5dbe6]')}>
        <span className={cx('absolute top-[3px] size-5 rounded-full bg-white shadow transition-all', checked ? 'left-[21px]' : 'left-[3px]')} />
      </span>
      {label && <span className="text-[13px] font-semibold text-ink">{label}</span>}
    </button>
  )
}

/** Inline info banner (blue / amber / pink / green) */
export function Notice({ tone = 'blue', icon = 'lock', className = '', children }) {
  const tones = { blue: 'bg-blue-50 text-blue', amber: 'bg-[#fdf1dc] text-[#9a5b0b]', pink: 'bg-pink-100 text-rose', green: 'bg-[#e3f5ec] text-[#1d7a4f]', violet: 'bg-violet-50 text-violet' }
  return (
    <div className={cx('inline-flex items-center gap-2.5 rounded-[14px] px-4 py-2.5 text-[13px] font-medium', tones[tone], className)}>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </div>
  )
}

/* ───────────────────────── Modal ───────────────────────── */

/** Centered dialog over a dimmed screen. Used by flow states (record payment, log contact …). */
export function Modal({ open = true, onClose, width = 560, className = '', children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(19,41,75,0.35)] p-6" onClick={onClose}>
      <div
        className={cx('max-h-[90vh] overflow-auto rounded-[32px] bg-white p-7 shadow-[0px_30px_60px_-12px_rgba(19,41,75,0.35)]', className)}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

/* ───────────────────────── Wizard ───────────────────────── */

/**
 * Stepper (quotation / proposal / add-product flows).
 * steps: ['Customer','Type',…]; current: 0-based index of active step.
 */
export function Stepper({ steps, current, className = '' }) {
  return (
    <div className={cx('flex items-start rounded-[28px] bg-white px-5 py-[18px] drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)]', className)}>
      {steps.map((s, i) => {
        const done = i < current
        const on = i === current
        return (
          <div key={s} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-[64px] flex-col items-center gap-2">
              <span
                className={cx(
                  'flex size-[30px] items-center justify-center rounded-full text-[12px] font-bold',
                  done && 'bg-navy text-white',
                  on && 'border-2 border-blue bg-white text-blue',
                  !done && !on && 'border border-line bg-white text-muted',
                )}
              >
                {done ? <Icon name="check" size={16} strokeWidth={2} /> : i + 1}
              </span>
              <span className={cx('text-center text-[11px] whitespace-nowrap', on || done ? 'font-semibold text-ink' : 'font-medium text-muted')}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <span className={cx('mt-[15px] h-[2px] flex-1 rounded-full', done ? 'bg-navy' : 'bg-line')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Pink "Your quotation / summary" side card */
export function SummaryCard({ title, subtitle, badge, rows = [], children, className = '' }) {
  return (
    <div className={cx('rounded-[28px] bg-pink-hero p-[18px] shadow-pink', className)}>
      <div className="flex items-start justify-between px-1">
        <div>
          <p className="text-[17px] font-bold text-ink">{title}</p>
          {subtitle && <p className="text-[12px] font-medium text-rose-ink">{subtitle}</p>}
        </div>
        {badge && <Chip tone="white" className="border-0 text-rose">{badge}</Chip>}
      </div>
      {rows.length > 0 && (
        <div className="mt-3 rounded-[18px] bg-white/80 px-3 py-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5 text-[12px]">
              <span className="font-medium text-rose-ink">{k}</span>
              <span className={cx('font-bold', v ? 'text-ink' : 'text-muted')}>{v || '—'}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

/** Simple table with the design's header style. columns: [{key,label,className,render}] */
export function Table({ columns, rows, onRowClick, className = '' }) {
  return (
    <div className={cx('overflow-hidden rounded-[28px] bg-white drop-shadow-[0px_8px_12px_rgba(19,41,75,0.05)]', className)}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line-2">
            {columns.map((c) => (
              <th key={c.key} className={cx('px-5 py-3.5 text-[11px] font-semibold tracking-[0.3px] text-muted uppercase', c.headClass)}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id ?? i}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={cx('border-b border-line-2 last:border-0', onRowClick && 'cursor-pointer hover:bg-panel-2')}
            >
              {columns.map((c) => (
                <td key={c.key} className={cx('px-5 py-3.5 text-[13px] font-medium text-ink', c.className)}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Empty / success state block */
export function SuccessState({ title, subtitle, icon = 'check', actions, className = '' }) {
  return (
    <div className={cx('flex flex-col items-center gap-3 text-center', className)}>
      <span className="flex size-[72px] items-center justify-center rounded-full bg-[#e3f5ec] text-[#1d7a4f]">
        <Icon name={icon} size={34} strokeWidth={2} />
      </span>
      <p className="text-[22px] font-bold text-ink">{title}</p>
      {subtitle && <p className="max-w-[420px] text-[14px] font-medium text-muted">{subtitle}</p>}
      {actions && <div className="mt-2 flex gap-3">{actions}</div>}
    </div>
  )
}
