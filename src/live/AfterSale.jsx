// 11 Policies · 12 Policy detail · 13 Renewals · 14 Communications — all on the live API.
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Dropdown } from '../components/pickers'
import { cx } from '../components/ui'
import { RenewalCard } from '../components/cards'
import { Header, HeadButton, SmallButton, StatTile, SegTabs, DataTable, StatusChip, RowChevron, IdCell, Panel, PanelHead, RingAvatar } from '../screens/catalogue/_parts'
import { SH8 } from '../screens/states-records/_parts'
import { matchesQuery, useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { api, useQuery } from '../api'
import { avatarClass, daysFromToday, fmtDate, fmtDateTime, fmtMoney, initials } from '../api/format'
import { ActionDialog, Field, useAct, label, dmy, isoDay, ErrorNote } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { EditNomineesDrawer } from './PolicyRecords'
import { Drawer } from '../screens/flow-payment/_parts'
import RenewalQuoteDialog from './RenewalQuote'
import { WALLET_ENABLED } from '../config/features'
import { useAuth } from '../auth/AuthProvider'

const day = (v) => (v ? fmtDate(isoDay(v)) : '—')
const FREQ_OPTS = ['Yearly', 'Half-yearly', 'Quarterly', 'Monthly', 'Single']

/** ₹10 lakh / ₹1.5 crore — the Indian lakh/crore form the Figma screens use for sum insured. */
const fmtLakh = (n) => {
  if (n == null || n === '') return '—'
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  if (v >= 1e7) { const c = v / 1e7; return `₹${Number.isInteger(c) ? c : +c.toFixed(2)} crore` }
  if (v >= 1e5) { const l = v / 1e5; return `₹${Number.isInteger(l) ? l : +l.toFixed(2)} lakh` }
  return fmtMoney(v)
}
/** "Kavya, Arjun and Anya" from the insured people's first names. */
const coversText = (insured) => {
  const names = (insured || []).map((m) => (m?.name || '').split(' ')[0]).filter(Boolean)
  if (!names.length) return ''
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
const sinceText = (v) => {
  const n = daysFromToday(v)
  if (n == null) return ''
  const d = -n
  return d <= 0 ? 'today' : d === 1 ? '1 day ago' : `${d} days ago`
}

/* ═════════════ 11 · Policies ═════════════ */
const P_TABS = [['AWAITING_ISSUANCE', 'Awaiting issuance'], ['ISSUED', 'Issued'], ['EXPIRED', 'Expired'], ['RENEWED', 'Renewed'], ['CANCELLED', 'Cancelled']]
const P_CHIP = {
  ISSUED: <StatusChip tone="green" icon="check">Issued</StatusChip>, AWAITING_ISSUANCE: <StatusChip tone="violet" icon="clock">Awaiting</StatusChip>,
  EXPIRED: <StatusChip tone="red" icon="alert">Expired</StatusChip>, RENEWED: <StatusChip tone="sky" icon="refresh">Renewed</StatusChip>, CANCELLED: <StatusChip tone="neutral" icon="x">Cancelled</StatusChip>,
}

export function LivePolicies() {
  const [pick, setPick] = useState(false) // PP2: choose the policy holder first
  const [tab, setTab] = useState('ISSUED')
  const [q, clearQ] = useHeaderSearch()
  const list = useQuery('policies:all', () => api.policies.list())
  const all = list.data || []
  const rows = all.filter((p) => p.status === tab).map((p) => ({
    ...p, initials: initials(p.customer), bg: avatarClass(p.customer), number: p.policyNumber || 'Pending', ref: p.number ?? '—',
    product: [p.insurer, p.productName].filter(Boolean).join(' ') || '—', ends: day(p.endDate), premiumText: fmtMoney(p.premium),
  })).filter((p) => matchesQuery(q, p.number, p.ref, p.customer, p.product, p.ends, p.premiumText))
  const issued = all.filter((p) => p.status === 'ISSUED')
  const renewing = issued.filter((p) => p.endDate && daysFromToday(isoDay(p.endDate)) >= 0 && daysFromToday(isoDay(p.endDate)) <= 60).sort((a, b) => isoDay(a.endDate).localeCompare(isoDay(b.endDate)))
  const awaiting = all.filter((p) => p.status === 'AWAITING_ISSUANCE')
  const expired = all.filter((p) => p.status === 'EXPIRED' || p.renewal?.status === 'LAPSED')
  const stats = [
    { key: 'awaiting', bg: 'bg-violet-100', icon: 'clock', label: 'Awaiting issuance', value: awaiting.length, note: awaiting[0] ? `Submitted ${sinceText(awaiting[0].createdAt)}` : 'Nothing waiting' },
    { key: 'issued', bg: 'bg-mint-100', icon: 'shield', label: 'Issued', value: issued.length, note: `${fmtMoney(issued.reduce((a, p) => a + (p.premium || 0), 0))} premium in force` },
    { key: 'renewing', bg: 'bg-amber-100', icon: 'refresh', label: 'Renewing in 60 days', value: renewing.length, note: renewing[0] ? `${renewing[0].productName ?? ''} · ${fmtDate(isoDay(renewing[0].endDate), { year: false })}` : 'None soon' },
    { key: 'expired', bg: 'bg-pink-100', icon: 'alert', label: 'Expired or lapsed', value: expired.length, note: expired[0]?.customer ?? 'None' },
  ]
  const columns = [
    { key: 'policy', label: 'Policy', width: 260, render: (r) => <IdCell initials={r.initials} bg={r.bg} title={r.number} sub={r.ref} /> },
    { key: 'customer', label: 'Customer', width: 170 },
    { key: 'product', label: 'Product', width: 210, render: (r) => <span className="truncate">{r.product}</span> },
    { key: 'ends', label: 'Ends', width: 120 },
    { key: 'premiumText', label: 'Premium', width: 110 },
    { key: 'status', label: 'Status', width: 120, render: (r) => P_CHIP[r.status] },
    { key: 'go', label: '', width: 40, className: 'justify-end', render: (_r, hot) => <RowChevron on={hot} /> },
  ]
  if (list.error && !list.data) return <ErrorPanel active="policies" error={list.error} />
  const tabLabel = P_TABS.find(([k]) => k === tab)[1].toLowerCase()
  return (
    <AppLayout active="policies" responsive mobileTitle="Policies">
      <Header breadcrumb={'AFTER-SALE  /  POLICIES'} title="Policies" subtitle="Issued policies start a renewal cycle automatically."
        actions={<HeadButton icon="plus" onClick={() => setPick(true)}>Existing policy</HeadButton>} />
      <div data-rsp className="mt-[13px] flex gap-5 max-md:mt-3 max-md:grid max-md:grid-cols-2 max-md:gap-2.5">{stats.map((s) => <StatTile key={s.key} {...s} />)}</div>
      <SegTabs items={P_TABS.map(([key, l]) => ({ key, label: l, count: all.filter((p) => p.status === key).length }))} value={tab} onChange={setTab} className="mt-3 md:mt-5" />
      <DataTable className="mt-7 w-[1180px] max-md:hidden" columns={columns} rows={list.loading && !list.data ? [] : rows} rowTo={(r) => `/policies/${r.id}`}
        empty={list.loading ? 'Loading…' : q.trim() ? `No ${tabLabel} policies match “${q.trim()}”.` : `No ${tabLabel} policies yet.`} onClear={q.trim() ? clearQ : undefined} />
      {/* Mobile card list */}
      <div className="mt-3 flex flex-col gap-2 md:hidden">
        {rows.map((r) => (
          <Link key={r.id} to={`/policies/${r.id}`} className="flex items-center gap-3 rounded-[16px] border border-line bg-white p-3">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${r.bg}`}>{r.initials}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[14px] font-bold text-ink">{r.number}</p>
              <p className="truncate text-[12px] font-medium text-muted">{r.customer} · {r.product}</p>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-ink">{r.premiumText}</span>
                {r.ends && <span className="text-[11px] text-muted">ends {r.ends}</span>}
                {P_CHIP[r.status]}
              </div>
            </div>
            <RowChevron />
          </Link>
        ))}
        {list.loading && !list.data && <p className="px-4 py-5 text-[13px] font-medium text-muted">Loading\u2026</p>}
        {!list.loading && rows.length === 0 && <p className="px-4 py-4 text-center text-[13px] font-medium text-muted">{q.trim() ? 'No matches.' : `No ${tabLabel} policies yet.`}</p>}
      </div>
      {pick && <PickCustomerDialog onClose={() => setPick(false)} />}
    </AppLayout>
  )
}

/** Record existing policy starts from a policy holder (/customers/:id/policies/new). */
function PickCustomerDialog({ onClose }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const hits = useQuery(['customers', 'pick', q], () => api.customers.list({ status: 'ACTIVE', search: q || undefined, limit: 8 }))
  return (
    <ActionDialog title="Record existing policy" body="Whose policy is it?" onClose={onClose}>
      <Field label="Search policy holder" value={q} onChange={setQ} placeholder="Name, mobile or CU number" />
      <div className="flex flex-col">
        {(hits.data || []).map((c) => <button key={c.id} type="button" onClick={() => navigate(`/customers/${c.id}/policies/new`)} className="rounded-[12px] px-3 py-2.5 text-left text-[13px] font-semibold text-ink hover:bg-panel-2">{c.name} <span className="text-muted">· {c.number}</span></button>)}
        {hits.data && !hits.data.length && <p className="px-3 py-2 text-[13px] font-medium text-muted">No active policy holders found.</p>}
      </div>
    </ActionDialog>
  )
}

/* ═════════════ 12 · Policy detail ═════════════ */
const CANCEL_REASONS = ['Free-look cancellation', 'Cancelled by insurer', 'Cancelled by customer', 'Recorded by mistake', 'Insurer declined the proposal']

export function LivePolicyDetail() {
  const { id } = useParams()
  const q = useQuery(['policy', id], () => api.policies.get(id))
  const [dlg, setDlg] = useState(null)
  if (q.error) return <ErrorPanel active="policies" error={q.error} back="/policies" />
  if (!q.data) return <LoadingPanel active="policies" />
  const p = q.data
  const awaiting = p.status === 'AWAITING_ISSUANCE'
  const productLine = [p.insurer, p.productName].filter(Boolean).join(' ') || '—'
  const docId = p.documentFileId ?? p.document?.id ?? p.documentFile?.id ?? null
  const nv = p.nomineeVersions?.[0]
  const nvDate = nv && (nv.createdAt ?? nv.date ?? nv.effectiveDate)
  const total = (p.nominees || []).reduce((t, n) => t + (Number(n.share) || 0), 0)
  const dueDays = p.renewal?.dueDate != null ? daysFromToday(isoDay(p.renewal.dueDate)) : null
  // Coverage hero progress: how far the policy year has run.
  const startISO = isoDay(p.startDate), endISO = isoDay(p.endDate)
  const daysLeft = endISO ? daysFromToday(endISO) : null
  let pct = 0
  if (startISO && endISO) {
    const s = new Date(`${startISO}T00:00:00Z`).getTime(), e = new Date(`${endISO}T00:00:00Z`).getTime()
    pct = e > s ? Math.min(100, Math.max(0, ((Date.now() - s) / (e - s)) * 100)) : 0
  }
  const showHero = !awaiting && !!p.endDate
  const kv = [
    ['Insurer policy number', p.policyNumber || 'Pending'],
    ['Issue date', day(p.issueDate)],
    ['Frequency', p.frequency ?? '—'],
    ['Sum insured', fmtLakh(p.sumInsured)],
    ...(p.agentCode ? [['Agent code', p.agentCode]] : []),
    ['Source', p.source === 'EXISTING' ? 'Existing policy' : 'Quotation'],
  ]
  const headActions = awaiting
    ? <>
        <HeadButton variant="white" icon="users" onClick={() => setDlg('nominees')}>Edit nominees</HeadButton>
        <HeadButton icon="check" to={`/policies/${p.id}/issue`}>Record issued policy</HeadButton>
      </>
    : <>
        {p.status === 'ISSUED' && <HeadButton variant="danger" icon="x" onClick={() => setDlg('cancel')}>Record cancellation</HeadButton>}
        <HeadButton variant="white" icon="edit" onClick={() => setDlg('correct')}>Correct details</HeadButton>
        <HeadButton variant="navy" icon="users" onClick={() => setDlg('nominees')}>Edit nominees</HeadButton>
      </>
  return (
    <AppLayout active="policies" responsive mobileTitle="Policy">
      <Header back="/policies" breadcrumb={`POLICIES  /  ${(p.number || 'POLICY').toUpperCase()}`} title={p.policyNumber || 'Awaiting issuance'}
        titleExtra={P_CHIP[p.status]} subtitle={[p.number, p.customer?.name, productLine].filter(Boolean).join(' · ')}
        actions={headActions} />

      {showHero && (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-[24px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-5 py-5 shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)] md:mt-6 md:flex-nowrap md:gap-6 md:rounded-[32px] md:px-[30px] md:py-[26px]">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/85 md:size-[72px] md:rounded-[36px]"><Icon name="shield" size={24} className="text-ink" /></span>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <p className="text-[17px] font-bold tracking-[-0.16px] text-ink md:text-[22px] md:tracking-[-0.22px]">{productLine}</p>
            <p className="text-[13px] font-medium text-[#2f6b55]">{[coversText(p.insured) && `Covers ${coversText(p.insured)}`, p.sumInsured != null ? fmtLakh(p.sumInsured) : null, p.frequency].filter(Boolean).join(' · ')}</p>
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 w-[520px] max-w-full overflow-hidden rounded-[5px] bg-white/70"><div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${pct}%` }} /></div>
              <div className="flex w-[520px] max-w-full items-start text-[12px]">
                <p className="flex-1 font-semibold text-[#2f6b55]">{day(p.startDate)}</p>
                <p className="font-bold text-ink">{day(p.endDate)}{daysLeft != null ? ` · ${daysLeft >= 0 ? `${daysLeft} days left` : `${-daysLeft} days overdue`}` : ''}</p>
              </div>
            </div>
          </div>
          {p.premium != null && (
            <div className="flex shrink-0 flex-col gap-0.5 rounded-[16px] bg-white/80 px-4 py-3 max-md:basis-full md:rounded-[20px] md:px-5 md:py-3.5">
              <p className="text-[12px] font-semibold text-[#2f6b55]">Premium</p>
              <p className="text-[22px] font-bold text-ink">{fmtMoney(p.premium)}</p>
            </div>
          )}
        </div>
      )}

      <div className={cx('flex flex-col gap-4 md:flex-row md:items-start md:gap-5', showHero ? 'mt-4 md:mt-5' : 'mt-4 md:mt-6')}>
        <div className="flex min-w-0 flex-col gap-4 md:w-[760px] md:gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Policy" subtitle={p.frozen?.quotation ? `Recorded from ${p.frozen.quotation}` : p.source === 'EXISTING' ? 'Recorded existing policy' : 'As issued by the insurer'}
              right={docId && <SmallButton variant="ghost" icon="download" onClick={() => window.open(api.files.url(docId), '_blank', 'noopener')}>Policy PDF</SmallButton>} />
            <div className="flex flex-wrap gap-x-5 gap-y-3 md:gap-y-[18px]">
              {kv.map(([k, v]) => <div key={k} className="flex w-full flex-col gap-1 md:w-[220px]"><p className="text-[12px] font-medium text-muted">{k}</p><p className="text-[14px] font-semibold text-ink">{v}</p></div>)}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <PanelHead title="Nominees" subtitle={nv ? `Version ${nv.number}${nvDate ? ` · ${day(nvDate)}` : ''}` : 'None recorded'}
              right={(p.nominees || []).length ? <StatusChip tone={total === 100 ? 'green' : 'amber'} icon={total === 100 ? 'check' : 'alert'}>{total}%</StatusChip> : null} />
            {(p.nominees || []).length === 0 && <p className="text-[13px] font-medium text-muted">Not recorded.</p>}
            {(p.nominees || []).map((n, i) => (
              <div key={i} className="flex items-center gap-3.5 rounded-[20px] bg-panel px-4 py-3.5">
                <RingAvatar initials={initials(n.name)} bg={avatarClass(n.name)} size={44} text={14} />
                <div className="flex min-w-0 flex-1 flex-col"><p className="text-[14px] font-bold text-ink">{n.name}</p><p className="text-[12px] font-medium text-muted">{[n.relationship, n.dob ? `born ${day(n.dob)}` : null].filter(Boolean).join(' · ')}</p></div>
                <p className="text-[18px] font-bold text-ink">{n.share}%</p>
              </div>
            ))}
            {(p.nominees || []).length > 0 && <p className="text-[12px] leading-[18px] font-medium text-muted">Changes need the insurer’s endorsement reference. Each save keeps the earlier version.</p>}
          </Panel>

          {p.cancellation && <Panel><PanelHead title="Cancelled" subtitle={`${p.cancellation.reason ?? ''} · ${day(p.cancellation.date)}`} /></Panel>}
        </div>

        <div className="flex w-full flex-col gap-4 md:w-[400px] md:gap-5">
          {p.renewal && (
            <div className="flex flex-col gap-3 rounded-[20px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-4 shadow-[0px_14px_30px_-12px_rgba(201,138,46,0.2)] md:gap-4 md:rounded-[28px] md:p-6">
              <div className="flex items-center gap-3"><p className="flex-1 text-[17px] font-bold text-ink">Renewal</p><StatusChip tone="amber" icon="alert">{label(p.renewal.status)}</StatusChip></div>
              <div className="flex items-center gap-3.5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[28px] bg-white text-[18px] font-bold text-ink">{dueDays != null ? Math.abs(dueDays) : '—'}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[16px] font-bold text-ink">{dueDays != null && dueDays < 0 ? 'days overdue' : 'days to renewal'}</p>
                  <p className="text-[12px] font-medium text-[#8a5a12]">{p.renewal.remindersPaused ? 'Reminders paused' : `Reminders on${p.renewal.remindersSent ? ` · ${p.renewal.remindersSent} sent` : ''}`}</p>
                </div>
              </div>
              <SmallButton variant="navy" icon="arrow" to={p.renewal.id ? `/renewals?open=${p.renewal.id}` : '/renewals'} className="self-start">Open renewal</SmallButton>
            </div>
          )}
          {p.expectedCommission != null && (
            <section className="flex flex-col gap-3 rounded-[20px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-4 text-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)] md:rounded-[28px] md:p-6">
              <div className="flex items-center gap-2.5"><p className="flex-1 text-[17px] font-bold">Expected commission</p><span className="flex items-center gap-1 rounded-[12px] bg-[rgba(255,255,255,0.12)] px-2.5 py-1 text-[11px] font-semibold"><Icon name="lock" size={12} />Only you</span></div>
              <p className="text-[32px] font-bold tracking-[-0.64px]">{fmtMoney(p.expectedCommission)}</p>
              <p className="text-[12px] leading-[18px] font-medium text-[#c9d6ea]">{p.commissionRate != null ? `${p.commissionRate}% of premium before tax. ` : ''}For your reference only.</p>
            </section>
          )}
        </div>
      </div>
      {dlg === 'nominees' && <EditNomineesDrawer policy={p} onClose={() => setDlg(null)} />}
      {dlg === 'cancel' && <CancelPolicyDialog p={p} onClose={() => setDlg(null)} />}
      {dlg === 'correct' && <CorrectPolicyDialog p={p} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

function CancelPolicyDialog({ p, onClose }) {
  const [f, setF] = useState({ reason: CANCEL_REASONS[0], date: '', refund: '', note: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.policies.cancel(p.id, { version: p.version, reason: f.reason, date: dmy(f.date), refund: f.refund === '' ? null : Number(f.refund), note: f.note || null }),
    { invalidates: ['policy', 'policies', 'renewals'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Record cancellation" icon="x" tone="danger" confirm="Record cancellation" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Reason *" type="select" value={f.reason} onChange={set('reason')} options={CANCEL_REASONS} />
      <div className="flex gap-3">
        <Field label="Cancellation date *" type="date" value={f.date} onChange={set('date')} error={fe.date} />
        <Field label="Refund (₹)" type="number" value={f.refund} onChange={set('refund')} />
      </div>
      <Field label="Note" type="textarea" value={f.note} onChange={set('note')} />
    </ActionDialog>
  )
}

/** PO · Correct a data-entry mistake on the policy (does not change the insurer's record). */
function CorrectPolicyDialog({ p, onClose }) {
  const [f, setF] = useState({
    policyNumber: p.policyNumber ?? '', issueDate: isoDay(p.issueDate), startDate: isoDay(p.startDate), endDate: isoDay(p.endDate),
    frequency: p.frequency ?? 'Yearly', premium: p.premium ?? '', sumInsured: p.sumInsured ?? '', reason: '',
  })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.policies.correct(p.id, {
    version: p.version, policyNumber: f.policyNumber.trim(), issueDate: dmy(f.issueDate), startDate: dmy(f.startDate), endDate: dmy(f.endDate),
    frequency: f.frequency, premium: f.premium === '' ? null : Number(f.premium), sumInsured: f.sumInsured === '' ? null : Number(f.sumInsured), reason: f.reason.trim() || null,
  }), { invalidates: ['policy', 'policies', 'renewals'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Correct details" body="Fix a data-entry mistake. The insurer’s own record does not change." icon="edit" confirm="Save corrections" busy={busy} error={error} disabled={!f.reason.trim()} onConfirm={save} onClose={onClose} width={600}>
      <Field label="Insurer policy number *" value={f.policyNumber} onChange={set('policyNumber')} error={fe.policyNumber} />
      <div className="flex gap-3">
        <Field label="Issue date" type="date" value={f.issueDate} onChange={set('issueDate')} error={fe.issueDate} />
        <Field label="Frequency" type="select" value={f.frequency} onChange={set('frequency')} options={FREQ_OPTS} error={fe.frequency} />
      </div>
      <div className="flex gap-3">
        <Field label="Start date" type="date" value={f.startDate} onChange={set('startDate')} error={fe.startDate} />
        <Field label="End date" type="date" value={f.endDate} onChange={set('endDate')} error={fe.endDate} />
      </div>
      <div className="flex gap-3">
        <Field label="Premium (₹)" type="number" value={f.premium} onChange={set('premium')} error={fe.premium} />
        <Field label="Sum insured (₹)" type="number" value={f.sumInsured} onChange={set('sumInsured')} error={fe.sumInsured} />
      </div>
      <Field label="Reason for correction *" value={f.reason} onChange={set('reason')} error={fe.reason} placeholder="What was wrong and why" />
    </ActionDialog>
  )
}

/* ═════════════ 13 · Renewals ═════════════ */
const R_TABS = [['DUE', 'Due'], ['IN_FOLLOW_UP', 'In follow-up'], ['UPCOMING', 'Upcoming'], ['NOT_RENEWING', 'Not renewing'], ['LAPSED', 'Lapsed'], ['RENEWED', 'Renewed']]
const RANGES = [['30', 'Next 30 days', 30], ['60', 'Next 60 days', 60], ['90', 'Next 90 days', 90], ['365', 'Next 12 months', 365], ['all', 'All dates', Infinity]]
const TONES = ['pink', 'blue', 'violet', 'green', 'amber']
const OFFSETS = [[-60, '60 days before'], [-30, '30 days before'], [-15, '15 days before'], [-7, '7 days before'], [-1, '1 day before'], [1, '1 day after expiry']]
const OFFSET_LABEL = Object.fromEntries(OFFSETS)
const NOT_RENEWING = ['Customer not interested', 'Moved to another advisor', 'Bought elsewhere', 'Cover no longer needed', 'Other']

export function LiveRenewals() {
  const [sp] = useSearchParams()
  const [tab, setTab] = useState('DUE')
  const [range, setRange] = useState('all')
  const [sel, setSel] = useState(sp.get('open'))
  const [dlg, setDlg] = useState(null)
  const [q, clearQ] = useHeaderSearch()
  const list = useQuery('renewals:all', () => api.renewals.list()) // every stage except RENEWED (API default)
  const renewed = useQuery('renewals:RENEWED', () => api.renewals.list({ status: 'RENEWED' }))
  const all = useMemo(() => [...(list.data || []), ...(renewed.data || [])], [list.data, renewed.data])
  const maxDays = RANGES.find((r) => r[0] === range)[2]
  const rows = all.filter((r) => r.status === tab && (r.daysLeft ?? 0) <= maxDays && matchesQuery(q, r.customer?.name, r.policy?.insurer, r.policy?.product))
  const cur = all.find((r) => r.id === sel) ?? rows[0] ?? all[0]
  const lapsedTab = tab === 'LAPSED'
  const { act, busy } = useAct()
  const pause = () => act(() => (cur.remindersPaused ? api.renewals.resume(cur.id, { version: cur.version }) : api.renewals.pause(cur.id, { version: cur.version })), { invalidates: ['renewals'] })
  if (list.error && !list.data) return <ErrorPanel active="renewals" error={list.error} />
  const card = (r, i) => {
    const d = r.daysLeft ?? daysFromToday(r.dueDate)
    return {
      initials: initials(r.customer?.name), tone: TONES[i % TONES.length], name: r.customer?.name ?? '—', insurer: r.policy?.insurer ?? '—',
      plan: [r.policy?.product, r.policy?.type].filter(Boolean).join(' · ') || '—',
      due: d >= 0 ? (r.status === 'DUE' ? `Due in ${d} days` : `${label(r.status)} · ${d} days`) : `${-d} days overdue`,
      urgent: d <= 45, renews: fmtDate(r.dueDate), premium: fmtMoney(r.premium ?? r.policy?.premium),
    }
  }
  // Per-reminder detail (channel + sent date) when the API provides it; otherwise the computed six-step schedule.
  const steps = cur
    ? (Array.isArray(cur.reminders) && cur.reminders.length
      ? cur.reminders.map((rm, i) => {
          const done = !!rm.sentAt || rm.status === 'SENT' || rm.status === 'DELIVERED'
          const when = rm.sentAt ? `Sent ${fmtDate(rm.sentAt, { year: false })}` : (rm.dueAt ?? rm.scheduledAt ?? rm.at) ? fmtDate(rm.dueAt ?? rm.scheduledAt ?? rm.at, { year: false }) : ''
          const ch = Array.isArray(rm.channels) ? rm.channels.map(label).join(' + ') : rm.channel ? label(rm.channel) : ''
          return { title: rm.label ?? rm.title ?? (rm.offset != null ? OFFSET_LABEL[rm.offset] ?? `${rm.offset} days` : `Reminder ${i + 1}`), sub: [when, ch].filter(Boolean).join(' · '), done }
        })
      : OFFSETS.map(([off, t]) => {
          const d = new Date(`${isoDay(cur.dueDate)}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + off)
          return { title: t, sub: fmtDate(d, { year: false }), done: daysFromToday(d) < 0 }
        }))
    : []
  return (
    <AppLayout active="renewals" responsive mobileTitle="Renewals">
      <Header breadcrumb={'AFTER-SALE  /  RENEWALS'} title="Renewals" subtitle="The system moves each renewal by date. You close each one."
        actions={<Dropdown value={range} onChange={setRange} options={RANGES} minWidth={200} className="w-[210px]" buttonClassName="h-[46px] rounded-[24px] border border-line bg-white" />} />
      <SegTabs items={R_TABS.map(([key, l]) => ({ key, label: l, count: all.filter((r) => r.status === key).length }))} value={tab} onChange={setTab} className="mt-3 md:mt-[13px]" />
      {cur && !lapsedTab && cur.status !== 'RENEWED' && (() => { const dl = cur.daysLeft ?? daysFromToday(cur.dueDate) ?? 0; return (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[24px] bg-gradient-to-r from-[#fde8c9] to-[#fbd9b0] px-4 py-4 shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)] md:mt-5 md:h-[120px] md:flex-nowrap md:gap-[22px] md:rounded-[34px] md:px-[30px] md:py-0">
          <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-full bg-white md:size-[80px]">
            <span className="text-[20px] font-bold text-ink md:text-[26px]">{Math.max(0, dl)}</span>
            <span className="text-[11px] font-semibold text-[#8a5a12]">days</span>
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-[16px] font-bold tracking-[-0.1px] text-ink md:text-[22px] md:tracking-[-0.2px]">{cur.customer?.name}{cur.policy?.product ? ` \u00b7 ${[cur.policy.insurer, cur.policy.product].filter(Boolean).join(' ')}` : ''}</p>
            <p className="text-[13px] font-medium text-[#8a5a12]">{cur.dueDate ? `Renews ${fmtDate(cur.dueDate)}` : ''}{cur.graceUntil ? ` \u00b7 grace till ${fmtDate(cur.graceUntil)}` : ''}</p>
          </div>
          <div className="flex flex-col gap-0.5 rounded-[14px] bg-white/80 px-3.5 py-2.5 max-md:basis-full md:rounded-[18px] md:px-[18px] md:py-3">
            <p className="text-[12px] font-semibold text-[#8a5a12]">Premium</p>
            <p className="text-[16px] font-bold whitespace-nowrap text-ink">{fmtMoney(cur.premium ?? cur.policy?.premium)}</p>
          </div>
        </div>
      ) })()}
      <div className="mt-4 flex flex-col gap-4 md:mt-7 md:flex-row md:items-start md:gap-6">
        <div className={cx('w-full md:w-[756px]', lapsedTab ? 'flex flex-col gap-3 md:gap-4' : 'flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-5')}>
          {/* Desktop: original card layout */}
          <div className="hidden md:contents">
          {rows.map((r, i) => lapsedTab ? (
            <button key={r.id} type="button" onClick={() => setSel(r.id)} className={cx('flex w-full items-center gap-3.5 rounded-[26px] bg-white px-[22px] py-[18px] text-left', SH8, cur?.id === r.id && 'ring-2 ring-blue')}>
              <RingAvatar initials={initials(r.customer?.name)} bg="bg-[#eef1f5]" size={44} text={14} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-[14px] font-bold text-ink">{[r.customer?.name, [r.policy?.insurer, r.policy?.product].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}</p>
                <p className="text-[12px] font-medium text-muted">{r.graceUntil ? `Grace ended ${fmtDate(r.graceUntil)}. ` : ''}If the insurer revives it, you can still record the renewal.</p>
              </div>
              <StatusChip tone="rose" icon="x">Lapsed</StatusChip>
            </button>
          ) : (
            <div key={r.id} className="rounded-[32px]">
              <RenewalCard r={card(r, i)} to={`/renewals/${r.id}`} />
            </div>
          ))}
          </div>
          {/* Mobile: compact list cards */}
          <div className="contents md:hidden">
          {rows.map((r, i) => { const c = card(r, i); return (
            <Link key={r.id} to={`/renewals/${r.id}`} className="flex items-center gap-3 rounded-[16px] border border-line bg-white p-3">
              <RingAvatar initials={c.initials} bg={`bg-${c.tone}-100`} size={40} text={13} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-[14px] font-bold text-ink">{c.name}</p>
                <p className="truncate text-[12px] font-medium text-muted">{c.insurer} \u00b7 {c.plan}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink">{c.premium}</span>
                  <span className={cx('text-[11px] font-medium', c.urgent ? 'text-rose' : 'text-muted')}>{c.due}</span>
                </div>
              </div>
              <RowChevron />
            </Link>
          )})}
          </div>
          {rows.length === 0 && (
            <NoMatches className={cx('w-full rounded-[26px] bg-white', SH8)} text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'Nothing here'}
              sub={q.trim() ? `No renewals match “${q.trim()}”.` : `No ${R_TABS.find(([k]) => k === tab)[1].toLowerCase()} renewals.`} onClear={q.trim() ? clearQ : undefined} />
          )}
        </div>
        {cur && (
          <div className="flex w-full flex-col gap-4 md:w-[400px] md:gap-5">
            <Panel className="flex flex-col gap-3.5">
              <PanelHead title="Customer reminders" subtitle={`${cur.customer?.name ?? ''} · only on channels with consent`}
                right={<StatusChip tone={cur.remindersPaused ? 'amber' : 'blue'} icon="clock">{cur.remindersPaused ? 'Paused' : 'Auto'}</StatusChip>} />
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-[14px]', s.done ? 'bg-[#16845b] text-white' : 'bg-panel text-[11px] font-bold text-muted')}>{s.done ? <Icon name="check" size={14} /> : i + 1}</span>
                  <div className="flex flex-col gap-px"><p className={cx('text-[13px] font-bold', s.done ? 'text-ink' : 'text-ink-2')}>{s.title}</p>{s.sub && <p className="text-[11px] font-medium text-muted">{s.sub}</p>}</div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2.5">
                <SmallButton variant="outline" icon="clock" onClick={pause} disabled={busy}>{cur.remindersPaused ? 'Resume reminders' : 'Pause reminders'}</SmallButton>
                <SmallButton variant="navy" icon="phone" onClick={() => setDlg('contact')}>Log contact</SmallButton>
                {['UPCOMING', 'DUE', 'IN_FOLLOW_UP', 'LAPSED'].includes(cur.status) && <SmallButton variant="danger" onClick={() => setDlg('not')}>Not renewing</SmallButton>}
                {cur.status === 'NOT_RENEWING' && <SmallButton variant="outline" icon="refresh" onClick={() => setDlg('reopen')}>Reopen</SmallButton>}
              </div>
            </Panel>
            {cur.lastContact && (
              <Panel className="flex flex-col gap-1">
                <PanelHead title="Last contact" subtitle={fmtDateTime(cur.lastContact.at)} />
                <p className="text-[13px] font-semibold text-ink">{cur.lastContact.outcome}</p>
                {cur.lastContact.note && <p className="text-[12px] font-medium text-muted">{cur.lastContact.note}</p>}
              </Panel>
            )}
            <div className="flex flex-col items-start gap-2.5 rounded-[20px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] p-4 md:rounded-[28px] md:p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
              <p className="text-[16px] font-bold text-ink">How to renew</p>
              <p className="text-[13px] leading-[20px] font-medium text-ink-2">Create the renewal quotation, share it, record payment, submit the proposal, then record the new policy. That closes this renewal and starts the next.</p>
              {cur.renewalQuotationId
                ? <SmallButton variant="navy" icon="quote" to={`/quotations/${cur.renewalQuotationId}`}>Open renewal quotation</SmallButton>
                : <SmallButton variant="navy" icon="quote" onClick={() => setDlg('quote')}>Create renewal quotation</SmallButton>}
              {cur.policy?.id && <SmallButton variant="white" icon="shield" to={`/policies/${cur.policy.id}`}>Open policy</SmallButton>}
            </div>
          </div>
        )}
      </div>
      {dlg === 'contact' && <RenewalContactDialog r={cur} onClose={() => setDlg(null)} />}
      {dlg === 'not' && <NotRenewingDialog r={cur} onClose={() => setDlg(null)} />}
      {dlg === 'reopen' && <RenewalReopenDialog r={cur} onClose={() => setDlg(null)} />}
      {dlg === 'quote' && <RenewalQuoteDialog r={cur} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

function RenewalContactDialog({ r, onClose }) {
  const [outcome, setOutcome] = useState('Spoke to customer')
  const [note, setNote] = useState('')
  const { act, busy, error } = useAct()
  const save = () => act(() => api.renewals.logContact(r.id, { version: r.version, outcome, note: note || null }), { invalidates: ['renewals'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Log contact" body={`${r.customer?.name} · ${r.policy?.product ?? ''}`} icon="phone" confirm="Save contact" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Outcome *" type="select" value={outcome} onChange={setOutcome} options={['Spoke to customer', 'Not reachable', 'Asked to call back']} />
      <Field label="Note" type="textarea" value={note} onChange={setNote} />
    </ActionDialog>
  )
}
function NotRenewingDialog({ r, onClose }) {
  const [reason, setReason] = useState(NOT_RENEWING[0])
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.renewals.notRenewing(r.id, { version: r.version, reason, note: note || null }), { invalidates: ['renewals'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Mark not renewing?" body="Customer reminders stop. You can reopen it later." icon="x" tone="danger" confirm="Not renewing" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Reason *" type="select" value={reason} onChange={setReason} options={NOT_RENEWING} />
      <Field label={reason === 'Other' ? 'Note *' : 'Note'} type="textarea" value={note} onChange={setNote} error={fe.note} />
    </ActionDialog>
  )
}
function RenewalReopenDialog({ r, onClose }) {
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.renewals.reopen(r.id, { version: r.version, note }), { invalidates: ['renewals'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Reopen this renewal?" icon="refresh" confirm="Reopen" busy={busy} error={error} disabled={!note.trim()} onConfirm={save} onClose={onClose}>
      <Field label="Reason *" value={note} onChange={setNote} error={fe.note} />
    </ActionDialog>
  )
}

/* ═════════════ N1 · Renewal detail (full page) ═════════════ */

const STATUS_CHIP = { DUE: ['amber', 'Due'], IN_FOLLOW_UP: ['blue', 'In follow-up'], UPCOMING: ['sky', 'Upcoming'], NOT_RENEWING: ['rose', 'Not renewing'], LAPSED: ['rose', 'Lapsed'], RENEWED: ['green', 'Renewed'] }
const CONTACT_ICON = { phone: { icon: 'phone', bg: 'bg-[#e9e3fc]' }, email: { icon: 'mail', bg: 'bg-[#d9eafd]' }, whatsapp: { icon: 'chat', bg: 'bg-[#d4f1e7]' }, system: { icon: 'mail', bg: 'bg-[#eef1f5]' } }

export function LiveRenewalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const q = useQuery(['renewal', id], () => api.renewals.get(id))
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  if (q.error) return <ErrorPanel active="renewals" error={q.error} back="/renewals" />
  if (!q.data) return <LoadingPanel active="renewals" />
  const r = q.data
  const dl = r.daysLeft ?? daysFromToday(r.dueDate) ?? 0
  const chip = STATUS_CHIP[r.status] ?? ['neutral', label(r.status)]
  const policyLine = [r.policy?.insurer, r.policy?.product].filter(Boolean).join(' ')
  const policyNum = r.policy?.number ?? ''
  const custName = r.customer?.name ?? ''
  const pause = () => act(() => (r.remindersPaused ? api.renewals.resume(r.id, { version: r.version }) : api.renewals.pause(r.id, { version: r.version })), { invalidates: ['renewal', 'renewals'] })

  // Contacts: API may return r.contacts or r.contactLog; fall back to lastContact
  const contacts = Array.isArray(r.contacts) ? r.contacts : Array.isArray(r.contactLog) ? r.contactLog : r.lastContact ? [r.lastContact] : []
  // Reminders
  const reminders = Array.isArray(r.reminders) ? r.reminders : []
  const sentCount = reminders.filter((rm) => rm.sentAt || rm.status === 'SENT' || rm.status === 'DELIVERED').length
  const steps = reminders.length
    ? reminders.map((rm, i) => {
        const done = !!rm.sentAt || rm.status === 'SENT' || rm.status === 'DELIVERED'
        const when = rm.sentAt ? fmtDate(rm.sentAt, { year: false }) : (rm.dueAt ?? rm.scheduledAt) ? fmtDate(rm.dueAt ?? rm.scheduledAt, { year: false }) : ''
        const ch = Array.isArray(rm.channels) ? rm.channels.map(label).join(' + ') : rm.channel ? label(rm.channel) : ''
        return { title: rm.label ?? rm.title ?? `Reminder ${i + 1}`, sub: [when, ch].filter(Boolean).join(' \u00b7 '), done }
      })
    : OFFSETS.map(([off, t]) => {
        const d = new Date(`${isoDay(r.dueDate)}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + off)
        return { title: t, sub: fmtDate(d, { year: false }), done: daysFromToday(d) < 0 }
      })

  return (
    <AppLayout active="renewals" responsive mobileTitle="Renewal">
      {/* Header */}
      <Header back="/renewals" breadcrumb={`RENEWALS  /  ${custName.toUpperCase()}`} title={`Renewal \u00b7 ${custName}`}
        titleExtra={<StatusChip tone={chip[0]} icon={chip[0] === 'amber' ? 'alert' : chip[0] === 'green' ? 'check' : undefined}>{chip[1]}</StatusChip>}
        subtitle={`${policyLine}${policyNum ? ` \u00b7 ${policyNum}` : ''}`}
        actions={<>
          {['DUE', 'IN_FOLLOW_UP', 'UPCOMING', 'LAPSED'].includes(r.status) && <SmallButton variant="danger" icon="x" onClick={() => setDlg('not')}>Not renewing</SmallButton>}
          {r.status === 'NOT_RENEWING' && <SmallButton variant="outline" icon="refresh" onClick={() => setDlg('reopen')}>Reopen</SmallButton>}
          <SmallButton variant="outline" icon="phone" onClick={() => setDlg('contact')}>Log contact</SmallButton>
          {r.renewalQuotationId
            ? <SmallButton variant="navy" icon="quote" to={`/quotations/${r.renewalQuotationId}`}>Open renewal quotation</SmallButton>
            : <SmallButton variant="navy" icon="quote" onClick={() => setDlg('quote')}>Create renewal quotation</SmallButton>}
        </>} />

      {/* Countdown banner */}
      {r.status !== 'RENEWED' && r.status !== 'LAPSED' && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[24px] bg-gradient-to-r from-[#fde8c9] to-[#fbd9b0] px-4 py-4 shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)] md:mt-5 md:h-[144px] md:flex-nowrap md:gap-[22px] md:rounded-[34px] md:px-[30px] md:py-0">
          <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-full bg-white md:size-[92px]">
            <span className="text-[20px] font-bold text-ink md:text-[28px]">{Math.max(0, dl)}</span>
            <span className="text-[11px] font-semibold text-[#8a5a12]">days</span>
          </span>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-[16px] font-bold tracking-[-0.1px] text-ink md:text-[24px] md:tracking-[-0.2px]">{r.dueDate ? `Renews on ${fmtDate(r.dueDate)}` : 'Renewal'}</p>
            <p className="text-[13px] font-medium text-[#8a5a12]">{[r.graceUntil ? `Grace period until ${fmtDate(r.graceUntil)}` : null, r.policy?.premium ? `last premium ${fmtMoney(r.policy.premium)}` : null, r.policy?.sumInsured ? fmtLakh(r.policy.sumInsured) : null].filter(Boolean).join(' \u00b7 ')}</p>
          </div>
          <div className="flex flex-col gap-0.5 rounded-[14px] bg-white/80 px-3.5 py-2.5 max-md:basis-full md:rounded-[18px] md:px-[18px] md:py-3">
            <p className="text-[12px] font-semibold text-[#8a5a12]">Reminders</p>
            <p className="text-[14px] font-bold whitespace-nowrap text-ink md:text-[16px]">{sentCount} of {steps.length} sent</p>
          </div>
        </div>
      )}

      {/* Body: Contacts + How to renew */}
      <div className="mt-5 flex flex-col gap-4 md:mt-9 md:flex-row md:items-start md:gap-5">
        {/* Contacts card */}
        <Panel className="flex w-full flex-col gap-3.5 md:w-[760px]">
          <PanelHead title="Contacts" subtitle="Logging one moves the renewal to In follow-up" />
          {contacts.length === 0 && <p className="text-[13px] font-medium text-muted">No contacts logged yet.</p>}
          {contacts.map((c, i) => {
            const look = CONTACT_ICON[c.channel?.toLowerCase()] ?? CONTACT_ICON[c.type?.toLowerCase()] ?? CONTACT_ICON.phone
            const isSystem = c.source === 'SYSTEM' || c.type === 'REMINDER'
            return (
              <div key={i} className="flex items-start gap-3.5">
                <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full', look.bg)}>
                  <Icon name={look.icon} size={18} className="text-ink" />
                </span>
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-bold text-ink">{c.outcome ?? c.title ?? c.label ?? (isSystem ? `Reminder ${c.channel ? label(c.channel).toLowerCase() : 'sent'}` : 'Contact')}</p>
                  <p className="text-[12px] font-medium text-muted">{c.at ? `${fmtDateTime(c.at)} \u00b7 ` : ''}{isSystem ? 'System' : 'You'}</p>
                  {c.note && <p className="self-start rounded-[12px] bg-panel px-3 py-2 text-[12px] font-medium text-ink-2">{c.note}</p>}
                </div>
              </div>
            )
          })}
          <div className="flex gap-2.5">
            <SmallButton variant="outline" icon="clock" onClick={pause} disabled={busy}>{r.remindersPaused ? 'Resume reminders' : 'Pause reminders'}</SmallButton>
            <SmallButton variant="navy" icon="phone" onClick={() => setDlg('contact')}>Log contact</SmallButton>
          </div>
        </Panel>

        {/* How to renew card */}
        <div className="flex w-full flex-col items-start gap-2.5 rounded-[20px] bg-gradient-to-b from-[#e9e3fc] to-[#dcd2fb] p-4 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] md:w-[400px] md:rounded-[28px] md:p-6">
          <p className="text-[16px] font-bold text-ink">How to renew</p>
          <p className="text-[13px] leading-[20px] font-medium text-ink-2">{"Renewal quotation \u2192 share \u2192 record payment \u2192 proposal \u2192 record the new policy. That closes this renewal."}</p>
          {r.renewalQuotationId
            ? <SmallButton variant="navy" icon="quote" to={`/quotations/${r.renewalQuotationId}`}>Open renewal quotation</SmallButton>
            : <SmallButton variant="navy" icon="quote" onClick={() => setDlg('quote')}>Create renewal quotation</SmallButton>}
          {r.policy?.id && <SmallButton variant="white" icon="shield" to={`/policies/${r.policy.id}`}>Open policy</SmallButton>}
        </div>
      </div>

      {/* Dialogs */}
      {dlg === 'contact' && <RenewalContactDialog r={r} onClose={() => setDlg(null)} />}
      {dlg === 'not' && <NotRenewingDialog r={r} onClose={() => setDlg(null)} />}
      {dlg === 'reopen' && <RenewalReopenDialog r={r} onClose={() => setDlg(null)} />}
      {dlg === 'quote' && <RenewalQuoteDialog r={r} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

/* ═════════════ 14 · Communications ═════════════ */
const C_TABS = [['scheduled', 'Scheduled'], ['sent', 'Sent'], ['failed', 'Not sent'], ['greetings', 'Occasion greetings']]
const C_CHANNELS = [['all', 'All'], ['WHATSAPP', 'WhatsApp'], ['EMAIL', 'Email'], ['SMS', 'SMS']]
const C_CHIP = {
  QUEUED: ['purple', 'Queued'], SENDING: ['purple', 'Sending'], SENT: ['sky', 'Sent'], DELIVERED: ['green', 'Delivered'], READ: ['green', 'Read'],
  FAILED: ['rose', 'Failed'], SKIPPED: ['amber', 'Skipped'], STATUS_UNKNOWN: ['amber', 'Status unknown'], CANCELLED: ['neutral', 'Cancelled'], BOUNCED: ['rose', 'Bounced'],
}
const isGreeting = (m) => String(m.purpose || '').includes('GREETING')

export function LiveCommunications() {
  const [tab, setTab] = useState('failed')
  const [channel, setChannel] = useState('all')
  const [openMsg, setOpenMsg] = useState(null) // CM3
  const [q, clearQ] = useHeaderSearch()
  const scheduled = useQuery(['communications', 'scheduled'], () => api.communications.list({ tab: 'scheduled' }))
  const sent = useQuery(['communications', 'sent'], () => api.communications.list({ tab: 'sent' }))
  const failed = useQuery(['communications', 'failed'], () => api.communications.list({ tab: 'failed' }))
  const lists = { scheduled, sent, failed }
  // P-56 wallet: shown only when VITE_WHATSAPP_WALLET=true
  const wallet = useQuery('wallet', () => (WALLET_ENABLED ? api.wallet.get() : Promise.resolve({ data: null })))
  const greet = useQuery('greetings', () => api.greetings.get())
  // The advisor's own MSG91 / Brevo (Settings → Integrations); assistants cannot manage them.
  const isAdvisor = useAuth().user?.role === 'ADV'
  const ints = useQuery(['integrations', isAdvisor ? 'adv' : 'no'], () => (isAdvisor ? api.integrations.list() : Promise.resolve({ data: null })))
  const { act, busy } = useAct()
  // "Occasion greetings" tab = greeting messages across every outbox list.
  const greetingMsgs = useMemo(() => [...(scheduled.data || []), ...(sent.data || []), ...(failed.data || [])].filter(isGreeting), [scheduled.data, sent.data, failed.data])
  const base = tab === 'greetings' ? greetingMsgs : (lists[tab].data || [])
  const loading = tab === 'greetings' ? (scheduled.loading || sent.loading || failed.loading) : lists[tab].loading
  const rows = base.filter((m) => (channel === 'all' || m.channel === channel) && matchesQuery(q, m.customer, m.purpose, m.to, m.reason, m.text))
  const W = wallet.data || {}
  // Upcoming occasions eligible for a greeting this week (surfaced only when the API provides them).
  const occasions = (greet.data?.upcoming ?? greet.data?.occasions ?? []).map((o) => ({
    name: o.name ?? o.customer ?? o.personName ?? '',
    detail: [o.occasion ?? o.type ?? '', o.blockedReason ?? (o.date ? fmtDate(o.date, { year: false }) : null)].filter(Boolean).join(' · '),
    eligible: o.eligible ?? o.status === 'ELIGIBLE',
  }))
  return (
    <AppLayout active="communications">
      <Header breadcrumb="COMMUNICATIONS" title="Communications" subtitle="Every message sent or tried, with its status."
        actions={isAdvisor && (
          <div className="flex gap-2.5">
            <HeadButton variant="white" icon="link" to="/settings/integrations">Integrations</HeadButton>
            <HeadButton variant="white" icon="list" to="/settings/message-templates">Message templates</HeadButton>
          </div>
        )} />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={C_TABS.map(([key, l]) => ({ key, label: l, count: key === 'greetings' ? undefined : lists[key].data?.length ?? 0 }))} value={tab} onChange={setTab} />
        <SegTabs items={C_CHANNELS.map(([key, l]) => ({ key, label: l }))} value={channel} onChange={setChannel} />
      </div>
      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-3">
          {rows.map((m) => {
            const [tone, chip] = C_CHIP[m.status] ?? ['neutral', label(m.status)]
            const when = m.status === 'QUEUED' ? `Queued ${fmtDateTime(m.createdAt)}` : fmtDateTime(m.sentAt ?? m.statusAt ?? m.createdAt)
            const reasonBad = ['FAILED', 'BOUNCED'].includes(m.status)
            return (
              <div key={m.id} role="button" tabIndex={0} onClick={() => setOpenMsg(m)} onKeyDown={(e) => e.key === 'Enter' && setOpenMsg(m)} className={cx('flex cursor-pointer items-center gap-4 rounded-[24px] bg-white px-[22px] py-[18px] hover:bg-tile', SH8)}>
                <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-[24px]', m.channel === 'EMAIL' ? 'bg-[#e9e3fc]' : 'bg-[#d4f1e7]')}>
                  <Icon name={m.channel === 'EMAIL' ? 'mail' : 'chat'} size={22} className="text-ink" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="truncate text-[14px] font-bold text-ink">{m.customer ?? m.to} · {label(m.purpose)}</p>
                  <p className="text-[12px] font-medium text-muted">{when} · {m.to}</p>
                  {m.reason && <p className={cx('flex items-center gap-1.5 text-[12px] font-semibold', reasonBad ? 'text-[#b4323c]' : 'text-[#8a5a12]')}><Icon name="alert" size={13} />{m.reason}</p>}
                </div>
                <StatusChip tone={tone}>{chip}</StatusChip>
                {['FAILED', 'STATUS_UNKNOWN'].includes(m.status) && ['QUOTATION_EMAIL', 'RENEWAL_REMINDER'].includes(m.purpose) && (
                  <SmallButton variant="outline" icon="refresh" disabled={busy} onClick={(e) => e.stopPropagation() || act(() => api.communications.resend(m.id, {}), { invalidates: ['communications'] })}>Resend</SmallButton>
                )}
                {m.status === 'QUEUED' && <SmallButton variant="danger" className="px-3.5" disabled={busy} onClick={(e) => e.stopPropagation() || act(() => api.communications.cancel(m.id, {}), { invalidates: ['communications'] })}>Cancel</SmallButton>}
              </div>
            )
          })}
          {rows.length === 0 && (
            <NoMatches className={cx('rounded-[24px] bg-white', SH8)} text={loading ? 'Loading…' : q.trim() ? 'No matches' : 'Nothing here'}
              sub={q.trim() ? `No messages match “${q.trim()}”.` : tab === 'greetings' ? 'No occasion greetings yet.' : 'No messages in this list.'} onClear={q.trim() || channel !== 'all' ? () => { clearQ(); setChannel('all') } : undefined} />
          )}
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          {isAdvisor && ints.data && <ConnectionsCard data={ints.data} />}
          <div className={cx('flex flex-col gap-3.5 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6', SH8)}>
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[17px] font-bold text-white">Occasion greetings</p>
              <span className="rounded-[12px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-navy">Premium</span>
            </div>
            <p className="text-[13px] leading-[20px] font-medium text-[#c9d6ea]">Birthdays and anniversaries go out automatically on WhatsApp, only to people with consent. Choose the template for each occasion in Message templates.</p>
            {WALLET_ENABLED && <div className="flex items-center gap-3 rounded-[20px] bg-[rgba(255,255,255,0.08)] p-4">
              <span className="flex size-11 items-center justify-center rounded-[22px] bg-[rgba(255,255,255,0.12)]"><Icon name="wallet" size={20} className="text-white" /></span>
              <div className="flex flex-1 flex-col gap-0.5"><p className="text-[12px] font-medium text-[#c9d6ea]">Wallet balance</p><p className="text-[20px] font-bold text-white">{fmtMoney(W.balance ?? (W.balancePaise != null ? W.balancePaise / 100 : null), { decimals: 2 })}</p></div>
              {W.pricePerMessage != null && <p className="text-[12px] font-semibold text-[#f7b9c4]">{fmtMoney(W.pricePerMessage)} / message</p>}
            </div>}
            <SmallButton variant="pink" icon="sparkle" className="self-start" to="/settings/message-templates">Set up greetings</SmallButton>
          </div>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="This week" subtitle="Eligible to receive a greeting" />
            {occasions.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <RingAvatar initials={initials(o.name)} bg={avatarClass(o.name)} size={38} text={12} />
                <div className="flex min-w-0 flex-1 flex-col"><p className="text-[13px] font-bold text-ink">{o.name}</p><p className="text-[12px] font-medium text-muted">{o.detail}</p></div>
                <StatusChip tone={o.eligible ? 'green' : 'amber'}>{o.eligible ? 'Eligible' : 'Blocked'}</StatusChip>
              </div>
            ))}
            {!occasions.length && <p className="text-[13px] font-medium text-muted">No occasions this week.</p>}
          </Panel>
          <ErrorNote error={WALLET_ENABLED && wallet.error && wallet.error.status !== 403 ? wallet.error : null} />
        </div>
      </div>
      {openMsg && <MessageDrawer m={openMsg} onClose={() => setOpenMsg(null)} />}
    </AppLayout>
  )
}
/** Your own MSG91 (WhatsApp) and Brevo (email): connected or not, with a way to connect (Settings → Integrations). */
function ConnectionsCard({ data }) {
  const rows = [
    { key: 'msg91', name: 'WhatsApp', via: 'MSG91', icon: 'chat', c: data.MSG91, what: (c) => `Number ${c.config?.waNumber ?? ''}` },
    { key: 'brevo', name: 'Email', via: 'Brevo', icon: 'mail', c: data.BREVO, what: (c) => c.config?.fromEmail ?? '' },
  ]
  const all = rows.every((r) => r.c?.status === 'ACTIVE')
  return (
    <Panel className="flex flex-col gap-3">
      <PanelHead title="Your messaging accounts" subtitle={all ? 'Messages go through your own accounts.' : 'Connect your MSG91 and Brevo to send from your own number and email.'} />
      {rows.map((r) => {
        const on = r.c?.status === 'ACTIVE'
        return (
          <div key={r.key} className="flex items-center gap-3">
            <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full', on ? 'bg-[#d4f1e7] text-[#127650]' : 'bg-panel text-muted')}><Icon name={r.icon} size={18} /></span>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-[13px] font-bold text-ink">{r.name} · {r.via}</p>
              <p className="truncate text-[12px] font-medium text-muted">{on ? r.what(r.c) : r.c ? 'Needs attention: check the details' : 'Not connected'}</p>
            </div>
            <SmallButton variant={on ? 'outline' : 'navy'} icon={on ? 'settings' : 'link'} to={`/settings/integrations?tab=${r.key}`}>{on ? 'Manage' : 'Connect'}</SmallButton>
          </div>
        )
      })}
    </Panel>
  )
}

/* CM3 · Message detail: what happened to one message, step by step (outbox history). */
const STEPS = [['QUEUED', 'Queued'], ['SENT', 'Sent'], ['DELIVERED', 'Delivered'], ['READ', 'Read']]
const STOPS = { FAILED: 'Failed', STATUS_UNKNOWN: 'Status unknown', SKIPPED: 'Not sent', CANCELLED: 'Cancelled' }
function MessageDrawer({ m, onClose }) {
  const hist = m.history ?? []
  const at = (s) => hist.find((h) => h.status === s)
  const stop = hist.find((h) => STOPS[h.status]) ?? (STOPS[m.status] ? { status: m.status, at: m.statusAt, note: m.reason } : null)
  const reached = STEPS.filter(([s]) => at(s) || (s === 'QUEUED' && m.createdAt) || (s === 'SENT' && m.sentAt))
  const time = (v, first) => (v ? (first ? fmtDateTime(v) : new Date(v).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', second: '2-digit' })) : '')
  const rows = [
    ...STEPS.map(([s, l], i) => {
      const h = at(s) ?? (s === 'QUEUED' ? { at: m.createdAt } : s === 'SENT' && m.sentAt ? { at: m.sentAt } : null)
      const notTracked = s === 'READ' && m.channel === 'EMAIL'
      return { key: s, title: l, done: !!h, sub: h ? [time(h.at, i === 0), h.note, s === 'SENT' ? 'accepted by provider' : null].filter(Boolean).join(' · ') : notTracked ? 'Not tracked for email' : stop ? '—' : 'Waiting' }
    }).filter((r) => !stop || r.done || r.key === 'QUEUED'),
    ...(stop ? [{ key: 'stop', title: STOPS[stop.status], done: false, bad: true, sub: [time(stop.at, !reached.length), stop.note ?? m.reason].filter(Boolean).join(' · ') }] : []),
  ]
  return (
    <Drawer title="Message detail" subtitle={[m.customer ?? m.to, m.channel === 'WHATSAPP' ? 'WhatsApp' : label(m.channel), label(m.purpose)].filter(Boolean).join(' · ')} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.key} className="flex items-start gap-3">
            <span className={cx('mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full', r.done ? 'bg-[#127650] text-white' : r.bad ? 'bg-[#b4323c] text-white' : 'bg-panel text-muted')}>
              {r.done ? <Icon name="check" size={13} /> : r.bad ? <Icon name="x" size={13} /> : <span className="text-[11px]">–</span>}
            </span>
            <div className="flex flex-col"><p className="text-[14px] font-bold text-ink">{r.title}</p><p className="text-[12px] font-medium text-muted">{r.sub}</p></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 rounded-[20px] bg-panel p-4">
        <p className="text-[12px] font-medium text-muted">To {m.to}</p>
        {m.subject && <p className="text-[13px] font-bold text-ink">Subject: {m.subject}</p>}
        <p className="text-[13px] leading-5 font-medium whitespace-pre-line text-ink-2">{m.text || 'The message text is filled in when it is sent.'}</p>
      </div>
      {m.resendOf && <p className="text-[12px] font-medium text-muted">This is a resend of an earlier message.</p>}
    </Drawer>
  )
}