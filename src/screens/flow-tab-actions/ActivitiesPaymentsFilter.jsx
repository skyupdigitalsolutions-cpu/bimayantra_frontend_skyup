// Figma 247:21783 · PA1 · Activities — Payments filter
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { PageHeading, ProfileHero, PillTabs } from '../flow-consent/_parts'
import { CARD } from './_parts'
import { activities } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from '../customer-tabs/_search'

const FILTERS = ['All', 'Quotations', 'Payments', 'Documents', 'Messages', 'Consent'].map((l) => ({ key: l.toLowerCase(), label: l }))

// Same activity log as 05i, grouped by day; tag → filter key
const GROUPS = activities.map((g) => ({ day: g.day, items: g.items.map((i) => ({ ...i, kind: i.tag.toLowerCase() })) }))

export default function ActivitiesPaymentsFilter() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('payments')
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const groups = GROUPS
    .map((g) => ({ ...g, items: g.items.filter((e) => (filter === 'all' || e.kind === filter) && matches(q, e.title, e.sub, e.tag)) }))
    .filter((g) => g.items.length)
  return (
    <AppLayout active="customers">
      <PageHeading crumb="POLICY HOLDERS  /  KAVYA HEGDE  /  ACTIVITIES" />
      <ProfileHero className="mt-[13px]" />
      <PillTabs items={FILTERS} active={filter} onSelect={setFilter} className="mt-6" />
      <PillTabs
        items={FILTERS}
        active="all"
        onSelect={(k) => (k === 'all' ? navigate('/x/05i-customer-activities') : setFilter(k))}
        className="mt-6"
      />
      <section className={cx(CARD, 'mt-[22px] flex flex-col gap-1.5 p-6')}>
        {groups.map((g) => (
          <div key={g.day} className="contents">
            <p className="px-2 pt-2.5 pb-1 text-[11px] font-bold tracking-[0.4px] text-muted">{g.day}</p>
            {g.items.map((e) => (
              <div key={e.title} className="flex items-center gap-3.5 p-2">
                <span className="flex size-10 items-center justify-center rounded-full text-ink" style={{ background: e.bg }}><Icon name={e.icon} size={18} /></span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-ink">{e.title}</span>
                  <span className="text-[12px] font-medium text-muted">{e.sub}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
        {!groups.length && (
          <NoMatches label={q ? `No activity matches “${q}”` : 'No activity for this filter'} onClear={() => { setQ(''); setFilter('all') }} />
        )}
      </section>
    </AppLayout>
  )
}
