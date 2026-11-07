// Figma 285:31639 · PRL · Proposals list
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { Shell, Header } from '../flow-policy/_kit'
import { SegTabs, CHIPS } from './_parts'
import { proposalTabs, proposalRows } from '../../data/states-proposal-policy'
import { useHeaderSearch, matches, NoMatches } from '../customer-tabs/_search'

const COLS = [
  ['Proposal', 220], ['Policy holder', 200], ['Product', 240], ['Premium', 110], ['Status', 150], ['Updated', 120], ['', 20],
]

export default function ProposalsList() {
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const found = proposalRows.filter((r) => matches(q, r.id, r.holder, r.product, r.premium, r.status, r.updated))
  const rows = tab === 'all' ? found : found.filter((r) => r.status === tab)
  // badge counts follow the data (and the search, when one is typed)
  const tabs = proposalTabs.map((t) => ({ ...t, count: t.key === 'all' ? found.length : found.filter((r) => r.status === t.key).length }))
  return (
    <Shell active="proposals">
      <Header search crumb="PROPOSALS" title="Proposals" sub="Submit on the insurer portal, then record it here." />
      <SegTabs items={tabs} value={tab} onChange={setTab} className="mt-[13px]" />
      <div className="mt-5 w-[1180px] overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <div className="flex h-[44px] items-center gap-4 border-b border-line bg-[#fafbfd] px-6">
          {COLS.map(([l, w], i) => (
            <p key={i} className="shrink-0 text-[12px] leading-[15px] font-semibold text-muted" style={{ width: w }}>{l}</p>
          ))}
        </div>
        {rows.length === 0 && (
          q ? (
            <div className="p-4"><NoMatches label={`No proposals match “${q}”`} onClear={() => setQ('')} /></div>
          ) : (
            <p className="px-6 py-10 text-center text-[13px] font-medium text-muted">No proposals here yet.</p>
          )
        )}
        {rows.map((r) => (
          <Link key={r.id} to={r.to} className="flex h-[63px] items-center gap-4 border-b border-line px-6 transition last:h-[62px] last:border-0 hover:bg-[#f7f9ff]">
            <div className="flex w-[220px] shrink-0 items-center gap-2.5">
              <span className="flex size-[34px] items-center justify-center rounded-full bg-panel text-ink"><Icon name="send" size={15} /></span>
              <span className="text-[13px] leading-4 font-bold text-ink">{r.id}</span>
            </div>
            <div className="flex w-[200px] shrink-0 items-center gap-2">
              <span className="flex size-[30px] items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy" style={{ background: r.bg }}>{r.initials}</span>
              <span className="text-[13px] leading-4 font-semibold text-ink">{r.holder}</span>
            </div>
            <p className="w-[240px] shrink-0 text-[13px] leading-4 font-medium text-ink-2">{r.product}</p>
            <p className="w-[110px] shrink-0 text-[14px] leading-[18px] font-bold text-ink">{r.premium}</p>
            <div className="w-[150px] shrink-0">{CHIPS[r.status]}</div>
            <p className="w-[120px] shrink-0 text-[13px] leading-4 font-medium text-ink">{r.updated}</p>
            <Icon name="chev-right" size={16} className="w-5 shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </Shell>
  )
}
