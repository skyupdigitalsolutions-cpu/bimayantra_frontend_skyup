// Shared wizard shell for the New quotation flow (Figma Q1–Q11).
// Header · local stepper · step card (left, 760) · "Your quotation" live summary (right, 400).
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { Dropdown } from '../../components/pickers'
import { useHeaderSearch } from '../customer-tabs/_search'
import { STEPS, SUMMARY, QUOTE_NO } from '../../data/quotation-flow'

/* ───────── small atoms ───────── */

/** Green status chip (Draft saved / Consent given / Ready / Free) */
export function GreenChip({ icon = 'check', children, className = '' }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 text-[12px] font-semibold whitespace-nowrap text-[#127650]', icon ? 'pl-2' : 'pl-3', className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** 22px radio dot (Figma "Radio") */
export function Radio({ on, disabled, className = '' }) {
  return (
    <span
      className={cx(
        'block size-[22px] shrink-0 rounded-full',
        on ? 'border-[6px] border-navy bg-white' : 'border-[1.5px] border-[#c3ccd8] bg-white',
        disabled && 'bg-panel',
        className,
      )}
    />
  )
}

/** 22px checkbox, radius 7 */
export function Check({ on, size = 22, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-[7px]', on ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white', className)}
      style={{ width: size, height: size }}
    >
      {on && <Icon name="check" size={size === 24 ? 16 : 14} strokeWidth={2.2} />}
    </span>
  )
}

/** Selectable row/card surface: selected = pale blue + 1.5px blue border, idle = panel */
export function choice(on, disabled) {
  return cx(
    'rounded-[20px] text-left transition',
    on ? 'border-[1.5px] border-blue bg-[#f3f7ff]' : 'bg-panel',
    !on && !disabled && 'hover:bg-[#eef1f8]',
    disabled && 'cursor-not-allowed',
  )
}

/** Initials avatar used in rows (42 / 44px, 2px white ring) */
export function RowAvatar({ initials, tone, size = 42, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-navy', tone, className)}
      style={{ width: size, height: size, fontSize: size >= 44 ? 14 : 13 }}
    >
      {initials}
    </span>
  )
}

/** Blue / violet / amber inline note (h40, radius 14) */
export function Note({ tone = 'blue', icon, children, className = '' }) {
  const tones = { blue: 'bg-blue-50 text-blue', violet: 'bg-violet-50 text-violet', amber: 'bg-[#fbf1e1] text-[#8a5a12]', green: 'bg-[#e7f4ee] text-[#127650]' }
  return (
    <div className={cx('inline-flex items-center gap-2.5 self-start rounded-[16px] px-4 py-3 text-[13px] font-semibold', tones[tone], className)}>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </div>
  )
}

/** Navy CTA with leading icon (h46, r24, pl16 pr20) */
export function NavyButton({ to, icon = 'arrow', children, className = '', ...rest }) {
  const cls = cx(
    'inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold whitespace-nowrap text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] transition hover:bg-navy-700',
    className,
  )
  const inner = (<>{icon && <Icon name={icon} size={18} />}{children}</>)
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <button type="button" className={cls} {...rest}>{inner}</button>
}

/** White bordered button (h46, r24) */
export function OutlineButton({ to, icon, children, className = '', ...rest }) {
  const cls = cx(
    'inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] border border-line bg-white text-[14px] font-semibold whitespace-nowrap text-ink transition hover:bg-tile',
    icon ? 'pr-5 pl-4' : 'px-5',
    className,
  )
  const inner = (<>{icon && <Icon name={icon} size={18} />}{children}</>)
  return to ? <Link to={to} className={cls} {...rest}>{inner}</Link> : <button type="button" className={cls} {...rest}>{inner}</button>
}

/** Field select on #f4f6fb (h50, r16) with muted chevron */
export function PlainSelect({ value, onChange, options, className = '' }) {
  return (
    <Dropdown value={value} onChange={onChange} options={options} className={className} />
  )
}

/** Text input on #f4f6fb (h50, r16). focused = 2px blue ring, prefix = muted ₹ */
export function TextField({ value, onChange, placeholder, prefix, focused, className = '', inputClass = '' }) {
  return (
    <span className={cx('flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 focus-within:ring-2 focus-within:ring-blue/30', focused && 'border-2 border-blue focus-within:ring-0', className)}>
      {prefix && <span className="text-[14px] font-semibold text-muted">{prefix}</span>}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cx('min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint', inputClass)}
      />
    </span>
  )
}

export const MoneyInput = (p) => <TextField prefix="₹" {...p} />

/** Card head: 17 bold + 12 muted */
export function Head({ title, subtitle, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {subtitle && <p className="text-[12px] font-medium text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/** Ledger rows (Base premium / Riders / GST / Total) on a tinted box */
export function Ledger({ rows, total, className = '', labelClass = 'text-muted', boxClass = 'bg-panel' }) {
  return (
    <div className={cx('rounded-[20px] p-[18px]', boxClass, className)}>
      <div className="flex flex-col gap-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4">
            <span className={cx('text-[13px] font-medium', labelClass)}>{k}</span>
            <span className="text-[14px] font-semibold whitespace-nowrap text-ink">{v}</span>
          </div>
        ))}
        <span className="h-px bg-line" />
        <div className="flex items-center justify-between gap-4">
          <span className="text-[15px] font-bold text-ink">{total[0]}</span>
          <span className="text-[22px] font-bold tracking-[-0.2px] whitespace-nowrap text-ink">{total[1]}</span>
        </div>
      </div>
    </div>
  )
}

/* ───────── Stepper (local: Figma differs from shared one) ───────── */

export function QuoteStepper({ current }) {
  return (
    <div className="rounded-[28px] bg-white px-7 py-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const done = i < current
          const on = i === current
          const dot = (
            <span
              className={cx(
                'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                done && 'bg-navy text-white',
                on && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                !done && !on && 'bg-panel text-muted',
              )}
            >
              {done ? <Icon name="check" size={16} strokeWidth={2.2} /> : i + 1}
            </span>
          )
          return (
            <div key={s.label} className="contents">
              {done ? (
                <Link to={s.path} className="flex min-w-px flex-1 flex-col items-center gap-2 hover:opacity-80">
                  {dot}
                  <span className="text-[12px] font-semibold whitespace-nowrap text-ink-2">{s.label}</span>
                </Link>
              ) : (
                <div className="flex min-w-px flex-1 flex-col items-center gap-2">
                  {dot}
                  <span className={cx('text-[12px] whitespace-nowrap', on ? 'font-bold text-ink' : 'font-semibold text-muted')}>{s.label}</span>
                </div>
              )}
              {i < STEPS.length - 1 && <span className={cx('h-[2px] min-w-px flex-1 rounded-[1px]', done ? 'bg-navy' : 'bg-line')} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── Live summary ───────── */

/**
 * Pink "Your quotation" card.
 *  filled: how many SUMMARY rows have values (0–6)
 *  extraRows: additional [label, value] rows after the standard ones
 *  rowGap: gap between rows (12, or 10 on Q6/Q7)
 *  total: estimated total string → white box at the bottom
 *  children: extra boxes rendered after the rows (Q6 premium entry, Q7 price summary)
 */
export function LiveSummary({ filled = 0, extraRows = [], rowGap = 12, total, children }) {
  const rows = [...SUMMARY.map(([k, v], i) => [k, i < filled ? v : null]), ...extraRows]
  return (
    <aside className="flex w-[400px] shrink-0 flex-col gap-3.5 rounded-[28px] bg-pink-hero p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
      <Head
        title="Your quotation"
        subtitle="Builds up as you go"
        right={<span className="rounded-[14px] bg-pink-100 px-3 py-[5px] text-[12px] font-semibold text-[#b4325a]">Draft</span>}
      />
      <div className="flex flex-col rounded-[20px] bg-white/80 p-4" style={{ gap: rowGap }}>
        {rows.map(([k, v]) => (
          <div key={k} className="flex h-4 items-center gap-2">
            <span className="min-w-px flex-1 text-[12px] font-medium text-rose-ink">{k}</span>
            <span className={cx('text-[13px] font-bold whitespace-nowrap', v ? 'text-ink' : 'text-[#b98b96]')}>{v || '—'}</span>
          </div>
        ))}
      </div>
      {children}
      {total && (
        <div className="flex h-[60px] items-center rounded-[20px] bg-white/80 px-4">
          <span className="flex-1 text-[13px] font-semibold text-rose-ink">Estimated total</span>
          <span className="text-[22px] font-bold tracking-[-0.2px] text-ink">{total}</span>
        </div>
      )}
    </aside>
  )
}

/* ───────── Step card ───────── */

/**
 * Left step body. index 0-based.
 *  next: { label, to, icon } · back: route or false · saved: footer text
 */
export function StepCard({ index, title, subtitle, children, next, back, saved = 'Draft saved', backChevron = false, gap = 18 }) {
  const backTo = back ?? (index > 0 ? STEPS[index - 1].path : null)
  return (
    <section
      className="flex w-[760px] shrink-0 flex-col rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]"
      style={{ gap }}
    >
      <Head title={`${index + 1} · ${title}`} subtitle={subtitle} />
      {children}
      <span className="h-px w-full bg-line" />
      <div className="flex items-center gap-3">
        {backTo && (
          <OutlineButton to={backTo} className={backChevron ? 'gap-2 pr-5 pl-4' : 'px-5'}>
            {backChevron && <Icon name="chev-right" size={18} className="rotate-180" />}
            Back
          </OutlineButton>
        )}
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
          <Icon name="check" size={16} strokeWidth={2} className="text-[#127650]" />
          {saved}
        </span>
        <span className="flex-1" />
        {next && <NavyButton to={next.to} icon={next.icon ?? 'arrow'}>{next.label}</NavyButton>}
      </div>
    </section>
  )
}

/* ───────── Page shell ───────── */

/**
 * Wizard page: header + stepper + [step card | summary].
 *  step: 0-based current step (null hides stepper)
 *  numbered: breadcrumb shows QT number instead of NEW
 */
export default function QuoteWizard({ step, numbered = false, subtitle = 'Kavya Hegde', chip = 'Draft saved', children }) {
  useHeaderSearch() // Ctrl/Cmd+K focuses the header search pill
  return (
    <AppLayout active="quotations">
      <PageHeader
        breadcrumb={`QUOTATIONS  /  ${numbered ? QUOTE_NO : 'NEW'}`}
        title="New quotation"
        titleExtra={<GreenChip>{chip}</GreenChip>}
        subtitle={subtitle}
        actions={<OutlineButton to="/quotations" icon="download" className="mt-px">Save and exit</OutlineButton>}
      />
      {step != null && (
        <div className="mt-[21px]">
          <QuoteStepper current={step} />
        </div>
      )}
      <div className="mt-[35px] flex items-start gap-5">{children}</div>
    </AppLayout>
  )
}
