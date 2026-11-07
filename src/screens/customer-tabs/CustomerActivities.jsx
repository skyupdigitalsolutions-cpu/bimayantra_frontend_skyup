// Figma 56:9324 · 05i · Customer — Activities
import { useState } from 'react'
import { cx } from '../../components/ui'
import { ProfileShell, PillTabs, IconTile, CARD_SHADOW } from './_parts'
import { activityFilters, activities } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

export default function CustomerActivities() {
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const groups = activities
    .map((g) => ({ ...g, items: g.items.filter((i) => (filter === 'All' || i.tag === filter) && matches(q, i.title, i.sub, i.tag)) }))
    .filter((g) => g.items.length)
  return (
    <ProfileShell tab="activities" crumb="ACTIVITIES" routes={{ payments: '/x/pa1-activities-payments-filter' }}>
      <PillTabs items={activityFilters.map((f) => ({ key: f, label: f }))} value={filter} onChange={setFilter} />

      <section className={cx('mt-[22px] flex flex-col gap-1.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        {groups.map((g) => (
          <div key={g.day} className="contents">
            <p className="px-2 pt-2.5 pb-1 text-[11px] font-bold tracking-[0.4px] text-muted">{g.day}</p>
            {g.items.map((i) => (
              <div key={i.title} className="flex h-14 items-center gap-3.5 rounded-[16px] p-2 hover:bg-panel">
                <IconTile icon={i.icon} bg={i.bg} size={40} iconSize={18} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                  <p className="text-[14px] font-bold text-ink">{i.title}</p>
                  <p className="text-[12px] font-medium text-muted">{i.sub}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
        {!groups.length && (
          <NoMatches label={q ? `No activity matches “${q}”` : 'No activity of this type yet'} onClear={() => { setQ(''); setFilter('All') }} />
        )}
      </section>
    </ProfileShell>
  )
}
