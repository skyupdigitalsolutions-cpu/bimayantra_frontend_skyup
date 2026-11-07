// Figma 290:37369 · AA6 · Admin — Product corrections
import { useState } from 'react'
import { SegTabs } from '../admin/_parts'
import { AdminLayout, AdminHeader, Pill, ATable, ARow, ACell, RowButton } from './_parts'
import { correctionRows } from '../../data/states-admin'
import { NoMatches } from '../admin/_filter'

const COLS = [['Product', 'w-[230px]'], ['Field', 'w-[180px]'], ['Suggested change', 'w-[300px]'], ['From', 'w-[180px]'], ['Status', 'w-[130px]'], ['', 'w-[60px]']]
const CHIP = {
  submitted: <Pill tone="violet" icon="clock">Submitted</Pill>,
  accepted: <Pill tone="green" icon="check">Accepted</Pill>,
  rejected: <Pill tone="bg-[#fbebec] text-[#b4323c]" icon="x">Rejected</Pill>,
}

export default function ProductCorrections() {
  // Figma opens on the Submitted tab but lists every suggestion; the tabs filter once one is picked.
  const [tab, setTab] = useState(null)
  const [rows, setRows] = useState(correctionRows)
  const [open, setOpen] = useState(null)
  const count = (s) => rows.filter((r) => r.status === s).length
  return (
    <AdminLayout active="corrections">
      <AdminHeader title="Product corrections" subtitle="Suggestions from advisors. Accepting opens a new product version for approval." />
      <SegTabs
        className="mt-[21px]"
        value={tab ?? 'submitted'}
        onChange={setTab}
        items={[
          { key: 'submitted', label: 'Submitted', count: count('submitted') },
          { key: 'accepted', label: 'Accepted', count: count('accepted') },
          { key: 'rejected', label: 'Rejected', count: count('rejected') },
        ]}
      />
      <ATable cols={COLS} className="mt-5">
        {rows.map((r, i) => (tab && r.status !== tab ? null : (
          <ARow key={r.product}>
            <ACell w="w-[230px]" strong>{r.product}</ACell>
            <ACell w="w-[180px]">{r.field}</ACell>
            <ACell w="w-[300px]">{r.change}</ACell>
            <ACell w="w-[180px]">{r.from}</ACell>
            <ACell w="w-[130px]">{CHIP[r.status]}</ACell>
            <ACell w="w-[60px] relative">
              {r.status === 'submitted' && <RowButton onClick={() => setOpen(open === i ? null : i)}>Review</RowButton>}
              {open === i && (
                <div className="absolute top-11 right-0 z-20 flex w-[160px] flex-col rounded-[16px] bg-white p-1.5 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
                  {[['accepted', 'Accept'], ['rejected', 'Reject']].map(([s, l]) => (
                    <button key={s} type="button" onClick={() => { setRows(rows.map((x, j) => (j === i ? { ...x, status: s } : x))); setOpen(null) }} className="rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-panel">{l}</button>
                  ))}
                </div>
              )}
            </ACell>
          </ARow>
        )))}
        {tab && count(tab) === 0 && (
          <div className="border-t border-line p-4">
            <NoMatches hint={`No ${tab} suggestions.`} clearLabel="Show all" onClear={() => setTab(null)} />
          </div>
        )}
      </ATable>
    </AdminLayout>
  )
}
