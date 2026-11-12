// Shared layout + pieces for the "Add my product" flow (Figma AP1–AP7).
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { R, steps, previewLabels, sourcePages, pageLines, fixes, cropLines } from '../../data/flow-add-product'
import { FixedScrim } from '../catalogue/_overlay'

export { R }

const SHADOW_CARD = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const SHADOW_BTN = 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]'
const SHADOW_SOFT = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'

/* ───────────── atoms ───────────── */

const CHIP = {
  green: 'bg-[#e7f4ee] text-[#127650]',
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
  pink: 'bg-[#fde8ec] text-[#b4325a]',
  gray: 'bg-[#eef1f5] text-[#44526a]',
  amber: 'bg-[#fbf1e1] text-[#8a5a12]',
  red: 'bg-[#fbebec] text-[#b4323c]',
}
export function Chip({ tone = 'gray', icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] pr-3 text-[12px] font-semibold whitespace-nowrap', icon ? 'pl-2' : 'pl-3', CHIP[tone], className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}
export const CONF_TONE = { High: 'green', Medium: 'amber', Low: 'red', 'Not found': 'gray' }

const BTN = {
  primary: `bg-navy text-white ${SHADOW_BTN} hover:bg-navy-700`,
  outline: 'bg-white text-ink border border-line hover:bg-tile',
  ghost: 'text-ink hover:bg-white/70',
  pink: 'bg-[linear-gradient(to_right,#f9c6d0,#f29db0)] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]',
}
/** md = 46px (r24, icon 18, 14px text) · sm = 36px (r18, icon 16, 13px text) */
export function Btn({ variant = 'primary', size = 'md', icon, to, className = '', children, ...rest }) {
  const md = size === 'md'
  const cls = cx(
    'inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap transition',
    md ? 'h-[46px] rounded-[24px] pr-5 text-[14px]' : 'h-9 rounded-[18px] pr-3.5 text-[13px]',
    icon ? (md ? 'pl-4' : 'pl-3') : md ? 'pl-5' : 'pl-3.5',
    BTN[variant],
    className,
  )
  const inner = (
    <>
      {icon && <Icon name={icon} size={md ? 18 : 16} />}
      {children}
    </>
  )
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  return <button type="button" className={cls} {...rest}>{inner}</button>
}

export function RoundBtn({ icon, size = 32, iconSize = 13.4, color = 'text-ink', className = '', iconClass = '', ...rest }) {
  return (
    <button type="button" className={cx('flex shrink-0 items-center justify-center rounded-full bg-white hover:bg-tile', SHADOW_SOFT, color, className)} style={{ width: size, height: size }} {...rest}>
      <Icon name={icon} size={iconSize} className={iconClass} />
    </button>
  )
}

export function Box({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={() => onChange?.(!checked)}
      className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white', className)}
    >
      {checked && <Icon name="check" size={15} />}
    </button>
  )
}

export function Field({ label, hint, className = '', children }) {
  return (
    <label className={cx('flex min-w-0 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

/** 50px input. tone: panel (#f4f6fb) | white. focused draws the 2px blue stroke. */
export function TextInput({ tone = 'panel', focused, leading, trailing, className = '', inputClass = '', ...rest }) {
  return (
    <span
      className={cx(
        'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] px-4 focus-within:border-2 focus-within:border-blue',
        tone === 'white' ? 'bg-white' : 'bg-panel',
        focused && 'border-2 border-blue',
        className,
      )}
    >
      {leading}
      <input className={cx('min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint', inputClass)} {...rest} />
      {trailing}
    </span>
  )
}

export function TextArea({ className = '', ...rest }) {
  return (
    <textarea
      className={cx('h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none focus:border-2 focus:border-blue', className)}
      {...rest}
    />
  )
}

export function Note({ icon, tone = 'blue', className = '', children }) {
  return (
    <div className={cx('flex h-10 w-fit items-center gap-2.5 self-start rounded-[16px] px-4 text-[13px] font-semibold whitespace-nowrap', tone === 'blue' ? 'bg-blue-50 text-blue' : 'bg-[#e7f4ee] text-[#127650]', className)}>
      <Icon name={icon} size={16} />
      {children}
    </div>
  )
}

export const Divider = () => <div className="h-px shrink-0 bg-line" />

/* ───────────── page shell ───────────── */

export function Stepper({ current }) {
  const items = []
  steps.forEach((label, i) => {
    const n = i + 1
    const state = n < current ? 'done' : n === current ? 'current' : 'todo'
    if (i > 0) items.push(<span key={`c${i}`} className={cx('h-0.5 flex-1 rounded-[1px]', n <= current ? 'bg-navy' : 'bg-line')} />)
    items.push(
      <div key={label} className="flex flex-1 flex-col items-center gap-2">
        <span
          className={cx(
            'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
            state === 'done' && 'bg-navy text-white',
            state === 'current' && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
            state === 'todo' && 'bg-panel text-muted',
          )}
        >
          {state === 'done' ? <Icon name="check" size={16} /> : n}
        </span>
        <span className={cx('text-[12px] whitespace-nowrap', state === 'current' ? 'font-bold text-ink' : state === 'done' ? 'font-semibold text-ink-2' : 'font-semibold text-muted')}>{label}</span>
      </div>,
    )
  })
  return (
    <div className={cx('mt-[21px] rounded-[28px] bg-white px-7 py-5', SHADOW_CARD)}>
      <div className="flex h-[57px] items-center">{items}</div>
    </div>
  )
}

/** Advisor shell with the "Add my product" header + stepper. overlay renders above the whole panel. */
export function Shell({ step, subtitle, headChip, aside, overlay, children, extra, tightBottom }) {
  return (
    <AppLayout active="products">
      <header className="flex items-start justify-between max-xl:flex-col max-xl:gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre max-xl:whitespace-pre-wrap text-muted">PRODUCTS  /  ADD MY PRODUCT</p>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">Add my product</h1>
            {headChip ?? <Chip tone="green" icon="check">Draft saved</Chip>}
          </div>
          <p className="text-[14px] font-medium text-muted">{subtitle}</p>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <RoundBtn icon="bell" size={44} iconSize={18.5} />
          <Btn variant="outline" icon="download" to={R.products}>Save and exit</Btn>
        </div>
      </header>
      <Stepper current={step} />
      <div className={cx('mt-[35px] flex items-start gap-5', !tightBottom && 'mb-5')}>
        {children}
        {aside}
      </div>
      {extra}
      {overlay}
    </AppLayout>
  )
}

export function StepCard({ title, subtitle, chip, className = '', children }) {
  return (
    <section className={cx('flex w-[760px] shrink-0 flex-col gap-[18px] rounded-[28px] bg-white p-6', SHADOW_CARD, className)}>
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <h2 className="text-[17px] leading-[21px] font-bold text-ink">{title}</h2>
          <p className="text-[12px] leading-[15px] font-medium whitespace-nowrap text-muted">{subtitle}</p>
        </div>
        {chip}
      </div>
      {children}
    </section>
  )
}

/** Divider + footer row. mid: 'draft' | 'confirm' */
export function StepFooter({ back, backLabel = 'Back', mid = 'draft', next }) {
  const [ok, setOk] = useState(false)
  return (
    <>
      <Divider />
      <div className="flex items-center gap-3">
        <Btn variant="outline" to={back}>{backLabel}</Btn>
        {mid === 'draft' ? (
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
            <Icon name="check" size={16} className="text-[#127650]" />
            Draft saved
          </span>
        ) : (
          <span className="flex items-center gap-2.5">
            <Box checked={ok} onChange={setOk} />
            <span className="text-[13px] font-semibold text-ink">I’ve checked every value on this page</span>
          </span>
        )}
        <span className="flex-1" />
        {next}
      </div>
    </>
  )
}

/* ───────────── right column ───────────── */

export function PreviewCard({ values, sparkle, foot = 'Published only in your account as soon as you save.' }) {
  return (
    <aside className="flex w-[400px] shrink-0 flex-col gap-3.5 rounded-[28px] bg-pink-hero p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-[3px]">
          <h3 className="text-[17px] font-bold text-ink">Your product</h3>
          <p className="text-[12px] font-medium text-muted">How it will look in the library</p>
        </div>
        <Chip tone="pink">Draft</Chip>
      </div>
      <div className="flex flex-col gap-3 rounded-[20px] bg-white/80 p-4">
        {previewLabels.map((label, i) => (
          <div key={label} className="flex h-4 items-center gap-1.5">
            <span className="flex-1 text-[12px] font-medium text-rose-ink">{label}</span>
            {values[i] ? (
              <>
                {sparkle && i > 0 && <Icon name="sparkle" size={13} className="text-violet" />}
                <span className="text-[13px] font-bold text-ink">{values[i]}</span>
              </>
            ) : (
              <span className="text-[13px] font-bold text-[#b98b96]">—</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[12px] font-medium text-rose-ink">{foot}</p>
    </aside>
  )
}

function PageSkeleton({ hl }) {
  return (
    <div className="relative h-[440px] w-[352px] overflow-clip rounded-[12px] border border-line bg-white shadow-[0px_6px_16px_-6px_rgba(19,41,75,0.1)]">
      {pageLines.map(([top, w, h = 6, head]) => (
        <span key={top} className={cx('absolute left-[23px]', head ? 'rounded-[4px] bg-[#c9d2df]' : 'rounded-[3px] bg-[#e7ebf2]')} style={{ top: top - 1, width: w, height: h }} />
      ))}
      <span className="absolute left-[19px] w-[312px] rounded-[8px] border-2 border-violet bg-violet/10" style={{ top: hl.top - 1, height: hl.h }} />
      <span className="absolute left-[19px] rounded-[8px] bg-violet px-2 py-[3px] text-[10px] font-bold text-white" style={{ top: hl.labelTop - 1 }}>{hl.label}</span>
    </div>
  )
}

export function SourceViewer({ kind }) {
  const src = sourcePages[kind]
  const [page, setPage] = useState(src.page)
  return (
    <aside className={cx('flex w-[400px] shrink-0 flex-col gap-3 rounded-[28px] bg-white p-6', SHADOW_CARD)}>
      <div className="flex h-[35px] items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="text-[15px] font-bold text-ink">Brochure source</h3>
          <p className="text-[11px] font-medium text-muted">arogya-plus-brochure.pdf</p>
        </div>
        <RoundBtn icon="chev-right" size={30} iconSize={12.6} iconClass="rotate-180" onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page" />
        <Chip tone="gray">Page {page} of 12</Chip>
        <RoundBtn icon="chev-right" size={30} iconSize={12.6} onClick={() => setPage((p) => Math.min(12, p + 1))} aria-label="Next page" />
      </div>
      <PageSkeleton hl={{ ...src.hl, label: src.label }} />
      <div className="flex h-9 items-center gap-2">
        <RoundBtn icon="search" size={30} iconSize={12.6} />
        <span className="text-[12px] font-semibold text-muted">100%</span>
        <span className="flex-1" />
        <Btn variant="ghost" size="sm" icon="folder">Open full brochure</Btn>
      </div>
    </aside>
  )
}

/* ───────────── AI review pieces ───────────── */

export function AiBanner({ count, bar }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-[linear-gradient(to_right,#f0ecfb,#e6dffb)] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-white text-violet">
          <Icon name="sparkle" size={17} />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[13px] font-bold text-ink">Read by AI from the brochure. Check each value.</p>
          <p className="text-[12px] font-medium text-violet">Compare with the highlighted page on the right. Fix anything that’s wrong.</p>
        </div>
        <span className="text-[13px] font-bold text-violet">{count}</span>
      </div>
      <div className="h-1.5 overflow-clip rounded-[3px] bg-white">
        <div className="h-full rounded-[3px] bg-violet" style={{ width: bar }} />
      </div>
    </div>
  )
}

export const AiLabel = () => <p className="text-[12px] font-bold tracking-[0.5px] text-muted">What the AI read</p>

export function ExtractedList({ rows }) {
  const [confirmed, setConfirmed] = useState(() => rows.map((r) => r.status === 'ok'))
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => {
        const ok = r.status === 'ok'
        return (
          <div key={r.label} className={cx('flex h-[58px] items-center gap-3 rounded-[14px] border px-3', ok ? 'border-[#d5eee2] bg-[#f7fbf9]' : 'border-[#f1d9a8] bg-[#fff9ef]')}>
            <span className={cx('flex size-[26px] shrink-0 items-center justify-center rounded-full', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbf1e1] text-[#8a5a12]')}>
              <Icon name={ok ? 'check' : 'alert'} size={13} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[11px] font-semibold text-muted">{r.label}</span>
              <span className={cx('text-[13px] font-bold', r.status === 'missing' ? 'text-faint' : 'text-ink')}>{r.value}</span>
            </div>
            <Chip tone={CONF_TONE[r.conf]}>{r.conf}</Chip>
            {r.page && (
              <span className="flex h-6 items-center gap-1 rounded-[8px] border border-line bg-white px-2 text-[11px] font-bold text-blue">
                <Icon name="eye" size={12} />
                {r.page}
              </span>
            )}
            {ok ? (
              <Btn variant="ghost" size="sm" icon="check" className={cx(!confirmed[i] && 'text-muted')} onClick={() => setConfirmed((c) => c.map((v, j) => (j === i ? !v : v)))}>
                {confirmed[i] ? 'Confirmed' : 'Confirm'}
              </Btn>
            ) : r.status === 'missing' ? (
              <Btn size="sm">Add</Btn>
            ) : (
              <Btn size="sm" to={r.fix ? R[r.fix] : undefined}>Fix</Btn>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ───────────── overlays ───────────── */

export function Scrim({ onClick }) {
  return <FixedScrim z="z-20" onClick={onClick} />
}

/** Right-hand "Fix value" drawer (AP3b / AP4b / AP5b). */
export function FixDrawer({ kind, cancelTo, saveTo, children }) {
  const navigate = useNavigate()
  const f = fixes[kind]
  return (
    <>
      <Scrim onClick={() => navigate(cancelTo)} />
      <div data-overlay="drawer" className="fixed top-12 right-12 bottom-12 z-30 flex w-[500px] flex-col overflow-y-auto overscroll-contain gap-4 rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-[3px]">
            <h2 className="text-[20px] font-bold tracking-[-0.2px] text-ink">Fix value</h2>
            <p className="text-[12px] font-medium text-muted">{f.subtitle}</p>
          </div>
          <Link to={cancelTo} aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line">
            <Icon name="x" size={16} />
          </Link>
        </div>
        <div className="flex h-[65px] items-center gap-3 rounded-[16px] border border-[#f1d9a8] bg-[#fff9ef] px-3.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#fbf1e1] text-[#8a5a12]">
            <Icon name="sparkle" size={15} />
          </span>
          <div className="flex flex-1 flex-col gap-[3px] text-[#8a5a12]">
            <span className="text-[10px] font-bold tracking-[0.6px]">AI READ</span>
            <span className="text-[15px] font-bold line-through">{f.aiRead}</span>
          </div>
          <Chip tone={CONF_TONE[f.conf]}>{f.conf}</Chip>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-[25px] items-center gap-2">
            <span className="text-[13px] font-semibold text-ink">Source</span>
            <Chip tone="gray">{f.page}</Chip>
            {f.zoomed && <span className="text-[12px] font-medium text-muted">zoomed to the highlighted area</span>}
          </div>
          <div className="relative h-[200px] overflow-clip rounded-[14px] border border-line bg-white">
            {cropLines.map(([top, w]) => (
              <span key={top} className="absolute left-[23px] h-2 rounded-[4px] bg-[#e7ebf2]" style={{ top: top - 1, width: w }} />
            ))}
            <span className="absolute top-[73px] left-[17px] h-11 w-[300px] rounded-[8px] border-2 border-violet bg-violet/10" />
            {f.hlLabel && <span className="absolute top-[49px] left-[17px] rounded-[8px] bg-violet px-2 py-[3px] text-[10px] font-bold text-white">{f.hlLabel}</span>}
          </div>
        </div>
        {children}
        <Field label="Note (optional)">
          <TextArea defaultValue={f.note} />
        </Field>
        <span className="flex-1" />
        <div className="sticky bottom-0 flex gap-2.5 bg-white">
          <Btn variant="outline" to={cancelTo} className="flex-1">Cancel</Btn>
          <Btn icon="check" to={saveTo} className="w-[214px]">Save correction</Btn>
        </div>
      </div>
    </>
  )
}
