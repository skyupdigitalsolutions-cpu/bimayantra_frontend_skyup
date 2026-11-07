// Figma 38:3490 · 10 · Products library
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, StatusChip, Tick } from './_parts'
import { productSourceTabs, productTypeTabs, products as seed, productStatLabels, carefirstVariants, compareTray } from '../../data/catalogue'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

const TYPE_ICON = { health: 'heart', motor: 'car', life: 'umbrella', travel: 'plane' }

const STATUS_CHIP = {
  quote: <StatusChip tone="green" icon="check">Can quote</StatusChip>,
  expired: <StatusChip tone="amber" icon="alert">Agent code expired</StatusChip>,
  withdrawn: <StatusChip tone="rose" icon="x">Withdrawn</StatusChip>,
}

function VariantDropdown({ variants, value, onPick, onToggle }) {
  return (
    <div className="absolute top-[138px] left-5 z-30 flex w-[340px] flex-col gap-0.5 rounded-[28px] bg-white p-2.5 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
      <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold tracking-[0.4px] text-muted">CAREFIRST FAMILY · 4 VARIANTS</p>
      {variants.map((v) => {
        const on = v.key === value
        return (
          <div key={v.key} onClick={() => onPick(v.key)} className={cx('flex h-[52px] cursor-pointer items-center gap-3 rounded-[14px] px-3', on ? 'bg-[#f3f7ff]' : 'hover:bg-panel-2')}>
            <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-bold whitespace-nowrap text-ink">{v.name}</p>
              <p className="text-[11px] font-medium whitespace-nowrap text-muted">{v.sub}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Tick checked={v.compare} onChange={() => onToggle(v.key)} />
              <span className="text-[11px] font-semibold text-muted">Compare</span>
            </div>
          </div>
        )
      })}
      <Link to="/x/10b-products-compare-variants" className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5 text-[13px] font-bold text-blue">
        <Icon name="compare" size={15} />Compare all 4 variants
      </Link>
    </div>
  )
}

function ProductCard({ p, open, onOpen, onCompare, dropdown }) {
  const live = p.status === 'quote'
  return (
    <div className="relative flex w-[380px] flex-col rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <div className={cx('flex h-[76px] items-center gap-3.5 rounded-t-[28px] px-5', p.bg)}>
        <span className="flex size-11 items-center justify-center rounded-[22px] bg-white/80">
          <Icon name={TYPE_ICON[p.type] ?? 'heart'} size={20} className="text-ink" />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[12px] font-semibold text-slate">{p.insurer}</p>
          <p className="text-[17px] font-bold text-ink">{p.name}</p>
        </div>
        <span className="rounded-[10px] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink">{p.variants}</span>
      </div>
      <div className="flex flex-col gap-3 px-[18px] pt-3.5 pb-4">
        <button
          type="button"
          onClick={onOpen}
          className={cx('flex h-11 items-center gap-2.5 rounded-[14px] px-3.5 text-left', open ? 'border-2 border-blue bg-white' : 'bg-panel')}
        >
          <div className="flex flex-1 flex-col gap-px">
            <span className="text-[10px] font-semibold text-muted">Variant</span>
            <span className="text-[13px] font-bold text-ink">{p.variant}</span>
          </div>
          <Icon name="chev-down" size={18} className={open ? 'rotate-180 text-blue' : 'text-muted'} />
        </button>
        <div className="flex gap-1.5">
          {p.stats.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col gap-0.5 rounded-[12px] bg-panel px-2.5 py-2">
              <p className="text-[10px] font-medium text-muted">{productStatLabels[i]}</p>
              <p className="text-[12px] font-bold whitespace-nowrap text-ink">{v}</p>
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
          <SmallButton variant={live ? 'navy' : 'disabled'} icon="quote" to="/x/q1-quotation-customer" className="flex-1 justify-center">New quotation</SmallButton>
        </div>
      </div>
      {open && dropdown}
    </div>
  )
}

export default function Products() {
  const [source, setSource] = useState('verified')
  const [type, setType] = useState('health')
  const [items, setItems] = useState(seed)
  const [open, setOpen] = useState('carefirst')
  const [variant, setVariant] = useState('gold')
  const [variants, setVariants] = useState(carefirstVariants)
  const [tray, setTray] = useState(compareTray)

  const [q, clearQ] = useHeaderSearch()
  const sourceTabs = productSourceTabs.map((t) => ({ ...t, count: items.filter((p) => p.source === t.key).length }))
  const shown = items.filter((p) => p.source === source && (type === 'all' || p.type === type) && matchesQuery(q, p.name, p.insurer, p.variant))
  const toggleCompare = (id) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, compare: !x.compare } : x)))
  const toggleVariant = (k) => setVariants((vs) => vs.map((v) => (v.key === k ? { ...v, compare: !v.compare } : v)))

  return (
    <AppLayout active="products">
      <Header
        breadcrumb="PRODUCTS"
        title="Products"
        subtitle="Each product has variants. Pick a variant on the card, then add it to compare."
        actions={
          <>
            <HeadButton variant="white" icon="list" to="/x/10d-feature-table-health-all">Feature table</HeadButton>
            <HeadButton icon="plus" to="/x/ap1-add-product-category">My product</HeadButton>
          </>
        }
      />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={sourceTabs} value={source} onChange={setSource} />
        <SegTabs items={productTypeTabs} value={type} onChange={setType} />
      </div>
      <div className="mt-5 flex w-[1180px] flex-wrap gap-x-5 gap-y-[18px]">
        {shown.length === 0 && (
          <NoMatches
            className="w-full rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]"
            text={q.trim() ? 'No matches' : 'No products here yet'}
            sub={q.trim() ? `No products match “${q.trim()}”.` : `No ${productTypeTabs.find((t) => t.key === type).label} products in ${productSourceTabs.find((t) => t.key === source).label}.`}
            onClear={() => { clearQ(); setType('all') }}
          />
        )}
        {shown.map((p) => (
          <ProductCard
            key={p.id}
            p={p.id === 'carefirst' ? { ...p, variant: variants.find((v) => v.key === variant).name } : p}
            open={open === p.id}
            onOpen={() => setOpen(open === p.id ? null : p.id)}
            onCompare={() => toggleCompare(p.id)}
            dropdown={<VariantDropdown variants={variants} value={variant} onPick={(k) => { setVariant(k); setOpen(null) }} onToggle={toggleVariant} />}
          />
        ))}
      </div>

      {tray.length > 0 && (
        <div className="absolute top-[896px] left-10 z-20 flex h-[70px] w-[1180px] items-center gap-3 rounded-[30px] bg-rail py-3 pr-3 pl-5 shadow-[0px_20px_40px_-12px_rgba(19,41,75,0.3)]">
          <div className="flex flex-col gap-px">
            <p className="text-[14px] font-bold text-white">Compare ({tray.length} of 3)</p>
            <p className="text-[11px] font-medium text-[#c9d6ea]">Same insurance type · variants allowed</p>
          </div>
          {tray.map((t, i) => (
            <div key={t.name + t.variant} className="flex h-9 items-center gap-2 rounded-[18px] bg-white/10 py-2 pr-2 pl-3">
              <span className="text-[12px] font-semibold text-white">{t.name}</span>
              <span className="rounded-[8px] bg-[#f7b9c4] px-2 py-0.5 text-[11px] font-bold text-navy">{t.variant}</span>
              <button type="button" aria-label="Remove" onClick={() => setTray((xs) => xs.filter((_, j) => j !== i))} className="flex size-5 items-center justify-center rounded-[10px] bg-white/20 text-white">
                <Icon name="x" size={11} />
              </button>
            </div>
          ))}
          <span className="flex-1" />
          <HeadButton icon="compare" to="/x/10b-products-compare-variants">Compare now</HeadButton>
        </div>
      )}
    </AppLayout>
  )
}
