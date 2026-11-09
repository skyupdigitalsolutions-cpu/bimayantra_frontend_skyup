// P-09 global search behind the header "Search anything · Ctrl K" pill.
// On a page that filters its own list with the pill (it registered with headerSearchBus) the pill keeps doing that.
// Everywhere else (dashboard, detail pages, forms…) typing shows leads, customers, family members, quotations and
// policies from GET /search, grouped, in a panel under the pill. ↑/↓ move, Enter opens, Escape closes.
// Mounted once in App; listens on `document`, so it works with every header that renders the pill.
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { cx } from './ui'
import { api } from '../api'
import { useAuth } from '../auth/AuthProvider'
import { isPill, hasConsumer, subscribe, visiblePills } from './headerSearchBus'

const MIN = 3 // CFG-24 (search starts after 3 characters); the API's own message is shown if it is set higher
const ROLES = ['ADV', 'AST'] // search.use
const GROUP_LABEL = { LEADS: 'Leads', CUSTOMERS: 'Customers', FAMILY_MEMBERS: 'Family members', QUOTATIONS: 'Quotations', POLICIES: 'Policies' }
const ICON = { LEAD: 'user-plus', CUSTOMER: 'users', FAMILY_MEMBER: 'users', QUOTATION: 'quote', POLICY: 'shield' }

function hrefFor(open) {
  if (!open?.id) return null
  if (open.type === 'LEAD') return `/leads/${open.id}`
  if (open.type === 'CUSTOMER') return open.tab ? `/customers/${open.id}/${open.tab}` : `/customers/${open.id}`
  if (open.type === 'QUOTATION') return `/quotations/${open.id}`
  if (open.type === 'POLICY') return `/policies/${open.id}`
  return null
}
const statusLabel = (s) => (s ? String(s).toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '')

export default function GlobalSearch() {
  const { user } = useAuth() ?? {}
  const navigate = useNavigate()
  const loc = useLocation()
  const [anchor, setAnchor] = useState(null) // the pill being typed in
  const [text, setText] = useState('')
  const [res, setRes] = useState({ state: 'idle' }) // idle | short | loading | done | error
  const [active, setActive] = useState(0)
  const [rect, setRect] = useState(null)
  const panel = useRef(null)
  const allowed = !!user && ROLES.includes(user.role)
  const items = res.state === 'done' ? res.groups.flatMap((g) => g.items) : []
  const itemsRef = useRef(items)
  itemsRef.current = items
  const activeRef = useRef(active)
  activeRef.current = active

  const close = () => { setAnchor(null); setRes({ state: 'idle' }); setActive(0) }
  const go = (it) => {
    const to = hrefFor(it?.open)
    if (!to) return
    close()
    if (anchor) { anchor.value = ''; anchor.blur() }
    navigate(to)
  }
  const goRef = useRef(go)
  goRef.current = go

  // Typing in a pill on a page without its own list filter opens the panel.
  useEffect(() => {
    const onInput = (e) => {
      if (!isPill(e.target) || hasConsumer()) return
      setAnchor(e.target)
      setText(e.target.value)
      setActive(0)
    }
    const onFocus = (e) => {
      if (!isPill(e.target) || hasConsumer() || !e.target.value.trim()) return
      setAnchor(e.target)
      setText(e.target.value)
    }
    const onKey = (e) => {
      // Ctrl/Cmd+K focuses the pill on every page (some headers have no page hook to do it)
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key?.toLowerCase() === 'k') {
        const el = visiblePills()[0]
        if (el && document.activeElement !== el) { e.preventDefault(); el.focus(); el.select?.() }
        return
      }
      if (!isPill(e.target) || hasConsumer()) return
      const n = itemsRef.current.length
      if (e.key === 'ArrowDown' && n) { e.preventDefault(); setActive((a) => (a + 1) % n) }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setActive((a) => (a - 1 + n) % n) }
      else if (e.key === 'Enter') { e.preventDefault(); if (n) goRef.current(itemsRef.current[activeRef.current] ?? itemsRef.current[0]) }
      else if (e.key === 'Escape') { e.target.value = ''; setText(''); close() }
    }
    const onDown = (e) => {
      if (panel.current?.contains(e.target) || isPill(e.target)) return
      close()
    }
    document.addEventListener('input', onInput)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    // a page that starts filtering its own list takes the pill over
    const off = subscribe((n) => { if (n > 0) close() })
    return () => {
      document.removeEventListener('input', onInput)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
      off()
    }
  }, [])

  // New page: close.
  useEffect(() => { close() }, [loc.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Query the API, debounced; drop answers to older text.
  useEffect(() => {
    if (!anchor) return undefined
    const q = text.trim()
    if (!q) { setRes({ state: 'idle' }); return undefined }
    if (!allowed) { setRes({ state: 'unavailable' }); return undefined }
    if (q.length < MIN) { setRes({ state: 'short' }); return undefined }
    let live = true
    setRes((r) => ({ ...r, state: r.state === 'done' ? 'done' : 'loading', loading: true }))
    const t = setTimeout(() => {
      api.search.all(q)
        .then(({ data }) => { if (live) { setRes({ state: 'done', groups: (data?.groups ?? []).filter((g) => g.items?.length), count: data?.count ?? 0, message: data?.message }); setActive(0) } })
        .catch((e) => { if (live) setRes({ state: 'error', message: e?.fieldErrors?.q ?? e?.message ?? 'Search failed.' }) })
    }, 250)
    return () => { live = false; clearTimeout(t) }
  }, [text, anchor, allowed])

  // Stay under the pill while the page scrolls or resizes.
  useEffect(() => {
    if (!anchor) return undefined
    const place = () => setRect((anchor.closest('label') ?? anchor).getBoundingClientRect())
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => { window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place) }
  }, [anchor])

  if (!anchor || !rect || res.state === 'idle' || !document.contains(anchor)) return null
  const width = Math.max(420, rect.width)
  const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12))
  let i = -1
  return (
    <div ref={panel} role="listbox" aria-label="Search results" data-global-search
      style={{ position: 'fixed', top: rect.bottom + 8, left, width }}
      className="z-[90] flex max-h-[min(520px,70vh)] flex-col overflow-y-auto rounded-[24px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.25)]">
      {res.state === 'short' && <Note>Type at least {MIN} characters to search.</Note>}
      {res.state === 'unavailable' && <Note>Search isn’t available on this page.</Note>}
      {res.state === 'loading' && <Note>Searching…</Note>}
      {res.state === 'error' && <Note tone="error">{res.message}</Note>}
      {res.state === 'done' && !items.length && <Note>{res.message ?? `Nothing matches “${text.trim()}”.`}</Note>}
      {res.state === 'done' && res.groups.map((g) => (
        <div key={g.group} className="flex flex-col gap-0.5 py-1">
          <p className="px-3 pt-1.5 pb-1 text-[11px] font-bold text-muted">{GROUP_LABEL[g.group] ?? g.group}</p>
          {g.items.map((it) => {
            i += 1
            const idx = i
            const on = idx === active
            return (
              <button key={`${it.type}${it.id}`} type="button" role="option" aria-selected={on} onMouseEnter={() => setActive(idx)} onClick={() => go(it)}
                className={cx('flex items-center gap-3 rounded-[14px] px-3 py-2 text-left', on ? 'bg-[#f3f7ff]' : 'hover:bg-panel')}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-panel text-muted"><Icon name={ICON[it.type] ?? 'search'} size={15} /></span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] font-bold text-ink">{it.title}</span>
                  {it.subtitle && <span className="truncate text-[11px] font-medium text-muted">{it.subtitle}</span>}
                </span>
                {it.status && <span className="shrink-0 rounded-[10px] bg-panel px-2 py-0.5 text-[11px] font-semibold text-muted">{statusLabel(it.status)}</span>}
              </button>
            )
          })}
          {g.more && <p className="px-3 pb-1 text-[11px] font-medium text-muted">More {(GROUP_LABEL[g.group] ?? '').toLowerCase()} match — type more to narrow it down.</p>}
        </div>
      ))}
    </div>
  )
}

function Note({ tone, children }) {
  return <p className={cx('px-3 py-3 text-[13px] font-medium', tone === 'error' ? 'text-[#b4323c]' : 'text-muted')}>{children}</p>
}
