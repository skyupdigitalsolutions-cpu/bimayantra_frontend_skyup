// 04 · Policy Holders list and 05 · Customer profile (overview tab) on the live API.
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { PageHeader } from '../components/ui'
import { PillButton, StatCard, SegTabs, SearchField, TableCard, THead, TRow, PersonCell, SChip, ChevBtn } from '../screens/sales/_parts'
import CustomerProfile from '../screens/sales/CustomerProfile'
import { NoMatches, useHeaderSearch } from '../screens/tasks/_filter'
import { api, useQuery, useDebounced } from '../api'
import { avatarHex, daysFromToday, fmtDate, fmtMobile, initials, titleCase } from '../api/format'
import { useToast } from '../components/LiveToast'
import { LoadingPanel, ErrorPanel } from './common'
import { CustomerStatusActions } from './CustomerTabs'
import { customerTabPath } from './views'

const COLS = [
  { label: 'Customer', w: 'w-[300px]' }, { label: 'Mobile', w: 'w-[150px]' }, { label: 'City', w: 'w-[140px]' },
  { label: 'Family', w: 'w-[100px]' }, { label: 'Policies', w: 'w-[110px]' }, { label: 'Personal-data consent', w: 'w-[220px]' }, { label: '', w: 'w-[60px]' },
]
const cell = 'shrink-0 text-[14px] font-medium text-ink'
const PAGE = 25

export function LiveCustomers() {
  const [tab, setTab] = useState('active')
  const [q, setQ] = useState('')
  const [hq] = useHeaderSearch()
  const search = useDebounced((q || hq).trim(), 300)
  const [page, setPage] = useState(1)
  useEffect(() => setPage(1), [tab, search])
  const status = tab === 'active' ? 'ACTIVE' : 'INACTIVE'
  const list = useQuery(['customers', status, search, page], () => api.customers.list({ status, search: search || undefined, page, limit: PAGE }))
  // tab counts and the stat cards
  const st = useQuery('customers:stats', () => api.customers.stats())
  const S = st.data || {}
  const activeTotal = { meta: { total: S.active } }
  const inactiveTotal = { meta: { total: S.inactive } }
  const rows = list.data || []
  const meta = list.meta || {}
  const stats = [
    { icon: 'users', label: 'Active customers', value: String(S.active ?? '—'), sub: `${S.inactive ?? 0} inactive`, bg: '#d9eafd' },
    { icon: 'user-plus', label: 'Family members', value: String(S.familyMembers ?? '—'), sub: `Across ${S.households ?? 0} household${S.households === 1 ? '' : 's'}`, bg: '#e9e3fc' },
    { icon: 'shield', label: 'Policies in force', value: String(S.policiesInForce ?? '—'), sub: `${S.awaitingIssuance ?? 0} awaiting issuance`, bg: '#d4f1e7' },
    { icon: 'lock', label: 'Consent pending', value: String(S.consentPending ?? '—'), sub: 'Record before adding PAN', bg: '#fde8c9' },
  ]
  if (list.error && !list.data) return <ErrorPanel active="customers" error={list.error} />
  return (
    <AppLayout active="customers">
      <PageHeader title="Policy Holders" subtitle="Everyone you have converted or added directly." actions={<PillButton variant="pink" icon="plus" to="/customers/new">New customer</PillButton>} />
      <div className="mt-[34px] flex gap-5">{stats.map((s) => <StatCard key={s.label} {...s} />)}</div>
      <div className="mt-[19px] flex items-center gap-3">
        <SegTabs value={tab} onChange={setTab} items={[{ key: 'active', label: 'Active', count: activeTotal.meta?.total ?? 0 }, { key: 'inactive', label: 'Inactive', count: inactiveTotal.meta?.total ?? 0 }]} />
        <SearchField placeholder="Name, mobile or CU number" value={q} onChange={setQ} />
        <PillButton variant="outline" size="sm" icon="filter">Filters</PillButton>
      </div>
      <TableCard className="mt-6">
        <THead cols={COLS} />
        <div>
          {rows.map((c) => (
            <TRow key={c.id} to={`/customers/${c.id}`}>
              <div className="w-[300px] shrink-0"><PersonCell initials={initials(c.name)} bg={avatarHex(c.name)} name={c.name} sub={c.number} /></div>
              <p className={`${cell} w-[150px]`}>{fmtMobile(c.mobile)}</p>
              <p className={`${cell} w-[140px]`}>{c.city ?? '—'}</p>
              <p className={`${cell} w-[100px]`}>{c.familyCount ?? 0}</p>
              <p className={`${cell} w-[110px]`}>{c.policyCount ?? 0}</p>
              <div className="w-[220px] shrink-0">{c.personalDataConsent === 'GIVEN' ? <SChip tone="green" icon="check">Given</SChip> : c.personalDataConsent === 'WITHDRAWN' ? <SChip tone="red" icon="x">Withdrawn</SChip> : <SChip tone="gray">Not recorded</SChip>}</div>
              <div className="flex w-[60px] shrink-0 justify-end"><ChevBtn /></div>
            </TRow>
          ))}
        </div>
        {list.loading && !rows.length && <p className="border-b border-line px-6 py-5 text-[13px] font-medium text-muted">Loading…</p>}
        {!list.loading && rows.length === 0 && <NoMatches className="border-b border-line" onClear={() => setQ('')} sub="No policy holders fit the current search." />}
        <div className="flex items-center gap-2 px-6 py-4">
          <p className="flex-1 text-[13px] font-medium text-muted">{rows.length ? `${rows.length} of ${meta.total ?? rows.length} customers` : '0 customers'}</p>
          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex size-[34px] items-center justify-center rounded-[17px] bg-white text-ink shadow-soft hover:bg-tile disabled:opacity-40"><Icon name="chev-right" size={15} className="rotate-180" /></button>
          <button type="button" aria-label="Next page" disabled={page >= (meta.pages ?? 1)} onClick={() => setPage((p) => p + 1)} className="flex size-[34px] items-center justify-center rounded-[17px] bg-white text-ink shadow-soft hover:bg-tile disabled:opacity-40"><Icon name="chev-right" size={15} /></button>
        </div>
      </TableCard>
    </AppLayout>
  )
}

const PREF = { WHATSAPP: 'WhatsApp', PHONE_CALL: 'Phone call', EMAIL: 'Email' }
const CONSENT = {
  GIVEN: { tone: 'green', icon: 'check', label: 'Personal-data consent', short: 'Consent given' },
  WITHDRAWN: { tone: 'red', icon: 'x', label: 'Consent withdrawn', short: 'Withdrawn' },
  NOT_RECORDED: { tone: 'amber', icon: 'alert', label: 'Consent not recorded', short: 'Not recorded' },
}

export function LiveCustomerProfile() {
  const { id } = useParams()
  const { toastError } = useToast()
  const c = useQuery(['customer', id], () => api.customers.get(id))
  const quotes = useQuery(['quotations', id], () => api.quotations.list({ customerId: id }))
  const renewals = useQuery(['renewals', id], () => api.renewals.list({ customerId: id }))
  const tasks = useQuery(['tasks', 'customer', id], () => api.tasks.list('TODAY', undefined, { type: 'CUSTOMER', id }))
  const policies = useQuery(['policies', id], () => api.policies.list({ customerId: id }))
  const nominee = useQuery(['default-nominee', id], () => api.customers.defaultNominee(id))
  const consents = useQuery(['consents', id], () => api.customers.consents(id))
  const [shown, setShown] = useState({})

  const reveal = async (field) => {
    try {
      const { data } = await api.customers.revealIdentity(id, field)
      const value = data?.value
      setShown((s) => ({ ...s, [field]: String(value) }))
      setTimeout(() => setShown((s) => ({ ...s, [field]: undefined })), (data?.maskAfterSeconds ?? 30) * 1000)
    } catch (e) { toastError(e) }
  }

  const data = useMemo(() => {
    const x = c.data
    if (!x) return null
    const fam = (x.family || []).filter((m) => m.status === 'ACTIVE')
    const qs = quotes.data || []
    const ps = policies.data || []
    const openQ = qs.filter((q) => ['DRAFT', 'READY', 'SHARED'].includes(q.status))
    const addr = [x.address?.line1, x.address?.line2, x.address?.city, x.address?.state, x.address?.pin].filter(Boolean).join(', ')
    // Identity-card chip (short) stays on personal-data consent, so the PAN card's colour is never misleading.
    const pd = CONSENT[x.personalDataConsent] ?? CONSENT.NOT_RECORDED
    // Hero chip label follows the primary holder's WhatsApp messaging consent, per Figma ("WhatsApp consent").
    const waStatus = (consents.data?.rows || []).find((r) => r.person?.id === x.id)?.channels?.WHATSAPP?.status
    const waLabel = waStatus === 'GIVEN' ? 'WhatsApp consent' : waStatus === 'WITHDRAWN' ? 'WhatsApp withdrawn' : 'WhatsApp not recorded'
    // Soonest upcoming renewal, for the hero's 3rd mini tile.
    const renewalDays = (renewals.data || []).map((r) => (r.daysLeft != null ? r.daysLeft : daysFromToday(r.dueDate))).filter((v) => v != null)
    const renewalMini = ['Renewal in', renewalDays.length ? `${Math.min(...renewalDays)} days` : '—']
    const nomName = nominee.data?.defaultNominee?.name
    const tab = (key, label, count) => ({ key, label, count, to: customerTabPath(id, key) })
    return {
      active: x.status === 'ACTIVE', name: x.name, initials: initials(x.name),
      meta: [x.number, x.age != null ? `${x.age} years` : null, x.city].filter(Boolean).join(' · '),
      tagline: [x.occupation, x.preferredContact ? `prefers ${PREF[x.preferredContact]}` : null].filter(Boolean).join(' · ') || 'No occupation or contact preference yet',
      consentChip: { tone: pd.tone, icon: pd.icon, label: waLabel, short: pd.short },
      sourceChip: x.referredBy ? `Referred by ${x.referredBy.name}` : x.referrer ? `Referrer · ${x.referrer.name}` : x.source,
      minis: [['Policies', String(ps.length)], ['Open quotes', String(openQ.length)], renewalMini],
      details: [
        ['Date of birth', x.dob ? `${fmtDate(x.dob)}${x.age != null ? ` (${x.age})` : ''}` : '—'],
        ['Primary mobile', fmtMobile(x.mobile)], ['Email', x.email || '—'], ['Preferred contact', PREF[x.preferredContact] ?? '—'],
        ['Wedding anniversary', x.anniversary ? fmtDate(x.anniversary) : '—'], ['Occupation', x.occupation || '—'],
      ],
      address: addr || '—',
      householdSub: `${fam.length} member${fam.length === 1 ? '' : 's'}${nomName ? ` · default nominee ${nomName}` : ''}`,
      members: fam.map((m) => ({ initials: initials(m.name), name: m.name, rel: `${m.relationship}${m.age != null ? ` · ${m.age}` : ' · add DOB'}`, warn: m.age == null, bg: avatarHex(m.name) })),
      ids: [
        { label: 'PAN', masked: x.identity?.pan, shown: shown.PAN, onShow: () => reveal('PAN') },
        { label: 'Aadhaar', masked: x.identity?.aadhaar, shown: shown.AADHAAR, onShow: () => reveal('AADHAAR') },
      ],
      openItems: [
        ...openQ.slice(0, 2).map((q) => ({ icon: 'quote', bg: '#e9e3fc', title: q.number ?? 'Draft quotation', sub: [q.productName, q.validUntil ? `valid till ${fmtDate(q.validUntil, { year: false })}` : null].filter(Boolean).join(' · ') || titleCase(q.status), chip: ['blue', titleCase(q.status)], to: `/quotations/${q.id}` })),
        ...(renewals.data || []).slice(0, 1).map((r) => ({ icon: 'refresh', bg: '#fde8c9', title: `Renewal · ${r.policy?.product ?? ''}`, sub: `Ends ${fmtDate(r.dueDate)}`, chip: ['amber', titleCase(r.status)], to: `/renewals?open=${r.id}` })),
        ...(tasks.data?.tasks || []).slice(0, 2).map((t) => ({ icon: 'calendar', bg: '#d9eafd', title: t.title, sub: t.dueShown, chip: ['gray', 'Task'] })),
      ],
      tabs: [tab('overview', 'Overview'), tab('family', 'Family', fam.length), tab('consent', 'Consent'), tab('documents', 'Documents'), tab('vehicles', 'Vehicles'),
        tab('quotations', 'Quotations', qs.length), tab('policies', 'Policies', ps.length), tab('payments', 'Payments'), tab('renewals', 'Renewals'), tab('activities', 'Activities')],
      quoteTo: `/quotations/new?customerId=${id}`, bestFitTo: `/best-fit?customerId=${id}`, editTo: `/customers/${id}/edit`,
      statusActions: <CustomerStatusActions c={x} edit={false} />,
    }
  }, [c.data, quotes.data, policies.data, renewals.data, tasks.data, nominee.data, consents.data, shown, id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (c.error) return <ErrorPanel active="customers" error={c.error} back="/customers" />
  if (!data) return <LoadingPanel active="customers" />
  return <CustomerProfile data={data} />
}