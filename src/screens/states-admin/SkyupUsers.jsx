// Figma 290:38242 · AA9 · Admin — SkyUp users
import { useState } from 'react'
import { AdminLayout, AdminHeader, HButton, Pill, ATable, ARow, ACell, RowButton, TinyAvatar } from './_parts'
import { skyupUsers } from '../../data/states-admin'

const COLS = [['Person', 'w-[260px]'], ['Role', 'w-[140px]'], ['Mobile', 'w-[160px]'], ['Status', 'w-[150px]'], ['Last active', 'w-[160px]'], ['', 'w-[60px]']]
const STATUS = {
  active: <Pill tone="green" icon="check">Active</Pill>,
  invited: <Pill tone="blue" icon="send">Invited</Pill>,
  disabled: <Pill tone="bg-[#eef1f5] text-ink-2" icon="x">Disabled</Pill>,
}

export default function SkyupUsers() {
  const [users, setUsers] = useState(skyupUsers)
  const set = (i, status) => setUsers(users.map((u, j) => (j === i ? { ...u, status } : u)))
  return (
    <AdminLayout active="catalogue">
      <AdminHeader
        title="SkyUp users"
        subtitle="Staff and admins. The last active admin can’t be disabled."
        actions={<HButton variant="pink" icon="user-plus">Add user</HButton>}
      />
      <ATable cols={COLS} className="mt-[21px]">
        {users.map((u, i) => (
          <ARow key={u.name}>
            <ACell w="w-[260px]" strong><TinyAvatar initials={u.initials} tint={u.tint} />{u.name}</ACell>
            <ACell w="w-[140px]">{u.role}</ACell>
            <ACell w="w-[160px]">{u.mobile}</ACell>
            <ACell w="w-[150px]">{STATUS[u.status]}</ACell>
            <ACell w="w-[160px]">{u.last}</ACell>
            <ACell w="w-[60px]">
              {i > 0 && u.status === 'active' && <RowButton variant="danger" onClick={() => set(i, 'disabled')}>Disable</RowButton>}
              {u.status === 'invited' && <RowButton>Resend</RowButton>}
              {u.status === 'disabled' && <RowButton onClick={() => set(i, 'active')}>Enable</RowButton>}
            </ACell>
          </ARow>
        ))}
      </ATable>
    </AdminLayout>
  )
}
