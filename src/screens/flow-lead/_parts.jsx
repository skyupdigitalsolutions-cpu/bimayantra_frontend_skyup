// Shared shell + atoms for the Lead → customer flow (Figma F1–F3).
// Header · form column (760) · side column (400) · floating action bar (y 900).
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { Dropdown } from '../../components/pickers'

export const cardShadow = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/** White form card (r28, p24) with 17/bold title + optional 12 subtitle and right slot */
export function FormCard({ title, subtitle, right, gap = 14, className = '', children }) {
  return (
    <section className={cx('flex flex-col rounded-[20px] bg-white p-4 md:rounded-[28px] md:p-6', cardShadow, className)} style={{ gap }}>
      <div className="flex items-center gap-3">
        <div className="flex min-w-px flex-1 flex-col gap-[3px]">
          <p className="text-[17px] font-bold text-ink">{title}</p>
          {subtitle && <p className="text-[12px] font-medium text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

export function Row({ className = '', children }) {
  return <div className={cx('flex flex-col gap-3 md:flex-row md:items-start md:gap-3.5', className)}>{children}</div>
}

/** Label + control + optional hint (gap 8) */
export function FField({ label, hint, className = '', onClick, children }) {
  return (
    <div data-field className={cx('flex min-w-px flex-1 flex-col gap-2', className)} onClick={onClick}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </div>
  )
}

const shell = 'flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4'
const inputCls = 'min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint'

/** Text input. prefix: "+91" text · leading: icon · trailing: icon · focused: 2px blue border */
export function TInput({ value, onChange, placeholder, prefix, leading, trailing, focused, className = '' }) {
  return (
    <span className={cx(shell, focused ? 'border-2 border-blue' : 'focus-within:ring-2 focus-within:ring-blue/30', className)}>
      {leading && <Icon name={leading} size={18} className="text-muted" />}
      {prefix && <span className="text-[14px] font-semibold text-muted">{prefix}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cx(inputCls, 'scroll-mt-28 scroll-mb-28')} />
      {trailing && <Icon name={trailing} size={18} className="text-muted" />}
    </span>
  )
}

/** Native select styled as the design's dropdown field (muted chevron). lead: node before the value */
export function SInput({ value, onChange, options, lead, className = '' }) {
  return (
    <Dropdown value={value} onChange={onChange} options={options} leading={lead} className={className} />
  )
}

/** Segmented control (white pill, navy active tab) */
export function Segmented({ items, value, onChange }) {
  return (
    <div className="flex h-11 w-fit items-center gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onChange(it)}
          className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap', value === it ? 'bg-navy text-white' : 'text-slate hover:text-ink')}
        >
          {it}
        </button>
      ))}
    </div>
  )
}

/** Small pill chip */
export function Pill({ className = '', icon, children }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-[5px] rounded-[14px] py-[5px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** "After you save" numbered list. tone: gradient classes */
export function AfterSave({ tone, steps, className = '' }) {
  return (
    <aside className={cx('flex flex-col gap-3.5 rounded-[28px] p-6', tone, cardShadow, className)}>
      <p className="text-[16px] font-bold text-ink">After you save</p>
      {steps.map(([t, s], i) => (
        <div key={t} className="flex items-center gap-3">
          <span
            className={cx(
              'flex size-[30px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
              i === 0 ? 'border-2 border-blue bg-white text-blue' : 'bg-white/50 text-muted',
            )}
          >
            {i + 1}
          </span>
          <span className="flex flex-col gap-px">
            <span className="text-[13px] font-bold text-ink">{t}</span>
            <span className="text-[11px] font-medium text-slate">{s}</span>
          </span>
        </div>
      ))}
    </aside>
  )
}

/**
 * Page: header (search + bell) · [form column | side column] · action bar.
 * The bar sits at the bottom of the panel (y=900) like the frame when everything fits, and sticks to the bottom of
 * the window while the form is taller than the screen — so Save is always reachable and the form never slides
 * under it (it used to be absolutely positioned, which overlapped the last card once errors or warnings appeared).
 * min-h = AppLayout panel min-height (976) − its top/bottom padding (36 + 40).
 */
export default function LeadShell({ active, breadcrumb, title, titleExtra, subtitle, side, cancel = true, actions, children }) {
  const navigate = useNavigate()
  return (
    <AppLayout active={active} responsive mobileTitle={title}>
      <div className="flex min-h-[600px] flex-col md:min-h-[900px]">
      <PageHeader breadcrumb={breadcrumb} title={title} titleExtra={titleExtra} subtitle={subtitle} />
      <div className="mt-4 flex flex-col gap-4 md:mt-[21px] md:flex-row md:items-start md:gap-5">
        <div className="flex min-w-0 flex-col md:w-[760px] md:shrink-0">{children}</div>
        <div className="relative md:w-[400px] md:shrink-0">{side}</div>
      </div>
      <div className="min-h-4 flex-1 md:min-h-6" aria-hidden="true" />
      <div className="sticky bottom-1.5 z-20 -mb-[34px] flex shrink-0 flex-wrap items-center gap-2 rounded-[24px] bg-white p-3 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1),0px_-8px_24px_-12px_rgba(19,41,75,0.12)] md:h-[70px] md:flex-nowrap md:gap-3 md:rounded-[30px] md:py-3 md:pr-3 md:pl-6">
        {cancel && (
          <button type="button" onClick={() => navigate(-1)} className="inline-flex h-[46px] items-center justify-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile max-md:order-2 max-md:h-10 max-md:flex-1 max-md:px-3 max-md:text-[13px]">
            Cancel
          </button>
        )}
        <span className="flex-1 max-md:hidden" />
        <div className="max-md:order-1 max-md:w-full">{actions}</div>
      </div>
      </div>
    </AppLayout>
  )
}

export function PrimaryAction({ to, icon, children }) {
  return (
    <Link to={to} className="inline-flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700">
      <Icon name={icon} size={18} />
      {children}
    </Link>
  )
}

export function SecondaryAction({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">
      {children}
    </button>
  )
}