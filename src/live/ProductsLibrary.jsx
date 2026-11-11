// 10 · Products library (Figma 38:3490) on the live API.
// Cards follow the design: coloured header, variant picker (radio + per-variant "Compare" tick, "Compare all N variants"),
// four key-feature tiles, "Add to compare" / "In compare", quote status chip, Details + New quotation, and the
// navy compare tray ("Compare (n of 3)") that opens the feature table narrowed to the picked variants.
//
// Data
//   GET /products                       → cards (name, insurer, type, variants, canQuote, agent code state)
//   GET /my-products/types              → the type tabs (All · Health · Motor · Life and Term · Travel …)
//   GET /catalogue/feature-table        → key-feature tiles per variant (one call per insurance type shown)
//   GET /products/:id  (only when a picker opens) → sum-insured range and cover type for each variant
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { useToast } from '../components/LiveToast'
import { Header, HeadButton, SmallButton, SegTabs, StatusChip, Tick } from '../screens/catalogue/_parts'
import { matchesQuery, useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { api, useQuery } from '../api'
import { label } from './kit'
import { ErrorPanel } from './common'

/* ───────── look ───────── */
// Header colours run in the design's order across the grid.
const CARD_BG = ['bg-[#fde8ec]', 'bg-[#fde8c9]', 'bg-[#e9e3fc]', 'bg-[#d9eafd]', 'bg-[#d4f1e7]', 'bg-[#eef1f5]']
const TYPE_ICON = { health: 'heart', motor: 'car', car: 'car', bike: 'car', life: 'umbrella', term: 'umbrella', travel: 'plane' }
const iconOf = (type) => TYPE_ICON[String(type || '').toLowerCase().split(/[\s/]/)[0]] ?? 'box'
const MAX_COMPARE = 3
const TRAY_KEY = 'bimayantra.products.compare'

const quoteChip = (p) => (p.canQuote ? <StatusChip tone="green" icon="check">Can quote</StatusChip>
  : p.renewalOnly ? <StatusChip tone="rose" icon="x">Withdrawn</StatusChip>
    : p.agentCode === 'EXPIRED' ? <StatusChip tone="amber" icon="alert">Agent code expired</StatusChip>
      : p.agentCode !== 'ACTIVE' ? <StatusChip tone="amber" icon="alert">Add agent code</StatusChip>
        : <StatusChip tone="neutral">{label(p.status)}</StatusChip>)

/* ───────── small helpers ───────── */
const vName = (v) => (typeof v === 'string' ? v : v?.name ?? '')
/** "Aditya Birla Health Insurance Co. Ltd." → "Aditya Birla" (full name stays in the tooltip) */
function shortInsurer(s) {
  if (!s) return ''
  let x = String(s).replace(/\s*\b(general\s+)?insurance\b.*$/i, '').replace(/\s+(co\.?|company|ltd\.?|limited)$/i, '').trim()
  if (/\shealth$/i.test(x) && x.split(/\s+/).length > 2) x = x.replace(/\s+health$/i, '')
  return x || s
}
const num = (n) => String(Number(n.toFixed(2)))
function inr(n) {
  const v = Number(n)
  if (!v) return null
  if (v >= 1e7) return [num(v / 1e7), 'crore']
  if (v >= 1e5) return [num(v / 1e5), 'lakh']
  return [v.toLocaleString('en-IN'), '']
}
/** ₹3 – 10 lakh · ₹10 lakh – 1 crore */
function siRange(min, max) {
  const a = inr(min), b = inr(max)
  if (a && b) return a[1] === b[1] ? `₹${a[0]} – ${b[0]} ${a[1]}`.trim() : `₹${a.join(' ')} – ${b.join(' ')}`.trim()
  if (a) return `from ₹${a.join(' ')}`.trim()
  if (b) return `up to ₹${b.join(' ')}`.trim()
  return null
}
function fmtFeature(v) {
  if (v === null || v === undefined || v === '') return '—'
  if (v === true) return 'Yes'
  if (v === false) return 'No'
  if (Array.isArray(v)) return v.length ? v.map(fmtFeature).join(', ') : '—'
  if (typeof v === 'object') {
    if (v.notStated) return '—'
    return fmtFeature(v.value ?? v.label ?? v.text ?? null)
  }
  return String(v)
}
/** Every variant name we know for a product: the list's variants, then any extra the feature table has. */
function variantsOf(p, cols = []) {
  const names = [...(p.variants || []).map(vName), ...cols.filter((c) => c.productId === p.id).map((c) => c.variantName)]
  const out = [...new Set(names.filter(Boolean))]
  if (!out.length) out.push(p.defaultVariant || 'Standard')
  return out
}

/* ───────── key-feature tiles (from the feature table) ───────── */
// The design's four tiles. A type that lacks one (motor, travel…) fills the slot with its own next feature.
const KEY_FEATURES = [
  ['Room rent', [/room\s*rent/i]],
  ['Co-pay', [/co[-\s]?pay/i]],
  ['PED wait', [/pre[-\s]?existing/i, /\bped\b/i]],
  ['Claims', [/claim.*(settle|ratio|paid)/i, /\bcsr\b/i, /claim(?!.*bonus)/i]],
]
function buildKeyFeatures(table) {
  const rows = (table?.groups ?? []).flatMap((g) => g.rows ?? [])
  const used = new Set()
  const slots = KEY_FEATURES.map(([lbl, tests]) => {
    for (const re of tests) {
      const r = rows.find((x) => !used.has(x.key) && re.test(`${x.name ?? ''} ${x.key ?? ''}`))
      if (r) { used.add(r.key); return { label: lbl, row: r } }
    }
    return { label: lbl, row: null }
  })
  const spare = rows.filter((r) => !used.has(r.key) && (r.values ?? []).some((v) => v !== null && v !== undefined && v !== ''))
  for (const s of slots) {
    if (!s.row && spare.length) { const r = spare.shift(); s.row = r; s.label = r.name ?? s.label }
  }
  return { slots, cols: table?.columns ?? [] }
}
function tilesFor(kf, productId, variant) {
  if (!kf) return KEY_FEATURES.map(([lbl]) => ({ label: lbl, value: '—' }))
  let ci = kf.cols.findIndex((c) => c.productId === productId && c.variantName === variant)
  if (ci < 0) ci = kf.cols.findIndex((c) => c.productId === productId)
  return kf.slots.map((s) => ({ label: s.label, value: ci < 0 || !s.row ? '—' : fmtFeature(s.row.values?.[ci]) }))
}

/* ───────── compare tray (kept for the session, so it survives opening a product and coming back) ───────── */
function useCompareTray() {
  const [tray, setTray] = useState(() => {
    try { const x = JSON.parse(sessionStorage.getItem(TRAY_KEY) || '[]'); return Array.isArray(x) ? x : [] } catch { return [] }
  })
  useEffect(() => { try { sessionStorage.setItem(TRAY_KEY, JSON.stringify(tray)) } catch { /* storage off: tray just isn't kept */ } }, [tray])
  return [tray, setTray]
}

/* ═════════════ page ═════════════ */
export function LiveProducts() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [source, setSource] = useState('VERIFIED')
  const [type, setType] = useState('all')
  const [open, setOpen] = useState(null) // product id whose variant picker is open
  const [picked, setPicked] = useState({}) // productId → variant name chosen on the card
  const [tray, setTray] = useCompareTray()
  const [q, clearQ] = useHeaderSearch()

  const list = useQuery('products', () => api.products.list())
  const typesQ = useQuery('own-product-types', () => api.myProducts.types())
  const all = useMemo(() => list.data || [], [list.data])

  // Type tabs: every insurance type from the backend (design shows them all), plus any type only a product carries.
  const typeList = useMemo(() => {
    const out = (typesQ.data || []).map((t) => ({ id: t.id, name: t.name }))
    for (const p of all) if (p.type && !out.some((t) => t.name === p.type)) out.push({ id: p.typeId ?? null, name: p.type })
    return out
  }, [typesQ.data, all])
  const typeIdOf = (p) => p.typeId ?? typeList.find((t) => t.name === p.type)?.id ?? null
  const typeKeyOf = (p) => typeIdOf(p) ?? p.type ?? ''

  const rows = all.filter((p) => p.kind === source && (type === 'all' || p.type === type) && matchesQuery(q, p.name, p.insurer, p.type, p.code, p.defaultVariant))
  // How many products each category tab holds for the chosen source (and search), so empty categories are obvious.
  const countOf = (t) => all.filter((p) => p.kind === source && (t === 'all' || p.type === t) && matchesQuery(q, p.name, p.insurer, p.type, p.code, p.defaultVariant)).length

  // Key features: one feature-table call per insurance type on screen (cached; shared with the Feature table page).
  const typeIds = [...new Set(rows.map(typeIdOf).filter(Boolean))].sort()
  const kfQ = useQuery(['feature-table', 'cards', typeIds.join(',')], () =>
    Promise.allSettled(typeIds.map((id) => api.products.featureTable({ typeId: id, source: 'ALL' }))).then((rs) => ({
      data: Object.fromEntries(rs.map((r, i) => [typeIds[i], r.status === 'fulfilled' ? buildKeyFeatures(r.value?.data) : null])),
    })), { enabled: typeIds.length > 0 })
  const kfByType = kfQ.data || {}
  const allCols = Object.values(kfByType).flatMap((k) => k?.cols ?? [])

  // Close the picker on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!e.target.closest?.(`[data-vpick="${open}"]`)) setOpen(null) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  if (list.error && !list.data) return <ErrorPanel active="products" error={list.error} />

  const variantFor = (p) => picked[p.id] ?? p.defaultVariant ?? variantsOf(p, allCols)[0]
  const inTray = (pid, v) => tray.some((t) => t.productId === pid && t.variant === v)
  const toggleCompare = (p, v) => {
    if (inTray(p.id, v)) { setTray((xs) => xs.filter((t) => !(t.productId === p.id && t.variant === v))); return }
    const tk = typeKeyOf(p)
    if (tray.length && tray[0].typeKey !== tk) { toast(`Compare works within one insurance type. Remove the ${tray[0].typeName || 'other'} items first.`, 'error'); return }
    if (tray.length >= MAX_COMPARE) { toast(`You can compare up to ${MAX_COMPARE} variants. Remove one first.`, 'error'); return }
    setTray((xs) => [...xs, { productId: p.id, productName: p.name, variant: v, typeKey: tk, typeId: typeIdOf(p), typeName: p.type ?? '' }])
  }
  const compareNow = () => {
    const tid = tray[0]?.typeId
    const sp = new URLSearchParams()
    if (tid) sp.set('type', tid)
    sp.set('source', 'ALL')
    sp.set('pick', tray.map((t) => `${t.productId}~${t.variant}`).join('|'))
    navigate(`/products/feature-table?${sp}`)
  }
  const currentTypeId = type === 'all' ? null : typeList.find((t) => t.name === type)?.id

  return (
    <AppLayout active="products">
      <Header breadcrumb="PRODUCTS" title="Products" subtitle="Each product has variants. Pick a variant on the card, then add it to compare."
        actions={<>
          <HeadButton variant="white" icon="list" to={`/products/feature-table${currentTypeId ? `?type=${encodeURIComponent(currentTypeId)}` : ''}`}>Feature table</HeadButton>
          <HeadButton icon="plus" to="/products/new">My product</HeadButton>
        </>} />
      <div className="mt-[13px] flex flex-wrap items-center gap-3">
        <SegTabs items={[{ key: 'VERIFIED', label: 'Verified by SkyUp', count: all.filter((p) => p.kind === 'VERIFIED').length }, { key: 'OWN', label: 'My products', count: all.filter((p) => p.kind === 'OWN').length }]} value={source} onChange={(v) => { setSource(v); setOpen(null) }} />
        <SegTabs items={[{ key: 'all', label: 'All', count: countOf('all') }, ...typeList.map((t) => ({ key: t.name, label: t.name, count: countOf(t.name), dim: countOf(t.name) === 0 }))]} value={type} onChange={(v) => { setType(v); setOpen(null) }} />
      </div>

      <div className="mt-5 flex w-[1180px] flex-wrap gap-x-5 gap-y-[18px]">
        {rows.map((p, i) => {
          const variants = variantsOf(p, allCols)
          const v = variantFor(p)
          return (
            <ProductCard key={p.id} p={p} bg={CARD_BG[i % CARD_BG.length]} variant={v} variants={variants}
              tiles={tilesFor(kfByType[typeIdOf(p)], p.id, v)}
              open={open === p.id} onOpen={() => setOpen(open === p.id ? null : p.id)}
              onPick={(name) => { setPicked((m) => ({ ...m, [p.id]: name })); setOpen(null) }}
              inTray={(name) => inTray(p.id, name)} onCompare={(name) => toggleCompare(p, name)} />
          )
        })}
        {rows.length === 0 && (
          <NoMatches className="w-full rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]" text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'No products here yet'}
            sub={list.loading ? '' : q.trim() ? `No products match “${q.trim()}”.` : source === 'OWN'
              ? `You have not added your own ${type === 'all' ? '' : `${type} `}products yet. Use + My product to add one.`
              : `SkyUp has not added any ${type === 'all' ? '' : `${type} `}products yet.${type !== 'all' ? ` You can add your own ${type} product with + My product.` : ''}`}
            onClear={q.trim() ? clearQ : type !== 'all' ? () => setType('all') : undefined} />
        )}
      </div>

      {tray.length > 0 && (
        <div className="sticky bottom-6 z-20 mt-8 flex h-[70px] w-[1180px] items-center gap-3 rounded-[30px] bg-rail py-3 pr-3 pl-5 shadow-[0px_20px_40px_-12px_rgba(19,41,75,0.3)]">
          <div className="flex shrink-0 flex-col gap-px">
            <p className="text-[14px] font-bold text-white">Compare ({tray.length} of {MAX_COMPARE})</p>
            <p className="text-[11px] font-medium text-[#c9d6ea]">Same insurance type · variants allowed</p>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
            {tray.map((t) => (
              <div key={`${t.productId}~${t.variant}`} className="flex h-9 shrink-0 items-center gap-2 rounded-[18px] bg-white/10 py-2 pr-2 pl-3">
                <span className="text-[12px] font-semibold whitespace-nowrap text-white">{t.productName}</span>
                <span className="rounded-[8px] bg-[#f7b9c4] px-2 py-0.5 text-[11px] font-bold whitespace-nowrap text-navy">{t.variant}</span>
                <button type="button" aria-label={`Remove ${t.productName} ${t.variant}`} onClick={() => setTray((xs) => xs.filter((x) => x !== t))} className="flex size-5 items-center justify-center rounded-[10px] bg-white/20 text-white hover:bg-white/30">
                  <Icon name="x" size={11} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setTray([])} className="shrink-0 px-2 text-[12px] font-semibold text-[#c9d6ea] hover:text-white">Clear</button>
          <HeadButton icon="compare" onClick={compareNow} disabled={tray.length < 2} title={tray.length < 2 ? 'Add one more variant to compare' : undefined}
            className={tray.length < 2 ? 'cursor-not-allowed opacity-60' : ''}>Compare now</HeadButton>
        </div>
      )}
    </AppLayout>
  )
}

/* ═════════════ one card ═════════════ */
function ProductCard({ p, bg, variant, variants, tiles, open, onOpen, onPick, inTray, onCompare }) {
  const on = inTray(variant)
  const n = p.variantCount ?? variants.length
  return (
    <div className={cx('relative flex w-[380px] flex-col rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', open && 'z-30')}>
      <div className={cx('flex h-[76px] items-center gap-3.5 rounded-t-[28px] px-5', bg)}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white/80">
          <Icon name={iconOf(p.type)} size={20} className="text-ink" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-[12px] font-semibold text-slate" title={p.insurer}>{shortInsurer(p.insurer)}</p>
          <p className="truncate text-[17px] font-bold text-ink" title={p.name}>{p.name}</p>
        </div>
        <span className="shrink-0 rounded-[10px] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink">{n} variant{n === 1 ? '' : 's'}</span>
      </div>

      <div className="flex flex-col gap-3 px-[18px] pt-3.5 pb-4">
        <div className="relative" data-vpick={p.id}>
          <button type="button" onClick={onOpen} aria-haspopup="listbox" aria-expanded={open}
            className={cx('flex h-11 w-full items-center gap-2.5 rounded-[14px] px-3.5 text-left', open ? 'border-2 border-blue bg-white px-[12px]' : 'bg-panel hover:bg-panel-2')}>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[10px] font-semibold text-muted">Variant</span>
              <span className="truncate text-[13px] font-bold text-ink">{variant}</span>
            </div>
            <Icon name="chev-down" size={18} className={open ? 'rotate-180 text-blue' : 'text-muted'} />
          </button>
          {open && <VariantMenu p={p} variants={variants} value={variant} onPick={onPick} inTray={inTray} onCompare={onCompare} />}
        </div>

        <div className="flex gap-1.5">
          {tiles.map((t, i) => (
            <div key={i} className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-[12px] bg-panel px-2.5 py-2" title={`${t.label}: ${t.value}`}>
              <p className="truncate text-[10px] font-medium text-muted">{t.label}</p>
              <p className="truncate text-[12px] font-bold text-ink">{t.value}</p>
            </div>
          ))}
        </div>

        <div className="flex h-[25px] items-center gap-2">
          <div className="flex cursor-pointer items-center gap-2" onClick={() => onCompare(variant)}>
            <Tick checked={on} onChange={() => onCompare(variant)} />
            <span className={cx('text-[13px] font-semibold select-none', on ? 'text-ink' : 'text-ink-2')}>{on ? 'In compare' : 'Add to compare'}</span>
          </div>
          <span className="flex-1" />
          {quoteChip(p)}
        </div>

        <div className="flex gap-2">
          <SmallButton variant="outline" to={`/products/${p.id}`} className="flex-1 justify-center px-3.5">Details</SmallButton>
          <SmallButton variant={p.canQuote ? 'navy' : 'disabled'} icon="quote" to={p.canQuote ? `/quotations/new?productId=${p.id}` : undefined} className="flex-1 justify-center">New quotation</SmallButton>
        </div>
      </div>
    </div>
  )
}

/* ═════════════ variant picker ═════════════ */
function VariantMenu({ p, variants, value, onPick, inTray, onCompare }) {
  // Sum-insured range and cover type come from the product itself (same cache key as the detail page).
  const detail = useQuery(['product', p.id], () => api.products.get(p.id))
  const info = (name) => {
    const v = (detail.data?.variants || []).find((x) => x.name === name)
    if (!v) return detail.loading ? 'Loading…' : ''
    const from = v.premiumFrom ?? v.startingPremium ?? v.minPremium
    return [siRange(v.sumInsuredMin, v.sumInsuredMax), v.coverType ? label(v.coverType) : null, from ? `from ₹${Number(from).toLocaleString('en-IN')}` : null].filter(Boolean).join(' · ')
  }
  return (
    <div role="listbox" aria-label={`${p.name} variants`}
      className="absolute top-[calc(100%+6px)] left-0.5 z-30 flex max-h-[360px] w-[340px] flex-col gap-0.5 overflow-y-auto rounded-[28px] bg-white p-2.5 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
      <p className="truncate px-3 pt-2 pb-1.5 text-[11px] font-bold tracking-[0.4px] text-muted uppercase">{p.name} · {variants.length} variant{variants.length === 1 ? '' : 's'}</p>
      {variants.map((name) => {
        const on = name === value
        const sub = info(name)
        return (
          <div key={name} role="option" aria-selected={on} tabIndex={0} onClick={() => onPick(name)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(name) } }}
            className={cx('flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[14px] px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-blue', on ? 'bg-[#f3f7ff]' : 'hover:bg-panel-2')}>
            <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-bold text-ink">{name}</p>
              {sub && <p className="truncate text-[11px] font-medium text-muted">{sub}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Tick checked={inTray(name)} onChange={() => onCompare(name)} />
              <span className="text-[11px] font-semibold text-muted">Compare</span>
            </div>
          </div>
        )
      })}
      {variants.length > 1 && (
        <Link to={`/products/${p.id}/variants`} className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5 text-[13px] font-bold text-blue hover:underline">
          <Icon name="compare" size={15} />Compare all {variants.length} variants
        </Link>
      )}
    </div>
  )
}