// Figma 290:38974 · AA12 · Admin — Agent-code flags
import { useState } from 'react'
import { AdminLayout, AdminHeader, Pill, ATable, ARow, ACell, RowButton } from './_parts'
import { flagRows } from '../../data/states-admin'

const COLS = [['Insurer', 'w-[180px]'], ['Agent code', 'w-[150px]'], ['Accounts', 'w-[360px]'], ['Raised', 'w-[140px]'], ['Status', 'w-[150px]'], ['', 'w-[60px]']]

export default function AgentCodeFlags() {
  const [rows, setRows] = useState(flagRows)
  return (
    <AdminLayout active="flags">
      <AdminHeader title="Agent-code flags" subtitle="The same agent code used in more than one account." />
      <ATable cols={COLS} className="mt-[21px]">
        {rows.map((f, i) => (
          <ARow key={f.code}>
            <ACell w="w-[180px]" strong>{f.insurer}</ACell>
            <ACell w="w-[150px]">{f.code}</ACell>
            <ACell w="w-[360px]">{f.accounts}</ACell>
            <ACell w="w-[140px]">{f.raised}</ACell>
            <ACell w="w-[150px]">{f.open ? <Pill tone="amber" icon="alert">Open</Pill> : <Pill tone="green" icon="check">Resolved</Pill>}</ACell>
            <ACell w="w-[60px]">{f.open && <RowButton onClick={() => setRows(rows.map((x, j) => (j === i ? { ...x, open: false } : x)))}>Review</RowButton>}</ACell>
          </ARow>
        ))}
      </ATable>
    </AdminLayout>
  )
}
