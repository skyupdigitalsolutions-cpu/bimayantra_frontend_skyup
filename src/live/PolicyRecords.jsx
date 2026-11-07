// Batch 7 · Policies on the live API (P-33 to P-35):
//   L1  /policies/:id/issue           record the policy the insurer issued: POST /policies/:id/issue (policy document required)
//   PP2 /customers/:id/policies/new   record a policy bought before Bimayantra: POST /policies/existing
//   PP1 EditNomineesDrawer            nominees as a new version: PUT /policies/:id/nominees (an issued policy needs the
//                                     insurer's endorsement reference and effective date)
// The API checks every rule (dates, duplicates, nominee shares, appointees); these screens only collect and show its answers.
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, Panel, PanelHead } from '../screens/catalogue/_parts'
import { Drawer } from '../screens/flow-payment/_parts'
import { api, invalidate, useQuery } from '../api'
import { fmtDate, fmtMoney } from '../api/format'
import { useToast } from '../components/LiveToast'
import { ErrorNote, Field, dmy, isoDay } from './kit'
import { ErrorPanel, LoadingPanel } from './common'

const FREQ = ['Yearly', 'Half-yearly', 'Quarterly', 'Monthly', 'Single']
const INVALIDATES = ['policy', 'policies', 'renewals', 'dashboard', 'customer', 'customers', 'activity']
const BTN = 'flex h-[48px] items-center justify-center gap-2 rounded-[24px] px-6 text-[14px] font-semibold disabled:opacity-50'

/** End date the insurers use by default: start + 1 year − 1 day (YYYY-MM-DD). */
function defaultEnd(start) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start ?? '')) return ''
  const d = new Date(`${start}T12:00:00Z`)
  d.setUTCFullYear(d.getUTCFullYear() + 1)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

const ageOn = (dob) => {
  if (!dob) return null
  const b = new Date(`${isoDay(dob)}T12:00:00Z`), t = new Date()
  let a = t.getUTCFullYear() - b.getUTCFullYear()
  if (t.getUTCMonth() < b.getUTCMonth() || (t.getUTCMonth() === b.getUTCMonth() && t.getUTCDate() < b.getUTCDate())) a -= 1
  return a
}

/** One run of an API call with its error kept for the form (field errors under each field, the summary below). */
function useRun() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const run = async (fn) => {
    setBusy(true); setError(null)
    try { return await fn() } catch (e) { setError(e); return undefined } finally { setBusy(false) }
  }
  return { busy, error, fe: error?.fieldErrors ?? {}, run, setError }
}

/** Policy document upload (purpose POLICY_DOCUMENT). */
function PolicyDocument({ fileId, name, onChange, error, required }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  return (
    <Panel className="flex flex-col gap-3">
      <PanelHead title="Policy document" subtitle={required ? 'Required · the insurer’s policy schedule (PDF or image)' : 'Optional · the policy schedule, if you have it'} />
      <label className={cx('flex h-[72px] cursor-pointer items-center gap-4 rounded-[20px] border px-4', fileId ? 'border-[#bfe5d4] bg-[#f3faf7]' : 'border-dashed border-line bg-panel', error && 'border-[#b4323c]')}>
        <span className="flex size-10 items-center justify-center rounded-full bg-white"><Icon name={fileId ? 'check' : 'folder'} size={18} className={fileId ? 'text-[#127650]' : 'text-muted'} /></span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-bold text-ink">{busy ? 'Uploading…' : fileId ? name || 'Policy document' : 'Choose the policy document'}</span>
          <span className="text-[12px] font-medium text-muted">{fileId ? 'Uploaded' : 'PDF, JPG or PNG'}</span>
        </span>
        {fileId && <span className="rounded-[16px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink">Replace</span>}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return
          setBusy(true); setErr(null)
          try { onChange((await api.files.upload(f, 'POLICY_DOCUMENT')).data.id, f.name) } catch (x) { setErr(x.message) } finally { setBusy(false) }
        }} />
      </label>
      {(err || error) && <span className="text-[12px] font-semibold text-[#b4323c]">{err || error}</span>}
    </Panel>
  )
}

/** Policy number, dates, frequency, premium and sum insured — shared by L1 and PP2. f uses YYYY-MM-DD dates. */
function PolicyFields({ f, set, fe, paymentDate, quotedSumInsured }) {
  const setStart = (v) => set({ startDate: v, ...(!f.endTouched ? { endDate: defaultEnd(v) } : {}) })
  const siChanged = quotedSumInsured != null && f.sumInsured !== '' && Number(f.sumInsured) !== Number(quotedSumInsured)
  const instalments = !['Yearly', 'Single'].includes(f.frequency)
  return (
    <>
      <div className="flex gap-3">
        <Field label="Insurer policy number *" value={f.policyNumber} onChange={(v) => set({ policyNumber: v })} error={fe.policyNumber} />
        <Field label="Issue date *" type="date" value={f.issueDate} onChange={(v) => set({ issueDate: v })} error={fe.issueDate}
          hint={paymentDate ? `Not before the payment date (${fmtDate(paymentDate, { year: false })}).` : undefined} />
      </div>
      <div className="flex gap-3">
        <Field label="Start date *" type="date" value={f.startDate} onChange={setStart} error={fe.startDate} />
        <Field label="End date *" type="date" value={f.endDate} onChange={(v) => set({ endDate: v, endTouched: true })} error={fe.endDate} hint={!f.endTouched ? 'Start + 1 year − 1 day' : undefined} />
        <Field label="Frequency *" type="select" value={f.frequency} onChange={(v) => set({ frequency: v })} options={FREQ} error={fe.frequency} />
      </div>
      <div className="flex gap-3">
        <Field label="Premium (₹) *" type="number" value={f.premium} onChange={(v) => set({ premium: v })} error={fe.premium} />
        <Field label="Sum insured (₹) *" type="number" value={f.sumInsured} onChange={(v) => set({ sumInsured: v })} error={fe.sumInsured}
          hint={quotedSumInsured != null ? `Quoted: ${fmtMoney(quotedSumInsured)}` : undefined} />
        {instalments && <Field label="Next premium due" type="date" value={f.nextDueDate} onChange={(v) => set({ nextDueDate: v })} error={fe.nextDueDate} />}
      </div>
      {siChanged && <Field label="Why does the sum insured differ from the quotation? *" value={f.sumInsuredReason} onChange={(v) => set({ sumInsuredReason: v })} error={fe.sumInsuredReason} />}
    </>
  )
}

const fieldsBody = (f) => ({
  policyNumber: f.policyNumber.trim(), issueDate: dmy(f.issueDate), startDate: dmy(f.startDate), endDate: dmy(f.endDate), frequency: f.frequency,
  nextDueDate: f.nextDueDate && !['Yearly', 'Single'].includes(f.frequency) ? dmy(f.nextDueDate) : null,
  premium: Number(f.premium), sumInsured: Number(f.sumInsured), sumInsuredReason: f.sumInsuredReason?.trim() || null,
  documentFileId: f.documentFileId || null, notes: f.notes?.trim() || null,
  expectedCommission: f.expectedCommission === '' || f.expectedCommission == null ? null : Number(f.expectedCommission),
})

function CommissionCard({ value, onChange, error }) {
  return (
    <section className="flex flex-col gap-3 rounded-[28px] bg-rail p-6 text-white">
      <div className="flex items-center justify-between"><p className="text-[17px] font-bold">Expected commission</p><span className="flex items-center gap-1 rounded-[12px] bg-white/10 px-2.5 py-1 text-[11px] font-semibold"><Icon name="lock" size={12} />Only you</span></div>
      <span className="flex h-[50px] items-center gap-2 rounded-[16px] bg-white/10 px-4 text-[16px] font-bold">₹
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Optional" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/40" aria-label="Expected commission" />
      </span>
      {error ? <p className="text-[12px] font-semibold text-pink-200">{error}</p> : <p className="text-[12px] font-medium text-[#c9d6ea]">For your own reference. Never shown to the customer.</p>}
    </section>
  )
}

function Footer({ onCancel, onSave, busy, saveLabel = 'Save policy', disabled }) {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-[28px] bg-white p-3 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <button type="button" onClick={onCancel} className={cx(BTN, 'border border-line text-ink')}>Cancel</button>
      <span className="flex-1" />
      <button type="button" disabled={busy || disabled} onClick={onSave} className={cx(BTN, 'bg-navy text-white')}><Icon name="shield" size={16} />{busy ? 'Saving…' : saveLabel}</button>
    </div>
  )
}

/* ═════════════ L1 · Record issued policy ═════════════ */
export function LiveRecordIssuedPolicy() {
  const { id } = useParams()
  const q = useQuery(['policy', id], () => api.policies.get(id))
  if (q.error) return <ErrorPanel active="policies" error={q.error} back="/policies" />
  if (!q.data) return <LoadingPanel active="policies" />
  if (q.data.status !== 'AWAITING_ISSUANCE') return <ErrorPanel active="policies" error={{ message: 'This policy is already recorded. Open it to see or correct its details.' }} back={`/policies/${id}`} />
  return <IssueForm key={q.data.version} p={q.data} />
}

function IssueForm({ p }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const fr = p.frozen ?? {}
  const [f, setF] = useState({
    policyNumber: '', issueDate: '', startDate: '', endDate: '', endTouched: false, frequency: 'Yearly', nextDueDate: '',
    premium: p.premium ?? fr.premium ?? '', sumInsured: p.sumInsured ?? '', sumInsuredReason: '', documentFileId: null, documentName: '', expectedCommission: '',
  })
  const set = (patch) => setF((s) => ({ ...s, ...patch }))
  const { busy, error, fe, run } = useRun()
  const save = () => run(async () => {
    const r = await api.policies.issue(p.id, { version: p.version, ...fieldsBody(f) })
    invalidate(...INVALIDATES)
    toast(r.meta?.message)
    navigate(`/policies/${p.id}`)
  })
  const declared = (fr.declarations ?? []).flatMap((d) => Object.entries(d.answers ?? {}).filter(([, a]) => a?.answer).map(([k, a]) => `${d.member}: ${a.condition || k}`))
  const facts = [
    ['Insured', (p.insured ?? []).map((m) => m.name.split(' ')[0]).join(', ') || '—'],
    ['Nominee', (fr.nominees ?? []).map((n) => `${n.name} · ${n.share}%`).join(', ') || 'None'],
    ['Declared', declared.join('; ') || 'Nothing declared'],
    ['Paid', fr.payment ? `${fmtMoney(fr.payment.amount, { decimals: 2 })} · ${fr.payment.mode} · ${fmtDate(fr.payment.date, { year: false })}` : '—'],
  ]
  return (
    <AppLayout active="policies">
      <Header breadcrumb={`POLICIES  /  ${fr.proposal ?? 'PROPOSAL'}  /  RECORD`} title="Record issued policy"
        titleExtra={<span className="flex items-center gap-1 rounded-[14px] bg-[#efeafd] px-2.5 py-1 text-[12px] font-semibold text-[#5b3fc4]"><Icon name="clock" size={13} />Awaiting issuance</span>}
        subtitle={[p.customer?.name, p.insurer, p.productName, fr.product?.variantName].filter(Boolean).join(' · ')} />
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="From the insurer" subtitle="Copy these from the policy schedule" />
            <PolicyFields f={f} set={set} fe={fe} paymentDate={fr.payment?.date} quotedSumInsured={p.sumInsured} />
          </Panel>
          <PolicyDocument required fileId={f.documentFileId} name={f.documentName} onChange={(fid, n) => set({ documentFileId: fid, documentName: n })} error={fe.documentFileId} />
          <ErrorNote error={error} />
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <CommissionCard value={f.expectedCommission} onChange={(v) => set({ expectedCommission: v })} error={fe.expectedCommission} />
          <Panel className="flex flex-col gap-3">
            <PanelHead title="From the proposal" subtitle={[fr.quotation, fr.proposal].filter(Boolean).join(' · ')} />
            {facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4 text-[13px]"><span className="font-medium text-muted">{k}</span><span className="text-right font-semibold text-ink">{v}</span></div>)}
            <p className="text-[12px] font-medium text-muted">The proposal’s nominees are recorded on the policy. Change them later with Edit nominees.</p>
          </Panel>
        </div>
      </div>
      <Footer onCancel={() => navigate(`/policies/${p.id}`)} onSave={save} busy={busy} disabled={!f.documentFileId} />
    </AppLayout>
  )
}

/* ═════════════ PP2 · Record existing policy ═════════════ */
export function LiveRecordExistingPolicy() {
  const { id } = useParams()
  const c = useQuery(['customer', id], () => api.customers.get(id))
  if (c.error) return <ErrorPanel active="customers" error={c.error} back="/customers" />
  if (!c.data) return <LoadingPanel active="customers" />
  return <ExistingForm c={c.data} />
}

function ExistingForm({ c }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const insurers = useQuery('insurer-catalogue', () => api.myInsurers.catalogue({}))
  const types = useQuery('own-product-types', () => api.myProducts.types())
  const [f, setF] = useState({
    insurerId: '', typeId: '', productId: '', productName: '', insured: [`C:${c.id}`], soldByMe: false,
    policyNumber: '', issueDate: '', startDate: '', endDate: '', endTouched: false, frequency: 'Yearly', nextDueDate: '',
    premium: '', sumInsured: '', documentFileId: null, documentName: '', notes: '',
  })
  const set = (patch) => setF((s) => ({ ...s, ...patch }))
  const products = useQuery(['products', 'existing', f.typeId], () => api.products.list({ typeId: f.typeId }), { enabled: !!f.typeId })
  const productOpts = (products.data ?? []).filter((x) => x.insurerId === f.insurerId)
  const [expired, setExpired] = useState(null) // POL-08: the policy already ended; record it as expired?
  const { busy, error, fe, run, setError } = useRun()
  const people = useMemo(() => [
    { key: `C:${c.id}`, name: c.name, rel: 'Policy holder' },
    ...(c.family ?? []).filter((m) => m.status === 'ACTIVE').map((m) => ({ key: `F:${m.id}`, name: m.name, rel: m.relationship })),
  ], [c])
  const toggle = (k) => set({ insured: f.insured.includes(k) ? f.insured.filter((x) => x !== k) : [...f.insured, k] })

  const save = (confirmExpired = false) => run(async () => {
    try {
      const r = await api.policies.recordExisting({
        ...fieldsBody(f), customerId: c.id, insurerId: f.insurerId, typeId: f.typeId, productId: f.productId || null,
        productName: f.productId ? null : f.productName.trim() || null, soldByMe: f.soldByMe, insured: f.insured, ...(confirmExpired ? { confirmExpired: true } : {}),
      })
      invalidate(...INVALIDATES)
      toast(r.meta?.message)
      navigate(`/policies/${r.data.id}`)
    } catch (e) {
      if (e.code === 'CONFIRMATION_REQUIRED') { setExpired(e); return }
      throw e
    }
  })
  const ready = f.insurerId && f.typeId && (f.productId || f.productName.trim()) && f.insured.length && f.policyNumber.trim() && f.issueDate && f.startDate && f.endDate && f.premium !== '' && f.sumInsured !== ''

  return (
    <AppLayout active="customers">
      <Header breadcrumb={`POLICY HOLDERS  /  ${c.name.toUpperCase()}  /  EXISTING POLICY`} title="Record existing policy" subtitle={`${c.name} · a policy bought before Bimayantra`} />
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Policy details" subtitle="Copy from the policy schedule" />
            <div className="flex gap-3">
              <Field label="Insurer *" type="select" value={f.insurerId} onChange={(v) => set({ insurerId: v, productId: '' })} error={fe.insurerId}
                options={[{ value: '', label: insurers.loading ? 'Loading…' : 'Choose an insurer' }, ...(insurers.data ?? []).map((i) => ({ value: i.id, label: i.name }))]} />
              <Field label="Insurance type *" type="select" value={f.typeId} onChange={(v) => set({ typeId: v, productId: '' })} error={fe.typeId}
                options={[{ value: '', label: types.loading ? 'Loading…' : 'Choose a type' }, ...(types.data ?? []).map((t) => ({ value: t.id, label: t.name }))]} />
            </div>
            <div className="flex gap-3">
              <Field label="Product *" type="select" value={f.productId} onChange={(v) => set({ productId: v })} error={fe.productId} disabled={!f.insurerId || !f.typeId}
                options={[{ value: '', label: productOpts.length ? 'Not in the list · type its name' : 'Type the product name' }, ...productOpts.map((x) => ({ value: x.id, label: x.name }))]} />
              {!f.productId && <Field label="Product name *" value={f.productName} onChange={(v) => set({ productName: v })} error={fe.productName} placeholder="As on the policy" />}
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-ink">Insured people *</span>
              <div className="flex flex-wrap gap-2">{people.map((x) => {
                const on = f.insured.includes(x.key)
                return <button key={x.key} type="button" onClick={() => toggle(x.key)} className={cx('flex h-[40px] items-center gap-2 rounded-[20px] border px-4 text-[13px] font-semibold', on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink')}>{on && <Icon name="check" size={13} />}{x.name}<span className={on ? 'text-white/70' : 'text-muted'}>· {x.rel}</span></button>
              })}</div>
              {fe.insured && <span className="text-[12px] font-semibold text-[#b4323c]">{fe.insured}</span>}
            </div>
            <PolicyFields f={f} set={set} fe={fe} />
            <Field type="checkbox" label="I sold this policy (it counts in my business reports)" value={f.soldByMe} onChange={(v) => set({ soldByMe: v })} />
          </Panel>
          <PolicyDocument fileId={f.documentFileId} name={f.documentName} onChange={(fid, n) => set({ documentFileId: fid, documentName: n })} error={fe.documentFileId} />
          {expired ? (
            <div className="flex items-center gap-3 rounded-[20px] bg-[#fbf1e1] px-4 py-3 text-[13px] font-semibold text-[#8a5a12]">
              <Icon name="alert" size={18} /><span className="flex-1">{expired.message}</span>
              <button type="button" onClick={() => { setExpired(null); setError(null) }} className="h-9 rounded-[18px] border border-line bg-white px-3.5 text-ink">Change dates</button>
              <button type="button" disabled={busy} onClick={() => { setExpired(null); save(true) }} className="h-9 rounded-[18px] bg-navy px-3.5 text-white">Record as expired</button>
            </div>
          ) : <ErrorNote error={error} />}
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <section className="flex flex-col gap-2 rounded-[28px] bg-linear-to-b from-[#fde7d2] to-[#f9d6b5] p-6">
            <p className="text-[16px] font-bold text-ink">Renewal tracking starts</p>
            <p className="text-[13px] font-medium text-[#8a5a12]">{f.endDate ? `A renewal cycle is created for ${fmtDate(f.nextDueDate && !['Yearly', 'Single'].includes(f.frequency) ? f.nextDueDate : f.endDate)} when you save.` : 'A renewal cycle is created from the end date when you save.'}</p>
          </section>
        </div>
      </div>
      <Footer onCancel={() => navigate(`/customers/${c.id}/policies`)} onSave={() => save(false)} busy={busy} disabled={!ready} />
    </AppLayout>
  )
}

/* ═════════════ PP1 · Edit policy nominees (a new version) ═════════════ */
const OTHER = '__other'
const blankRow = (share = '') => ({ who: '', name: '', relationship: '', dob: '', share, apWho: '', apName: '', apRelationship: '', apDob: '' })

export function EditNomineesDrawer({ policy, onClose }) {
  const customer = useQuery(['customer', policy.customerId ?? policy.customer?.id], () => api.customers.get(policy.customerId ?? policy.customer?.id))
  const family = (customer.data?.family ?? []).filter((m) => m.status === 'ACTIVE')
  const issued = policy.status === 'ISSUED'
  const nextVersion = (policy.nomineeVersions?.[0]?.number ?? 0) + 1
  const [rows, setRows] = useState(() => {
    const cur = policy.nominees ?? []
    if (!cur.length) return [blankRow(100)]
    return cur.map((n) => ({
      who: n.personKey ?? OTHER, name: n.name, relationship: n.relationship, dob: isoDay(n.dob), share: n.share,
      apWho: n.appointee ? OTHER : '', apName: n.appointee?.name ?? '', apRelationship: n.appointee?.relationship ?? '', apDob: isoDay(n.appointee?.dob),
    }))
  })
  const [endorsementRef, setRef] = useState('')
  const [effectiveDate, setEff] = useState('')
  const { toast } = useToast()
  const { busy, error, fe, run } = useRun()
  const put = (i, patch) => setRows((s) => s.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const member = (key) => family.find((m) => `F:${m.id}` === key)
  const resolved = rows.map((r) => {
    const m = member(r.who)
    const base = m ? { personKey: r.who, name: m.name, relationship: m.relationship, dob: isoDay(m.dob) } : { personKey: null, name: r.name.trim(), relationship: r.relationship.trim(), dob: r.dob }
    const ap = member(r.apWho)
    return { ...base, share: Number(r.share) || 0, age: ageOn(base.dob), appointee: ap ? { name: ap.name, relationship: ap.relationship, dob: isoDay(ap.dob) } : r.apWho === OTHER || r.apName ? { name: r.apName.trim(), relationship: r.apRelationship.trim(), dob: r.apDob } : null }
  })
  const total = resolved.reduce((t, n) => t + n.share, 0)
  const save = () => run(async () => {
    const r = await api.policies.setNominees(policy.id, {
      nominees: resolved.map((n) => ({ personKey: n.personKey, name: n.name, relationship: n.relationship, dob: dmy(n.dob), share: n.share, appointee: n.age != null && n.age < 18 && n.appointee ? { ...n.appointee, dob: dmy(n.appointee.dob) } : null })),
      ...(issued ? { endorsementRef: endorsementRef.trim(), effectiveDate: dmy(effectiveDate) } : {}),
    })
    invalidate(...INVALIDATES)
    toast(r.meta?.message)
    onClose()
  })
  const whoOptions = [{ value: '', label: 'Choose' }, ...family.map((m) => ({ value: `F:${m.id}`, label: `${m.name} · ${m.relationship}` })), { value: OTHER, label: 'Someone else' }]
  const adults = family.filter((m) => (ageOn(m.dob) ?? 0) >= 18)
  const footer = (
    <>
      <button type="button" onClick={onClose} className={cx(BTN, 'flex-1 border border-line text-ink')}>Cancel</button>
      <button type="button" disabled={busy || !rows.length || (issued && (!endorsementRef.trim() || !effectiveDate))} onClick={save} className={cx(BTN, 'flex-1 bg-navy text-white')}><Icon name="check" size={16} />{busy ? 'Saving…' : `Save as version ${nextVersion}`}</button>
    </>
  )
  return (
    <Drawer title="Edit nominees" subtitle={[policy.productName, policy.policyNumber].filter(Boolean).join(' · ')} onClose={onClose} footer={footer}>
      <div className="flex max-h-[calc(100vh-260px)] flex-col gap-4 overflow-y-auto pr-1">
        {issued && <p className="flex items-start gap-2 rounded-[16px] bg-[#fdf1dc] px-4 py-3 text-[13px] font-semibold text-[#9a5b0b]"><Icon name="alert" size={16} className="mt-px shrink-0" />Change nominees on the insurer side first, then record the endorsement here.</p>}
        <div className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
          {rows.map((r, i) => {
            const n = resolved[i]
            const minor = n.age != null && n.age < 18
            return (
              <div key={i} className="flex flex-col gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <div className="flex items-end gap-3">
                  <Field label="Nominee *" type="select" value={r.who} onChange={(v) => put(i, { who: v })} options={whoOptions} error={fe[`nominees.${i}.name`]} />
                  <Field label="Share % *" type="number" className="max-w-[110px]" value={r.share} onChange={(v) => put(i, { share: v })} error={fe[`nominees.${i}.share`]} />
                  {rows.length > 1 && <button type="button" aria-label="Remove nominee" onClick={() => setRows((s) => s.filter((_, j) => j !== i))} className="mb-3 text-muted hover:text-[#b4323c]"><Icon name="x" size={16} /></button>}
                </div>
                {r.who === OTHER && (
                  <div className="flex gap-3">
                    <Field label="Name *" value={r.name} onChange={(v) => put(i, { name: v })} />
                    <Field label="Relationship *" value={r.relationship} onChange={(v) => put(i, { relationship: v })} />
                    <Field label="Date of birth *" type="date" value={r.dob} onChange={(v) => put(i, { dob: v })} />
                  </div>
                )}
                {minor && (
                  <div className="flex flex-col gap-3">
                    <Field label={`Appointee for ${n.name.split(' ')[0] || 'this nominee'} (under 18) *`} type="select" value={r.apWho} onChange={(v) => put(i, { apWho: v })} error={fe[`nominees.${i}.appointee`]}
                      options={[{ value: '', label: 'Choose' }, ...adults.map((m) => ({ value: `F:${m.id}`, label: `${m.name} · ${m.relationship}` })), { value: OTHER, label: 'Someone else' }]} />
                    {r.apWho === OTHER && (
                      <div className="flex gap-3">
                        <Field label="Appointee name *" value={r.apName} onChange={(v) => put(i, { apName: v })} />
                        <Field label="Relationship *" value={r.apRelationship} onChange={(v) => put(i, { apRelationship: v })} />
                        <Field label="Date of birth *" type="date" value={r.apDob} onChange={(v) => put(i, { apDob: v })} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <button type="button" onClick={() => setRows((s) => [...s, blankRow()])} className="flex h-[38px] items-center gap-2 self-start rounded-[20px] border border-line bg-white px-4 text-[13px] font-semibold text-ink"><Icon name="plus" size={14} />Add nominee</button>
        </div>
        <p className={cx('flex items-center gap-2 rounded-[16px] px-4 py-3 text-[13px] font-semibold', total === 100 ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbebec] text-[#b4323c]')}>
          <Icon name={total === 100 ? 'check' : 'alert'} size={16} />Shares total {total}%{total !== 100 ? ' · they must add up to 100%' : ''}
        </p>
        {issued && (
          <div className="flex gap-3">
            <Field label="Endorsement reference *" value={endorsementRef} onChange={setRef} error={fe.endorsementRef} />
            <Field label="Effective from *" type="date" value={effectiveDate} onChange={setEff} error={fe.effectiveDate} />
          </div>
        )}
        <ErrorNote error={error} />
      </div>
    </Drawer>
  )
}
