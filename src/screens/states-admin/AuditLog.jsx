// Figma 290:38759 · AA11 · Admin — Audit log
import { AdminLayout, AdminHeader, HButton, ATable, ARow, ACell } from './_parts'
import { auditRows } from '../../data/states-admin'

const W = ['w-[150px]', 'w-[170px]', 'w-[380px]', 'w-[200px]', 'w-[140px]']
const COLS = ['When', 'Who', 'Action', 'Account', 'Record'].map((l, i) => [l, W[i]])

export default function AuditLog() {
  return (
    <AdminLayout active="catalogue">
      <AdminHeader
        title="Audit log"
        subtitle="Every action across SkyUp and advisor accounts. Personal data is masked for staff."
        actions={<HButton variant="outline" icon="download">Export CSV</HButton>}
      />
      <ATable cols={COLS} className="mt-[21px]">
        {auditRows.map((r) => (
          <ARow key={r[0]}>
            {r.map((c, i) => <ACell key={i} w={W[i]} strong={i === 0}>{c}</ACell>)}
          </ARow>
        ))}
      </ATable>
    </AdminLayout>
  )
}
