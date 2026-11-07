// 11 Policies · 12 Policy detail · 13 Renewals · 14 Communications — all on the live API.
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
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

const day = (v) => (v ? fmtDate(isoDay(v)) : '—')

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
    ...p, initials: initials(p.customer), bg: avatarClass(p.customer), number: p.policyNumber || 'Pending', ref: p.insurer ?? '—',
    product: p.productName ?? '—', ends: day(p.endDate), premiumText: fmtMoney(p.premium),
  })).filter((p) => matchesQuery(q, p.number, p.ref, p.customer, p.product, p.ends, p.premiumText))
  const issued = all.filter((p) => p.status === 'ISSUED')
  const renewing = issued.filter((p) => p.endDate && daysFromToday(isoDay(p.endDate)) >= 0 && daysFromToday(isoDay(p.endDate)) <= 60).sort((a, b) => isoDay(a.endDate).localeCompare(isoDay(b.endDate)))
  const awaiting = all.filter((p) => p.status === 'AWAITING_ISSUANCE')
  const expired = all.filter((p) => p.status === 'EXPIRED' || p.renewal?.status === 'LAPSED')
  const stats = [
    { key: 'awaiting', bg: 'bg-violet-100', icon: 'clock', label: 'Awaiting issuance', value: awaiting.length, note: awaiting[0] ? `${awaiting[0].customer} · since ${fmtDate(awaiting[0].createdAt, { year: false })}` : 'Nothing waiting' },
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
    <AppLayout active="policies">
      <Header breadcrumb={'AFTER-SALE  /  POLICIES'} title="Policies" subtitle="Issued policies start a renewal cycle automatically."
        actions={<HeadButton icon="plus" onClick={() => setPick(true)}>Existing policy</HeadButton>} />
      <div className="mt-[13px] flex gap-5">{stats.map((s) => <StatTile key={s.key} {...s} />)}</div>
      <SegTabs items={P_TABS.map(([key, l]) => ({ key, label: l, count: all.filter((p) => p.status === key).length }))} value={tab} onChange={setTab} className="mt-5" />
      <DataTable className="mt-7 w-[1180px]" columns={columns} rows={list.loading && !list.data ? [] : rows} rowTo={(r) => `/policies/${r.id}`}
        empty={list.loading ? 'Loading…' : q.trim() ? `No ${tabLabel} policies match “${q.trim()}”.` : `No ${tabLabel} policies yet.`} onClear={q.trim() ? clearQ : undefined} />
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
  const kv = [
    ['Policy number', p.policyNumber || 'Pending'], ['Insurer', p.insurer ?? '—'], ['Product', [p.productName, p.frozen?.variantName].filter(Boolean).join(' · ') || '—'],
    ['Sum insured', fmtMoney(p.sumInsured)], ['Premium', fmtMoney(p.premium)], ['Frequency', p.frequency ?? '—'],
    ['Issued', day(p.issueDate)], ['Starts', day(p.startDate)], ['Ends', day(p.endDate)],
    ['Next premium due', day(p.nextDueDate)], ['Source', p.source === 'EXISTING' ? 'Recorded existing policy' : 'Sold through Bimayantra'],
    ...(p.expectedCommission != null ? [['Expected commission', fmtMoney(p.expectedCommission)]] : []),
  ]
  return (
    <AppLayout active="policies">
      <Header breadcrumb={`AFTER-SALE  /  POLICIES  /  ${(p.policyNumber || 'PENDING').toUpperCase()}`} title={p.policyNumber || 'Awaiting issuance'}
        titleExtra={P_CHIP[p.status]} subtitle={`${p.customer?.name ?? ''} · ${p.productName ?? ''}`}
        actions={awaiting
          ? <HeadButton icon="check" to={`/policies/${p.id}/issue`}>Record issued policy</HeadButton>
          : p.status === 'ISSUED' ? <HeadButton variant="white" icon="x" onClick={() => setDlg('cancel')}>Record cancellation</HeadButton> : null} />
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Policy" subtitle="As issued by the insurer" />
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
              {kv.map(([k, v]) => <div key={k} className="flex flex-col gap-1"><p className="text-[12px] font-medium text-muted">{k}</p><p className="text-[14px] font-semibold text-ink">{v}</p></div>)}
            </div>
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Insured people" subtitle={`${(p.insured || []).length} covered`} />
            {(p.insured || []).length === 0 && <p className="text-[13px] font-medium text-muted">Not recorded.</p>}
            {(p.insured || []).map((m, i) => (
              <div key={m.key ?? i} className="flex items-center gap-3">
                <RingAvatar initials={initials(m.name)} bg={avatarClass(m.name)} size={36} text={11} />
                <div className="flex flex-col"><p className="text-[13px] font-bold text-ink">{m.name}</p><p className="text-[12px] font-medium text-muted">{m.relationship ?? ''}{m.dob ? ` · born ${day(m.dob)}` : ''}</p></div>
              </div>
            ))}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Policy holder" />
            {p.customer && (
              <Link to={`/customers/${p.customer.id}`} className="flex items-center gap-3 rounded-[16px] bg-panel p-3 hover:bg-panel-2">
                <RingAvatar initials={initials(p.customer.name)} bg={avatarClass(p.customer.name)} size={40} />
                <div className="flex flex-1 flex-col"><p className="text-[14px] font-bold text-ink">{p.customer.name}</p><p className="text-[12px] font-medium text-muted">{p.customer.number}</p></div>
                <Icon name="chev-right" size={16} className="text-muted" />
              </Link>
            )}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Nominees" subtitle={p.nomineeVersions?.length ? `Version ${p.nomineeVersions[0].number}` : 'None recorded'}
              right={['AWAITING_ISSUANCE', 'ISSUED'].includes(p.status) && <SmallButton variant="outline" icon="users" onClick={() => setDlg('nominees')}>Edit nominees</SmallButton>} />
            {(p.nominees || []).map((n, i) => (
              <div key={i} className="flex items-center justify-between text-[13px] font-semibold text-ink"><span>{n.name} · {n.relationship}</span><span className="text-muted">{n.share}%</span></div>
            ))}
          </Panel>
          {p.renewal && (
            <Panel className="flex flex-col gap-2">
              <PanelHead title="Renewal" subtitle={`Due ${day(p.renewal.dueDate)}`} right={<StatusChip tone="amber">{label(p.renewal.status)}</StatusChip>} />
              <SmallButton variant="navy" icon="refresh" to="/renewals" className="self-start">Open renewals</SmallButton>
            </Panel>
          )}
          {p.cancellation && <Panel><PanelHead title="Cancelled" subtitle={`${p.cancellation.reason ?? ''} · ${day(p.cancellation.date)}`} /></Panel>}
        </div>
      </div>
      {dlg === 'nominees' && <EditNomineesDrawer policy={p} onClose={() => setDlg(null)} />}
      {dlg === 'cancel' && <CancelPolicyDialog p={p} onClose={() => setDlg(null)} />}
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

/* ═════════════ 13 · Renewals ═════════════ */
const R_TABS = [['DUE', 'Due'], ['IN_FOLLOW_UP', 'In follow-up'], ['UPCOMING', 'Upcoming'], ['NOT_RENEWING', 'Not renewing'], ['LAPSED', 'Lapsed'], ['RENEWED', 'Renewed']]
const RANGES = [['30', 'Next 30 days', 30], ['60', 'Next 60 days', 60], ['90', 'Next 90 days', 90], ['365', 'Next 12 months', 365], ['all', 'All dates', Infinity]]
const TONES = ['pink', 'blue', 'violet', 'green', 'amber']
const OFFSETS = [[-60, '60 days before'], [-30, '30 days before'], [-15, '15 days before'], [-7, '7 days before'], [-1, '1 day before'], [1, '1 day after expiry']]
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
  const { act, busy } = useAct()
  const pause = () => act(() => (cur.remindersPaused ? api.renewals.resume(cur.id, { version: cur.version }) : api.renewals.pause(cur.id, { version: cur.version })), { invalidates: ['renewals'] })
  if (list.error && !list.data) return <ErrorPanel active="renewals" error={list.error} />
  const card = (r, i) => {
    const d = r.daysLeft ?? daysFromToday(r.dueDate)
    return {
      initials: initials(r.customer?.name), tone: TONES[i % TONES.length], name: r.customer?.name ?? '—', insurer: r.policy?.insurer ?? '—',
      plan: r.policy?.product ?? '—', due: d >= 0 ? `${label(r.status)} · ${d} days` : `${-d} days overdue`, urgent: d <= 45, renews: fmtDate(r.dueDate), premium: fmtMoney(r.premium ?? r.policy?.premium),
    }
  }
  const steps = cur ? OFFSETS.map(([off, t]) => {
    const d = new Date(`${isoDay(cur.dueDate)}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + off)
    return { title: t, sub: fmtDate(d, { year: false }), done: daysFromToday(d) < 0 }
  }) : []
  return (
    <AppLayout active="renewals">
      <Header breadcrumb={'AFTER-SALE  /  RENEWALS'} title="Renewals" subtitle="The system moves each renewal by date. You close each one."
        actions={<select value={range} onChange={(e) => setRange(e.target.value)} className="h-[46px] rounded-[24px] border border-line bg-white px-4 text-[14px] font-semibold text-ink">{RANGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>} />
      <SegTabs items={R_TABS.map(([key, l]) => ({ key, label: l, count: all.filter((r) => r.status === key).length }))} value={tab} onChange={setTab} className="mt-[13px]" />
      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-wrap gap-5">
          {rows.map((r, i) => (
            <div key={r.id} onClickCapture={(e) => { e.preventDefault(); setSel(r.id) }} className={cx('rounded-[32px]', cur?.id === r.id && 'ring-2 ring-blue')}>
              <RenewalCard r={card(r, i)} to="#" />
            </div>
          ))}
          {rows.length === 0 && (
            <NoMatches className={cx('w-full rounded-[26px] bg-white', SH8)} text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'Nothing here'}
              sub={q.trim() ? `No renewals match “${q.trim()}”.` : `No ${R_TABS.find(([k]) => k === tab)[1].toLowerCase()} renewals.`} onClear={q.trim() ? clearQ : undefined} />
          )}
        </div>
        {cur && (
          <div className="flex w-[400px] flex-col gap-5">
            <Panel className="flex flex-col gap-3.5">
              <PanelHead title="Customer reminders" subtitle={`${cur.customer?.name ?? ''} · only on channels with consent`}
                right={<StatusChip tone={cur.remindersPaused ? 'amber' : 'blue'} icon="clock">{cur.remindersPaused ? 'Paused' : 'Auto'}</StatusChip>} />
              <p className="text-[12px] font-medium text-muted">{cur.remindersSent} reminder{cur.remindersSent === 1 ? '' : 's'} sent or queued · renews {fmtDate(cur.dueDate)}</p>
              {steps.map((s, i) => (
                <div key={s.title} className="flex items-center gap-3">
                  <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-[14px]', s.done ? 'bg-[#16845b] text-white' : 'bg-panel text-[11px] font-bold text-muted')}>{s.done ? <Icon name="check" size={14} /> : i + 1}</span>
                  <div className="flex flex-col gap-px"><p className="text-[13px] font-bold text-ink">{s.title}</p><p className="text-[11px] font-medium text-muted">{s.sub}</p></div>
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
            <div className="flex flex-col items-start gap-2.5 rounded-[28px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
              <p className="text-[16px] font-bold text-ink">How to renew</p>
              <p className="text-[13px] leading-[20px] font-medium text-ink-2">Create the renewal quotation, share it, record payment, submit the proposal, then record the new policy.</p>
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

/* ═════════════ 14 · Communications ═════════════ */
const C_TABS = [['scheduled', 'Scheduled'], ['sent', 'Sent'], ['failed', 'Not sent']]
const C_CHANNELS = [['all', 'All channels'], ['WHATSAPP', 'WhatsApp'], ['EMAIL', 'Email'], ['SMS', 'SMS']]
const C_CHIP = {
  QUEUED: ['purple', 'Queued'], SENDING: ['purple', 'Sending'], SENT: ['sky', 'Sent'], DELIVERED: ['green', 'Delivered'], READ: ['green', 'Read'],
  FAILED: ['rose', 'Failed'], SKIPPED: ['amber', 'Skipped'], STATUS_UNKNOWN: ['amber', 'Status unknown'], CANCELLED: ['neutral', 'Cancelled'], BOUNCED: ['rose', 'Bounced'],
}

export function LiveCommunications() {
  const [tab, setTab] = useState('failed')
  const [channel, setChannel] = useState('all')
  const [openMsg, setOpenMsg] = useState(null) // CM3
  const [q, clearQ] = useHeaderSearch()
  const scheduled = useQuery(['communications', 'scheduled'], () => api.communications.list({ tab: 'scheduled' }))
  const sent = useQuery(['communications', 'sent'], () => api.communications.list({ tab: 'sent' }))
  const failed = useQuery(['communications', 'failed'], () => api.communications.list({ tab: 'failed' }))
  const lists = { scheduled, sent, failed }
  const wallet = useQuery('wallet', () => api.wallet.get())
  const greet = useQuery('greetings', () => api.greetings.get())
  const { act, busy } = useAct()
  const cur = lists[tab]
  const rows = (cur.data || []).filter((m) => (channel === 'all' || m.channel === channel) && matchesQuery(q, m.customer, m.purpose, m.to, m.reason, m.text))
  const W = wallet.data || {}
  return (
    <AppLayout active="communications">
      <Header breadcrumb="COMMUNICATIONS" title="Communications" subtitle="Every message sent or tried, with its status."  />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={C_TABS.map(([key, l]) => ({ key, label: l, count: lists[key].data?.length ?? 0 }))} value={tab} onChange={setTab} />
        <SegTabs items={C_CHANNELS.map(([key, l]) => ({ key, label: l }))} value={channel} onChange={setChannel} />
      </div>
      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-3">
          {rows.map((m) => {
            const [tone, chip] = C_CHIP[m.status] ?? ['neutral', label(m.status)]
            const when = m.status === 'QUEUED' ? `Queued ${fmtDateTime(m.createdAt)}` : fmtDateTime(m.sentAt ?? m.statusAt ?? m.createdAt)
            return (
              <div key={m.id} role="button" tabIndex={0} onClick={() => setOpenMsg(m)} onKeyDown={(e) => e.key === 'Enter' && setOpenMsg(m)} className={cx('flex cursor-pointer items-center gap-4 rounded-[24px] bg-white px-[22px] py-[18px] hover:bg-tile', SH8)}>
                <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-[24px]', m.channel === 'EMAIL' ? 'bg-[#e9e3fc]' : 'bg-[#d4f1e7]')}>
                  <Icon name={m.channel === 'EMAIL' ? 'mail' : 'chat'} size={22} className="text-ink" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="truncate text-[14px] font-bold text-ink">{m.customer ?? m.to} · {label(m.purpose)}</p>
                  <p className="text-[12px] font-medium text-muted">{when} · {m.to}</p>
                  {m.reason && <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8a5a12]"><Icon name="alert" size={13} />{m.reason}</p>}
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
            <NoMatches className={cx('rounded-[24px] bg-white', SH8)} text={cur.loading ? 'Loading…' : q.trim() ? 'No matches' : 'Nothing here'}
              sub={q.trim() ? `No messages match “${q.trim()}”.` : 'No messages in this list.'} onClear={q.trim() || channel !== 'all' ? () => { clearQ(); setChannel('all') } : undefined} />
          )}
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <div className={cx('flex flex-col gap-3.5 rounded-[28px] bg-rail p-6', SH8)}>
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[17px] font-bold text-white">Occasion greetings</p>
              <span className="rounded-[12px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-navy">{greet.data?.on ? 'On' : 'Off'}</span>
            </div>
            <p className="text-[13px] leading-[20px] font-medium text-[#c9d6ea]">Birthdays and anniversaries go out automatically from your dedicated WhatsApp number, only to people with consent.</p>
            <div className="flex items-center gap-3 rounded-[20px] bg-white/10 p-4">
              <span className="flex size-11 items-center justify-center rounded-[22px] bg-white/10"><Icon name="wallet" size={20} className="text-[#f7b9c4]" /></span>
              <div className="flex flex-1 flex-col gap-0.5"><p className="text-[12px] font-medium text-[#c9d6ea]">Wallet balance</p><p className="text-[20px] font-bold text-white">{fmtMoney(W.balance ?? (W.balancePaise != null ? W.balancePaise / 100 : null), { decimals: 2 })}</p></div>
            </div>
            <SmallButton variant="pink" icon="wallet" className="self-start" to="/settings/wallet">Wallet and greetings</SmallButton>
          </div>
          <ErrorNote error={wallet.error && wallet.error.status !== 403 ? wallet.error : null} />
        </div>
      </div>
      {openMsg && <MessageDrawer m={openMsg} onClose={() => setOpenMsg(null)} />}
    </AppLayout>
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