// Figma 290:39177 · AA13 · Admin — Support access
import Icon from '../../components/Icon'
import { AdminLayout, AdminHeader, ATable, ARow, ACell, RowButton, TPill } from './_parts'
import { grantRows } from '../../data/states-admin'

const COLS = [['Advisor', 'w-[240px]'], ['Given to', 'w-[160px]'], ['Reason', 'w-[320px]'], ['Ends', 'w-[160px]'], ['Status', 'w-[130px]'], ['', 'w-[80px]']]

export default function SupportAccess() {
  return (
    <AdminLayout active="support">
      <AdminHeader title="Support access" subtitle="You can open an advisor’s records only while they’ve given you access." />
      <ATable cols={COLS} className="mt-[21px]">
        {grantRows.map((g) => (
          <ARow key={g.advisor}>
            <ACell w="w-[240px]" strong>{g.advisor}</ACell>
            <ACell w="w-[160px]">{g.to}</ACell>
            <ACell w="w-[320px]">{g.reason}</ACell>
            <ACell w="w-[160px]">{g.ends}</ACell>
            <ACell w="w-[130px]"><TPill t={g.status} /></ACell>
            <ACell w="w-[80px]">{g.open && <RowButton variant="navy" >Open</RowButton>}</ACell>
          </ARow>
        ))}
      </ATable>
      <div className="mt-4 flex h-[42px] items-center gap-2.5 rounded-[16px] border border-[#f2c4c8] bg-[#fff7f7] px-4">
        <Icon name="lock" size={16} className="text-[#b4323c]" />
        <p className="text-[13px] font-semibold text-[#b4323c]">Opening Coastal Cover was refused and logged: no active grant.</p>
      </div>
    </AdminLayout>
  )
}
