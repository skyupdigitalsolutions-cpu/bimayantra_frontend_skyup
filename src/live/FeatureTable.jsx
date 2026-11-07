// Batch 11 · Feature table (10d, all 9 frames) on the live API: GET /catalogue/feature-table?typeId&source.
// One page for every insurance type (tabs) and source (All · Verified by SkyUp · My products). Columns are product
// variants; rows are the type's template features, grouped, plus each product's own features. Tick up to 3 variants
// and "Compare selected" narrows the table to them. "Highlight differences" marks rows whose values are not all equal.
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SegTabs } from '../screens/catalogue/_parts'
import { api, useQuery } from '../api'
import { ErrorNote } from './kit'

const SOURCES = [['ALL', 'All'], ['VERIFIED', 'Verified by SkyUp'], ['OWN', 'My products']]
const PRODUCT_BG = ['bg-[#fde4e8]', 'bg-[#fdecd2]', 'bg-[#e9e3fc]', 'bg-[#d4f1e7]', 'bg-[#e8f0fd]']
const MAX_PICK = 3

function Value({ v }) {
  if (v === null || v === undefined || v === '') return <span className="flex items-center gap-2 text-muted"><span className="w-4 text-center">–</span>Not stated</span>
  if (v === false) return <span className="flex items-center gap-2 text-muted"><span className="flex size-4 items-center justify-center rounded-full bg-[#fbebec] text-[#b4323c]"><Icon name="x" size={10} /></span>Not included</span>
  const text = v === true ? 'Included' : String(v)
  return <span className="flex items-center gap-2 text-ink"><span className="flex size-4 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]"><Icon name="check" size={10} /></span>{text}</span>
}

export default function LiveFeatureTable() {
  const [sp, setSp] = useSearchParams()
  const types = useQuery('own-product-types', () => api.myProducts.types())
  const typeId = sp.get('type') ?? types.data?.[0]?.id ?? null
  const source = sp.get('source') ?? 'ALL'
  const setParam = (k, v) => { const n = new URLSearchParams(sp); n.set(k, v); setSp(n, { replace: true }); setPicked([]); setOnlyPicked(false) }
  const t = useQuery(['feature-table', typeId ?? '', source], () => api.products.featureTable({ typeId, source }), { enabled: !!typeId })
  const [find, setFind] = useState('')
  const [highlight, setHighlight] = useState(true)
  const [picked, setPicked] = useState([]) // column indexes
  const [onlyPicked, setOnlyPicked] = useState(false)

  const cols = useMemo(() => (t.data?.columns ?? []).map((c, i) => ({ ...c, i })), [t.data])
  const shownCols = onlyPicked && picked.length ? cols.filter((c) => picked.includes(c.i)) : cols
  // Consecutive columns of the same product share one header block.
  const productBlocks = []
  for (const c of shownCols) {
    const last = productBlocks.at(-1)
    if (last && last.productId === c.productId) last.span += 1
    else productBlocks.push({ productId: c.productId, name: c.productName, insurer: c.insurer, kind: c.kind, span: 1, tone: PRODUCT_BG[productBlocks.length % PRODUCT_BG.length] })
  }
  const q = find.trim().toLowerCase()
  const groups = (t.data?.groups ?? []).map((g) => ({ ...g, rows: g.rows.filter((r) => !q || r.name.toLowerCase().includes(q)) })).filter((g) => g.rows.length)
  const featureCount = (t.data?.groups ?? []).reduce((n, g) => n + g.rows.length, 0)
  const products = new Set(cols.map((c) => c.productId)).size
  const toggle = (i) => setPicked((s) => (s.includes(i) ? s.filter((x) => x !== i) : s.length >= MAX_PICK ? s : [...s, i]))
  const W = 150 // px per variant column

  return (
    <AppLayout active="products">
      <Header breadcrumb="PRODUCTS  /  FEATURE TABLE" title="Feature table" subtitle="Every product and variant, feature by feature. Scroll sideways to see all variants." search={false}
        actions={<HeadButton variant="white" icon="download" onClick={() => window.print()}>Print / Save PDF</HeadButton>} />
      <div className="mt-[13px] flex flex-wrap items-center gap-3">
        <SegTabs items={(types.data ?? []).map((x) => ({ key: x.id, label: x.name }))} value={typeId} onChange={(v) => setParam('type', v)} />
        <SegTabs items={SOURCES.map(([key, label]) => ({ key, label }))} value={source} onChange={(v) => setParam('source', v)} />
        <span className="flex-1" />
        <label className="flex h-[46px] w-[260px] items-center gap-2 rounded-[23px] bg-white px-4 shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
          <Icon name="search" size={16} className="text-muted" />
          <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find a feature…" className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px] font-semibold text-ink-2">
        <Value v /><Value v={false} /><Value v={null} />
        <button type="button" role="switch" aria-checked={highlight} onClick={() => setHighlight(!highlight)} className="flex items-center gap-2.5">
          <span className={cx('flex h-6 w-11 items-center rounded-full p-0.5 transition', highlight ? 'bg-navy' : 'bg-line')}><span className={cx('size-5 rounded-full bg-white transition', highlight && 'translate-x-5')} /></span>Highlight differences
        </button>
        <span className="flex-1" />
        <span className="text-[12px] font-medium text-muted">{products} product{products === 1 ? '' : 's'} · {cols.length} variant{cols.length === 1 ? '' : 's'}</span>
        <button type="button" disabled={!picked.length} onClick={() => setOnlyPicked(!onlyPicked)} className="flex h-10 items-center gap-2 rounded-[20px] bg-navy px-4 text-[13px] font-semibold text-white disabled:opacity-40">
          <Icon name="compare" size={15} />{onlyPicked ? 'Show all variants' : `Compare selected${picked.length ? ` (${picked.length})` : ''}`}
        </button>
      </div>
      <ErrorNote error={types.error ?? t.error} />
      {t.data && !cols.length && <p className="mt-6 rounded-[24px] bg-white p-6 text-[14px] font-medium text-muted">No {source === 'OWN' ? 'products of yours' : 'published products'} for {t.data.typeName} yet.</p>}
      {(t.loading || types.loading) && !t.data && <p className="mt-6 text-[14px] font-medium text-muted">Loading…</p>}
      {cols.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <table className="border-separate border-spacing-0 text-[13px]" style={{ minWidth: 260 + shownCols.length * W }}>
            <thead>
              <tr>
                <th rowSpan={2} className="sticky left-0 z-10 w-[260px] min-w-[260px] border-r border-line bg-white px-5 text-left align-bottom">
                  <p className="text-[11px] font-bold tracking-[0.6px] text-muted">FEATURE</p>
                  <p className="text-[12px] font-medium text-muted">{featureCount} features · {(t.data?.groups ?? []).length} groups</p>
                  {shownCols.length > 5 && <p className="pb-4 text-[12px] font-semibold text-blue">Scroll right for more variants →</p>}
                </th>
                {productBlocks.map((p, i) => (
                  <th key={`${p.productId}-${i}`} colSpan={p.span} className="px-1 pt-3 text-left font-normal">
                    <div className={cx('rounded-[16px] px-3 py-2.5', p.tone)}>
                      <p className="text-[11px] font-medium text-ink-2">{p.insurer}{p.kind === 'OWN' ? ' · My product' : ''}</p>
                      <p className="truncate text-[14px] font-bold text-ink">{p.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                {shownCols.map((c) => (
                  <th key={c.i} className="px-1 pt-2 pb-3 text-left font-normal" style={{ width: W, minWidth: W }}>
                    <label className={cx('flex cursor-pointer items-center justify-between gap-2 rounded-[14px] px-3 py-2', picked.includes(c.i) ? 'bg-[#e8f0fd]' : 'bg-panel')}>
                      <span className="truncate rounded-[10px] bg-white px-2 py-0.5 text-[12px] font-bold text-ink">{c.variantName}</span>
                      <input type="checkbox" checked={picked.includes(c.i)} disabled={!picked.includes(c.i) && picked.length >= MAX_PICK} onChange={() => toggle(c.i)} className="size-[18px] accent-[#13294b]" aria-label={`Select ${c.productName} ${c.variantName}`} />
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <FeatureGroup key={g.group} g={g} cols={shownCols} highlight={highlight} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-[12px] font-medium text-muted">Feature names stay pinned while you scroll sideways. Tick up to {MAX_PICK} variants, then Compare selected.</p>
    </AppLayout>
  )
}

function FeatureGroup({ g, cols, highlight }) {
  return (
    <>
      <tr><td colSpan={cols.length + 1} className="sticky left-0 bg-panel px-5 py-3 text-[14px] font-bold text-ink">{g.group} <span className="ml-1 text-[12px] font-medium text-muted">{g.rows.length}</span></td></tr>
      {g.rows.map((r, n) => {
        const vals = cols.map((c) => r.values[c.i])
        const differs = new Set(vals.map((x) => JSON.stringify(x ?? null))).size > 1
        return (
          <tr key={r.key} className={n % 2 ? 'bg-[#fafbfd]' : 'bg-white'}>
            <td className={cx('sticky left-0 z-[1] border-r border-line px-5 py-3 font-semibold text-ink', n % 2 ? 'bg-[#fafbfd]' : 'bg-white')}>
              <span className={cx('flex items-center gap-2', highlight && differs && 'border-l-[3px] border-blue pl-2')}>{r.name}</span>
            </td>
            {cols.map((c) => <td key={c.i} className="px-4 py-3 font-medium"><Value v={r.values[c.i]} /></td>)}
          </tr>
        )
      })}
    </>
  )
}
