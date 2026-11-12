// Figma 74:11116 · AP7 · Products — Published
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Btn, RoundBtn, Chip, Note, R } from './_parts'
import { libraryTabs, categoryTabs, myProducts } from '../../data/flow-add-product'
import { useHeaderSearch, matches, NoMatches } from '../customer-tabs/_search'

const TABS = 'flex gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'
const tabCls = (on) => cx('flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold whitespace-nowrap', on ? 'bg-navy text-white' : 'text-slate hover:bg-panel')

export default function Published() {
  const [lib, setLib] = useState('mine')
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const shown = myProducts.filter((p) => (cat === 'All' || p.category === cat) && matches(q, p.name, p.insurer, p.category, p.variants, p.note))
  const counts = { mine: myProducts.length }

  return (
    <AppLayout active="products">
      <header className="flex flex-col items-start gap-3 xl:flex-row xl:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre-wrap xl:whitespace-pre text-muted">PRODUCTS  /  MY PRODUCTS</p>
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">Products</h1>
          <p className="text-[14px] font-medium text-muted">Your own products are visible only in your account.</p>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <label className="flex h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
            <Icon name="search" size={18} className="text-muted" />
            <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
            <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
          </label>
          <RoundBtn icon="bell" size={44} iconSize={18.5} />
          <Btn variant="pink" icon="plus" to={R.category}>My product</Btn>
        </div>
      </header>

      <div className="mt-[13px] flex items-center gap-3">
        <div className={TABS}>
          {libraryTabs.map((t) => {
            const on = lib === t.key
            const tab = (
              <>
                {t.label}
                <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20 text-white' : 'bg-panel text-muted')}>{counts[t.key] ?? t.count}</span>
              </>
            )
            return t.key === 'verified' ? (
              <Link key={t.key} to={R.products} className={tabCls(on)}>{tab}</Link>
            ) : (
              <button key={t.key} type="button" onClick={() => setLib(t.key)} className={tabCls(on)}>{tab}</button>
            )
          })}
        </div>
        <div className={TABS}>
          {categoryTabs.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={tabCls(cat === c)}>{c}</button>
          ))}
        </div>
      </div>

      <Note icon="check" tone="green" className="mt-5">Arogya Plus is published in your library and ready to quote.</Note>

      <div className="mt-[34px] flex gap-5">
        {shown.map((p) => (
          <article key={p.name} className="w-[380px] overflow-clip rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <div className={cx('flex h-[76px] items-center gap-3.5 px-5', p.bg)}>
              <span className="flex size-11 items-center justify-center rounded-full bg-white/80 text-ink">
                <Icon name="heart" size={20} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[12px] font-semibold text-slate">{p.insurer}</span>
                <span className="text-[17px] font-bold text-ink">{p.name}</span>
              </div>
              <span className="rounded-[10px] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink">{p.variants}</span>
            </div>
            <div className="flex flex-col items-start gap-3 px-[18px] pt-4 pb-[18px]">
              <Chip tone="green" icon="check">Published · only you</Chip>
              <p className="text-[12px] leading-[18px] font-medium text-muted">{p.note}</p>
              <div className="flex w-full gap-2">
                <Btn variant="outline" size="sm" to="/products/1" className="flex-1">Details</Btn>
                <Btn size="sm" icon="quote" to="/x/q1-quotation-customer" className="w-[166px]">New quotation</Btn>
              </div>
            </div>
          </article>
        ))}
        {!shown.length && (
          <NoMatches
            className="w-[780px] bg-white"
            label={q ? `No products match “${q}”${cat !== 'All' ? ` in ${cat}` : ''}` : `No ${cat} products in your library yet`}
            onClear={() => { setQ(''); setCat('All') }}
          />
        )}
      </div>
    </AppLayout>
  )
}