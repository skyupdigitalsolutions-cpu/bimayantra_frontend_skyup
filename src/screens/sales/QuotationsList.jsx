// Figma 71:9067 · 07L · Quotations list
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader } from '../../components/ui'
import { PillButton, SChip, SegTabs, TableCard, THead, TRow, Dot } from './_parts'
import { quoteStats, quotations, comparisons } from '../../data/sales'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

const STATUS = {
  accepted: ['green', 'check', 'Accepted'],
  shared: ['blue', 'send', 'Shared'],
  draft: ['gray', null, 'Draft'],
  ready: ['violet', null, 'Ready'],
  expired: ['red', 'x', 'Expired'],
}
const PAYMENT = { paid: ['green', 'check', 'Paid'], awaiting: ['violet', 'clock', 'Awaiting'] }

const COLS = [
  { label: 'Quotation', w: 'w-[220px]' },
  { label: 'Customer', w: 'w-[170px]' },
  { label: 'Product', w: 'w-[170px]' },
  { label: 'Total', w: 'w-[90px]' },
  { label: 'Status', w: 'w-[110px]' },
  { label: 'Payment', w: 'w-[120px]' },
  { label: 'Valid until', w: 'w-[80px]' },
  { label: '', w: 'w-5' },
]

function QStat({ icon, label, value, bg }) {
  return (
    <div className="flex h-[117px] w-[280px] flex-col gap-1.5 rounded-[24px] p-5 max-md:h-auto max-md:w-auto max-md:rounded-[18px] max-md:p-3" style={{ background: bg }}>
      <div className="flex items-center gap-2.5 max-md:gap-1.5">
        <span className="flex size-9 items-center justify-center rounded-full bg-white/70 text-ink max-md:size-7"><Icon name={icon} size={18} /></span>
        <p className="text-[13px] font-semibold whitespace-nowrap text-ink-2 max-md:text-[11px] max-md:whitespace-normal max-md:leading-tight">{label}</p>
      </div>
      <p className="text-[28px] font-bold tracking-[-0.6px] text-ink max-md:text-[20px]">{value}</p>
    </div>
  )
}

export default function QuotationsList() {
  const [kind, setKind] = useState('quotations')
  const [status, setStatus] = useState('all')

  const source = kind === 'quotations' ? quotations : comparisons
  const [q, clearQ] = useHeaderSearch()
  const rows = source.filter((r) => (status === 'all' || r.status === status) && matchesQuery(q, r.id, r.customer, r.product, r.total, STATUS[r.status][2]))
  const clearAll = () => { setStatus('all'); clearQ() }

  return (
    <AppLayout active="quotations">
      <PageHeader
        breadcrumb="QUOTATIONS"
        title="Quotations"
        subtitle="Every quotation and comparison, newest first."
        actions={
          <>
            <PillButton variant="outline" icon="compare" className="pl-[17px] max-md:hidden" to="/x/cq2-comparison-type">New comparison</PillButton>
            <PillButton variant="pink" icon="plus" to="/x/q1-quotation-customer" className="max-md:h-9 max-md:rounded-[18px] max-md:gap-1.5 max-md:pr-3 max-md:pl-2.5 max-md:text-[12px]"><span className="md:hidden">New</span><span className="max-md:hidden">New quotation</span></PillButton>
          </>
        }
      />

      <div className="mt-[13px] flex gap-5 max-md:mt-3 max-md:grid max-md:grid-cols-2 max-md:gap-2">
        {quoteStats.map((s) => <QStat key={s.label} {...s} />)}
      </div>

      <div className="mt-[33px] flex gap-3 max-md:mt-4 max-md:-mx-4 max-md:flex-col max-md:gap-2 max-md:px-4">
        <div className="md:contents max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:[scrollbar-width:none]">
          <SegTabs
            value={kind}
            onChange={(k) => { setKind(k); setStatus('all') }}
            items={[
              { key: 'quotations', label: 'Quotations', count: quotations.length },
              { key: 'comparisons', label: 'Comparisons', count: comparisons.length },
            ]}
          />
        </div>
        <div className="md:contents max-md:flex max-md:overflow-x-auto max-md:[scrollbar-width:none]">
          <SegTabs
            value={status}
            onChange={setStatus}
            items={[
              { key: 'all', label: 'All' },
              { key: 'draft', label: 'Draft' },
              { key: 'ready', label: 'Ready' },
              { key: 'shared', label: 'Shared' },
              { key: 'accepted', label: 'Accepted' },
              { key: 'expired', label: 'Expired' },
            ]}
          />
        </div>
      </div>

      <TableCard className="mt-7 max-md:mt-4 max-md:-mx-4 max-md:overflow-x-auto max-md:rounded-none max-md:shadow-none">
        <THead cols={COLS} gap="gap-4" />
        <div>
          {rows.map((r) => {
            const st = STATUS[r.status]
            const pay = PAYMENT[r.payment]
            return (
              <TRow key={r.id} to={r.to} gap="gap-4">
                <div className="flex w-[220px] shrink-0 items-center gap-3">
                  <span className="flex size-[38px] items-center justify-center rounded-full bg-panel text-ink"><Icon name={kind === 'quotations' ? 'quote' : 'compare'} size={17} /></span>
                  <p className="text-[13px] font-bold whitespace-nowrap text-ink">{r.id}</p>
                </div>
                <div className="flex w-[170px] shrink-0 items-center gap-2.5">
                  <Dot initials={r.initials} bg={r.bg} size={32} font={10} />
                  <p className="text-[13px] font-semibold whitespace-nowrap text-ink">{r.customer}</p>
                </div>
                <p className="w-[170px] shrink-0 truncate text-[13px] font-medium text-ink-2">{r.product}</p>
                <p className="w-[90px] shrink-0 text-[14px] font-bold text-ink">{r.total}</p>
                <div className="w-[110px] shrink-0"><SChip tone={st[0]} icon={st[1]}>{st[2]}</SChip></div>
                <div className="w-[120px] shrink-0">{pay ? <SChip tone={pay[0]} icon={pay[1]}>{pay[2]}</SChip> : <span className="text-[13px] text-muted">—</span>}</div>
                <p className="w-[80px] shrink-0 text-[13px] font-medium text-ink">{r.valid}</p>
                <Icon name="chev-right" size={18} className="text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
              </TRow>
            )
          })}
          {rows.length === 0 && (
            <NoMatches
              text={q.trim() ? 'No matches' : 'Nothing here yet'}
              sub={q.trim() ? `No ${kind} match “${q.trim()}”${status !== 'all' ? ` in ${STATUS[status][2]}` : ''}.` : `No ${STATUS[status]?.[2].toLowerCase() ?? ''} ${kind} right now.`}
              onClear={clearAll}
            />
          )}
        </div>
      </TableCard>
    </AppLayout>
  )
}