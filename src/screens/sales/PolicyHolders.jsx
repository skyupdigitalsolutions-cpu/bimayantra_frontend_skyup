// Figma 9:562 · 04 · Policy Holders
import { useMemo, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { PageHeader } from '../../components/ui'
import { PillButton, StatCard, SegTabs, SearchField, TableCard, THead, TRow, ChevBtn, PersonCell, SChip } from './_parts'
import { customerStats, customers } from '../../data/sales'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { matchesQuery, useHeaderSearch, useDismiss, NoMatches } from '../tasks/_filter'

const CONSENT = [['all', 'Any consent'], ['given', 'Consent given'], ['missing', 'Not recorded']]
const CITIES = [...new Set(customers.map((c) => c.city))]

function FiltersMenu({ consent, setConsent, city, setCity, onClear }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, setOpen)
  const n = (consent !== 'all') + (city !== 'all')
  const opt = (on, onClick, label) => (
    <button key={label} type="button" role="option" aria-selected={on} onClick={onClick} className={cx('flex h-9 items-center gap-2 rounded-[10px] px-2.5 text-left text-[13px] font-semibold text-ink hover:bg-[#f3f7ff]', on && 'bg-[#f3f7ff]')}>
      <span className="flex-1">{label}</span>{on && <Icon name="check" size={14} className="text-blue" />}
    </button>
  )
  return (
    <div ref={ref} className="relative">
      <PillButton variant="outline" size="sm" icon="filter" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cx('pl-[13px] pr-[15px]', n > 0 && 'border-blue bg-blue-50 text-blue hover:bg-blue-50')}>
        Filters{n > 0 && <span className="rounded-[8px] bg-blue px-1.5 text-[11px] font-bold text-white">{n}</span>}
      </PillButton>
      {open && (
        <div role="listbox" className="absolute top-11 left-0 z-30 flex w-[240px] flex-col gap-0.5 rounded-[18px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
          <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">PERSONAL-DATA CONSENT</p>
          {CONSENT.map(([k, l]) => opt(consent === k, () => setConsent(k), l))}
          <p className="px-2.5 pt-3 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">CITY</p>
          {[['all', 'All cities'], ...CITIES.map((c) => [c, c])].map(([k, l]) => opt(city === k, () => setCity(k), l))}
          <div className="flex justify-between px-2.5 pt-2 pb-1">
            <button type="button" onClick={() => { onClear(); setOpen(false) }} className="text-[13px] font-semibold text-ink hover:underline">Clear</button>
            <button type="button" onClick={() => setOpen(false)} className="text-[13px] font-bold text-blue hover:underline">Done</button>
          </div>
        </div>
      )}
    </div>
  )
}

const COLS = [
  { label: 'Customer', w: 'w-[300px]' },
  { label: 'Mobile', w: 'w-[150px]' },
  { label: 'City', w: 'w-[140px]' },
  { label: 'Family', w: 'w-[100px]' },
  { label: 'Policies', w: 'w-[110px]' },
  { label: 'Personal-data consent', w: 'w-[176px]' },
  { label: '', w: 'w-9' },
]

const cell = 'shrink-0 text-[14px] font-medium text-ink'

export default function PolicyHolders() {
  const [tab, setTab] = useState('active')
  const [q, setQ] = useState('')
  const [hq, clearHq] = useHeaderSearch()
  const [consent, setConsent] = useState('all')
  const [city, setCity] = useState('all')

  const inTab = customers.filter((c) => (tab === 'active' ? c.active : !c.active))
  const rows = useMemo(() => inTab
    .filter((c) => matchesQuery(q, c.name, c.mobile, c.mobile.replace(/\s/g, ''), c.code))
    .filter((c) => matchesQuery(hq, c.name, c.mobile, c.code, c.city))
    .filter((c) => consent === 'all' || (consent === 'given' ? c.consent : !c.consent))
    .filter((c) => city === 'all' || c.city === city), [inTab, q, hq, consent, city])
  const clearAll = () => { setQ(''); clearHq(); setConsent('all'); setCity('all') }

  const activeCount = customers.filter((c) => c.active).length

  return (
    <AppLayout active="customers">
      <PageHeader
        title="Policy Holders"
        subtitle="Everyone you have converted or added directly."
        actions={<PillButton variant="pink" icon="plus" to="/x/f3-new-customer">New customer</PillButton>}
      />

      <div className="mt-[34px] flex gap-5">
        {customerStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-[19px] flex items-center gap-3">
        <SegTabs
          value={tab}
          onChange={setTab}
          items={[
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'inactive', label: 'Inactive', count: customers.length - activeCount },
          ]}
        />
        <SearchField placeholder="Name, mobile or CU number" value={q} onChange={setQ} />
        <FiltersMenu consent={consent} setConsent={setConsent} city={city} setCity={setCity} onClear={() => { setConsent('all'); setCity('all') }} />
      </div>

      <TableCard className="mt-6">
        <THead cols={COLS} />
        <div>
        {rows.map((c) => (
          <TRow key={c.id} to="/customers/1">
            <div className="w-[300px] shrink-0">
              <PersonCell initials={c.initials} bg={c.avatar} name={c.name} sub={c.code} />
            </div>
            <p className={`${cell} w-[150px]`}>{c.mobile}</p>
            <p className={`${cell} w-[140px]`}>{c.city}</p>
            <p className={`${cell} w-[100px]`}>{c.family}</p>
            <p className={`${cell} w-[110px]`}>{c.policies}</p>
            <div className="w-[176px] shrink-0">
              {c.consent ? <SChip tone="green" icon="check">Given</SChip> : <SChip tone="gray">Not recorded</SChip>}
            </div>
          </TRow>
        ))}
        </div>
        {rows.length === 0 && <NoMatches className="border-b border-line" onClear={clearAll} sub="No policy holders fit the current search or filters." />}
        <div className="flex items-center px-6 py-4">
          <p className="flex-1 text-[13px] font-medium text-muted">{rows.length} of {inTab.length} customers</p>
          <ChevBtn size={34} />
        </div>
      </TableCard>
    </AppLayout>
  )
}
