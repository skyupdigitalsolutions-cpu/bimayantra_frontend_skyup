// Figma 11:1403 · 11 · Policies
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { Header, HeadButton, StatTile, SegTabs, DataTable, StatusChip, RowChevron, IdCell } from './_parts'
import { policyStats, policies, policyTabs } from '../../data/catalogue'
import { matchesQuery, useHeaderSearch } from '../tasks/_filter'

const STATUS_CHIP = {
  issued: <StatusChip tone="green" icon="check">Issued</StatusChip>,
  awaiting: <StatusChip tone="violet" icon="clock">Awaiting</StatusChip>,
  expired: <StatusChip tone="red" icon="alert">Expired</StatusChip>,
}

const columns = [
  { key: 'policy', label: 'Policy', width: 260, render: (r) => <IdCell initials={r.initials} bg={r.bg} title={r.number} sub={r.ref} /> },
  { key: 'customer', label: 'Customer', width: 170 },
  { key: 'product', label: 'Product', width: 210 },
  { key: 'ends', label: 'Ends', width: 120 },
  { key: 'premium', label: 'Premium', width: 110 },
  { key: 'status', label: 'Status', width: 120, render: (r) => STATUS_CHIP[r.status] },
  { key: 'go', label: '', width: 40, className: 'justify-end', render: (r, hot) => <RowChevron on={hot} /> },
]

export default function Policies() {
  const [tab, setTab] = useState('issued')
  const items = policyTabs.map((t) => ({ ...t, count: policies.filter((p) => p.status === t.key).length }))
  const [q, clearQ] = useHeaderSearch()
  const rows = policies.filter((p) => p.status === tab && matchesQuery(q, p.number, p.ref, p.customer, p.product, p.ends, p.premium))
  const label = policyTabs.find((t) => t.key === tab).label.toLowerCase()

  return (
    <AppLayout active="policies">
      <Header
        breadcrumb={'AFTER-SALE  /  POLICIES'}
        title="Policies"
        subtitle="Issued policies start a renewal cycle automatically."
        actions={<HeadButton icon="plus" to="/x/l1-record-issued-policy">Existing policy</HeadButton>}
      />

      <div className="mt-[13px] flex gap-5">
        {policyStats.map((s) => (
          <StatTile key={s.key} {...s} />
        ))}
      </div>

      <SegTabs items={items} value={tab} onChange={setTab} className="mt-5" />

      <DataTable
        className="mt-7 w-[1180px]"
        columns={columns}
        rows={rows}
        rowTo={(r) => (r.id === 1 ? '/policies/1' : '/policies/1')}
        highlight={(r, i) => i === 0}
        empty={q.trim() ? `No ${label} policies match “${q.trim()}”.` : `No ${label} policies yet.`}
        onClear={q.trim() ? clearQ : undefined}
      />
    </AppLayout>
  )
}
