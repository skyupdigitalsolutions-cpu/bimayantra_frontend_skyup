// Shared structure for Flow · Record payment (Figma 42:5774 / 42:5954 / 42:6143)
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, Button, CardHead, cx } from '../../components/ui'
import { useHeaderSearch } from '../customer-tabs/_search'
import { paymentQuote as q } from '../../data/payment'
import { PANEL_SCRIM, DRAWER_BOX, DRAWER_FOOT, useLockScroll } from '../sales/_overlay'

export const P = {
  addLink: '/x/p1-payment-add-payment-link',
  record: '/x/p2-payment-record-payment',
  recorded: '/x/p3-payment-recorded',
  proposal: '/x/r1-proposal-members',
  quote: '/quotations/1',
}

/** 46px navy / white header + drawer buttons (Figma Button/*: h46 r24 pl16 pr20) */
export function Btn({ variant = 'primary', className = '', ...rest }) {
  return (
    <Button
      variant={variant}
      className={cx('h-[46px] rounded-[24px] pr-5 pl-4', variant === 'primary' && 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]', className)}
      {...rest}
    />
  )
}

/** Quotation page header used by all three payment frames */
export function QuoteHeader({ chip, subtitle, action, rev }) {
  useHeaderSearch() // Ctrl/Cmd+K focuses the header search pill
  return (
    <PageHeader
      breadcrumb={`QUOTATIONS  /  ${q.id}${rev ? `  ${q.revision}` : ''}`}
      title={q.id}
      titleExtra={chip}
      subtitle={subtitle}
      actions={action}
    />
  )
}

/** The quotation screen behind the drawer (Figma "Quotation (behind)" + "Payment (behind)") */
export function QuoteBehind() {
  return (
    <div className="mt-[21px] flex gap-5">
      <div className="h-[420px] w-[760px] rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <CardHead title="Quotation" subtitle="Everything printed on the PDF" />
      </div>
      <div className="h-[420px] w-[400px] rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <CardHead title="Premium payment" />
      </div>
    </div>
  )
}

/** Scrim + right drawer inside the workspace panel (Figma Scrim + Drawer/*: 520×928 at right 24 / top 24) */
export function Drawer({ title, subtitle, onClose, footer, children }) {
  useLockScroll()
  return (
    <>
      <div data-overlay="scrim" className={cx(PANEL_SCRIM, 'z-40 bg-[rgba(14,31,59,0.4)]')} onClick={onClose} />
      <aside role="dialog" data-overlay="drawer" data-rsp className={cx(DRAWER_BOX, 'z-50 flex w-[520px] flex-col gap-[18px] rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]')}>
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] max-xl:whitespace-normal">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{title}</p>
            <p className="text-[12px] font-medium text-muted">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-[18px] bg-panel text-ink hover:bg-line">
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
        <div className="min-h-px flex-1" />
        <div className={cx(DRAWER_FOOT, 'flex gap-2.5')}>{footer}</div>
      </aside>
    </>
  )
}

/** Drawer note strip (blue info / green success) — Figma "Note": px16 py12 r16, 13 semibold */
export function DrawerNote({ tone = 'blue', icon, className = '', children }) {
  const tones = { blue: 'bg-[#e8f0fd] text-[#1f5fd6]', green: 'bg-[#e7f4ee] text-[#127650]', amber: 'bg-[#fdf1dc] text-[#9a5b0b]' }
  return (
    <div className={cx('flex items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', tones[tone], className)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** Labelled drawer field (label 13 semibold, gap 8) */
export function DField({ label, hint, className = '', children }) {
  return (
    <div className={cx('flex min-w-0 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </div>
  )
}

/** Figma "Input": h50 r16 #f4f6fb px16; `focus` draws the 2px blue ring seen on the active field */
export function DInput({ leading, prefix, trailing, focus, className = '', ...rest }) {
  return (
    <label
      className={cx(
        'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink',
        focus ? 'border-2 border-blue' : 'focus-within:ring-2 focus-within:ring-blue/30',
        className,
      )}
    >
      {leading && <Icon name={leading} size={18} className="text-muted" />}
      {prefix && <span className="text-muted">{prefix}</span>}
      <input className="min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:font-medium placeholder:text-faint" {...rest} />
      {trailing && <Icon name={trailing} size={18} className="text-muted" />}
    </label>
  )
}

export function PaymentLayout({ children }) {
  return (
    <AppLayout active="quotations" panelClass="overflow-hidden">
      {children}
    </AppLayout>
  )
}

const PILL = {
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  green: 'bg-[#e7f4ee] text-[#127650]',
}
/** Figma Chip/*: h25 r14 pad 5/12/5/8 */
export function Pill({ tone, icon, children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 pl-2 text-[12px] font-semibold whitespace-nowrap', PILL[tone])}>
      <Icon name={icon} size={13} />
      {children}
    </span>
  )
}

export function ChipShared() {
  return <Pill tone="blue" icon="send">Shared</Pill>
}