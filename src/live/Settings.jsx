// Settings (16, 17, S03–S11) on the live API. Each page keeps the Figma shell: left settings nav + 900px column.
import { useState } from 'react'
import { SettingsLayout, SCard, SHead, SChip, SNote } from '../screens/settings/_parts'
import { SmallButton, StatusChip } from '../screens/catalogue/_parts'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, useQuery } from '../api'
import { fmtDate, fmtDateTime, fmtMobile, fmtMoney, cleanMobile } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { ActionDialog, Field, ErrorNote, useAct, label, dmy, isoDay } from './kit'
import { openCheckout } from './razorpay'

const Row = ({ k, v }) => <div className="flex flex-col gap-1"><p className="text-[12px] font-medium text-muted">{k}</p><p className="text-[14px] font-semibold text-ink">{v || '—'}</p></div>
const Loading = ({ q }) => (q.error ? <ErrorNote error={q.error} /> : q.loading && !q.data ? <SCard><p className="text-[13px] font-medium text-muted">Loading…</p></SCard> : null)

/** Upload a file (POST /files) and return its id. */
async function uploadFile(file, purpose) {
  const r = await api.files.upload(file, purpose)
  return r.data.id
}
function FilePick({ label: lbl, purpose, value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink">{lbl}</span>
      <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink">
        <Icon name={value ? 'check' : 'folder'} size={16} className={value ? 'text-[#127650]' : 'text-muted'} />
        <span className="flex-1 truncate">{busy ? 'Uploading…' : value ? 'File attached' : 'Choose a file (PDF, JPG, PNG)'}</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return
          setBusy(true); setErr(null)
          try { onChange(await uploadFile(f, purpose)) } catch (x) { setErr(x.message) } finally { setBusy(false) }
        }} />
      </span>
      {err && <span className="text-[12px] font-medium text-[#b4323c]">{err}</span>}
    </label>
  )
}

/* ═════════════ 16 · Profile ═════════════ */
const SECTION_TITLE = { personal: 'Personal', contact: 'Contact and address', professional: 'Professional', business: 'Business (shown on quotations)' }

export function LiveProfile() {
  const q = useQuery('profile', () => api.profile.get())
  const [edit, setEdit] = useState(null)
  const P = q.data
  const S = P?.sections
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY PROFILE" title="My profile" subtitle="Saved section by section. Your quotations use these details."
      titleExtra={P && <SChip tone={P.completion.percent === 100 ? 'green' : 'amber'}>{P.completion.percent}% complete</SChip>}>
      <Loading q={q} />
      {P?.completion?.message && <SNote>{P.completion.message}</SNote>}
      {P?.licence?.message && <SNote>{P.licence.message}</SNote>}
      {S && Object.keys(SECTION_TITLE).map((key) => {
        const s = S[key]
        const rows = {
          personal: [['Full name', s.fullName], ['Date of birth', s.dob ? fmtDate(isoDay(s.dob)) : null], ['Gender', label(s.gender)]],
          contact: [['Login mobile', fmtMobile(s.loginMobile)], ['Email', s.email], ['Alternate mobile', s.altMobile && fmtMobile(s.altMobile)], ['Address', [s.address1, s.address2, s.city, s.state, s.pin].filter(Boolean).join(', ')]],
          professional: [['Advisor type', s.advisorType], ['Licence number', s.licenceNumber], ['Valid until', s.licenceValidUntil ? fmtDate(isoDay(s.licenceValidUntil)) : null], ['Experience', s.experienceYears != null ? `${s.experienceYears} years` : null], ['Categories', s.categories?.join(', ')]],
          business: [['Name on quotations', s.effectiveDisplayName], ['GSTIN', s.gstin]],
        }[key]
        return (
          <SCard key={key}>
            <SHead title={SECTION_TITLE[key]} subtitle={s.savedAt ? `Saved ${fmtDate(s.savedAt)}` : 'Not saved yet'} right={<SmallButton variant="outline" icon="edit" onClick={() => setEdit(key)}>Edit</SmallButton>} />
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">{rows.map(([k, v]) => <Row key={k} k={k} v={v} />)}</div>
          </SCard>
        )
      })}
      {edit && <ProfileDialog section={edit} s={S[edit]} options={P.options} onClose={() => setEdit(null)} />}
    </SettingsLayout>
  )
}

function ProfileDialog({ section, s, options, onClose }) {
  const init = {
    personal: { fullName: s.fullName ?? '', dob: isoDay(s.dob), gender: s.gender ?? '' },
    contact: { email: s.email ?? '', altMobile: s.altMobile ?? '', address1: s.address1 ?? '', address2: s.address2 ?? '', city: s.city ?? '', state: s.state ?? '', pin: s.pin ?? '' },
    professional: { advisorType: s.advisorType ?? '', licenceNumber: s.licenceNumber ?? '', licenceValidUntil: isoDay(s.licenceValidUntil), experienceYears: s.experienceYears ?? '', categories: s.categories ?? [] },
    business: { displayName: s.displayName ?? '', gstin: s.gstin ?? '' },
  }[section]
  const [f, setF] = useState(init)
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const body = () => {
    const b = { version: s.version }
    for (const [k, v] of Object.entries(f)) {
      if (k === 'dob' || k === 'licenceValidUntil') b[k] = v ? dmy(v) : null
      else if (k === 'altMobile') b[k] = cleanMobile(v) || null
      else if (k === 'experienceYears') b[k] = v === '' ? null : Number(v)
      else if (k === 'categories') b[k] = v
      else b[k] = v === '' ? null : v
    }
    if (section === 'personal' && !b.fullName) delete b.fullName
    return b
  }
  const save = () => act(() => api.profile.updateSection(section, body()), { invalidates: ['profile', 'dashboard'], onDone: onClose, quiet: true })
  const F = (k, lbl, extra = {}) => <Field key={k} label={lbl} value={f[k]} onChange={set(k)} error={fe[k]} {...extra} />
  return (
    <ActionDialog title={`Edit ${SECTION_TITLE[section].toLowerCase()}`} confirm="Save section" busy={busy} error={error} onConfirm={save} onClose={onClose} width={640}>
      {section === 'personal' && <>{F('fullName', 'Full name *')}<div className="flex gap-3">{F('dob', 'Date of birth', { type: 'date' })}{F('gender', 'Gender', { type: 'select', options: ['', ...(options?.genders ?? [])].map((g) => ({ value: g, label: g ? label(g) : 'Not given' })) })}</div></>}
      {section === 'contact' && <><div className="flex gap-3">{F('email', 'Email')}{F('altMobile', 'Alternate mobile')}</div>{F('address1', 'Address line 1')}{F('address2', 'Address line 2')}<div className="flex gap-3">{F('city', 'City')}{F('state', 'State')}{F('pin', 'PIN code')}</div></>}
      {section === 'professional' && <>
        <div className="flex gap-3">{F('advisorType', 'Advisor type', { type: 'select', options: ['', ...(options?.advisorTypes ?? [])].map((g) => ({ value: g, label: g || 'Choose' })) })}{F('experienceYears', 'Experience (years)', { type: 'number' })}</div>
        <div className="flex gap-3">{F('licenceNumber', 'IRDAI licence or POSP certificate number')}{F('licenceValidUntil', 'Valid until', { type: 'date' })}</div>
        <div className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-ink">Authorised insurance categories</span>
          <div className="flex flex-wrap gap-2">{(options?.categories ?? []).map((c) => {
            const on = f.categories.includes(c)
            return <button key={c} type="button" onClick={() => set('categories')(on ? f.categories.filter((x) => x !== c) : [...f.categories, c])} className={cx('h-[34px] rounded-[18px] border px-3.5 text-[13px] font-semibold', on ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-muted')}>{c}</button>
          })}</div>{fe.categories && <span className="text-[12px] text-[#b4323c]">{fe.categories}</span>}</div>
      </>}
      {section === 'business' && <>{F('displayName', 'Name shown on quotations')}{F('gstin', 'GSTIN')}</>}
    </ActionDialog>
  )
}

/* ═════════════ S03 · KYC ═════════════ */
const KYC_TONE = { NOT_SUBMITTED: 'gray', PENDING_REVIEW: 'amber', VERIFIED: 'green', REJECTED: 'red' }
export function LiveKyc() {
  const q = useQuery('kyc', () => api.kyc.get())
  const [f, setF] = useState(null)
  const k = q.data
  const form = f ?? { pan: k?.pan ?? '', nameOnPan: k?.nameOnPan ?? '', panFileId: k?.panFile?.id ?? null, licenceFileId: k?.licenceFile?.id ?? null, declaration: false }
  const set = (key) => (v) => setF({ ...form, [key]: v })
  const { act, busy, error, fieldErrors: fe } = useAct()
  // Editing VERIFIED KYC asks for a confirmation (PRF-07): the second click sends it.
  const confirm = error?.code === 'CONFIRMATION_REQUIRED' ? [error.messageId] : []
  const submit = () => act(() => api.kyc.submit({ version: k.version, pan: form.pan.toUpperCase(), nameOnPan: form.nameOnPan, panFileId: form.panFileId, licenceFileId: form.licenceFileId, declaration: form.declaration, confirm }), {
    invalidates: ['kyc', 'profile'], quiet: true, onDone: () => setF(null),
  })
  const locked = k?.status === 'PENDING_REVIEW'
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  KYC" title="KYC" subtitle="SkyUp verifies your PAN and licence before you can share quotations."
      titleExtra={k && <SChip tone={KYC_TONE[k.status]}>{label(k.status)}</SChip>}>
      <Loading q={q} />
      {k?.message && <SNote icon="clock">{k.message}</SNote>}
      {k?.rejection && <SNote>{k.rejection.message}</SNote>}
      {k && (
        <SCard>
          <SHead title="Your documents" subtitle={k.submittedAt ? `Submitted ${fmtDateTime(k.submittedAt)}` : 'Not submitted yet'} />
          <div className="flex gap-3"><Field label="PAN *" value={form.pan} onChange={set('pan')} error={fe.pan} disabled={locked} /><Field label="Name on PAN *" value={form.nameOnPan} onChange={set('nameOnPan')} error={fe.nameOnPan} disabled={locked} /></div>
          {!locked && <div className="flex gap-3"><FilePick label="PAN card *" purpose="KYC_PAN" value={form.panFileId} onChange={set('panFileId')} /><FilePick label="Licence or POSP certificate *" purpose="KYC_LICENCE" value={form.licenceFileId} onChange={set('licenceFileId')} /></div>}
          {!locked && <Field type="checkbox" label="I declare these documents are mine and true." value={form.declaration} onChange={set('declaration')} />}
          {error && <ErrorNote error={error} />}
          {!locked && <SmallButton variant="navy" icon="send" className="self-start" disabled={busy} onClick={submit}>{confirm.length ? 'Confirm and submit' : k.status === 'VERIFIED' ? 'Submit changes for review' : 'Submit for review'}</SmallButton>}
        </SCard>
      )}
    </SettingsLayout>
  )
}

/* ═════════════ S04 · My insurers ═════════════ */
export function LiveInsurers() {
  const q = useQuery('my-insurers', () => api.myInsurers.list())
  const [dlg, setDlg] = useState(null)
  const { act } = useAct()
  const rows = q.data || []
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY INSURERS" title="My insurers" subtitle="Your agent code with each insurer. You can quote only insurers listed here."
      actions={<SmallButton variant="navy" icon="plus" onClick={() => setDlg({ add: true })}>Add insurer</SmallButton>}>
      <Loading q={q} />
      {rows.map((m) => (
        <SCard key={m.id}>
          <SHead title={m.insurer?.name ?? '—'} subtitle={`${m.insurer?.category ?? ''} · Agent code ${m.agentCode}${m.validUntil ? ` · valid until ${fmtDate(isoDay(m.validUntil))}` : ''}`}
            right={<div className="flex items-center gap-2"><SChip tone={m.status === 'ACTIVE' ? 'green' : 'gray'}>{label(m.status)}</SChip>
              <SmallButton variant="outline" icon="edit" onClick={() => setDlg({ m })}>Edit</SmallButton>
              {m.status === 'ACTIVE'
                ? <SmallButton variant="danger" onClick={() => setDlg({ deact: m })}>Deactivate</SmallButton>
                : <SmallButton variant="outline" onClick={() => act(() => api.myInsurers.activate(m.id, { version: m.version }), { invalidates: ['my-insurers', 'products'] })}>Activate</SmallButton>}
            </div>} />
          {(m.warnings || []).map((w) => <SNote key={w.messageId}>{w.message}</SNote>)}
        </SCard>
      ))}
      {!q.loading && rows.length === 0 && <SCard><p className="text-[13px] font-medium text-muted">No insurers yet. Add the insurers you hold an agent code with.</p></SCard>}
      {dlg && !dlg.deact && <InsurerDialog m={dlg.m} onClose={() => setDlg(null)} />}
      {dlg?.deact && (
        <ActionDialog title={`Deactivate ${dlg.deact.insurer?.name}?`} body="You will not be able to create new quotations for this insurer. Existing quotations and policies stay as they are." icon="x" tone="danger" confirm="Deactivate"
          onConfirm={() => act(() => api.myInsurers.deactivate(dlg.deact.id, { version: dlg.deact.version, confirm: ['PRF-12'] }), { invalidates: ['my-insurers', 'products'], onDone: () => setDlg(null) })} onClose={() => setDlg(null)} />
      )}
    </SettingsLayout>
  )
}
function InsurerDialog({ m, onClose }) {
  const avail = useQuery('my-insurers:available', () => api.myInsurers.available(), { enabled: !m })
  const opts = (avail.data || []).map((i) => ({ value: i.id, label: i.name }))
  const [f, setF] = useState({ insurerId: '', agentCode: m?.agentCode ?? '', validUntil: isoDay(m?.validUntil), appointmentLetterFileId: null, declaration: false })
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => (m
    ? api.myInsurers.update(m.id, { version: m.version, agentCode: f.agentCode, validUntil: f.validUntil ? dmy(f.validUntil) : null, ...(f.appointmentLetterFileId ? { appointmentLetterFileId: f.appointmentLetterFileId } : {}) })
    : api.myInsurers.add({ insurerId: f.insurerId || opts[0]?.value, agentCode: f.agentCode, validUntil: f.validUntil ? dmy(f.validUntil) : null, appointmentLetterFileId: f.appointmentLetterFileId, declaration: f.declaration })),
  { invalidates: ['my-insurers', 'products', 'profile'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title={m ? `Edit ${m.insurer?.name}` : 'Add insurer'} confirm="Save" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      {!m && <Field label="Insurer *" type="select" value={f.insurerId || opts[0]?.value} onChange={set('insurerId')} options={opts} error={fe.insurerId} />}
      <div className="flex gap-3"><Field label="Agent code *" value={f.agentCode} onChange={set('agentCode')} error={fe.agentCode} /><Field label="Valid until" type="date" value={f.validUntil} onChange={set('validUntil')} error={fe.validUntil} /></div>
      <FilePick label="Appointment letter" purpose="APPOINTMENT_LETTER" value={f.appointmentLetterFileId} onChange={set('appointmentLetterFileId')} />
      {!m && <Field type="checkbox" label="I hold this agent code and may sell this insurer's products." value={f.declaration} onChange={set('declaration')} />}
    </ActionDialog>
  )
}

/* ═════════════ 17 · Plan and billing ═════════════ */
export function LiveBilling() {
  const q = useQuery('billing', () => api.billing.get())
  const { user } = useAuth()
  const [cycle, setCycle] = useState('YEARLY')
  const { act, busy, error } = useAct()
  const b = q.data
  // Razorpay: create the order, open Checkout, then the API verifies the signature and activates the plan
  const buy = (plan) => act(async () => {
    const o = (await api.billing.createOrder({ plan, cycle })).data
    if (o.gateway !== 'razorpay') throw new Error('Online payments are in test mode on this server.')
    const paid = await openCheckout(o, { name: user?.name, contact: user?.mobile })
    if (!paid) return { meta: { message: 'Payment cancelled. Nothing was charged.' } }
    const v = await api.billing.verifyOrder(o.orderId, paid)
    return { meta: { message: v.data.message } }
  }, {
    invalidates: ['billing', 'profile'], quiet: true,
  })
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY PLAN AND BILLING" title="My plan and billing" subtitle="Prices include GST where shown.">
      <Loading q={q} />
      {b && (
        <>
          <SCard>
            <SHead title={`${label(b.plan ?? 'Trial')} plan`} subtitle={`${label(b.status)}${b.cycle ? ` · ${label(b.cycle)}` : ''} · until ${fmtDate(isoDay(b.endsAt))}${b.nextPlan ? ` · moves to ${label(b.nextPlan)} next` : ''}`}
              right={<SChip tone={b.status === 'ACTIVE' ? 'green' : b.status === 'TRIAL' ? 'blue' : 'amber'}>{label(b.status)}</SChip>} />
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-ink">Billing cycle</span>
              {['MONTHLY', 'YEARLY'].map((c) => <button key={c} type="button" onClick={() => setCycle(c)} className={cx('h-9 rounded-[18px] px-3.5 text-[13px] font-semibold', cycle === c ? 'bg-navy text-white' : 'border border-line bg-white text-ink')}>{label(c)}</button>)}
            </div>
            <div className="flex gap-4">
              {['NORMAL', 'PREMIUM'].map((plan) => (
                <div key={plan} className={cx('flex flex-1 flex-col gap-2 rounded-[22px] p-5', plan === 'PREMIUM' ? 'bg-rail text-white' : 'bg-panel text-ink')}>
                  <p className="text-[16px] font-bold">{label(plan)}</p>
                  <p className="text-[26px] font-bold">{fmtMoney(b.prices?.[plan]?.[cycle])}<span className="text-[13px] font-medium opacity-70"> / {cycle === 'YEARLY' ? 'year' : 'month'} + {b.gstPercent}% GST</span></p>
                  <SmallButton variant={plan === 'PREMIUM' ? 'pink' : 'navy'} className="self-start" disabled={busy} onClick={() => buy(plan)}>{b.plan === plan && b.status === 'ACTIVE' ? 'Renew' : `Choose ${label(plan)}`}</SmallButton>
                </div>
              ))}
            </div>
            <ErrorNote error={error} />
            {b.plan === 'PREMIUM' && !b.nextPlan && <SmallButton variant="outline" className="self-start" onClick={() => act(() => api.billing.downgrade({ confirm: true }), { invalidates: ['billing'] })}>Move to Normal at renewal</SmallButton>}
          </SCard>
          <SCard>
            <SHead title="Invoices" subtitle={`${b.invoices.length} paid`} />
            {b.invoices.map((i) => (
              <div key={i.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
                <span className="w-[160px] font-bold text-ink">{i.invoiceNumber ?? '—'}</span>
                <span className="flex-1 font-medium text-muted">{label(i.plan)} · {label(i.cycle)} · {i.period}</span>
                <span className="font-semibold text-ink">{fmtMoney(i.total, { decimals: 2 })}</span>
              </div>
            ))}
            {!b.invoices.length && <p className="text-[13px] font-medium text-muted">No invoices yet.</p>}
          </SCard>
        </>
      )}
    </SettingsLayout>
  )
}

/* ═════════════ S05 · WhatsApp wallet + greetings ═════════════ */
export function LiveWallet() {
  const q = useQuery('wallet', () => api.wallet.get())
  const g = useQuery('greetings', () => api.greetings.get())
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const { act, busy, error } = useAct()
  const w = q.data
  const recharge = () => act(async () => {
    const o = (await api.wallet.recharge({ amount: Number(amount) })).data
    if (o.gateway !== 'razorpay') throw new Error('Online payments are in test mode on this server.')
    const paid = await openCheckout(o, { name: user?.name, contact: user?.mobile })
    if (!paid) return { meta: { message: 'Payment cancelled. Nothing was charged.' } }
    await api.wallet.verifyRecharge(o.orderId, paid)
    return { meta: { message: `Wallet recharged with ₹${o.amount}.` } }
  }, {
    invalidates: ['wallet'], quiet: true, onDone: () => setAmount(''),
  })
  const toggleGreetings = () => act(() => api.greetings.save({ on: !g.data.on, templates: g.data.templates ?? {}, excluded: g.data.excluded ?? [] }), { invalidates: ['greetings'] })
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  WHATSAPP WALLET" title="WhatsApp wallet" subtitle="Prepaid credit for messages from your dedicated WhatsApp number.">
      <Loading q={q} />
      {w && (
        <>
          <SCard>
            <SHead title="Balance" subtitle={`${fmtMoney(w.pricePerMessage, { decimals: 2 })} per message · minimum recharge ${fmtMoney(w.minimumRecharge)}`} right={<p className="text-[26px] font-bold text-ink">{fmtMoney(w.balance, { decimals: 2 })}</p>} />
            {w.balance < w.lowBalanceBelow && <SNote>Balance is low. Messages stop when it reaches zero.</SNote>}
            <div className="flex items-end gap-3"><Field label="Recharge amount (₹)" type="number" value={amount} onChange={setAmount} /><SmallButton variant="navy" icon="wallet" disabled={busy || !amount} onClick={recharge} className="mb-[7px]">Recharge</SmallButton></div>
            <ErrorNote error={error} />
          </SCard>
          {g.data?.available === false && <SNote>{g.data.message}</SNote>}
          {g.data && g.data.available !== false && (
            <SCard>
              <SHead title="Occasion greetings" subtitle="Birthdays and anniversaries, only to people with consent." right={<SmallButton variant={g.data.on ? 'outline' : 'navy'} onClick={toggleGreetings}>{g.data.on ? 'Turn off' : 'Turn on'}</SmallButton>} />
            </SCard>
          )}
          <SCard>
            <SHead title="Transactions" />
            {w.transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
                <span className="flex-1 font-semibold text-ink">{label(t.type)}{t.reason ? ` · ${t.reason}` : ''}</span>
                <span className="font-medium text-muted">{fmtDateTime(t.at)}</span>
                <span className={cx('w-[110px] text-right font-bold', t.amount < 0 ? 'text-[#b4323c]' : 'text-[#127650]')}>{fmtMoney(t.amount, { decimals: 2 })}</span>
                <SChip tone={t.status === 'SUCCESS' || t.status === 'DONE' ? 'green' : t.status === 'FAILED' ? 'red' : 'amber'}>{label(t.status)}</SChip>
              </div>
            ))}
            {!w.transactions.length && <p className="text-[13px] font-medium text-muted">No transactions yet.</p>}
          </SCard>
        </>
      )}
    </SettingsLayout>
  )
}

/* ═════════════ S06 · Assistants ═════════════ */
export function LiveAssistants() {
  const q = useQuery('assistants', () => api.assistants.list())
  const [add, setAdd] = useState(false)
  const { act } = useAct()
  const d = q.data
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  ASSISTANTS" title="Assistants" subtitle="People who work in your account. They cannot mark leads lost, see commissions or change settings."
      actions={d?.planAllows && <SmallButton variant="navy" icon="plus" onClick={() => setAdd(true)}>Add assistant</SmallButton>}>
      <Loading q={q} />
      {d && !d.planAllows && <SNote>Assistants are part of the Premium plan.</SNote>}
      {d?.items.map((a) => (
        <SCard key={a.id}>
          <SHead title={a.name} subtitle={`${fmtMobile(a.mobile)} · ${a.lastLoginAt ? `last signed in ${fmtDateTime(a.lastLoginAt)}` : 'not signed in yet'}`}
            right={<div className="flex items-center gap-2"><SChip tone={a.status === 'ACTIVE' ? 'green' : a.status === 'INVITED' ? 'blue' : 'gray'}>{label(a.status)}</SChip>
              {a.status !== 'DISABLED'
                ? <SmallButton variant="danger" onClick={() => act(() => api.assistants.disable(a.id, { version: a.version }), { invalidates: ['assistants'] })}>Disable</SmallButton>
                : <SmallButton variant="outline" onClick={() => act(() => api.assistants.enable(a.id, { version: a.version }), { invalidates: ['assistants'] })}>Enable</SmallButton>}</div>} />
          {a.recentActions?.slice(0, 3).map((x, i) => <p key={i} className="text-[12px] font-medium text-muted">{fmtDateTime(x.at)} · {label(x.action)}{x.entityRef ? ` · ${x.entityRef}` : ''}</p>)}
        </SCard>
      ))}
      {d && !d.items.length && <SCard><p className="text-[13px] font-medium text-muted">No assistants yet (up to {d.limit}).</p></SCard>}
      {add && <PersonDialog title="Add assistant" body="They sign in with this mobile number. Adding asks for an OTP on your phone." onSave={(b) => api.assistants.create(b)} inv="assistants" onClose={() => setAdd(false)} />}
    </SettingsLayout>
  )
}
function PersonDialog({ title, body, onSave, inv, onClose, withNote }) {
  const [f, setF] = useState({ name: '', mobile: '', note: '' })
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => onSave({ name: f.name.trim(), mobile: cleanMobile(f.mobile), ...(withNote && f.note ? { note: f.note } : {}) }), {
    invalidates: [inv], quiet: true, onDone: (r) => { if (r?.data?.whatsappUrl) window.open(r.data.whatsappUrl, '_blank', 'noopener'); onClose() },
  })
  return (
    <ActionDialog title={title} body={body} confirm="Add" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Full name *" value={f.name} onChange={set('name')} error={fe.name} />
      <Field label="Mobile *" value={f.mobile} onChange={set('mobile')} error={fe.mobile} />
      {withNote && <Field label="Note" type="textarea" value={f.note} onChange={set('note')} />}
    </ActionDialog>
  )
}

/* ═════════════ S07 · Referrers ═════════════ */
export function LiveReferrers() {
  const q = useQuery('referrers', () => api.referrers.list())
  const [add, setAdd] = useState(false)
  const { act } = useAct()
  const rows = q.data || []
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  REFERRERS" title="Referrers" subtitle="People who send you leads with their own link. Their leads arrive with consent recorded."
      actions={<SmallButton variant="navy" icon="plus" onClick={() => setAdd(true)}>Add referrer</SmallButton>}>
      <Loading q={q} />
      {rows.map((r) => (
        <SCard key={r.id}>
          <SHead title={r.name} subtitle={`${fmtMobile(r.mobile)} · ${r.sent} referred · ${r.converted} converted`}
            right={<div className="flex items-center gap-2"><SChip tone={r.status === 'ACTIVE' ? 'green' : r.status === 'INVITED' ? 'blue' : 'gray'}>{label(r.status)}</SChip>
              {r.status !== 'DISABLED'
                ? <SmallButton variant="danger" onClick={() => act(() => api.referrers.disable(r.id, {}), { invalidates: ['referrers'] })}>Disable</SmallButton>
                : <SmallButton variant="outline" onClick={() => act(() => api.referrers.enable(r.id, {}), { invalidates: ['referrers'] })}>Enable</SmallButton>}</div>} />
          {r.link && (
            <div className="flex items-center gap-2.5 rounded-[14px] bg-panel px-3.5 py-2.5">
              <Icon name="link" size={15} className="text-muted" />
              <span className="flex-1 truncate text-[13px] font-semibold text-ink">{r.link}</span>
              <SChip tone={r.codeStatus === 'ACTIVE' ? 'green' : 'amber'}>{r.codeStatus === 'ACTIVE' ? `Valid till ${fmtDate(isoDay(r.validUntil), { year: false })}` : label(r.codeStatus)}</SChip>
              <SmallButton variant="ghost" icon="list" onClick={() => navigator.clipboard?.writeText(r.link)}>Copy</SmallButton>
              <SmallButton variant="outline" icon="refresh" onClick={() => act(() => api.referrers.newLink(r.id, {}), { invalidates: ['referrers'] })}>New link</SmallButton>
            </div>
          )}
        </SCard>
      ))}
      {!q.loading && !rows.length && <SCard><p className="text-[13px] font-medium text-muted">No referrers yet.</p></SCard>}
      {add && <PersonDialog title="Add referrer" body="We send them an invitation to sign in and get their referral link." withNote onSave={(b) => api.referrers.create(b)} inv="referrers" onClose={() => setAdd(false)} />}
    </SettingsLayout>
  )
}

/* ═════════════ S08 · Support access ═════════════ */
export function LiveSupportAccess() {
  const q = useQuery('support-grants', () => api.supportGrants.list())
  const [give, setGive] = useState(false)
  const { act } = useAct()
  const rows = q.data || []
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  SUPPORT ACCESS" title="Support access" subtitle="Let a SkyUp person open your client records for a limited time. Everything they open is listed here."
      actions={<SmallButton variant="navy" icon="eye" onClick={() => setGive(true)}>Give access</SmallButton>}>
      <Loading q={q} />
      {rows.map((g) => (
        <SCard key={g.id}>
          <SHead title={g.to} subtitle={`${g.reason} · ${fmtDateTime(g.startsAt)} to ${fmtDateTime(g.endsAt)}`}
            right={<div className="flex items-center gap-2"><SChip tone={g.status === 'ACTIVE' ? 'green' : 'gray'}>{label(g.status)}</SChip>{g.status === 'ACTIVE' && <SmallButton variant="danger" onClick={() => act(() => api.supportGrants.end(g.id, {}), { invalidates: ['support-grants'] })}>End now</SmallButton>}</div>} />
          {(g.log || []).slice(-5).reverse().map((l, i) => <p key={i} className="text-[12px] font-medium text-muted">{fmtDateTime(l.at)} · {l.what ?? l.action}{l.recordId ? ` · ${l.recordId}` : ''}</p>)}
        </SCard>
      ))}
      {!q.loading && !rows.length && <SCard><p className="text-[13px] font-medium text-muted">You have not given support access.</p></SCard>}
      {give && <GiveAccessDialog onClose={() => setGive(false)} />}
    </SettingsLayout>
  )
}
function GiveAccessDialog({ onClose }) {
  const staff = useQuery('support-grants:staff', () => api.supportGrants.staff())
  const opts = (staff.data || []).map((s) => ({ value: s.id, label: s.name }))
  const [who, setWho] = useState('')
  const [reason, setReason] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.supportGrants.give({ granteeUserId: who || opts[0]?.value, reason }), { invalidates: ['support-grants'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Give support access" body="Asks for an OTP on your phone. Access ends on its own." icon="eye" confirm="Give access" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="SkyUp person *" type="select" value={who || opts[0]?.value} onChange={setWho} options={opts} />
      <Field label="Reason *" value={reason} onChange={setReason} error={fe.reason} />
    </ActionDialog>
  )
}

/* ═════════════ S09 · Export my data ═════════════ */
const PARTS = ['customers', 'leads', 'quotations', 'policies', 'payments', 'renewals']
export function LiveExport() {
  const q = useQuery('exports', () => api.exports.list())
  const [parts, setParts] = useState(PARTS)
  const { act, busy, error } = useAct()
  const { toastError } = useToast()
  const download = async (id) => {
    try {
      const { data, meta } = await api.exports.download(id)
      const a = document.createElement('a'); a.href = URL.createObjectURL(data); a.download = meta.filename || 'bimayantra-export.zip'; a.click()
    } catch (e) { toastError(e) }
  }
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  EXPORT MY DATA" title="Export my data" subtitle="A ZIP of CSV files. Ready in a few minutes; the download link expires.">
      <SCard>
        <SHead title="What to include" />
        <div className="flex flex-wrap gap-2">{PARTS.map((p) => {
          const on = parts.includes(p)
          return <button key={p} type="button" onClick={() => setParts(on ? parts.filter((x) => x !== p) : [...parts, p])} className={cx('h-[34px] rounded-[18px] border px-3.5 text-[13px] font-semibold', on ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-muted')}>{label(p)}</button>
        })}</div>
        <ErrorNote error={error} />
        <SmallButton variant="navy" icon="download" className="self-start" disabled={busy || !parts.length} onClick={() => act(() => api.exports.request({ include: parts }), { invalidates: ['exports'] })}>Request export</SmallButton>
      </SCard>
      <SCard>
        <SHead title="Your exports" />
        <Loading q={q} />
        {(q.data || []).map((j) => (
          <div key={j._id ?? j.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
            <span className="flex-1 font-semibold text-ink">{(j.include || []).map(label).join(', ')}</span>
            <span className="font-medium text-muted">{fmtDateTime(j.createdAt)}</span>
            <SChip tone={j.status === 'READY' ? 'green' : j.status === 'FAILED' ? 'red' : 'amber'}>{label(j.status)}</SChip>
            {j.status === 'READY' && <SmallButton variant="outline" icon="download" onClick={() => download(j._id ?? j.id)}>Download</SmallButton>}
          </div>
        ))}
        {q.data && !q.data.length && <p className="text-[13px] font-medium text-muted">No exports yet.</p>}
      </SCard>
    </SettingsLayout>
  )
}

/* ═════════════ S10 · Activity log ═════════════ */
export function LiveActivityLog() {
  const [page, setPage] = useState(1)
  const q = useQuery(['audit', page], () => api.audit.list({ page, limit: 25 }))
  const meta = q.meta || {}
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  ACTIVITY LOG" title="Activity log" subtitle="Who did what in your account. Personal data is masked.">
      <SCard>
        <Loading q={q} />
        {(q.data || []).map((e) => (
          <div key={e.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
            <span className="w-[150px] shrink-0 font-medium text-muted">{fmtDateTime(e.at)}</span>
            <span className="w-[150px] shrink-0 truncate font-semibold text-ink">{e.actorName ?? label(e.actorRole)}</span>
            <span className="flex-1 truncate font-semibold text-ink">{label(e.action)}{e.entityRef ? ` · ${e.entityRef}` : ''}</span>
            <StatusChip tone={e.result === 'SUCCESS' ? 'green' : 'rose'}>{label(e.result)}</StatusChip>
          </div>
        ))}
        {(meta.pages ?? 1) > 1 && (
          <div className="flex items-center justify-end gap-2 text-[13px] font-medium text-muted">Page {page} of {meta.pages}
            <SmallButton variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</SmallButton>
            <SmallButton variant="outline" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>Next</SmallButton>
          </div>
        )}
      </SCard>
    </SettingsLayout>
  )
}

/* ═════════════ S11 · Security ═════════════ */
export function LiveSecurity() {
  const q = useQuery('sessions', () => api.auth.sessions())
  const { user, logout } = useAuth()
  const { act } = useAct()
  const [dlg, setDlg] = useState(false)
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  SECURITY" title="Security" subtitle="You sign in with a one-time code. No password to remember.">
      <SCard>
        <SHead title="Login mobile" subtitle={fmtMobile(user?.mobile)} right={<SmallButton variant="outline" icon="phone" onClick={() => setDlg(true)}>Change mobile</SmallButton>} />
      </SCard>
      <SCard>
        <SHead title="Signed-in devices" subtitle="End any session you do not recognise." right={<SmallButton variant="danger" onClick={logout}>Log out here</SmallButton>} />
        <Loading q={q} />
        {(q.data || []).map((s) => (
          <div key={s.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
            <Icon name="lock" size={16} className="text-muted" />
            <span className="flex-1 font-semibold text-ink">{s.device ?? label(s.client)}{s.current ? ' · this device' : ''}</span>
            <span className="font-medium text-muted">{s.ip ?? ''} · active {fmtDateTime(s.lastActiveAt)}</span>
            {!s.current && <SmallButton variant="danger" onClick={() => act(() => api.auth.endSession(s.id), { invalidates: ['sessions'] })}>End</SmallButton>}
          </div>
        ))}
      </SCard>
      {dlg && <ChangeMobileDialog onClose={() => setDlg(false)} />}
    </SettingsLayout>
  )
}
function ChangeMobileDialog({ onClose }) {
  const [step, setStep] = useState('current')
  const [code, setCode] = useState('')
  const [token, setToken] = useState(null)
  const [mobile, setMobile] = useState('')
  const { act, busy, error } = useAct()
  const { logout } = useAuth()
  const next = async () => {
    if (step === 'current') { const r = await act(() => api.auth.mobileCurrentOtp(), { quiet: true }); if (r) setStep('current-code') }
    else if (step === 'current-code') { const r = await act(() => api.auth.mobileCurrentVerify(code), { quiet: true }); if (r) { setToken(r.data.changeToken); setCode(''); setStep('new') } }
    else if (step === 'new') { const r = await act(() => api.auth.mobileNewOtp({ changeToken: token, newMobile: cleanMobile(mobile) }), { quiet: true }); if (r) setStep('new-code') }
    else { const r = await act(() => api.auth.mobileNewVerify({ changeToken: token, newMobile: cleanMobile(mobile), code }), { quiet: true }); if (r) { onClose(); logout() } }
  }
  const text = { current: 'We send a code to your current mobile first.', 'current-code': 'Enter the code sent to your current mobile.', new: 'Enter the new mobile number.', 'new-code': 'Enter the code sent to the new mobile. You will sign in again after the change.' }[step]
  return (
    <ActionDialog title="Change login mobile" body={text} icon="phone" confirm={step === 'current' ? 'Send code' : step === 'new' ? 'Send code to new mobile' : 'Verify'} busy={busy} error={error} onConfirm={next} onClose={onClose}>
      {(step === 'current-code' || step === 'new-code') && <Field label="Code" value={code} onChange={setCode} inputMode="numeric" />}
      {step === 'new' && <Field label="New mobile" value={mobile} onChange={setMobile} />}
    </ActionDialog>
  )
}