// Shared building blocks for the Sales section (leads, customers, best fit, quotations, proposals).
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'

/** className for <PageHeader> so the heading column never wraps/shrinks (Figma headings are single-line) */
export const NOWRAP = '[&>div:first-child]:w-0 [&>div:first-child]:flex-1 [&>div:first-child_*]:whitespace-nowrap'

/* ───────────── Chips (Figma "Chip/*" — exact hexes used in this section) ───────────── */

const STONE = {
  gray: 'bg-[#eef1f5] text-[#44526a]',
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  high: 'bg-[#fde8ec] text-[#b4325a]',
  red: 'bg-[#fbebec] text-[#b4323c]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  green: 'bg-[#e7f4ee] text-[#127650]',
  white: 'bg-white text-ink',
  navy: 'bg-navy text-white',
}

export function SChip({ tone = 'gray', icon, className = '', children }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-[5px] rounded-[14px] py-[5px] pr-3 text-[12px] font-semibold whitespace-nowrap',
        icon ? 'pl-2' : 'pl-3',
        STONE[tone] ?? tone,
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/* ───────────── Buttons (46px header buttons / 36px card buttons) ───────────── */

const PB = {
  pink: 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]',
  navy: 'bg-navy text-white shadow-navy hover:bg-navy-700',
  outline: 'border border-line bg-white text-ink hover:bg-tile',
  white: 'bg-white text-ink shadow-soft hover:bg-tile',
  ghost: 'text-ink hover:bg-panel',
  danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fbebec]',
}

/** size md = 46px header CTA (pl16 pr20, 14px) · sm = 36px card button (pl12 pr14, 13px) */
export function PillButton({ variant = 'outline', size = 'md', icon, iconRight, to, className = '', children, ...rest }) {
  const cls = cx(
    'inline-flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap transition',
    size === 'md' ? 'h-[46px] rounded-[24px] pr-5 pl-4 text-[14px]' : 'h-9 rounded-[18px] pr-3.5 pl-3 text-[13px]',
    PB[variant],
    className,
  )
  const s = size === 'md' ? 18 : 16
  const inner = (
    <>
      {icon && <Icon name={icon} size={s} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s} />}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Round icon button (48px hero actions) */
export function CircleBtn({ icon, dark = true, size = 48, iconSize = 20, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full transition',
        dark ? 'bg-navy text-white hover:bg-navy-700' : 'bg-white text-ink shadow-soft hover:bg-tile',
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  )
}

/* ───────────── Surfaces ───────────── */

/** White section card: p24, r28, gap16 */
export function SCard({ className = '', gap = 'gap-4', children, ...rest }) {
  return (
    <section className={cx('flex flex-col rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] max-md:rounded-[22px] max-md:p-4', gap, className)} {...rest}>
      {children}
    </section>
  )
}

export function SCardHead({ title, subtitle, right, className = '' }) {
  return (
    <div className={cx('flex w-full items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {subtitle && <p className="text-[12px] font-medium text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/** Label 12/medium muted over value 14/semibold */
export function KVItem({ k, v, className = 'w-[220px]' }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <p className="text-[12px] font-medium text-muted">{k}</p>
      <p className="text-[14px] font-semibold text-ink">{v}</p>
    </div>
  )
}

/** Avatar with arbitrary bg hex (Figma avatars use per-person tints) */
export function Dot({ initials, bg = '#fde8c9', size = 38, font = 12, border = 2, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full border-solid border-white font-bold text-navy', className)}
      style={{ width: size, height: size, background: bg, fontSize: font, borderWidth: border }}
    >
      {initials}
    </span>
  )
}

/* ───────────── Lead Card (Figma Components › Lead Card 8:387 — Default / Hover) ───────────── */

/** onOpen(lead): a plain click opens a quick-update popup instead of the lead page (Ctrl/⌘-click still opens the page). */
export function LeadCard({ lead, to = "/leads/1" /* only one lead-detail design exists */, draggable, onDragStart, onDragEnd, dragging, onOpen }) {
  return (
    <Link
      to={to}
      onClick={onOpen ? (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onOpen(lead) } : undefined}
      title={onOpen ? 'Click to update · Ctrl-click to open the lead page' : undefined}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cx(
        'flex w-[252px] shrink-0 cursor-grab flex-col items-start gap-3 rounded-[22px] bg-white p-4 transition active:cursor-grabbing',
        'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:shadow-[0px_16px_30px_-10px_rgba(19,41,75,0.18)]',
        dragging && 'opacity-40',
      )}
    >
      <div className="flex w-full items-center gap-2.5">
        <Dot initials={lead.initials} bg={lead.avatar} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <p className="text-[14px] font-bold text-ink">{lead.name}</p>
          <p className="text-[12px] font-medium text-muted">{lead.phone}</p>
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpen?.(lead) }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onOpen?.(lead) } }}
          className="flex size-7 items-center justify-center rounded-full text-muted hover:bg-panel hover:text-ink"
          aria-label="Quick update"
        >
          <Icon name="more" size={18} />
        </span>
      </div>
      <p className="w-full text-[12px] leading-[18px] font-medium text-slate">{lead.note}</p>
      <div className="flex gap-1.5">
        {lead.chips.map((c) => (
          <SChip key={c.label} tone={c.tone} icon={c.icon}>{c.label}</SChip>
        ))}
      </div>
      <span className={cx('inline-flex items-center gap-[5px] rounded-[12px] py-1 pr-2.5 pl-2 text-[11px] font-bold whitespace-nowrap', STONE[lead.source.tone])}>
        <Icon name="link" size={14} />
        {lead.source.label}
      </span>
    </Link>
  )
}

/* ───────────── Stat card (pastel 280×149, p22) ───────────── */

export function StatCard({ icon, label, value, sub, bg, className = 'w-[280px]' }) {
  return (
    <div className={cx('flex flex-col items-start gap-1.5 rounded-[26px] p-[22px] max-md:gap-1 max-md:rounded-[20px] max-md:p-3.5', className)} style={{ background: bg }}>
      <div className="flex items-center gap-2.5 max-md:gap-2">
        <span className="flex size-10 items-center justify-center rounded-full bg-white/70 text-ink max-md:size-8">
          <Icon name={icon} size={20} />
        </span>
        <p className="text-[13px] font-semibold whitespace-nowrap text-ink-2 max-md:text-[11px] max-md:whitespace-normal">{label}</p>
      </div>
      <p className="text-[30px] font-bold tracking-[-0.6px] text-ink max-md:text-[22px] max-md:tracking-[-0.4px]">{value}</p>
      <p className="text-[12px] font-medium whitespace-nowrap text-slate max-md:text-[10px] max-md:whitespace-normal">{sub}</p>
    </div>
  )
}

/* ───────────── Segmented tabs (white pill p5, tabs px16 py9) ───────────── */

/** items: [{key,label,count,to}] — renders Links when `to` is given */
export function SegTabs({ items, value, onChange, className = '' }) {
  return (
    <div className={cx('flex w-max gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.05)] max-md:shrink-0', className)}>
      {items.map((t) => {
        const on = t.key === value
        const cls = cx(
          'flex items-center gap-2 rounded-[21px] px-4 py-[9px] text-[13px] font-semibold whitespace-nowrap transition max-md:px-3 max-md:py-2 max-md:text-[12px]',
          on ? 'bg-navy text-white' : 'text-slate hover:bg-panel hover:text-ink',
        )
        const inner = (
          <>
            {t.label}
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/18 text-white' : 'bg-panel text-muted')}>{t.count}</span>
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

/* ───────────── Tables (flex rows, header #fafbfd, hover #f7f9ff) ───────────── */

export function TableCard({ className = '', children }) {
  return (
    <div className={cx('flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] md:rounded-[28px]', className)}>
      {children}
    </div>
  )
}

/** cols: [{label, w}] (w = tailwind width class) */
export function THead({ cols, gap = 'gap-5', className = '' }) {
  return (
    <div className={cx('flex min-w-max border-b border-line bg-[#fafbfd] px-6 py-4', gap, className)}>
      {cols.map((c, i) => (
        <p key={i} className={cx('shrink-0 text-[12px] font-semibold whitespace-nowrap text-muted', c.w, c.className)}>{c.label}</p>
      ))}
    </div>
  )
}

export function TRow({ to, onClick, gap = 'gap-5', className = '', children }) {
  const cls = cx('group flex min-w-max items-center border-b border-line px-6 py-4 transition last:border-0 hover:bg-[#f7f9ff]', gap, className)
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return <div className={cls} onClick={onClick}>{children}</div>
}

/** 36px chevron button: white → navy on row hover */
export function ChevBtn({ size = 36, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-soft transition group-hover:bg-navy group-hover:text-white', className)}
      style={{ width: size, height: size }}
    >
      <Icon name="chev-right" size={size * 0.42} />
    </span>
  )
}

/** Big avatar + name/sub block used in table rows */
export function PersonCell({ initials, bg, name, sub, size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <Dot initials={initials} bg={bg} size={size} font={13} />
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <p className="text-[14px] font-bold text-ink">{name}</p>
        <p className="text-[12px] font-medium text-muted">{sub}</p>
      </div>
    </div>
  )
}

/** White search field (filters row) */
export function SearchField({ placeholder, value, onChange, className = 'w-[320px]' }) {
  return (
    <label className={cx('flex h-10 items-center gap-2 rounded-[20px] bg-white px-3.5 shadow-soft md:h-12 md:gap-2.5 md:rounded-[24px] md:px-[18px]', className)}>
      <Icon name="search" size={18} className="text-ink" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint"
      />
    </label>
  )
}

/* ───────────── Premium ledger (rows 28px apart, divider, total) ───────────── */
export function Ledger({ rows, totalLabel = 'Total payable', total, muted = 'text-muted' }) {
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-4">
          <p className={cx('text-[13px] font-medium', muted)}>{k}</p>
          <p className="text-[14px] font-semibold text-ink">{v}</p>
        </div>
      ))}
      <div className="h-px bg-line" />
      <div className="flex items-center justify-between gap-4">
        <p className="text-[15px] font-bold text-ink">{totalLabel}</p>
        <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">{total}</p>
      </div>
    </div>
  )
}