// Figma 129:15495 · 10e · Products — New from SkyUp
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, StatusChip, Tick } from '../catalogue/_parts'
import { newProducts, tray as trayData } from '../../data/flow-skyup'
import { useHeaderSearch, clearHeaderSearch, matches, NoMatches } from '../admin/_filter'

const HEALTH_STATS = ['Room rent', 'Co-pay', 'PED wait', 'Claims']
const TYPE_ICON = { health: 'heart', motor: 'car', life: 'umbrella', travel: 'plane' }

const STATUS_CHIP = {
  quote: <StatusChip tone="green" icon="check">Can quote</StatusChip>,
  expired: <StatusChip tone="amber" icon="alert">Agent code expired</StatusChip>,
  nocode: <StatusChip tone="amber" icon="x">No agent code yet</StatusChip>,
}

function ProductCard({ p, open, onOpen, onCompare }) {
  const live = p.status === 'quote'
  return (
    <div className="flex w-[380px] flex-col rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <div className={cx('flex h-[76px] items-center gap-3.5 rounded-t-[28px] px-5', p.bg)}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[22px] bg-white/80">
          <Icon name={TYPE_ICON[p.type] ?? 'heart'} size={20} className="text-ink" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[12px] font-semibold whitespace-nowrap text-slate">{p.insurer}</p>
          <p className="text-[17px] font-bold whitespace-nowrap text-ink">{p.name}</p>
        </div>
        {p.isNew && <StatusChip tone="pink" className="text-[#b4325a]" icon="star">New</StatusChip>}
        <span className="shrink-0 rounded-[10px] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink">{p.variants}</span>
      </div>
      <div className="flex flex-col gap-3 px-[18px] pt-3.5 pb-4">
        <button type="button" onClick={onOpen} className={cx('flex h-11 items-center gap-2.5 rounded-[14px] px-3.5 text-left', open ? 'border-2 border-blue bg-white' : 'bg-panel')}>
          <div className="flex flex-1 flex-col gap-px">
            <span className="text-[10px] font-semibold text-muted">Variant</span>
            <span className="text-[13px] font-bold text-ink">{p.variant}</span>
          </div>
          <Icon name="chev-down" size={18} className={open ? 'rotate-180 text-blue' : 'text-muted'} />
        </button>
        <div className="flex gap-1.5">
          {(p.statLabels ?? HEALTH_STATS).map((l, i) => (
            <div key={l} className="flex flex-1 flex-col gap-0.5 rounded-[12px] bg-panel px-2.5 py-2">
              <p className="text-[10px] font-medium text-muted">{l}</p>
              <p className="text-[12px] font-bold whitespace-nowrap text-ink">{p.stats[i]}</p>
            </div>
          ))}
        </div>
        <div className="flex h-[25px] items-center gap-2">
          <div className="flex cursor-pointer items-center gap-2" onClick={onCompare}>
            <Tick checked={p.compare} onChange={onCompare} />
            <span className={cx('text-[13px] font-semibold', p.compare ? 'text-ink' : 'text-ink-2')}>{p.compare ? 'In compare' : 'Add to compare'}</span>
          </div>
          <span className="flex-1" />
          {STATUS_CHIP[p.status]}
        </div>
        <div className="flex gap-2">
          <SmallButton variant="outline" to="/products/1" className="flex-1 justify-center px-3.5">Details</SmallButton>
          <SmallButton variant={live ? 'navy' : 'disabled'} icon="quote" to={p.quoteTo ?? '/x/q1-quotation-customer'} className="flex-1 justify-center">New quotation</SmallButton>
        </div>
      </div>
    </div>
  )
}

export default function ProductsNew() {
  const [source, setSource] = useState('verified')
  const [type, setType] = useState('health')
  const [items, setItems] = useState(newProducts)
  const [open, setOpen] = useState(0)
  const [tray, setTray] = useState(trayData)
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)

  const shown = items
    .map((p, i) => [p, i])
    .filter(([p]) => p.source === source && (type === 'all' || p.type === type) && matches(q, p.name, p.insurer, p.variant))
  const clearAll = () => {
    clearHeaderSearch()
    setQ('')
    setType('all')
  }

  return (
    <AppLayout active="products" panelClass="pb-[10px]">
      <Header
        breadcrumb="PRODUCTS"
        title="Products"
        subtitle="Each product has variants. Pick a variant on the card, then add it to compare."
        actions={
          <>
            <HeadButton variant="white" icon="list" to="/x/10d-feature-table-health-all">Feature table</HeadButton>
            <HeadButton variant="pink" icon="plus" to="/x/ap1-add-product-category">My product</HeadButton>
          </>
        }
      />
      <div className="mt-[13px] flex gap-3">
        <SegTabs value={source} onChange={setSource} items={[
            { key: 'verified', label: 'Verified by SkyUp', count: items.filter((p) => p.source === 'verified').length },
            { key: 'mine', label: 'My products', count: items.filter((p) => p.source === 'mine').length },
          ]} />
        <SegTabs
          value={type}
          onChange={setType}
          items={[
            { key: 'all', label: 'All' },
            { key: 'health', label: 'Health' },
            { key: 'motor', label: 'Motor' },
            { key: 'life', label: 'Life and Term' },
            { key: 'travel', label: 'Travel' },
          ]}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-[18px]">
        {shown.length === 0 && (
          <NoMatches
            className="w-full bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]"
            hint={type === 'travel' && !q ? 'Travel products are coming soon.' : 'No products match these filters.'}
            onClear={clearAll}
          />
        )}
        {shown.map(([p, i]) => (
          <ProductCard
            key={p.name}
            p={p}
            open={open === i}
            onOpen={() => setOpen(open === i ? null : i)}
            onCompare={() => setItems(items.map((x, j) => (j === i ? { ...x, compare: !x.compare } : x)))}
          />
        ))}
      </div>

      <div className="mt-5 flex w-fit items-center gap-2.5 rounded-[16px] bg-violet-50 px-4 py-3">
        <Icon name="star" size={16} className="text-violet" />
        <p className="text-[13px] font-semibold text-violet">New from SkyUp: Activ One MAX (Aditya Birla Health). Add your Aditya Birla agent code in My insurers to quote it.</p>
      </div>

      <div className="mt-9 flex h-[70px] items-center gap-3 rounded-[30px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] py-3 pr-3 pl-5 shadow-[0px_20px_40px_-12px_rgba(19,41,75,0.3)]">
        <div className="flex w-[202px] flex-col gap-px">
          <p className="text-[14px] font-bold text-white">Compare ({tray.length} of 3)</p>
          <p className="text-[11px] font-medium whitespace-nowrap text-[#c9d6ea]">Same insurance type · variants allowed</p>
        </div>
        {tray.map((t, i) => (
          <div key={t.name + t.variant} className="flex h-9 items-center gap-2 rounded-[18px] bg-white/10 py-2 pr-2 pl-3">
            <span className="text-[12px] font-semibold text-white">{t.name}</span>
            <span className="rounded-[8px] bg-pink-300 px-2 py-0.5 text-[11px] font-bold text-navy">{t.variant}</span>
            <button type="button" aria-label="Remove" onClick={() => setTray(tray.filter((_, j) => j !== i))} className="flex size-5 items-center justify-center rounded-full bg-white/20 text-white">
              <Icon name="x" size={11} />
            </button>
          </div>
        ))}
        <span className="flex-1" />
        <Link
          to="/x/10b-products-compare-variants"
          className="inline-flex h-[46px] items-center gap-2 rounded-[24px] bg-linear-to-b from-[#f9c6d0] to-[#f29db0] pr-5 pl-4 text-[14px] font-semibold text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]"
        >
          <Icon name="compare" size={18} />Compare now
        </Link>
      </div>
    </AppLayout>
  )
}
