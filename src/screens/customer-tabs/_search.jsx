// Page-level search helpers shared by the customer / quotation / proposal / product flows.
//  useHeaderSearch(onQuery): wires the header "Search anything · Ctrl K" pill (whichever component renders it)
//    — Ctrl/Cmd+K focuses it; typing (and Enter) reports the query so the page can filter its own list.
//  matches(q, ...fields): case-insensitive "every word appears in some field" test.
//  NoMatches: small empty-state row with a clear-filters link.
import { useEffect, useRef } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'

const SEL = 'input[placeholder^="Search anything"]'

export function useHeaderSearch(onQuery) {
  const cb = useRef(onQuery)
  cb.current = onQuery
  useEffect(() => {
    const isPill = (t) => t && t.matches && t.matches(SEL)
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key?.toLowerCase() === 'k') {
        const el = document.querySelector(SEL)
        if (el) {
          e.preventDefault()
          el.focus()
          el.select()
        }
        return
      }
      if (isPill(e.target)) {
        if (e.key === 'Enter') cb.current?.(e.target.value)
        if (e.key === 'Escape') {
          e.target.value = ''
          cb.current?.('')
          e.target.blur()
        }
      }
    }
    const onInput = (e) => {
      if (isPill(e.target)) cb.current?.(e.target.value)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('input', onInput)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('input', onInput)
    }
  }, [])
}

/** Clears the header pill's text (used by "Clear filters"). */
export function clearHeaderSearch() {
  const el = typeof document !== 'undefined' && document.querySelector(SEL)
  if (el) el.value = ''
}

export function matches(q, ...fields) {
  const words = String(q ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = fields.flat(Infinity).filter((v) => v != null && typeof v !== 'object').join(' ').toLowerCase()
  return words.every((w) => hay.includes(w))
}

export function NoMatches({ onClear, label = 'No matches', className = '' }) {
  return (
    <div data-empty="no-matches" className={cx('flex items-center gap-3 rounded-[18px] bg-panel px-4 py-3.5', className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-muted">
        <Icon name="search" size={16} />
      </span>
      <p className="flex-1 text-[13px] font-semibold text-muted">{label}</p>
      {onClear && (
        <button
          type="button"
          onClick={() => {
            clearHeaderSearch()
            onClear()
          }}
          className="text-[12px] font-bold text-blue hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
