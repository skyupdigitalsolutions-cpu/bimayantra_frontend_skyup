// Shared shell for Flow · Comparative quotation (Figma CQ2–CQ9).
// Wizard: page heading + 8-step stepper + step body card + pink "Your comparison" live summary.
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, IconButton, cx } from '../../components/ui'
import { CQ_STEPS } from '../../data/flow-comparative'

export const card = 'rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/* ───────── atoms ───────── */

/** Figma Button/*: h46 r24, navy (shadow) or white outline */
export function Btn({ variant = 'navy', icon, to, onClick, className = '', children, ...rest }) {
  const cls = cx(
    'inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[24px] pr-5 text-[14px] font-semibold whitespace-nowrap transition',
    icon ? 'pl-4' : 'pl-5',
    variant === 'navy'
      ? 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700'
      : 'border border-line bg-white text-ink hover:bg-tile',
    className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls} onClick={onClick} {...rest}>{inner}</Link>
  return <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>
}

const PILL = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  pink: 'bg-[#fde8ec] text-[#b4325a]',
  gray: 'bg-[#eef1f5] text-ink-2',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
}
/** Figma Chip/*: h25 r14, pad 5/12/5/8 with icon (12 semibold) */
export function Pill({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', PILL[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

const NOTE = {
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  green: 'bg-[#e7f4ee] text-[#127650]',
}
/** Figma Note: r16 pad 12/16, gap 10, 13 semibold */
export function Note({ tone = 'blue', icon, className = '', children }) {
  return (
    <div className={cx('flex w-fit items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', NOTE[tone], className)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** Figma Radio 22px: on = 6px navy ring */
export function Radio({ on }) {
  return (
    <span
      className={cx('block size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')}
    />
  )
}

export function CardHead({ title, subtitle, right }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] leading-[21px] font-bold text-ink">{title}</p>
        {subtitle && <p className="text-[12px] leading-[15px] font-medium text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/* ───────── stepper ───────── */

export function CqStepper({ current }) {
  return (
    <div className={cx(card, 'mt-[21px] px-7 py-5')}>
      <div className="flex h-[57px] items-center">
        {CQ_STEPS.map((s, i) => {
          const done = i < current
          const on = i === current
          return [
            <div key={s} className="flex w-[74.93px] shrink-0 flex-col items-center gap-2">
              <span
                className={cx(
                  'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                  done && 'bg-navy text-white',
                  on && 'border-2 border-[#1f5fd6] bg-white text-[#1f5fd6] shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                  !done && !on && 'bg-panel text-muted',
                )}
              >
                {done ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span className={cx('text-[12px] whitespace-nowrap', on ? 'font-bold text-ink' : done ? 'font-semibold text-ink-2' : 'font-semibold text-muted')}>{s}</span>
            </div>,
            i < CQ_STEPS.length - 1 && (
              <span key={s + '-bar'} className={cx('h-[2px] w-[74.93px] shrink-0 rounded-[1px]', done ? 'bg-navy' : 'bg-line')} />
            ),
          ]
        })}
      </div>
    </div>
  )
}

/* ───────── step body ───────── */

export function DraftSaved() {
  return (
    <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
      <Icon name="check" size={16} className="text-[#127650]" />
      Draft saved
    </span>
  )
}

/** White step card: head, content, divider, footer (Back · Draft saved · Next) */
export function StepCard({ title, subtitle, back, next, nextLabel, nextIcon = 'arrow', className = '', children }) {
  return (
    <section className={cx(card, 'flex w-[760px] shrink-0 flex-col gap-[18px] p-6', className)}>
      <CardHead title={title} subtitle={subtitle} />
      {children}
      <div className="h-px bg-line" />
      <div className="flex items-center gap-3">
        <Btn variant="outline" to={back}>Back</Btn>
        <DraftSaved />
        <span className="flex-1" />
        <Btn icon={nextIcon} to={next}>{nextLabel}</Btn>
      </div>
    </section>
  )
}

/* ───────── live summary ───────── */

function SumRow({ k, v }) {
  return (
    <div className="flex h-4 items-center">
      <span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">{k}</span>
      <span className={cx('text-[13px] font-bold', v ? 'text-ink' : 'text-[#b98b96]')}>{v || '—'}</span>
    </div>
  )
}

/**
 * Pink "Your comparison" card.
 * list: [{label, value, recommended}] → white OPTIONS box (omit for none)
 */
export function LiveSummary({ insurance, options, people, list, listTitle = 'OPTIONS' }) {
  return (
    <aside className="flex w-[400px] shrink-0 flex-col gap-3.5 rounded-[28px] bg-pink-hero p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
      <CardHead
        title="Your comparison"
        subtitle="Same people and sum insured for every option"
        right={<Pill tone="pink">Draft</Pill>}
      />
      <div className="flex flex-col gap-2.5 rounded-[20px] bg-white/80 p-4">
        <SumRow k="Customer" v="Kavya Hegde" />
        <SumRow k="Type" v="Comparative" />
        <SumRow k="Insurance" v={insurance} />
        <SumRow k="Options" v={options} />
        <SumRow k="People and cover" v={people} />
      </div>
      {list && (
        <div className="flex flex-col gap-2.5 rounded-[20px] bg-white p-4">
          <p className="text-[10px] leading-[13px] font-bold tracking-[0.6px] text-muted">{listTitle}</p>
          {list.map((o) => (
            <div key={o.label} className={cx('flex items-center gap-2', o.recommended ? 'h-[30px]' : 'h-4')}>
              <span className={cx('text-[12px] font-semibold text-ink-2', o.recommended ? 'w-[125px] shrink-0' : 'flex-1')}>{o.label}</span>
              {o.recommended && (
                <>
                  <Pill tone="green" icon="star">Recommended</Pill>
                  <span className="flex-1" />
                </>
              )}
              <span className={cx('text-[13px] font-bold', o.value ? 'text-ink' : 'text-[#b98b96]')}>{o.value || '—'}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

/* ───────── page ───────── */

export function CqHeader({ crumb = 'NEW COMPARISON', title = 'New comparative quotation', chip, subtitle = 'Kavya Hegde · 2 to 3 options side by side', action }) {
  return (
    <PageHeader
      hideSearch
      breadcrumb={`QUOTATIONS  /  ${crumb}`}
      title={title}
      titleExtra={chip ?? <Pill tone="green" icon="check">Draft saved</Pill>}
      subtitle={subtitle}
      actions={
        <>
          <IconButton icon="bell" className="shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]" />
          {action ?? <Btn variant="outline" icon="download" to="/quotations">Save and exit</Btn>}
        </>
      }
    />
  )
}

/** Full wizard page. `step` is 0-based index into CQ_STEPS. */
export default function CqPage({ step, summary, panelClass = '', children }) {
  return (
    <AppLayout active="quotations" panelClass={panelClass}>
      <CqHeader />
      <CqStepper current={step} />
      <div className="mt-[35px] flex items-start gap-5">
        {children}
        {summary}
      </div>
    </AppLayout>
  )
}
