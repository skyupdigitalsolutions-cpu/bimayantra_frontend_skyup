// Shared list-filtering helpers for the screens owned by tasks / auth / responsive / sales / catalogue /
// states-records / states-lead / flow-lead: header search wiring, query matching, dropdown filter and empty state.
import { useCallback, useEffect, useRef, useState } from 'react'
import RawIcon from '../../components/Icon'
import { cx } from '../../components/ui'

/** Case-insensitive "does any field contain the query" (empty query matches everything). */
export function matchesQuery(q, ...fields) {
  const s = String(q ?? '').trim().toLowerCase()
  if (!s) return true
  return fields.flat().some((f) => f != null && String(f).toLowerCase().includes(s))
}

const HEADER_SEL = 'input[placeholder^="Search anything"]'
const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)

/** Ctrl/Cmd+K focuses the (visible) global "Search anything" pill. */
export function useCtrlK() {
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        const el = [...document.querySelectorAll(HEADER_SEL)].find(visible)
        if (!el) return
        e.preventDefault()
        el.focus()
        el.select?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/**
 * Wires the global "Search anything · Ctrl K" header pill (an uncontrolled input rendered by the header) to the
 * current page's list. Typing filters live; Enter commits; Escape clears. Returns [query, clear].
 */
export function useHeaderSearch() {
  const [q, setQ] = useState('')
  useCtrlK()
  useEffect(() => {
    const inputs = [...document.querySelectorAll(HEADER_SEL)]
    const onInput = (e) => setQ(e.target.value)
    const onKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); setQ(e.target.value) }
      if (e.key === 'Escape') { e.target.value = ''; setQ('') }
    }
    inputs.forEach((i) => { i.addEventListener('input', onInput); i.addEventListener('keydown', onKey) })
    return () => inputs.forEach((i) => { i.removeEventListener('input', onInput); i.removeEventListener('keydown', onKey) })
  }, [])
  const clear = useCallback(() => {
    document.querySelectorAll(HEADER_SEL).forEach((i) => { i.value = '' })
    setQ('')
  }, [])
  return [q, clear]
}

/** Closes a popover when clicking outside `ref` or pressing Escape. */
export function useDismiss(open, setOpen) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open, setOpen])
  return ref
}

/**
 * Pill dropdown filter ("Pipeline: All ▾"). options: [{key,label,count?}]; value = selected key (allKey = no filter).
 * size md = 44px (desktop filter row) · sm = 33/36px (mobile / card heads).
 */
export function DropFilter({ label, value, options, onChange, allKey = 'all', icon, size = 'md', align = 'right', chevron = true, className = '', buttonClass = '', menuClass = '', title }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, setOpen)
  const cur = options.find((o) => o.key === value)
  const on = value !== allKey
  return (
    <div ref={ref} className={cx('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'flex items-center gap-2 font-semibold whitespace-nowrap',
          size === 'md' ? 'h-11 rounded-[22px] px-3.5 text-[13px]' : 'h-[33px] gap-1.5 rounded-[16px] px-3 text-[12px]',
          on ? 'border-[1.5px] border-blue bg-blue-50 text-blue' : 'border border-line bg-white text-ink',
          buttonClass,
        )}
      >
        {icon && <RawIcon name={icon} size={size === 'md' ? 15 : 13} className={on ? 'text-blue' : 'text-muted'} />}
        {label}: {cur?.label ?? 'All'}
        {chevron && <RawIcon name="chev-down" size={size === 'md' ? 15 : 13} className={cx(on ? 'text-blue' : 'text-muted', open && 'rotate-180')} />}
      </button>
      {open && (
        <div
          role="listbox"
          className={cx(
            'absolute top-[calc(100%+8px)] z-40 flex min-w-[220px] flex-col gap-0.5 rounded-[18px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]',
            align === 'right' ? 'right-0' : 'left-0',
            menuClass,
          )}
        >
          {title && <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">{title}</p>}
          {options.map((o) => {
            const sel = o.key === value
            return (
              <button
                key={o.key}
                type="button"
                role="option"
                aria-selected={sel}
                onClick={() => { onChange(o.key); setOpen(false) }}
                className={cx('flex h-10 shrink-0 items-center gap-2.5 rounded-[12px] px-2.5 text-left text-[13px] font-semibold text-ink hover:bg-[#f3f7ff]', sel && 'bg-[#f3f7ff]')}
              >
                <span className="flex-1 whitespace-nowrap">{o.label}</span>
                {o.count != null && <span className="text-[11px] font-bold text-muted">{o.count}</span>}
                {sel && <RawIcon name="check" size={15} className="text-blue" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** "No matches" row/card shown when filters leave a list empty. */
export function NoMatches({ onClear, text = 'No matches', sub = 'Nothing fits the current search or filters.', className = '' }) {
  return (
    <div data-empty="no-matches" className={cx('flex items-center gap-3.5 px-6 py-6', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-panel text-muted">
        <RawIcon name="search" size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-bold text-ink">{text}</p>
        <p className="text-[12px] font-medium text-muted">{sub}</p>
      </div>
      {onClear && (
        <button type="button" onClick={onClear} className="shrink-0 text-[13px] font-bold text-blue hover:underline">
          Clear filters
        </button>
      )}
    </div>
  )
}
