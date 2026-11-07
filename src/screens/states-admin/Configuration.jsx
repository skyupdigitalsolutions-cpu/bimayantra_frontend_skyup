// Figma 290:38503 · AA10 · Admin — Configuration
import { AdminLayout, AdminHeader, ATable, ARow, ACell, RowButton, TPill } from './_parts'
import { configRows } from '../../data/states-admin'

const COLS = [['Setting', 'w-[300px]'], ['Code', 'w-[100px]'], ['Live value', 'w-[170px]'], ['Pending value', 'w-[170px]'], ['Status', 'w-[190px]'], ['', 'w-[60px]']]

export default function Configuration() {
  return (
    <AdminLayout active="catalogue">
      <AdminHeader title="Configuration" subtitle="Changes apply only after a different admin approves." />
      <ATable cols={COLS} className="mt-[21px]">
        {configRows.map((c) => (
          <ARow key={c.code}>
            <ACell w="w-[300px]" strong>{c.name}</ACell>
            <ACell w="w-[100px]">{c.code}</ACell>
            <ACell w="w-[170px]">{c.live}</ACell>
            <ACell w="w-[170px]">{c.pending}</ACell>
            <ACell w="w-[190px]"><TPill t={c.status} /></ACell>
            <ACell w="w-[60px]">{c.edit && <RowButton>Edit</RowButton>}</ACell>
          </ARow>
        ))}
      </ATable>
    </AdminLayout>
  )
}
