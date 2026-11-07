// Shared base for the 10d · Feature table family (Figma 97:11244 … 98:15354).
// One data-driven screen: category (Health / Motor / Life and Term / Travel) × scope (All / Verified / My products).
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, IconButton, cx } from '../../components/ui'
import { FEATURE_TABLES, X, NA } from '../../data/feature-table'
import { NoMatches } from '../customer-tabs/_search'

const CATS = ['health', 'motor', 'life-and-term', 'travel']
const SCOPES = [
  { key: 'all', label: 'All', slug: 'all' },
  { key: 'verified', label: 'Verified by SkyUp', slug: 'verified' },
  { key: 'mine', label: 'My products', slug: 'my-products' },
]
const HAS_VERIFIED_FRAME = { health: true }
const pathFor = (cat, scope) => {
  const s = SCOPES.find((x) => x.key === scope)
  // Only Health has a "Verified" frame; the other categories link Verified → All (per the prototype).
  const slug = scope === 'verified' && !HAS_VERIFIED_FRAME[cat] ? 'all' : s.slug
  return `/x/10d-feature-table-${cat}-${slug}`
}

// Tab widths straight from the frames (keeps the pills pixel-aligned regardless of font hinting).
const TAB_W = { Health: 109, Motor: 102, 'Life and Term': 146, Travel: 100, All: 48, 'Verified by SkyUp': 143, 'My products': 112 }
const SHADOW = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'
const COL = 150
const PIN = 262

/* ───────── Small pieces ───────── */

// Figma renders these status glyphs sitting low in their discs — reproduced with a small offset.
function StatusDot({ kind, size = 20, icon = 11, dy = 0 }) {
  const bg = kind === 'y' ? 'bg-[#e7f4ee]' : kind === 'n' ? 'bg-[#fbebec]' : 'bg-[#f1f3f8]'
  return (
    <span className={cx('flex shrink-0 items-center justify-center rounded-full', bg)} style={{ width: size, height: size }}>
      {kind === 'na' ? (
        <span className="text-[11px] font-bold text-muted" style={{ fontSize: icon === 12 ? 12 : 11 }}>—</span>
      ) : (
        <Icon
          name={kind === 'y' ? 'check' : 'x'}
          size={icon}
          className={kind === 'y' ? 'text-[#127650]' : 'text-[#b4323c]'}
          style={{ transform: `translateY(${dy}px)` }}
        />
      )}
    </span>
  )
}

function TabGroup({ items, className }) {
  return (
    <div className={cx('flex h-11 items-start gap-1 rounded-[26px] bg-white p-[5px]', SHADOW, className)}>
      {items.map((t) => {
        const inner = (
          <>
            <span className={cx('text-[13px] font-semibold whitespace-nowrap', t.on ? 'text-white' : 'text-slate')}>{t.label}</span>
            {t.count != null && (
              <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', t.on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{t.count}</span>
            )}
          </>
        )
        const cls = cx('flex h-[34px] shrink-0 items-center gap-2 rounded-[21px] px-4', t.on ? 'bg-navy' : 'hover:bg-panel')
        const style = { width: TAB_W[t.label] }
        return t.on ? <span key={t.label} className={cls} style={style}>{inner}</span> : <Link key={t.label} to={t.to} className={cls} style={style}>{inner}</Link>
      })}
    </div>
  )
}

function VariantCheck({ on, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={onChange}
      className={cx('flex h-[22px] shrink-0 items-center justify-center rounded-[7px]', on ? 'w-[15px] bg-navy' : 'w-[22px] border-[1.5px] border-[#c3ccd8] bg-white')}
    >
      {on && <Icon name="check" size={15} className="text-white" />}
    </button>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex h-[26px] items-center gap-2.5">
      <span className={cx('flex h-[26px] w-11 items-center rounded-[14px] p-[3px] transition-colors', on ? 'justify-end bg-navy' : 'justify-start bg-[#d5dbe6]')}>
        <span className="size-5 rounded-[10px] bg-white" />
      </span>
      <span className="text-[13px] font-semibold whitespace-nowrap text-ink">{label}</span>
    </button>
  )
}

/* ───────── Table ───────── */

/**
 * FeatureTable — columns = product variants, grouped feature rows, cells = tick / cross / not stated + value.
 *  data: FEATURE_TABLES[cat]; products: visible products; checked/onCheck: variant selection;
 *  highlight: tint rows whose values differ; query: feature-name filter.
 */
export function FeatureTable({ data, products, checked, onCheck, highlight, query, onClearQuery }) {
  const variants = products.flatMap((p, pi) => p.variants.map((v, vi) => ({ ...v, p, key: `${pi}-${vi}`, pid: p.name })))
  const colsW = variants.length * COL
  const q = query.trim().toLowerCase()
  let fi = 0
  const groups = data.groups.map((g) => {
    const rows = g.features.map((name) => ({ name, i: fi++ })).filter((r) => !q || r.name.toLowerCase().includes(q))
    return { ...g, rows }
  }).filter((g) => g.rows.length)
  const nFeatures = data.groups.reduce((a, g) => a + g.features.length, 0)

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] [contain:inline-size]">
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div style={{ width: PIN + colsW, minWidth: '100%' }}>
          {/* Header: product + variant rows */}
          <div className="flex">
            <div className="sticky left-0 z-10 flex h-[152px] shrink-0 flex-col justify-end gap-1 border-r border-line bg-white pt-[18px] pr-4 pb-4 pl-5" style={{ width: PIN }}>
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.7px] text-muted">FEATURE</p>
              <p className="text-[12px] leading-[15px] font-medium text-muted">{nFeatures} features · {data.groups.length} groups</p>
              <p className="text-[11px] leading-[14px] font-semibold text-blue">Scroll right for more variants →</p>
            </div>
            <div className="flex flex-col">
              <div className="flex h-16">
                {products.map((p) => (
                  <div key={p.name} className="flex px-1 pt-3" style={{ width: p.variants.length * COL }}>
                    <div className="flex h-[52px] min-w-0 flex-1 items-center gap-2 rounded-[16px] px-3 py-2" style={{ background: p.bg }}>
                      <div className="flex min-w-0 flex-1 flex-col gap-px whitespace-nowrap">
                        <p className="text-[11px] font-semibold text-slate">{p.insurer}</p>
                        <p className="text-[14px] font-bold text-ink">{p.name}</p>
                      </div>
                      {p.chip && (
                        <span className="relative shrink-0 rounded-[14px] px-3 py-[5px] text-[12px] font-semibold whitespace-nowrap" style={{ background: p.chip.bg, color: p.chip.color }}>
                          {p.chip.text}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex h-[88px]">
                {variants.map((v) => (
                  <div key={v.key} className="px-1 pt-2 pb-3" style={{ width: COL }}>
                    <div className="flex h-[68px] flex-col justify-between rounded-[14px] p-3" style={{ background: v.p.bg }}>
                      <div className="flex h-[23px] items-center gap-2">
                        <Link to="/products/1" className="shrink-0 rounded-[10px] bg-white px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-ink">
                          {v.label}
                        </Link>
                        <span className="h-px min-w-px flex-1" />
                        <VariantCheck on={!!checked[v.key]} onChange={() => onCheck(v.key)} />
                      </div>
                      <p className="text-[12px] font-semibold whitespace-nowrap" style={{ color: v.color }}>{v.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Groups */}
          {groups.map((g) => (
            <div key={g.name}>
              <div className="flex h-[50px]">
                <div className="sticky left-0 z-10 flex shrink-0 items-center gap-2.5 bg-[#fafbfd] pr-4 pl-5" style={{ width: PIN }}>
                  <span className="flex size-7 items-center justify-center rounded-[14px] bg-white">
                    <Icon name={g.icon} size={14} className="text-ink" style={{ transform: 'translateY(2.5px)' }} />
                  </span>
                  <span className="text-[13px] font-bold whitespace-nowrap text-ink">{g.name}</span>
                  <span className="text-[12px] font-semibold text-muted">{q ? `${g.rows.length} of ${g.features.length}` : g.features.length}</span>
                </div>
                <div className="bg-[#fafbfd]" style={{ width: colsW }} />
              </div>
              {g.rows.map((r) => {
                const vals = variants.map((v) => v.values[r.i])
                const hl = highlight && new Set(vals.map(String)).size > 1
                return (
                  <div key={r.name} className="flex h-[46px]">
                    <div
                      className={cx('sticky left-0 z-10 flex shrink-0 items-center gap-2.5 pr-3 pl-5', hl ? 'bg-[#f5f9ff]' : 'border-r border-line bg-white')}
                      style={{ width: PIN }}
                    >
                      {hl && <span className="h-5 w-[3px] shrink-0 rounded-[2px] bg-blue" />}
                      <span className="text-[13px] font-semibold whitespace-nowrap text-ink">{r.name}</span>
                    </div>
                    <div className={cx('flex', hl && 'bg-[#f5f9ff]')} style={{ width: colsW }}>
                      {vals.map((val, k) => {
                        const kind = val === X ? 'n' : val === NA ? 'na' : 'y'
                        return (
                          <div key={k} className="flex shrink-0 items-center gap-2 pr-2 pl-4" style={{ width: COL }}>
                            <StatusDot kind={kind} dy={6} />
                            <span className={cx('text-[12px] whitespace-nowrap', kind === 'y' ? 'font-semibold text-ink' : 'font-medium text-muted')}>
                              {kind === 'y' ? val : kind === 'n' ? 'Not included' : 'Not stated'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {!groups.length && (
        <div className="px-5 py-4">
          <NoMatches label={`No features match “${query.trim()}”`} onClear={onClearQuery} />
        </div>
      )}
    </div>
  )
}

function EmptyMine({ title }) {
  return (
    <div className="flex flex-col items-center gap-3.5 rounded-[32px] bg-white p-12 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <span className="flex size-20 items-center justify-center rounded-[40px] bg-[#e8f0fd]">
        <Icon name="box" size={36} className="text-blue" />
      </span>
      <p className="text-[20px] font-bold text-ink">{title}</p>
      <p className="w-[520px] text-center text-[14px] leading-[22px] font-medium text-muted">
        Add a product the catalogue does not have. It appears here after SkyUp approves it.
      </p>
      <Link
        to="/x/ap1-add-product-category"
        className="flex h-[46px] items-center gap-2 rounded-[24px] bg-[linear-gradient(90deg,#f9c6d0,#f29db0)] pr-5 pl-4 text-[14px] font-semibold text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]"
      >
        <Icon name="plus" size={18} />
        Add my product
      </Link>
    </div>
  )
}

/* ───────── Screen ───────── */

export function FeatureTableScreen({ category, scope }) {
  const navigate = useNavigate()
  const data = FEATURE_TABLES[category]
  const [highlight, setHighlight] = useState(true)
  const [query, setQuery] = useState('')
  const products = useMemo(
    () => data.products.filter((p) => scope === 'all' || (scope === 'verified' ? p.verified : p.mine)),
    [data, scope],
  )
  const [checked, setChecked] = useState(() => {
    const o = {}
    products.forEach((p, pi) => p.variants.forEach((v, vi) => { if (v.checked) o[`${pi}-${vi}`] = true }))
    return o
  })
  const nVariants = products.reduce((a, p) => a + p.variants.length, 0)

  const typeTabs = CATS.map((c) => ({
    label: FEATURE_TABLES[c].label,
    count: FEATURE_TABLES[c].products.reduce((a, p) => a + p.variants.length, 0),
    on: c === category,
    to: pathFor(c, 'all'),
  }))
  const scopeTabs = SCOPES.map((s) => ({ label: s.label, on: s.key === scope, to: pathFor(category, s.key) }))

  return (
    <AppLayout active="products" panelClass="pb-[31px]">
      <PageHeader
        breadcrumb="PRODUCTS  /  FEATURE TABLE"
        title="Feature table"
        subtitle="Every product and variant, feature by feature. Scroll sideways to see all variants."
        hideSearch
        actions={
          <>
            <IconButton icon="bell" iconSize={18.5} />
            <button type="button" onClick={() => window.print()} className="flex h-[46px] w-[171px] items-center gap-2 rounded-[24px] border border-line bg-white pr-5 pl-4 text-[14px] font-semibold whitespace-nowrap text-ink hover:bg-tile">
              <Icon name="download" size={18} />
              Print / Save PDF
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="mt-[21px] flex h-[46px] items-center gap-3">
        <TabGroup items={typeTabs} />
        <TabGroup items={scopeTabs} />
        <span className="flex-1" />
        <label className={cx('flex h-[46px] w-[210px] items-center gap-2.5 rounded-[24px] bg-white px-4', SHADOW)}>
          <Icon name="search" size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a feature…"
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint"
          />
        </label>
      </div>

      {/* Legend */}
      <div className="mt-[18px] flex h-9 items-center gap-[18px]">
        {[['y', 'Included'], ['n', 'Not included'], ['na', 'Not stated']].map(([k, l]) => (
          <span key={k} className="flex items-center gap-2">
            <StatusDot kind={k} size={22} icon={12} dy={4.5} />
            <span className="text-[12px] font-semibold text-ink-2">{l}</span>
          </span>
        ))}
        <Toggle on={highlight} onChange={setHighlight} label="Highlight differences" />
        <span className="flex-1" />
        <span className="text-[12px] font-semibold text-muted">{products.length} products · {nVariants} variants</span>
        <button
          type="button"
          onClick={() => navigate('/x/10b-products-compare-variants')}
          className="flex h-9 items-center gap-2 rounded-[18px] bg-navy pr-3.5 pl-3 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700"
        >
          <Icon name="compare" size={16} />
          Compare selected
        </button>
      </div>

      <div className="mt-[22px]">
        {products.length ? (
          <>
            <FeatureTable
              data={data}
              products={products}
              checked={checked}
              onCheck={(k) => setChecked((c) => ({ ...c, [k]: !c[k] }))}
              highlight={highlight}
              query={query}
              onClearQuery={() => setQuery('')}
            />
            <p className="mt-4 text-[12px] font-medium text-muted">
              Feature names stay pinned while you scroll sideways. Tick up to 3 variants, then Compare selected.
            </p>
          </>
        ) : (
          <EmptyMine title={data.emptyTitle} />
        )}
      </div>
    </AppLayout>
  )
}
