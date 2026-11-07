// Figma 12:1775 · 15 · Documents
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SegTabs, StatusChip } from './_parts'
import { documentTabs, documentCards } from '../../data/catalogue'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

function DocCard({ d }) {
  const [label, tone, icon] = d.chip
  return (
    <div className="flex h-[260px] w-[280px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <div className={cx('flex h-[130px] items-center justify-center', d.bg)}>
        <div className="flex w-[110px] rotate-[4deg] flex-col gap-1.5 rounded-[12px] bg-white px-4 py-3.5 shadow-[0px_8px_16px_-6px_rgba(19,41,75,0.1)]">
          <Icon name={d.icon} size={18} className="text-ink" />
          <span className="h-[5px] w-[70px] rounded-[3px] bg-[#e3e8f0]" />
          <span className="h-[5px] w-[54px] rounded-[3px] bg-[#e3e8f0]" />
          <span className="h-[5px] w-[62px] rounded-[3px] bg-[#e3e8f0]" />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-[18px] pt-4 pb-[18px]">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[14px] font-bold text-ink">{d.title}</p>
          <button type="button" aria-label="More" className="text-muted hover:text-ink"><Icon name="more" size={18} /></button>
        </div>
        <p className="text-[12px] font-semibold text-ink-2">{d.owner}</p>
        <p className="text-[11px] font-medium text-muted">{d.ver}</p>
        <StatusChip tone={tone} icon={icon} className="self-start">{label}</StatusChip>
      </div>
    </div>
  )
}

export default function Documents() {
  const [tab, setTab] = useState('all')
  const [q, clearQ] = useHeaderSearch()
  const tabs = documentTabs.map((t) => ({ ...t, count: t.key === 'all' ? documentCards.length : documentCards.filter((d) => d.cat === t.key).length }))
  const docs = documentCards.filter((d) => (tab === 'all' || d.cat === tab) && matchesQuery(q, d.title, d.owner, d.ver, d.chip[0]))
  return (
    <AppLayout active="customers">
      <Header
        breadcrumb={'CLIENTS  /  DOCUMENTS'}
        title="Documents"
        subtitle="Every upload is kept as a version. Nothing is ever deleted."
        actions={<HeadButton icon="upload" to="/x/fd3-add-document-whose-document">Document</HeadButton>}
      />
      <SegTabs items={tabs} value={tab} onChange={setTab} className="mt-[13px]" />
      <div className="mt-7 flex w-[1180px] flex-wrap gap-5">
        {docs.map((d) => <DocCard key={d.title} d={d} />)}
        {docs.length === 0 && (
          <NoMatches className="w-full rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]" sub={`No documents match “${q.trim()}”.`} onClear={() => { clearQ(); setTab('all') }} />
        )}
      </div>
    </AppLayout>
  )
}
