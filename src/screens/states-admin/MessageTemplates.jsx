// Figma 290:37945 · AA8 · Admin — Message templates
import { useState } from 'react'
import { SegTabs } from '../admin/_parts'
import { AdminLayout, AdminHeader, HButton, ATable, ARow, ACell, RowButton, TPill } from './_parts'
import { templates } from '../../data/states-admin'
import { NoMatches } from '../admin/_filter'

const COLS = [['Template', 'w-[260px]'], ['Channel', 'w-[110px]'], ['Used for', 'w-[220px]'], ['Status', 'w-[200px]'], ['Updated', 'w-[140px]'], ['', 'w-[60px]']]

export default function MessageTemplates() {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? templates : templates.filter((t) => t.tag === tab)
  const count = (tag) => templates.filter((t) => t.tag === tag).length
  return (
    <AdminLayout active="templates">
      <AdminHeader
        title="Message templates"
        subtitle="WhatsApp templates need Meta approval. Email templates need a second admin."
        actions={<HButton variant="pink" icon="plus">New template</HButton>}
      />
      <SegTabs
        className="mt-[21px]"
        value={tab}
        onChange={setTab}
        items={[
          { key: 'all', label: 'All', count: templates.length },
          { key: 'active', label: 'Active', count: count('active') },
          { key: 'pending', label: 'Pending', count: count('pending') },
          { key: 'rejected', label: 'Rejected', count: count('rejected') },
        ]}
      />
      <ATable cols={COLS} className="mt-5">
        {rows.map((t) => (
          <ARow key={t.name}>
            <ACell w="w-[260px]" strong>{t.name}</ACell>
            <ACell w="w-[110px]">{t.channel}</ACell>
            <ACell w="w-[220px]">{t.use}</ACell>
            <ACell w="w-[200px]"><TPill t={t.status} /></ACell>
            <ACell w="w-[140px]">{t.updated}</ACell>
            <ACell w="w-[60px]">{t.action && <RowButton to={t.action === 'Review' ? '/x/23-skyup-admin-approvals' : undefined}>{t.action}</RowButton>}</ACell>
          </ARow>
        ))}
        {rows.length === 0 && (
          <div className="border-t border-line p-4">
            <NoMatches hint="No templates with this status." onClear={() => setTab('all')} />
          </div>
        )}
      </ATable>
    </AdminLayout>
  )
}
