// App-styled dropdown, date picker and time picker, used instead of the browser's <select> and <input type="date">.
// The list / calendar opens in a layer on <body>, so dialogs, drawers and scroll boxes never clip it, and it stays
// under (or above, when there is no room) its field while the page scrolls.
//   <Dropdown value options onChange(value) placeholder disabled />    options: ['A', …] | [{ value, label, disabled, hint }] | [[value, label], …]
//   <DatePicker value="YYYY-MM-DD" onChange(value) min max placeholder clearable />
//   <TimePicker value="HH:mm" onChange(value) options? min? step? />
import { Children, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { twMerge } from 'tailwind-merge'

const cx = (...c) => twMerge(c.filter(Boolean).join(' '))

/* ───────── shared: anchored layer ───────── */
function useAnchored(open, anchorRef, layerRef, { minWidth = 0, gap = 6 } = {}) {
  const [pos, setPos] = useState(null)
  const place = useCallback(() => {
    const a = anchorRef.current
    if (!a) return
    const r = a.getBoundingClientRect()
    const layer = layerRef.current
    const h = layer ? layer.offsetHeight : 320
    const w = Math.max(r.width, minWidth)
    const below = window.innerHeight - r.bottom
    const up = below < h + gap + 8 && r.top > below
    // Keep the layer on screen using its real width (a calendar is wider than a narrow phone field)
    const lw = Math.max(w, layer ? layer.offsetWidth : 0)
    let left = r.left
    if (left + lw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - lw)
    setPos({ left, width: w, top: up ? Math.max(8, r.top - h - gap) : r.bottom + gap, up })
  }, [anchorRef, layerRef, minWidth, gap])
  useLayoutEffect(() => { if (open) place() }, [open, place])
  useEffect(() => {
    if (!open) return undefined
    const raf = requestAnimationFrame(place) // again once the layer has its real height
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, place])
  return pos
}
function useOutside(open, refs, onOutside) {
  useEffect(() => {
    if (!open) return undefined
    const down = (e) => { if (!refs.some((r) => r.current?.contains(e.target))) onOutside() }
    document.addEventListener('mousedown', down, true)
    document.addEventListener('touchstart', down, true)
    return () => { document.removeEventListener('mousedown', down, true); document.removeEventListener('touchstart', down, true) }
  }, [open, refs, onOutside])
}
function Layer({ pos, layerRef, children, className = '', label }) {
  return createPortal(
    <div ref={layerRef} data-rsp role="presentation" aria-label={label} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}
      className={cx('fixed z-[300] rounded-[16px] border border-[#e6e9f0] bg-white shadow-[0px_20px_44px_-12px_rgba(19,41,75,0.3)]', !pos && 'invisible', className)}
      style={pos ? { top: pos.top, left: pos.left, minWidth: Math.min(pos.width, window.innerWidth - 16), maxWidth: 'calc(100vw - 16px)' } : { top: 0, left: 0 }}>
      {children}
    </div>,
    document.body,
  )
}

/** The field look shared by every trigger: panel background, rounded, chevron that opens it too. */
const FIELD = 'flex h-[50px] w-full min-w-0 items-center gap-2.5 rounded-[16px] bg-panel px-4 text-left text-[14px] outline-none transition focus-visible:ring-2 focus-visible:ring-blue/30 disabled:cursor-not-allowed disabled:opacity-60'

/* ───────── Dropdown ───────── */
const norm = (o) => (Array.isArray(o) ? { value: o[0], label: o[1] ?? String(o[0]) } : typeof o === 'object' && o !== null ? { ...o, label: o.label ?? String(o.value) } : { value: o, label: String(o) })

export function Dropdown({
  value, options = [], onChange, placeholder = 'Choose', disabled, className = '', buttonClassName = '', invalid,
  leading, searchable, minWidth = 200, id, name, 'aria-label': ariaLabel, renderValue,
}) {
  const opts = useMemo(() => options.map(norm), [options])
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hi, setHi] = useState(-1)
  const btn = useRef(null)
  const layer = useRef(null)
  const list = useRef(null)
  const typed = useRef({ s: '', t: 0 })
  const listId = useId()
  const pos = useAnchored(open, btn, layer, { minWidth })
  const close = useCallback(() => { setOpen(false); setQ('') }, [])
  useOutside(open, [btn, layer], close)
  const search = searchable ?? opts.length > 10
  const shown = q.trim() ? opts.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase())) : opts
  const sel = opts.find((o) => String(o.value) === String(value ?? ''))
  // an empty-value option ("Choose", "Not given", "Default pipeline") reads as the placeholder, not as a choice
  const hasValue = !!sel && sel.value !== '' && sel.value !== null && sel.value !== undefined
  const shownPlaceholder = sel && !hasValue && sel.label?.trim() ? sel.label : placeholder

  const openList = () => {
    if (disabled) return
    setOpen(true)
    setHi(Math.max(0, shown.findIndex((o) => String(o.value) === String(value ?? ''))))
  }
  const pick = (o) => { if (o.disabled) return; onChange?.(o.value); close(); btn.current?.focus() }
  const move = (d) => {
    if (!shown.length) return
    let i = hi
    for (let n = 0; n < shown.length; n++) { i = (i + d + shown.length) % shown.length; if (!shown[i].disabled) break }
    setHi(i)
  }
  useEffect(() => { if (open && hi >= 0) list.current?.querySelector(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' }) }, [open, hi])
  const onKey = (e) => {
    if (disabled) return
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); openList() }
      return
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); btn.current?.focus() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
    else if (e.key === 'Home') { e.preventDefault(); setHi(0) }
    else if (e.key === 'End') { e.preventDefault(); setHi(shown.length - 1) }
    else if (e.key === 'Enter') { e.preventDefault(); if (shown[hi]) pick(shown[hi]) }
    else if (e.key === 'Tab') close()
    else if (!search && e.key.length === 1) { // type to jump
      const t = Date.now(); typed.current = { s: (t - typed.current.t < 700 ? typed.current.s : '') + e.key.toLowerCase(), t }
      const i = shown.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.s))
      if (i >= 0) setHi(i)
    }
  }

  return (
    <div className={cx('relative min-w-0', className)}>
      <button ref={btn} id={id} name={name} type="button" disabled={disabled} onClick={() => (open ? close() : openList())} onKeyDown={onKey}
        role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-label={ariaLabel}
        className={cx(FIELD, open && 'ring-2 ring-blue/30', invalid && 'ring-2 ring-[#b4323c]', buttonClassName)}>
        {leading}
        <span className={cx('min-w-0 flex-1 truncate', hasValue ? 'font-semibold text-ink' : 'font-medium text-faint')}>{hasValue ? (renderValue ? renderValue(sel) : sel.label) : shownPlaceholder}</span>
        <Icon name="chev-down" size={17} className={cx('shrink-0 text-muted transition', open && 'rotate-180')} />
      </button>
      {open && (
        <Layer pos={pos} layerRef={layer} className="flex max-h-[320px] flex-col overflow-hidden p-1.5">
          {search && (
            <div className="mb-1 flex h-10 shrink-0 items-center gap-2 rounded-[11px] bg-panel px-3">
              <Icon name="search" size={14} className="text-muted" />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setHi(0) }} onKeyDown={onKey} placeholder="Search…" className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint" />
            </div>
          )}
          <div ref={list} id={listId} role="listbox" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {shown.length === 0 && <p className="px-3 py-2.5 text-[13px] font-medium text-muted">No matches</p>}
            {shown.map((o, i) => {
              const on = String(o.value) === String(value ?? '')
              return (
                <button key={`${o.value}`} type="button" data-i={i} role="option" aria-selected={on} aria-disabled={o.disabled || undefined}
                  onMouseEnter={() => !o.disabled && setHi(i)} onClick={() => pick(o)}
                  className={cx('flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13px]',
                    o.disabled ? 'cursor-not-allowed text-faint' : i === hi ? 'bg-[#f3f7ff] text-ink' : 'text-ink',
                    on && !o.disabled ? 'font-bold' : 'font-semibold')}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{o.label || placeholder}</span>
                    {o.hint && <span className="block truncate text-[11px] font-medium text-muted">{o.hint}</span>}
                  </span>
                  {on && <Icon name="check" size={14} className="shrink-0 text-blue" />}
                </button>
              )
            })}
          </div>
        </Layer>
      )}
    </div>
  )
}

/* ───────── DatePicker ───────── */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const pad = (n) => String(n).padStart(2, '0')
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
const parse = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || '')); return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null }
/** Today in India, as YYYY-MM-DD (the app works in IST). */
const todayIst = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
const addDays = (v, n) => { const p = parse(v); const d = new Date(Date.UTC(p.y, p.m, p.d + n)); return iso(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) }
const fmt = (v) => { const p = parse(v); if (!p) return ''; const d = new Date(Date.UTC(p.y, p.m, p.d)); return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) }

export function DatePicker({ value, onChange, min: minIn, max: maxIn, placeholder = 'Choose a date', disabled, clearable = true, invalid, className = '', buttonClassName = '', id, quick = true }) {
  const [open, setOpen] = useState(false)
  const today = todayIst()
  const min = minIn === 'today' ? today : minIn || undefined
  const max = maxIn === 'today' ? today : maxIn || undefined
  const start = parse(value) || parse(min && min > today ? min : max && max < today ? max : today)
  const [view, setView] = useState({ y: start.y, m: start.m })
  const [mode, setMode] = useState('days') // days | months | years
  const [focus, setFocus] = useState(value || today)
  const btn = useRef(null)
  const layer = useRef(null)
  const pos = useAnchored(open, btn, layer, { minWidth: 304 })
  const close = useCallback(() => { setOpen(false); setMode('days') }, [])
  useOutside(open, [btn, layer], close)
  const out = (v) => (min && v < min) || (max && v > max)
  const show = () => { if (disabled) return; const s = parse(value) || start; setView({ y: s.y, m: s.m }); setFocus(value || iso(s.y, s.m, s.d)); setMode('days'); setOpen(true) }
  const pick = (v) => { if (out(v)) return; onChange?.(v); close(); btn.current?.focus() }
  const shiftMonth = (d) => setView((x) => { const t = x.m + d; return { y: x.y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 } })
  const go = (v) => { setFocus(v); const p = parse(v); setView({ y: p.y, m: p.m }) }
  const onKey = (e) => {
    if (!open) { if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); show() } return }
    const k = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (k && mode === 'days') { e.preventDefault(); go(addDays(focus, k)) }
    else if (e.key === 'PageUp') { e.preventDefault(); shiftMonth(-1) }
    else if (e.key === 'PageDown') { e.preventDefault(); shiftMonth(1) }
    else if (e.key === 'Enter') { e.preventDefault(); pick(focus) }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); btn.current?.focus() }
    else if (e.key === 'Tab') close()
  }
  // days grid, Monday first
  const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay()
  const lead = (first + 6) % 7
  const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const yearBase = view.y - (view.y % 12)
  const monthOut = (m) => (min && iso(view.y, m, new Date(Date.UTC(view.y, m + 1, 0)).getUTCDate()) < min) || (max && iso(view.y, m, 1) > max)
  const yearOut = (y) => (min && `${y}-12-31` < min) || (max && `${y}-01-01` > max)
  const prevOk = mode === 'years' ? !yearOut(yearBase - 1) : mode === 'months' ? !yearOut(view.y - 1) : !(min && iso(view.y, view.m, 1) <= min)
  const nextOk = mode === 'years' ? !yearOut(yearBase + 12) : mode === 'months' ? !yearOut(view.y + 1) : !(max && iso(view.y, view.m, days) >= max)
  const prev = () => (mode === 'years' ? setView((x) => ({ ...x, y: x.y - 12 })) : mode === 'months' ? setView((x) => ({ ...x, y: x.y - 1 })) : shiftMonth(-1))
  const next = () => (mode === 'years' ? setView((x) => ({ ...x, y: x.y + 12 })) : mode === 'months' ? setView((x) => ({ ...x, y: x.y + 1 })) : shiftMonth(1))
  const quicks = [['Today', today], ['Tomorrow', addDays(today, 1)], ['In a week', addDays(today, 7)]].filter(([, v]) => !out(v))

  return (
    <div className={cx('relative min-w-0', className)}>
      <button ref={btn} id={id} type="button" disabled={disabled} onClick={() => (open ? close() : show())} onKeyDown={onKey} aria-haspopup="dialog" aria-expanded={open}
        className={cx(FIELD, open && 'ring-2 ring-blue/30', invalid && 'ring-2 ring-[#b4323c]', buttonClassName)}>
        <Icon name="calendar" size={17} className="shrink-0 text-muted" />
        <span className={cx('min-w-0 flex-1 truncate', value ? 'font-semibold text-ink' : 'font-medium text-faint')}>{value ? fmt(value) : placeholder}</span>
        {clearable && value && !disabled
          ? <span role="button" tabIndex={-1} aria-label="Clear date" onClick={(e) => { e.stopPropagation(); onChange?.('') }} className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white hover:text-ink"><Icon name="x" size={13} /></span>
          : <Icon name="chev-down" size={17} className={cx('shrink-0 text-muted transition', open && 'rotate-180')} />}
      </button>
      {open && (
        <Layer pos={pos} layerRef={layer} className="w-[304px] p-3" label="Choose a date">
          <div className="flex items-center gap-1" onKeyDown={onKey}>
            <button type="button" aria-label="Previous" disabled={!prevOk} onClick={prev} className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-panel disabled:opacity-30"><Icon name="chev-right" size={16} className="rotate-180" /></button>
            <div className="flex flex-1 items-center justify-center gap-1">
              <button type="button" onClick={() => setMode(mode === 'months' ? 'days' : 'months')} className={cx('rounded-[10px] px-2 py-1.5 text-[14px] font-bold hover:bg-panel', mode === 'months' ? 'bg-panel text-blue' : 'text-ink')}>{MONTHS[view.m]}</button>
              <button type="button" onClick={() => setMode(mode === 'years' ? 'days' : 'years')} className={cx('rounded-[10px] px-2 py-1.5 text-[14px] font-bold hover:bg-panel', mode === 'years' ? 'bg-panel text-blue' : 'text-ink')}>{mode === 'years' ? `${yearBase}–${yearBase + 11}` : view.y}</button>
            </div>
            <button type="button" aria-label="Next" disabled={!nextOk} onClick={next} className="flex size-9 items-center justify-center rounded-full text-ink hover:bg-panel disabled:opacity-30"><Icon name="chev-right" size={16} /></button>
          </div>

          {mode === 'days' && (
            <>
              <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-bold text-muted">{WEEK.map((w) => <span key={w} className="py-1">{w}</span>)}</div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((d, i) => {
                  if (!d) return <span key={`e${i}`} />
                  const v = iso(view.y, view.m, d)
                  const dis = out(v); const on = v === value; const isToday = v === today; const foc = v === focus
                  return (
                    <button key={v} type="button" disabled={dis} onClick={() => pick(v)} onMouseEnter={() => setFocus(v)}
                      className={cx('mx-auto flex size-9 items-center justify-center rounded-full text-[13px] transition',
                        dis ? 'cursor-not-allowed text-[#c3ccd8]' : on ? 'bg-navy font-bold text-white' : foc ? 'bg-[#e8f0fd] font-semibold text-ink' : 'font-semibold text-ink hover:bg-panel',
                        isToday && !on && 'ring-1 ring-blue ring-inset')}>
                      {d}
                    </button>
                  )
                })}
              </div>
            </>
          )}
          {mode === 'months' && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {MONTHS.map((n, m) => (
                <button key={n} type="button" disabled={monthOut(m)} onClick={() => { setView((x) => ({ ...x, m })); setMode('days') }}
                  className={cx('h-11 rounded-[12px] text-[13px] font-semibold disabled:cursor-not-allowed disabled:text-[#c3ccd8]', m === view.m ? 'bg-navy text-white' : 'text-ink hover:bg-panel')}>{n.slice(0, 3)}</button>
              ))}
            </div>
          )}
          {mode === 'years' && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => yearBase + i).map((y) => (
                <button key={y} type="button" disabled={yearOut(y)} onClick={() => { setView((x) => ({ ...x, y })); setMode('months') }}
                  className={cx('h-11 rounded-[12px] text-[13px] font-semibold disabled:cursor-not-allowed disabled:text-[#c3ccd8]', y === view.y ? 'bg-navy text-white' : 'text-ink hover:bg-panel')}>{y}</button>
              ))}
            </div>
          )}

          {(quick || clearable) && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
              {quick && quicks.map(([l, v]) => (
                <button key={l} type="button" onClick={() => pick(v)} className={cx('h-7 rounded-[14px] border px-2.5 text-[12px] font-semibold', v === value ? 'border-blue bg-blue-50 text-blue' : 'border-line text-ink-2 hover:bg-tile')}>{l}</button>
              ))}
              <span className="flex-1" />
              {clearable && value && <button type="button" onClick={() => { onChange?.(''); close() }} className="h-7 rounded-[14px] px-2.5 text-[12px] font-semibold text-[#b4323c] hover:bg-[#fdf6f7]">Clear</button>}
            </div>
          )}
        </Layer>
      )}
    </div>
  )
}

/* ───────── TimePicker ───────── */
const label12 = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}` }
/** Every `step` minutes from `from` to `to` ("HH:mm"); slots up to `after` (e.g. now, when the date is today) are shown as passed. */
export function TimePicker({ value, onChange, from = '08:00', to = '21:00', step = 30, after, placeholder = 'Choose a time', ...rest }) {
  const options = useMemo(() => {
    const [fh, fm] = from.split(':').map(Number); const [th, tm] = to.split(':').map(Number)
    const out = []
    for (let t = fh * 60 + fm; t <= th * 60 + tm; t += step) out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`)
    if (value && !out.includes(value)) out.push(value)
    return out.sort().map((t) => {
      const passed = !!after && t <= after && t !== value
      return { value: t, label: label12(t), disabled: passed, hint: passed ? 'Already passed' : undefined }
    })
  }, [from, to, step, after, value])
  return <Dropdown value={value} onChange={onChange} options={options} placeholder={placeholder} leading={<Icon name="clock" size={17} className="shrink-0 text-muted" />} searchable={false} minWidth={180} {...rest} />
}

/* ───────── drop-in for a native <select> ───────── */
const text = (n) => Children.toArray(n).map((x) => (typeof x === 'string' || typeof x === 'number' ? String(x) : '')).join('')
/**
 * Takes the same props as <select> (value or defaultValue, onChange(event), <option> children or `options`) and
 * calls onChange with { target: { value } }, so code written for the browser select keeps working unchanged.
 */
export function SelectCompat({ value, defaultValue, onChange, options, children, className = '', buttonClassName = '', disabled, placeholder, id, name, invalid, leading }) {
  const opts = useMemo(() => options
    ? options.map((o) => (typeof o === 'object' && o !== null && !Array.isArray(o) ? o : norm(o)))
    : Children.toArray(children).filter(isValidElement).map((c) => {
      const label = text(c.props.children)
      return { value: c.props.value ?? label, label: label || String(c.props.value ?? ''), disabled: !!c.props.disabled }
    }), [options, children])
  const controlled = value !== undefined
  const [own, setOwn] = useState(defaultValue ?? opts[0]?.value ?? '')
  return (
    <Dropdown value={controlled ? value : own} options={opts} disabled={disabled} placeholder={placeholder} className={className} buttonClassName={buttonClassName}
      id={id} name={name} invalid={invalid} leading={leading}
      onChange={(v) => { if (!controlled) setOwn(v); onChange?.({ target: { value: v, name }, currentTarget: { value: v, name } }) }} />
  )
}