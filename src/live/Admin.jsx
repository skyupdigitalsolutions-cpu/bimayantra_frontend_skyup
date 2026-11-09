// SkyUp Admin (22–24, AA1–AA13, AD1, ADa–ADc) on the live API. Roles ADM / STF; step-up OTP is asked by the API client.
// No admin approval (client decision Q92 / Q110): publishing and configuration changes apply at once, with an OTP and a
// reason in the audit log. The Approvals page only clears items that were waiting before the switch.
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { AdminLayout, AdminHeader, ACard, ACardHead, Pill, SButton, SegTabs } from '../screens/admin/_parts'
import { api, useQuery, useDebounced } from '../api'
import { fmtDate, fmtDateTime, fmtMoney, cleanMobile, mobileError, isEmail } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { ActionDialog, Field, ErrorNote, useAct, label, dmy, check } from './kit'
import { WALLET_ENABLED } from '../config/features'

const Line = ({ children, className = '' }) => <div className={cx('flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0', className)}>{children}</div>
const Empty = ({ q, text = 'Nothing here.' }) => (q?.error ? <ErrorNote error={q.error} /> : q?.loading && !q?.data ? <p className="text-[13px] font-medium text-muted">Loading…</p> : <p className="text-[13px] font-medium text-muted">{text}</p>)
const SUB_TONE = { TRIAL: 'blue', ACTIVE: 'green', GRACE: 'amber', READ_ONLY: 'red', EXPIRED: 'red', SUSPENDED: 'red', CLOSED: 'gray' }
const KYC_TONE = { NOT_SUBMITTED: 'gray', PENDING_REVIEW: 'amber', VERIFIED: 'green', REJECTED: 'red' }

/* ═════════════ 22 · Home ═════════════ */
export function AdminHome() {
  const q = useQuery('admin:dashboard', () => api.admin.dashboard())
  const d = q.data
  const k = d?.kpis
  const tiles = k ? [
    ['Advisors', k.advisors.total, `${k.advisors.active} paying · ${k.advisors.trial} on trial`, '/admin/accounts'],
    ['KYC to review', k.kycToReview.count, `oldest ${k.kycToReview.oldestWorkingDays} working days · target ${k.kycToReview.targetWorkingDays}`, '/admin/kyc'],
    ['Trials ending in 7 days', k.trialsEndingIn7Days, `${k.graceOrReadOnly.grace} in grace · ${k.graceOrReadOnly.readOnly} read-only`, '/admin/accounts'],
    ['Verified products', k.verifiedProducts.total, `${k.verifiedProducts.publishedThisWeek} published this week`, '/admin/catalogue'],
    ['Corrections waiting', k.correctionsWaiting, 'Suggested by advisors', '/admin/corrections'],
    ['Agent-code flags', k.openAgentCodeFlags, 'Same code on two accounts', '/admin/flags'],
    ...(WALLET_ENABLED && k.wallets ? [['Wallet balance (all)', fmtMoney(k.wallets.totalBalance), `${k.wallets.belowThreshold} below ${fmtMoney(k.wallets.threshold)}`, '/admin/accounts']] : []),
  ] : []
  return (
    <AdminLayout active="home">
      <AdminHeader title="SkyUp Admin" subtitle="Accounts, KYC, catalogue and configuration across all advisors." />
      {q.error && <ErrorNote error={q.error} />}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {tiles.map(([t, v, s, to]) => (
          <Link key={t} to={to} className="flex flex-col gap-1.5 rounded-[24px] bg-white p-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] hover:ring-1 hover:ring-blue/30">
            <p className="text-[12px] font-semibold text-muted">{t}</p><p className="text-[28px] font-bold text-ink">{v}</p><p className="text-[11px] font-medium text-muted">{s}</p>
          </Link>
        ))}
      </div>
      {d && (
        <div className="mt-6 flex gap-5">
          <ACard className="flex-1"><ACardHead title="Needs attention" />
            <div className="mt-3 flex flex-col gap-3">
              {d.needsAttention.map((n, i) => <Line key={i}><Pill tone="amber">{label(n.type)}</Pill><Link to={n.accountId ? `/admin/accounts/${n.accountId}` : '/admin'} className="flex-1 font-semibold text-ink hover:underline">{n.label}</Link><span className="text-muted">{fmtDate(n.since, { year: false })}</span></Line>)}
              {!d.needsAttention.length && <Empty text="Nothing needs attention." />}
            </div>
          </ACard>
          <ACard className="w-[380px]"><ACardHead title="Plan mix" />
            <div className="mt-3 flex flex-col gap-2">{Object.entries(d.planMix).map(([p, n]) => <Line key={p}><span className="flex-1 font-semibold text-ink">{label(p)}</span><span className="font-bold text-ink">{n}</span></Line>)}</div>
          </ACard>
        </div>
      )}
      {d?.recentActivity?.length > 0 && (
        <ACard className="mt-5"><ACardHead title="Recent activity" />
          <div className="mt-3 flex flex-col gap-2">{d.recentActivity.map((a, i) => <Line key={i}><span className="w-[150px] text-muted">{fmtDateTime(a.at)}</span><span className="flex-1 font-semibold text-ink">{a.text ?? label(a.action)}</span><span className="text-muted">{a.by ?? ''}</span></Line>)}</div>
        </ACard>
      )}
    </AdminLayout>
  )
}

/* ═════════════ AA1 · Advisor accounts ═════════════ */
const ACC_TABS = ['ALL', 'TRIAL', 'ACTIVE', 'GRACE', 'READ_ONLY', 'SUSPENDED', 'CLOSED']
export function AdminAccounts() {
  const [tab, setTab] = useState('ALL')
  const [q, setQ] = useState('')
  const dq = useDebounced(q.trim(), 300) // one request per pause in typing
  const list = useQuery(['admin:accounts', tab, dq], () => api.admin.accounts({ view: 'tabs', tab: tab === 'ALL' ? undefined : tab, q: dq || undefined }))
  const d = list.data
  return (
    <AdminLayout active="accounts">
      <AdminHeader title="Advisor accounts" subtitle={WALLET_ENABLED ? 'Every advisor account, its plan, KYC and wallet.' : 'Every advisor account, its plan and KYC.'} />
      <div className="mt-5 flex items-center gap-3">
        <SegTabs items={ACC_TABS.map((t) => ({ key: t, label: label(t), count: d?.tabs?.[t] ?? 0 }))} value={tab} onChange={setTab} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search advisor or mobile" className="h-[42px] w-[280px] rounded-[21px] bg-white px-4 text-[13px] font-semibold outline-none" />
      </div>
      <ACard className="mt-5">
        <div className="flex flex-col gap-3">
          {(d?.rows || []).map((r) => (
            <Line key={r.id}>
              <Link to={`/admin/accounts/${r.id}`} className="flex w-[260px] flex-col hover:underline"><span className="font-bold text-ink">{r.advisor}</span><span className="text-[12px] text-muted">{r.business ?? r.mobile}</span></Link>
              <Pill tone={SUB_TONE[r.subscription] ?? 'gray'}>{label(r.subscription)}{r.plan ? ` · ${label(r.plan)}` : ''}</Pill>
              <span className="w-[120px] text-muted">until {fmtDate(r.subscriptionEndsAt, { year: false })}</span>
              <Pill tone={KYC_TONE[r.kycStatus]}>KYC {label(r.kycStatus)}</Pill>
              {WALLET_ENABLED && <span className="w-[110px] text-muted">{fmtMoney(r.walletBalance)}</span>}
              <span className="flex-1 text-muted">{r.counts.leads} leads · {r.counts.customers} customers · {r.counts.policies} policies</span>
              <span className="text-muted">{r.lastLogin ? fmtDate(r.lastLogin, { year: false }) : '—'}</span>
            </Line>
          ))}
          {d && !d.rows.length && <Empty text="No accounts here." />}{!d && <Empty q={list} />}
        </div>
      </ACard>
    </AdminLayout>
  )
}

/* ═════════════ AA2 · Account detail (+ AA3 suspend, AA4 record payment) ═════════════ */
export function AdminAccountDetail() {
  const { id } = useParams()
  const q = useQuery(['admin:account', id], () => api.admin.account(id))
  const sub = useQuery(['admin:account', id, 'sub'], () => api.admin.accountSubscription(id))
  const kyc = useQuery(['admin:account', id, 'kyc'], () => api.admin.accountKyc(id))
  const act = useQuery(['admin:account', id, 'activity'], () => api.admin.accountActivity(id))
  const [dlg, setDlg] = useState(null)
  const a = q.data
  return (
    <AdminLayout active="accounts">
      <AdminHeader crumb={`SKYUP ADMIN  /  ACCOUNTS  /  ${(a?.advisor ?? '').toUpperCase()}`} title={a?.advisor ?? 'Account'} titleExtra={a && <Pill tone={a.account.status === 'ACTIVE' ? 'green' : 'red'}>{label(a.account.status)}</Pill>}
        subtitle={a ? `${a.mobile} · joined ${fmtDate(a.joinedAt)}` : ''}
        actions={a && <>
          <SButton icon="card" onClick={() => setDlg('pay')}>Record payment</SButton>
          <SButton icon="refresh" onClick={() => setDlg('plan')}>Change plan</SButton>
          {a.account.status === 'ACTIVE' ? <SButton icon="x" onClick={() => setDlg('suspend')}>Suspend</SButton> : a.account.status === 'SUSPENDED' && <SButton icon="refresh" onClick={() => setDlg('reactivate')}>Reactivate</SButton>}
          {a.account.status !== 'CLOSED' && <SButton icon="x" onClick={() => setDlg('close')}>Close</SButton>}
        </>} />
      {q.error && <ErrorNote error={q.error} />}
      {a && (
        <div className="mt-6 flex items-start gap-5">
          <div className="flex flex-1 flex-col gap-5">
            <ACard><ACardHead title="Advisor" />
              <div className="mt-3 grid grid-cols-3 gap-4 text-[13px]">
                {[['Business', a.business], ['Email', a.email], ['City', a.city], ['Licence', a.licence.number], ['Valid until', a.licence.validUntil], ['Type', a.licence.type], ['Assistants', `${a.assistants.used} of ${a.assistants.limit}`], ...(WALLET_ENABLED ? [['Wallet', fmtMoney(a.walletBalance)]] : []), ['Last sign-in', fmtDateTime(a.lastLogin)]].map(([k, v]) => <div key={k}><p className="text-muted">{k}</p><p className="font-semibold text-ink">{v || '—'}</p></div>)}
              </div>
              <p className="mt-3 text-[12px] font-medium text-muted">{a.counts.leads} leads · {a.counts.customers} customers · {a.counts.quotations} quotations · {a.counts.policies} policies</p>
              {a.account.reason && <p className="mt-2 text-[12px] font-semibold text-[#b4323c]">Reason: {a.account.reason}</p>}
            </ACard>
            <ACard><ACardHead title="Activity" />
              <div className="mt-3 flex flex-col gap-2">{(act.data || []).map((x, i) => <Line key={i}><span className="w-[150px] text-muted">{fmtDateTime(x.at)}</span><span className="flex-1 font-semibold text-ink">{x.text}</span><span className="text-muted">{x.by}</span></Line>)}{act.data && !act.data.length && <Empty />}</div>
            </ACard>
          </div>
          <div className="flex w-[380px] flex-col gap-5">
            <ACard><ACardHead title="Subscription" right={sub.data && <Pill tone={SUB_TONE[sub.data.status]}>{label(sub.data.status)}</Pill>} />
              {sub.data && <div className="mt-3 flex flex-col gap-1 text-[13px]"><p className="font-semibold text-ink">{label(sub.data.plan ?? 'Trial')} {sub.data.cycle ? `· ${label(sub.data.cycle)}` : ''}</p><p className="text-muted">{sub.data.startsAt} to {sub.data.endsAt}{sub.data.nextPlan ? ` · then ${label(sub.data.nextPlan)}` : ''}</p>
                {sub.data.invoices.map((i) => <p key={i.id} className="text-muted">{i.invoiceNumber} · {fmtMoney(i.total)}</p>)}</div>}
            </ACard>
            <ACard><ACardHead title="KYC" right={kyc.data && <Pill tone={KYC_TONE[kyc.data.status]}>{label(kyc.data.status)}</Pill>} />
              {kyc.data && <div className="mt-3 text-[13px]"><p className="text-ink">PAN {kyc.data.pan ?? '—'} · {kyc.data.nameOnPan ?? ''}</p>{kyc.data.status === 'PENDING_REVIEW' && <SButton className="mt-2" icon="shield" to={`/admin/kyc/${id}`}>Review KYC</SButton>}</div>}
            </ACard>
          </div>
        </div>
      )}
      {dlg && a && <AccountDialog kind={dlg} a={a} onClose={() => setDlg(null)} />}
    </AdminLayout>
  )
}
function AccountDialog({ kind, a, onClose }) {
  const [f, setF] = useState({ reasonCode: a.suspendReasons?.[0] ?? '', reason: '', confirmText: '', toPlan: 'NORMAL', effective: 'NOW', note: '', plan: 'NORMAL', cycle: 'YEARLY', amount: '', reference: '', startDate: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const inv = ['admin']
  const run = {
    suspend: () => api.admin.suspend(a.id, { reasonCode: f.reasonCode, reason: f.reason || undefined }),
    reactivate: () => api.admin.reactivate(a.id, { reason: f.reason }),
    close: () => api.admin.close(a.id, { reasonCode: f.reasonCode, reason: f.reason || undefined, confirmText: f.confirmText }),
    plan: () => api.admin.changePlan(a.id, { toPlan: f.toPlan, effective: f.effective, note: f.note }),
    pay: () => api.admin.offlinePayment(a.id, { plan: f.plan, cycle: f.cycle, amount: Number(f.amount), reference: f.reference, ...(f.startDate ? { startDate: dmy(f.startDate) } : {}) }),
  }[kind]
  const T = { suspend: 'Suspend account', reactivate: 'Reactivate account', close: 'Close account', plan: 'Change plan', pay: 'Record subscription payment' }[kind]
  return (
    <ActionDialog title={T} body={`${a.advisor}. Asks for your OTP.`} tone={['suspend', 'close'].includes(kind) ? 'danger' : 'navy'} confirm={T} busy={busy} error={error} onConfirm={() => act(run, { invalidates: inv, onDone: onClose, quiet: true })} onClose={onClose}>
      {['suspend', 'close'].includes(kind) && <Field label="Reason *" type="select" value={f.reasonCode} onChange={set('reasonCode')} options={a.suspendReasons ?? []} />}
      {['suspend', 'close', 'reactivate'].includes(kind) && <Field label={kind === 'reactivate' ? 'Reason *' : 'Note'} value={f.reason} onChange={set('reason')} error={fe.reason} />}
      {kind === 'close' && <Field label='Type "CLOSE" to confirm' value={f.confirmText} onChange={set('confirmText')} error={fe.confirmText} />}
      {kind === 'plan' && <><div className="flex gap-3"><Field label="New plan" type="select" value={f.toPlan} onChange={set('toPlan')} options={['NORMAL', 'PREMIUM']} /><Field label="When" type="select" value={f.effective} onChange={set('effective')} options={[{ value: 'NOW', label: 'Now' }, { value: 'NEXT_RENEWAL', label: 'At next renewal' }]} /></div><Field label="Note *" value={f.note} onChange={set('note')} error={fe.note} /></>}
      {kind === 'pay' && <><div className="flex gap-3"><Field label="Plan" type="select" value={f.plan} onChange={set('plan')} options={['NORMAL', 'PREMIUM']} /><Field label="Cycle" type="select" value={f.cycle} onChange={set('cycle')} options={['MONTHLY', 'YEARLY']} /></div>
        <div className="flex gap-3"><Field label="Amount (₹) *" type="number" value={f.amount} onChange={set('amount')} error={fe.amount} /><Field label="Reference *" value={f.reference} onChange={set('reference')} error={fe.reference} /><Field label="Start date" type="date" value={f.startDate} onChange={set('startDate')} /></div></>}
    </ActionDialog>
  )
}

/* ═════════════ 24 · Advisor KYC (+ AA5 reject) ═════════════ */
export function AdminKyc() {
  const { id } = useParams()
  const { can } = useAuth() // Q113: verify / reject is for SkyUp admins only (capability kyc.decide)
  const navigate = useNavigate()
  const list = useQuery('admin:kyc', () => api.kyc.adminList())
  const one = useQuery(['admin:kyc', id], () => api.kyc.adminGet(id), { enabled: !!id })
  const [dlg, setDlg] = useState(null)
  const items = list.data?.items || []
  const k = one.data
  return (
    <AdminLayout active="kyc">
      <AdminHeader title="Advisor KYC" subtitle={`Check PAN and licence. Target: ${list.data?.targetWorkingDays ?? 2} working days. Verifying and rejecting is for SkyUp admins.`} />
      <div className="mt-6 flex items-start gap-5">
        <ACard className="w-[420px]"><ACardHead title="Waiting" subtitle={`${items.length} submissions`} />
          <div className="mt-3 flex flex-col gap-2">
            {items.map((x) => <button key={x.accountId} type="button" onClick={() => navigate(`/admin/kyc/${x.accountId}`)} className={cx('flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-[13px] hover:bg-panel-2', id === x.accountId && 'bg-panel')}><span className="flex-1 font-bold text-ink">{x.advisorName}</span><span className={x.overdue ? "font-bold text-[#b4323c]" : "text-muted"}>{x.workingDaysWaiting} working days</span></button>)}
            {list.data && !items.length && <Empty text="No KYC waiting." />}
          </div>
        </ACard>
        <ACard className="flex-1">
          {!id && <Empty text="Pick a submission." />}
          {k && (
            <div className="flex flex-col gap-3 text-[13px]">
              <ACardHead title={k.advisor ?? k.nameOnPan} right={<Pill tone={KYC_TONE[k.status]}>{label(k.status)}</Pill>} />
              <p className="text-ink">PAN <b>{k.pan}</b> · Name on PAN <b>{k.nameOnPan}</b></p>
              <p className="text-ink">Licence <b>{k.licence?.number ?? '—'}</b> · valid until {k.licence?.validUntil ?? '—'}{k.licence?.expired ? ' (expired)' : ''}</p>
              <div className="flex gap-2">
                {k.documents?.panFileId && <SButton icon="eye" onClick={() => window.open(api.files.url(k.documents.panFileId), '_blank')}>PAN card</SButton>}
                {k.documents?.licenceFileId && <SButton icon="eye" onClick={() => window.open(api.files.url(k.documents.licenceFileId), '_blank')}>Licence</SButton>}
              </div>
              {k.status === 'PENDING_REVIEW' && (can('kyc.decide')
                ? <div className="flex gap-2"><SButton variant="navy" icon="check" onClick={() => setDlg('VERIFY')}>Verify</SButton><SButton icon="x" onClick={() => setDlg('REJECT')}>Reject</SButton></div>
                : <Pill tone="gray">Only a SkyUp admin can verify or reject KYC</Pill>)}
            </div>
          )}
        </ACard>
      </div>
      {dlg && k && <KycDecision k={k} accountId={id} decision={dlg} onClose={() => setDlg(null)} />}
    </AdminLayout>
  )
}
const REJECT = ['Document unclear', 'Name does not match', 'PAN invalid', 'Licence expired', 'Other']
function KycDecision({ k, accountId, decision, onClose }) {
  const [c, setC] = useState({ panReadable: true, nameMatches: true, licenceValid: true, photoClear: true })
  const [reason, setReason] = useState(REJECT[0])
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.kyc.adminDecide(accountId, { version: k.version, decision, ...(decision === 'REJECT' ? { reason, note: note || null } : { checklist: c }) }), { invalidates: ['admin'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title={decision === 'VERIFY' ? 'Verify KYC' : 'Reject KYC'} tone={decision === 'VERIFY' ? 'navy' : 'danger'} confirm={decision === 'VERIFY' ? 'Verify' : 'Reject'} busy={busy} error={error} onConfirm={save} onClose={onClose}>
      {decision === 'VERIFY' ? Object.entries({ panReadable: 'PAN is readable', nameMatches: 'Name matches', licenceValid: 'Licence is valid', photoClear: 'Photo is clear' }).map(([key, l]) => <Field key={key} type="checkbox" label={l} value={c[key]} onChange={(v) => setC({ ...c, [key]: v })} />)
        : <><Field label="Reason *" type="select" value={reason} onChange={setReason} options={REJECT} /><Field label={reason === 'Other' ? 'Note *' : 'Note'} type="textarea" value={note} onChange={setNote} error={fe.note} /></>}
    </ActionDialog>
  )
}

/* ═════════════ 23 · Approvals ═════════════ */
export function AdminApprovals() {
  const q = useQuery('admin:approvals', () => api.adminCatalogue.approvals())
  const { act, busy } = useAct()
  const [reject, setReject] = useState(null)
  const rows = q.data || []
  const approve = (x) => {
    const fn = { INSURER: () => api.adminCatalogue.approveInsurer(x.id, { version: x.version }), TEMPLATE: () => api.adminCatalogue.approveTemplate(x.id, { rev: x.version ?? x.rev }), PRODUCT_VERSION: () => api.adminCatalogue.approveVersion(x.id, { rev: x.version ?? x.rev }), CONFIG: () => api.admin.approveConfig(x.id, {}) }[x.kind ?? x.type]
    return act(fn, { invalidates: ['admin'] })
  }
  return (
    <AdminLayout active="approvals">
      <AdminHeader title="Waiting from before" subtitle="Publishing is immediate now. These items were waiting for a second admin before that change: publish them or send them back to draft." />
      <ACard className="mt-6"><div className="flex flex-col gap-3">
        {rows.map((x) => (
          <Line key={`${x.kind}${x.id}`}><Pill tone="violet">{label(x.kind)} · {x.what === 'CHANGE' ? 'Change' : 'New'}</Pill><span className="flex-1 font-semibold text-ink">{x.name ?? x.id}</span><span className="text-muted">{fmtDate(x.at, { year: false })}</span>
            <SButton variant="navy" icon="check" disabled={busy} onClick={() => approve(x)}>Publish</SButton><SButton icon="x" onClick={() => setReject(x)}>Back to draft</SButton></Line>
        ))}
        {q.data && !rows.length && <Empty text="Nothing left waiting." />}{!q.data && <Empty q={q} />}
      </div></ACard>
      {reject && <RejectApproval x={reject} onClose={() => setReject(null)} />}
    </AdminLayout>
  )
}
function RejectApproval({ x, onClose }) {
  const [reason, setReason] = useState('')
  const { act, busy, error } = useAct()
  const fn = { INSURER: () => api.adminCatalogue.rejectInsurer(x.id, { version: x.version, reason }), TEMPLATE: () => api.adminCatalogue.rejectTemplate(x.id, { rev: x.version ?? x.rev, reason }), PRODUCT_VERSION: () => api.adminCatalogue.rejectVersion(x.id, { rev: x.version ?? x.rev, reason }), CONFIG: () => api.admin.rejectConfig(x.id, { reason }) }[x.kind ?? x.type]
  return <ActionDialog title="Send back to draft" tone="danger" confirm="Back to draft" busy={busy} error={error} disabled={!reason.trim()} onConfirm={() => act(fn, { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose}><Field label="Reason *" value={reason} onChange={setReason} /></ActionDialog>
}

/* ═════════════ AA6 · Product corrections ═════════════ */
export function AdminCorrections() {
  const q = useQuery('admin:corrections', () => api.adminCatalogue.corrections())
  const { act, busy } = useAct()
  const [rej, setRej] = useState(null)
  return (
    <AdminLayout active="corrections">
      <AdminHeader title="Product corrections" subtitle="Values advisors say are wrong. Accepting publishes the corrected value (or adds it to an open draft). Asks for your OTP." />
      <ACard className="mt-6"><div className="flex flex-col gap-3">
        {(q.data || []).map((c) => (
          <Line key={c.id}><div className="flex flex-1 flex-col"><span className="font-bold text-ink">{c.product} · {c.fieldLabel ?? c.field}</span><span className="text-muted">Now “{String(c.currentValue ?? '—')}” → suggested “{String(c.proposedValue)}” · {c.reason}</span></div>
            <Pill tone={c.status === 'OPEN' ? 'amber' : 'gray'}>{label(c.status)}</Pill>
            {c.status === 'OPEN' && <><SButton variant="navy" icon="check" disabled={busy} onClick={() => act(() => api.adminCatalogue.acceptCorrection(c.id, {}), { invalidates: ['admin'] })}>Accept and publish</SButton><SButton icon="x" onClick={() => setRej(c)}>Reject</SButton></>}</Line>
        ))}
        {q.data && !q.data.length && <Empty text="No corrections waiting." />}{!q.data && <Empty q={q} />}
      </div></ACard>
      {rej && <ReasonDialog title="Reject correction" onSave={(reason) => api.adminCatalogue.rejectCorrection(rej.id, { reason })} onClose={() => setRej(null)} />}
    </AdminLayout>
  )
}
function ReasonDialog({ title, onSave, onClose }) {
  const [reason, setReason] = useState('')
  const { act, busy, error } = useAct()
  return <ActionDialog title={title} tone="danger" confirm="Save" busy={busy} error={error} disabled={!reason.trim()} onConfirm={() => act(() => onSave(reason), { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose}><Field label="Reason *" value={reason} onChange={setReason} /></ActionDialog>
}

/* ═════════════ AA8 · Message templates ═════════════ */
const PURPOSES = ['RENEWAL_REMINDER', 'QUOTATION_EMAIL', 'BIRTHDAY', 'FAMILY_BIRTHDAY', 'ANNIVERSARY', 'KYC_RESULT', 'SUBSCRIPTION']
export function AdminTemplates() {
  const q = useQuery('admin:templates', () => api.admin.templates())
  const [add, setAdd] = useState(false)
  const { act, busy } = useAct()
  return (
    <AdminLayout active="templates">
      <AdminHeader title="Message templates" subtitle="Publish applies at once (asks for your OTP). WhatsApp templates still need Meta's approval before they can be sent." actions={<SButton variant="navy" icon="plus" onClick={() => setAdd(true)}>New template</SButton>} />
      <ACard className="mt-6"><div className="flex flex-col gap-3">
        {(q.data || []).map((t) => (
          <Line key={t._id ?? t.id}><div className="flex flex-1 flex-col"><span className="font-bold text-ink">{t.name} <span className="font-medium text-muted">· {label(t.channel)} · {label(t.purpose)} · {t.language}</span></span><span className="truncate text-muted">{t.body}</span></div>
            <Pill tone={t.status === 'ACTIVE' ? 'green' : t.status === 'DRAFT' ? 'gray' : 'amber'}>{label(t.status)}{t.providerStatus ? ` · Meta via MSG91: ${label(t.providerStatus)}` : t.metaStatus ? ` · Meta ${label(t.metaStatus)}` : ''}</Pill>
            {t.providerStatus === 'REJECTED' && t.metaReason && <span className="text-[12px] font-semibold text-[#b4323c]">{t.metaReason}</span>}
            {['DRAFT', 'REJECTED'].includes(t.status) && <SButton variant="navy" disabled={busy} onClick={() => act(() => api.admin.submitTemplate(t._id ?? t.id, {}), { invalidates: ['admin'] })}>Publish</SButton>}
            {t.status === 'PENDING_APPROVAL' && <SButton variant="navy" disabled={busy} onClick={() => act(() => api.admin.approveTemplate(t._id ?? t.id, {}), { invalidates: ['admin'] })}>Publish</SButton>}
            {t.status === 'ACTIVE' && <SButton disabled={busy} onClick={() => act(() => api.admin.deactivateTemplate(t._id ?? t.id, {}), { invalidates: ['admin'] })}>Deactivate</SButton>}</Line>
        ))}
        {q.data && !q.data.length && <Empty />}{!q.data && <Empty q={q} />}
      </div></ACard>
      {add && <TemplateDialog onClose={() => setAdd(false)} />}
    </AdminLayout>
  )
}
function TemplateDialog({ onClose }) {
  const [f, setF] = useState({ name: '', channel: 'WHATSAPP', purpose: PURPOSES[0], language: 'English', subject: '', body: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  return (
    <ActionDialog title="New template" confirm="Save draft" busy={busy} error={error} onConfirm={() => act(() => api.admin.createTemplate({ ...f, subject: f.channel === 'EMAIL' ? f.subject : null }), { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose} width={620}>
      <div className="flex gap-3"><Field label="Name *" value={f.name} onChange={set('name')} error={fe.name} /><Field label="Channel" type="select" value={f.channel} onChange={set('channel')} options={['WHATSAPP', 'EMAIL']} /></div>
      <div className="flex gap-3"><Field label="Purpose" type="select" value={f.purpose} onChange={set('purpose')} options={PURPOSES.map((p) => ({ value: p, label: label(p) }))} /><Field label="Language" value={f.language} onChange={set('language')} /></div>
      {f.channel === 'EMAIL' && <Field label="Subject" value={f.subject} onChange={set('subject')} />}
      <Field label="Body *" type="textarea" value={f.body} onChange={set('body')} error={fe.body} hint="Placeholders like {name} and {advisor name} are filled per message." />
    </ActionDialog>
  )
}

/* ═════════════ AA9 · SkyUp users ═════════════ */
export function AdminUsers() {
  const q = useQuery('admin:staff', () => api.staff.list())
  const [add, setAdd] = useState(false)
  const { act, busy } = useAct()
  const { user } = useAuth()
  return (
    <AdminLayout active="users">
      <AdminHeader title="SkyUp users" subtitle="Admins approve; staff work in accounts only with the advisor's permission." actions={user?.role === 'ADM' && <SButton variant="navy" icon="plus" onClick={() => setAdd(true)}>Add user</SButton>} />
      <ACard className="mt-6"><div className="flex flex-col gap-3">
        {(q.data || []).map((u) => (
          <Line key={u.id}><span className="w-[220px] font-bold text-ink">{u.name}</span><span className="w-[140px] text-muted">{u.mobile}</span><span className="flex-1 text-muted">{u.email ?? ''}</span><Pill tone="violet">{u.roleLabel}</Pill><Pill tone={u.status === 'ACTIVE' ? 'green' : 'gray'}>{label(u.status)}</Pill>
            {user?.role === 'ADM' && u.id !== user.id && <>
              <SButton disabled={busy} onClick={() => act(() => api.staff.setRole(u.id, { version: u.version, role: u.role === 'ADM' ? 'STF' : 'ADM' }), { invalidates: ['admin'] })}>Make {u.role === 'ADM' ? 'staff' : 'admin'}</SButton>
              <SButton disabled={busy} onClick={() => act(() => (u.status === 'DISABLED' ? api.staff.enable(u.id, { version: u.version }) : api.staff.disable(u.id, { version: u.version })), { invalidates: ['admin'] })}>{u.status === 'DISABLED' ? 'Enable' : 'Disable'}</SButton></>}</Line>
        ))}
        {!q.data && <Empty q={q} />}
      </div></ACard>
      {add && <StaffDialog onClose={() => setAdd(false)} />}
    </AdminLayout>
  )
}
function StaffDialog({ onClose }) {
  const [f, setF] = useState({ name: '', mobile: '', email: '', role: 'STF' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  return (
    <ActionDialog title="Add SkyUp user" confirm="Add" busy={busy} error={error} onConfirm={() => act(() => {
      check({ name: !f.name.trim() && 'Enter a name.', mobile: mobileError(f.mobile, { required: true }), email: f.email.trim() && !isEmail(f.email) && 'Enter a valid email.' })
      return api.staff.create({ name: f.name.trim(), mobile: cleanMobile(f.mobile), email: f.email.trim() || undefined, role: f.role })
    }, { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose}>
      <Field label="Name *" value={f.name} onChange={set('name')} error={fe.name} /><div className="flex gap-3"><Field label="Mobile *" type="mobile" value={f.mobile} onChange={set('mobile')} error={fe.mobile} /><Field label="Email" value={f.email} onChange={set('email')} error={fe.email} /></div>
      <Field label="Role" type="select" value={f.role} onChange={set('role')} options={[{ value: 'STF', label: 'SkyUp staff' }, { value: 'ADM', label: 'SkyUp admin' }]} />
    </ActionDialog>
  )
}

/* ═════════════ AA10 · Configuration ═════════════ */
export function AdminConfig() {
  const q = useQuery('admin:config', () => api.admin.config())
  const h = useQuery('admin:config:history', () => api.admin.configHistory())
  const [edit, setEdit] = useState(null)
  const [s, setS] = useState('')
  const { act, busy } = useAct()
  const rows = (q.data || []).filter((c) => !s || `${c.id} ${c.label}`.toLowerCase().includes(s.toLowerCase()))
  const pending = (h.data || []).filter((x) => x.status === 'PENDING')
  return (
    <AdminLayout active="config">
      <AdminHeader title="Configuration" subtitle="Changes apply at once with your OTP and a reason. Values marked Release change only with a new release." />
      {pending.length > 0 && <ACard className="mt-6"><ACardHead title="Left waiting from before" /><div className="mt-3 flex flex-col gap-2">{pending.map((x) => <Line key={x.id}><span className="flex-1 font-semibold text-ink">{x.configId} → {JSON.stringify(x.value)} · {x.reason}</span><SButton variant="navy" disabled={busy} onClick={() => act(() => api.admin.approveConfig(x.id, {}), { invalidates: ['admin'] })}>Apply</SButton><SButton disabled={busy} onClick={() => act(() => api.admin.rejectConfig(x.id, {}), { invalidates: ['admin'] })}>Drop</SButton></Line>)}</div></ACard>}
      <input value={s} onChange={(e) => setS(e.target.value)} placeholder="Search CFG id or label" className="mt-5 h-[42px] w-[320px] rounded-[21px] bg-white px-4 text-[13px] font-semibold outline-none" />
      <ACard className="mt-4"><div className="flex flex-col gap-2">
        {rows.map((c) => (
          <Line key={c.id}><span className="w-[80px] font-bold text-ink">{c.id}</span><span className="flex-1 text-ink">{c.label}</span><span className="w-[220px] truncate font-semibold text-ink">{JSON.stringify(c.value)} {c.unit ?? ''}</span>{c.overridden && <Pill tone="amber">Changed</Pill>}
            {c.change === 'ADM' ? <SButton icon="edit" onClick={() => setEdit(c)}>Change</SButton> : <Pill tone="gray">{c.change}</Pill>}</Line>
        ))}
        {!q.data && <Empty q={q} />}
      </div></ACard>
      {edit && <ConfigDialog c={edit} onClose={() => setEdit(null)} />}
    </AdminLayout>
  )
}
function ConfigDialog({ c, onClose }) {
  const [v, setV] = useState(JSON.stringify(c.value))
  const [reason, setReason] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const parse = () => { try { return JSON.parse(v) } catch { return v } }
  return (
    <ActionDialog title={`${c.id} · ${c.label}`} body="Applies at once. Asks for your OTP; the reason is kept in the audit log." confirm="Apply change" busy={busy} error={error} onConfirm={() => act(() => api.admin.proposeConfig(c.id, { value: parse(), reason }), { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose}>
      <Field label={`New value${c.unit ? ` (${c.unit})` : ''}`} value={v} onChange={setV} error={fe.value} hint={`Default ${JSON.stringify(c.default)}`} /><Field label="Reason *" value={reason} onChange={setReason} error={fe.reason} />
    </ActionDialog>
  )
}

/* ═════════════ AA11 · Audit log ═════════════ */
export function AdminAudit() {
  const [page, setPage] = useState(1)
  const [action, setAction] = useState('')
  const da = useDebounced(action.trim(), 300)
  // starts-with: "LOGIN" finds LOGIN_SUCCEEDED and LOGIN_FAILED (an exact match only worked with the full name)
  const q = useQuery(['admin:audit', page, da], () => api.audit.list({ page, limit: 30, actionStartsWith: da || undefined }))
  const m = q.meta || {}
  return (
    <AdminLayout active="audit">
      <AdminHeader title="Audit log" subtitle="Every sign-in, change and access, across all accounts." />
      <input value={action} onChange={(e) => { setAction(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')); setPage(1) }} placeholder="Filter by action, e.g. LOGIN_SUCCEEDED" className="mt-5 h-[42px] w-[340px] rounded-[21px] bg-white px-4 text-[13px] font-semibold outline-none" />
      <ACard className="mt-4"><div className="flex flex-col gap-2">
        {(q.data || []).map((e) => <Line key={e.id}><span className="w-[150px] text-muted">{fmtDateTime(e.at)}</span><span className="w-[170px] truncate font-semibold text-ink">{e.actorName ?? label(e.actorRole)}</span><span className="flex-1 truncate font-semibold text-ink">{label(e.action)}{e.entityRef ? ` · ${e.entityRef}` : ''}</span><span className="w-[110px] text-muted">{e.ip}</span><Pill tone={e.result === 'SUCCESS' ? 'green' : 'red'}>{label(e.result)}</Pill></Line>)}
        {!q.data && <Empty q={q} />}
        {(m.pages ?? 1) > 1 && <div className="flex justify-end gap-2 pt-2 text-[13px] text-muted">Page {page} of {m.pages}<SButton disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</SButton><SButton disabled={page >= m.pages} onClick={() => setPage(page + 1)}>Next</SButton></div>}
      </div></ACard>
    </AdminLayout>
  )
}

/* ═════════════ AA12 · Agent-code flags ═════════════ */
export function AdminFlags() {
  const [tab, setTab] = useState('OPEN')
  const q = useQuery(['admin:flags', tab], () => api.admin.agentCodeFlags({ view: 'items', status: tab }))
  const [res, setRes] = useState(null)
  return (
    <AdminLayout active="flags">
      <AdminHeader title="Agent-code flags" subtitle="The same agent code on more than one account." />
      <SegTabs className="mt-5" items={['OPEN', 'RESOLVED'].map((t) => ({ key: t, label: label(t), count: q.data?.counts?.[t] ?? 0 }))} value={tab} onChange={setTab} />
      <ACard className="mt-5"><div className="flex flex-col gap-3">
        {(q.data?.items || []).map((f) => (
          <Line key={f.id}><div className="flex flex-1 flex-col"><span className="font-bold text-ink">{f.insurer ?? ''} · agent code {f.agentCode}</span><span className="text-muted">{(f.accounts || []).map((a) => a.advisor ?? a.name).join(', ')}</span></div>
            {f.status === 'OPEN' ? <SButton variant="navy" onClick={() => setRes(f)}>Resolve</SButton> : <Pill tone="gray">{label(f.resolution)}</Pill>}</Line>
        ))}
        {q.data && !q.data.items.length && <Empty text="No flags." />}{!q.data && <Empty q={q} />}
      </div></ACard>
      {res && <FlagDialog f={res} onClose={() => setRes(null)} />}
    </AdminLayout>
  )
}
function FlagDialog({ f, onClose }) {
  const [resolution, setR] = useState('BOTH_VALID')
  const [accountId, setA] = useState('')
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  return (
    <ActionDialog title="Resolve flag" confirm="Resolve" busy={busy} error={error} onConfirm={() => act(() => api.admin.resolveAgentCodeFlag(f.id, { version: f.version, resolution, ...(resolution === 'REMOVED_FROM_ACCOUNT' ? { accountId } : {}), note }), { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose}>
      <Field label="Outcome" type="select" value={resolution} onChange={setR} options={[{ value: 'BOTH_VALID', label: 'Both are valid' }, { value: 'REMOVED_FROM_ACCOUNT', label: 'Removed from one account' }, { value: 'ASKED_ADVISORS', label: 'Asked the advisors' }]} />
      {resolution === 'REMOVED_FROM_ACCOUNT' && <Field label="Account" type="select" value={accountId} onChange={setA} options={[{ value: '', label: 'Choose' }, ...(f.accounts || []).map((a) => ({ value: a.accountId ?? a.id, label: a.advisor ?? a.name }))]} />}
      <Field label="Note *" type="textarea" value={note} onChange={setNote} error={fe.note} />
    </ActionDialog>
  )
}

/* ═════════════ AA13 · Support access ═════════════ */
export function AdminSupport() {
  const q = useQuery('admin:grants', () => api.admin.supportGrants())
  const { act, busy } = useAct()
  return (
    <AdminLayout active="support">
      <AdminHeader title="Support access" subtitle="Access advisors gave SkyUp people, and what was opened." />
      <ACard className="mt-6"><div className="flex flex-col gap-3">
        {(q.data || []).map((g) => (
          <Line key={g.id}><div className="flex flex-1 flex-col"><span className="font-bold text-ink">{g.advisor ?? g.account} → {g.to ?? g.grantee}</span><span className="text-muted">{g.reason} · {fmtDateTime(g.startsAt)} to {fmtDateTime(g.endsAt)}</span></div>
            <Pill tone={g.status === 'ACTIVE' ? 'green' : 'gray'}>{label(g.status)}</Pill>
            {g.status === 'ACTIVE' && <><SButton icon="eye" to={`/support/${g.accountId}`}>Open account</SButton><SButton disabled={busy} onClick={() => act(() => api.admin.endSupportGrant(g.id, {}), { invalidates: ['admin'] })}>End</SButton></>}</Line>
        ))}
        {q.data && !q.data.length && <Empty text="No support access given." />}{!q.data && <Empty q={q} />}
      </div></ACard>
    </AdminLayout>
  )
}

/* ═════════════ AD1 / ADa–ADc · Catalogue ═════════════ */
const CATS = ['Life', 'General', 'Standalone Health']
export function AdminCatalogue() {
  const [tab, setTab] = useState('products')
  const ins = useQuery('admin:insurers', () => api.adminCatalogue.insurers())
  const types = useQuery('admin:types', () => api.adminCatalogue.types())
  const prods = useQuery('admin:products', () => api.adminCatalogue.products())
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  const insName = Object.fromEntries((ins.data || []).map((i) => [i.id, i.name]))
  const typName = Object.fromEntries((types.data || []).map((t) => [t.id, t.name]))
  return (
    <AdminLayout active="catalogue">
      <AdminHeader title="Catalogue" subtitle="Verified insurers, insurance types and products that advisors quote." actions={<><SButton icon="plus" onClick={() => setDlg('insurer')}>Add insurer</SButton><SButton variant="navy" icon="plus" onClick={() => setDlg('product')}>Add product</SButton></>} />
      <SegTabs className="mt-5" items={[{ key: 'products', label: 'Products', count: prods.data?.length ?? 0 }, { key: 'insurers', label: 'Insurers', count: ins.data?.length ?? 0 }, { key: 'types', label: 'Types', count: types.data?.length ?? 0 }]} value={tab} onChange={setTab} />
      <ACard className="mt-5"><div className="flex flex-col gap-3">
        {tab === 'products' && (prods.data || []).map((p) => (
          <Line key={p.id}><Link to={`/admin/catalogue/products/${p.id}`} className="flex flex-1 flex-col hover:underline"><span className="font-bold text-ink">{p.name ?? p.code}</span><span className="text-muted">{insName[p.insurerId] ?? p.insurer} · {typName[p.typeId] ?? p.type} · {p.code}</span></Link><Pill tone={p.status === 'ACTIVE' ? 'green' : 'amber'}>{label(p.status)}</Pill></Line>
        ))}
        {tab === 'insurers' && (ins.data || []).map((i) => (
          <Line key={i.id}><div className="flex flex-1 flex-col"><span className="font-bold text-ink">{i.name} <span className="font-medium text-muted">· {i.shortCode} · {i.category}</span></span><span className="text-muted">IRDAI {i.irdaiRegNo}{i.rejectReason ? ` · rejected: ${i.rejectReason}` : ''}</span></div>
            <Pill tone={i.status === 'ACTIVE' ? 'green' : i.status === 'PENDING_APPROVAL' ? 'violet' : 'gray'}>{i.status === 'PENDING_APPROVAL' ? 'Waiting from before' : label(i.status)}</Pill>
            {i.status === 'DRAFT' && <SButton variant="navy" disabled={busy} onClick={() => act(() => api.adminCatalogue.submitInsurer(i.id, { version: i.version }), { invalidates: ['admin'] })}>Publish</SButton>}
            {i.status === 'ACTIVE' && <SButton disabled={busy} onClick={() => act(() => api.adminCatalogue.deactivateInsurer(i.id, { version: i.version }), { invalidates: ['admin'] })}>Deactivate</SButton>}
            {i.status === 'INACTIVE' && <SButton disabled={busy} onClick={() => act(() => api.adminCatalogue.activateInsurer(i.id, { version: i.version }), { invalidates: ['admin'] })}>Activate</SButton>}</Line>
        ))}
        {tab === 'types' && (types.data || []).map((t) => (
          <Line key={t.id}><span className="flex-1 font-bold text-ink">{t.name}</span><span className="text-muted">{t.activeTemplate ? `Template v${t.activeTemplate.number}` : 'No active template'}</span><Pill tone={t.status === 'ACTIVE' ? 'green' : 'gray'}>{label(t.status)}</Pill></Line>
        ))}
        {(tab === 'products' ? prods : tab === 'insurers' ? ins : types).data?.length === 0 && <Empty />}
      </div></ACard>
      {dlg === 'insurer' && <InsurerDialog onClose={() => setDlg(null)} />}
      {dlg === 'product' && <NewProductDialog insurers={(ins.data || []).filter((i) => i.status === 'ACTIVE')} types={types.data || []} onClose={() => setDlg(null)} />}
    </AdminLayout>
  )
}
function InsurerDialog({ onClose }) {
  const [f, setF] = useState({ name: '', shortCode: '', category: CATS[2], irdaiRegNo: '', website: '', paymentDomains: '', careNumber: '', careEmail: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const body = { ...f, paymentDomains: f.paymentDomains.split(',').map((x) => x.trim()).filter(Boolean), website: f.website || undefined, careNumber: f.careNumber || undefined, careEmail: f.careEmail || undefined, submit: true }
  return (
    <ActionDialog title="Add insurer" body="Goes live at once for advisors to map. Asks for your OTP." confirm="Save and publish" busy={busy} error={error} onConfirm={() => act(() => api.adminCatalogue.createInsurer(body), { invalidates: ['admin'], onDone: onClose, quiet: true })} onClose={onClose} width={640}>
      <div className="flex gap-3"><Field label="Name *" value={f.name} onChange={set('name')} error={fe.name} /><Field label="Short code *" value={f.shortCode} onChange={set('shortCode')} error={fe.shortCode} /></div>
      <div className="flex gap-3"><Field label="Category *" type="select" value={f.category} onChange={set('category')} options={CATS} /><Field label="IRDAI reg. no. *" value={f.irdaiRegNo} onChange={set('irdaiRegNo')} error={fe.irdaiRegNo} /></div>
      <Field label="Payment domains * (comma separated)" value={f.paymentDomains} onChange={set('paymentDomains')} error={fe.paymentDomains} />
      <div className="flex gap-3"><Field label="Website" value={f.website} onChange={set('website')} error={fe.website} /><Field label="Care number" value={f.careNumber} onChange={set('careNumber')} /><Field label="Care email" value={f.careEmail} onChange={set('careEmail')} /></div>
    </ActionDialog>
  )
}
function NewProductDialog({ insurers, types, onClose }) {
  const navigate = useNavigate()
  const [f, setF] = useState({ insurerId: insurers[0]?.id ?? '', typeId: types[0]?.id ?? '', code: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  return (
    <ActionDialog title="Add product" body={insurers.length ? 'Then upload the brochure: values are read and you check each one.' : 'Add and publish an insurer first.'} confirm="Create" busy={busy} error={error} disabled={!insurers.length}
      onConfirm={() => act(() => api.adminCatalogue.createProduct(f), { invalidates: ['admin'], quiet: true, onDone: (r) => navigate(`/admin/catalogue/products/${r.data.id}`) })} onClose={onClose}>
      <Field label="Insurer *" type="select" value={f.insurerId} onChange={set('insurerId')} options={insurers.map((i) => ({ value: i.id, label: i.name }))} error={fe.insurerId} />
      <Field label="Type *" type="select" value={f.typeId} onChange={set('typeId')} options={types.map((t) => ({ value: t.id, label: t.name }))} error={fe.typeId} />
      <Field label="Product code *" value={f.code} onChange={set('code')} error={fe.code} />
    </ActionDialog>
  )
}

/** One product: versions, the open draft (basic data), brochure reading (ADa), review (ADb), send for approval (ADc). */
export function AdminProduct() {
  const { id } = useParams()
  const q = useQuery(['admin:product', id], () => api.adminCatalogue.product(id))
  const p = q.data
  const draft = p?.versions?.find((v) => ['DRAFT', 'REJECTED'].includes(v.status))
  const ocr = useQuery(['admin:ocr', draft?.id], () => api.adminCatalogue.versionOcr(draft.id), { enabled: !!draft })
  const { act, busy, error } = useAct()
  const [data, setData] = useState(null)
  const d = data ?? draft?.data ?? {}
  const set = (k) => (v) => setData({ ...d, [k]: v })
  const inv = ['admin']
  const read = async (file) => {
    return act(async () => {
      const fileId = (await api.files.upload(file, 'BROCHURE')).data.id
      return api.adminCatalogue.startVersionOcr(draft.id, { fileId })
    }, { invalidates: inv })
  }
  const job = ocr.data
  return (
    <AdminLayout active="catalogue">
      <AdminHeader crumb={'SKYUP ADMIN  /  CATALOGUE'} title={p?.name ?? p?.code ?? 'Product'} titleExtra={p && <Pill tone={p.status === 'ACTIVE' ? 'green' : 'amber'}>{label(p.status)}</Pill>}
        actions={p && <>
          {!draft && <SButton icon="plus" disabled={busy} onClick={() => act(() => api.adminCatalogue.newVersion(p.id, {}), { invalidates: inv })}>New version</SButton>}
          {p.status === 'ACTIVE' && <SButton icon="x" disabled={busy} onClick={() => act(() => api.adminCatalogue.withdraw(p.id, { version: p.version }), { invalidates: inv })}>Withdraw</SButton>}
        </>} />
      {q.error && <ErrorNote error={q.error} />}
      <ErrorNote error={error} />
      {p && (
        <div className="mt-6 flex items-start gap-5">
          <div className="flex flex-1 flex-col gap-5">
            {draft && (
              <ACard><ACardHead title={`Version ${draft.number ?? ''} · ${label(draft.status)}`} subtitle="ADa · read the brochure, ADb · check the values, ADc · publish" />
                <div className="mt-3 flex flex-col gap-3">
                  <label className="flex h-[50px] cursor-pointer items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink"><Icon name="folder" size={16} />Upload brochure (PDF) to read values<input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && read(e.target.files[0])} /></label>
                  {job && (
                    <div className="flex flex-col gap-2 rounded-[16px] bg-panel p-4 text-[13px]">
                      <p className="font-bold text-ink">Brochure reading · {label(job.status)}</p>
                      {job.error && <p className="text-[#b4323c]">{job.error}</p>}
                      {['QUEUED', 'PROCESSING'].includes(job.status) && <SButton disabled={busy} onClick={() => ocr.refetch()}>Refresh</SButton>}
                      {[...(job.details || []), ...(job.rows || []), ...(job.variants || [])].slice(0, 60).map((x) => (
                        <div key={x.key} className={cx('flex items-center gap-2 rounded-[10px] px-2 py-1', x.flagged && 'bg-[#fbf1e1]')}>
                          <span className="w-[200px] text-ink">{x.label ?? x.key}</span><b className="flex-1 truncate text-ink">{String(x.editedValue ?? x.value ?? '—')}</b>
                          <span className="text-muted">{x.confidence != null ? `${Math.round(x.confidence)}%` : ''}{x.page ? ` p${x.page}` : ''}</span>
                          {x.decision ? <Pill tone="green">{label(x.decision)}</Pill> : <>
                            <SButton disabled={busy} onClick={() => act(() => api.adminCatalogue.ocrDecisions(job.id, { decisions: [{ key: x.key, decision: 'ACCEPT' }] }), { invalidates: inv, quiet: true })}>Accept</SButton>
                            <SButton disabled={busy} onClick={() => { const v = window.prompt(`Correct value for ${x.label ?? x.key}`, x.value ?? ''); if (v !== null) act(() => api.adminCatalogue.ocrDecisions(job.id, { decisions: [{ key: x.key, decision: 'EDIT', value: v }] }), { invalidates: inv, quiet: true }) }}>Fix</SButton></>}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        {job.status === 'REVIEW_REQUIRED' && <SButton disabled={busy} onClick={() => act(() => api.adminCatalogue.ocrAcceptHigh(job.id, {}), { invalidates: inv })}>Accept all above {job.threshold}%</SButton>}
                        {['REVIEW_REQUIRED', 'REVIEWED'].includes(job.status) && <SButton variant="navy" disabled={busy} onClick={() => act(() => api.adminCatalogue.ocrApply(job.id, {}), { invalidates: inv })}>Apply to version</SButton>}
                        {job.status === 'FAILED' && <SButton disabled={busy} onClick={() => act(() => api.adminCatalogue.ocrRetry(job.id, {}), { invalidates: inv })}>Retry reading</SButton>}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3"><Field label="Name" value={d.name ?? ''} onChange={set('name')} /><Field label="UIN" value={d.uin ?? ''} onChange={set('uin')} /><Field label="Launch date" value={d.launchDate ?? ''} onChange={set('launchDate')} placeholder="DD-MM-YYYY" /></div>
                  <div className="flex gap-3"><Field label="Adult min age" type="number" value={d.adultMin ?? ''} onChange={set('adultMin')} /><Field label="Adult max age" type="number" value={d.adultMax ?? ''} onChange={set('adultMax')} /><Field label="Tax %" type="number" value={d.taxPercent ?? ''} onChange={set('taxPercent')} /></div>
                  <div className="flex gap-3"><Field label="Sum insured options (₹, comma separated)" value={(d.sumInsured?.options ?? []).join(', ')} onChange={(v) => set('sumInsured')({ ...(d.sumInsured || {}), options: v.split(',').map((x) => Number(x.trim())).filter(Boolean) })} />
                    <Field label="Policy terms (years)" value={(d.policyTerms ?? []).join(', ')} onChange={(v) => set('policyTerms')(v.split(',').map((x) => Number(x.trim())).filter(Boolean))} /></div>
                  <Field label="Pricing" type="select" value={d.pricingMode ?? 'RATE_TABLE'} onChange={set('pricingMode')} options={[{ value: 'RATE_TABLE', label: 'Rate table' }, { value: 'MANUAL_ENTRY', label: 'Typed at quotation' }]} />
                  <div className="flex gap-2">
                    <SButton disabled={busy || !data} onClick={() => act(() => api.adminCatalogue.saveVersion(draft.id, { rev: draft.rev ?? draft.version, data: d }), { invalidates: inv, onDone: () => setData(null) })}>Save</SButton>
                    <SButton variant="navy" icon="send" disabled={busy} onClick={() => act(() => api.adminCatalogue.submitVersion(draft.id, { rev: draft.rev ?? draft.version }), { invalidates: inv })}>Publish</SButton>
                  </div>
                </div>
              </ACard>
            )}
            <ACard><ACardHead title="Versions" /><div className="mt-3 flex flex-col gap-2">{(p.versions || []).map((v) => <Line key={v.id}><span className="flex-1 font-semibold text-ink">Version {v.number}</span><span className="text-muted">{fmtDate(v.createdAt ?? v.approvedAt, { year: false })}</span><Pill tone={v.status === 'PUBLISHED' || v.status === 'ACTIVE' ? 'green' : 'amber'}>{label(v.status)}</Pill></Line>)}</div></ACard>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}