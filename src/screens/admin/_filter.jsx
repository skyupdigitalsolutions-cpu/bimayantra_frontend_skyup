// Small filtering helpers shared by the admin, settings, states-settings and flow-skyup screens.
import { useEffect, useRef } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'

const PILL_SELECTOR = 'input[placeholder="Search anything"]'
const findPill = () => document.querySelector(`main ${PILL_SELECTOR}`) ?? document.querySelector(PILL_SELECTOR)

/**
 * Wires the header "Search anything · Ctrl K" pill (rendered by shared header components we
 * don't own) to the current page: typing / Enter calls `onSearch(text)`, Escape clears it,
 * and Ctrl/Cmd+K focuses the pill. Without `onSearch` it only adds the Ctrl/Cmd+K focus.
 */
export function useHeaderSearch(onSearch) {
  const cb = useRef(onSearch)
  cb.current = onSearch
  useEffect(() => {
    const el = findPill()
    const onInput = (e) => cb.current?.(e.target.value)
    const onKey = (e) => {
      if (e.key === 'Enter') cb.current?.(e.target.value)
      if (e.key === 'Escape') {
        e.target.value = ''
        cb.current?.('')
      }
    }
    const onDoc = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const pill = findPill()
        if (!pill) return
        e.preventDefault()
        pill.focus()
        pill.select()
      }
    }
    el?.addEventListener('input', onInput)
    el?.addEventListener('keydown', onKey)
    document.addEventListener('keydown', onDoc)
    return () => {
      el?.removeEventListener('input', onInput)
      el?.removeEventListener('keydown', onKey)
      document.removeEventListener('keydown', onDoc)
    }
  }, [])
}

/** Empties the header search pill (used by "Clear filters"). */
export function clearHeaderSearch() {
  const el = findPill()
  if (el) el.value = ''
}

/** Case-insensitive "does any of these fields contain q" */
export function matches(q, ...fields) {
  const s = (q ?? '').trim().toLowerCase()
  if (!s) return true
  return fields.some((f) => f != null && String(f).toLowerCase().includes(s))
}

/** Empty-results row: "No matches" + clear-filters link, styled like a list row. */
export function NoMatches({ onClear, clearLabel = 'Clear filters', className = '', label = 'No matches', hint = 'Nothing fits the current filters.' }) {
  return (
    <div data-empty="no-matches" className={cx('flex items-center gap-3 rounded-[18px] bg-panel px-4 py-4', className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-muted">
        <Icon name="search" size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <p className="text-[12px] font-medium text-muted">{hint}</p>
      </div>
      {onClear && (
        <button type="button" onClick={onClear} className="text-[13px] font-semibold text-blue hover:underline">
          {clearLabel}
        </button>
      )}
    </div>
  )
}
