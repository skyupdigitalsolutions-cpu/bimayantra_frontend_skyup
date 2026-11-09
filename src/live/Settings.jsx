// Settings (16, 17, S03–S11) on the live API. Each page keeps the Figma shell: left settings nav + content column.
// Rebuilt to match the current Figma (file pS93mvrih4lK1DSbX8lHnj, page "Bimayantra UI"): pink profile hero,
// inline per-section saves, plan cards with per-card cycle toggle, KYC review stepper, insurer count card,
// wallet preset chips, assistant permission panels, referrer stats strip, support countdown, OTP export,
// activity actor tabs + day grouping, security bulk logout + change-mobile steps. All backend wiring unchanged.
import { useMemo, useState } from 'react'
import { SettingsLayout, SCard, SHead, SChip, SNote, DocTile } from '../screens/settings/_parts'
import { SmallButton, HeadButton } from '../screens/catalogue/_parts'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, useQuery } from '../api'
import { fmtDate, fmtDateTime, fmtMobile, fmtMoney, cleanMobile, initials, avatarClass, mobileError } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { ActionDialog, Field, ErrorNote, useAct, label, dmy, isoDay, check } from './kit'
import { openCheckout } from './razorpay'

/* ───────── shared bits ───────── */
const Loading = ({ q }) => (q.error ? <ErrorNote error={q.error} /> : q.loading && !q.data ? <SCard><p className="text-[13px] font-medium text-muted">Loading…</p></SCard> : null)

/** Pastel avatar disc with initials (Figma: 2px white ring). */
function Avatar({ name, seed, size = 44, className = '' }) {
  return (
    <span className={cx('flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-[#13294b]', avatarClass(seed || name), className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}>
      {initials(name)}
    </span>
  )
}

/** Amber / blue inline note (SNote is blue-only; amber variants are inline here). */
function Note({ tone = 'blue', icon = 'alert', children }) {
  const t = tone === 'amber' ? 'bg-[#fbf1e1] text-[#8a5a12]' : 'bg-blue-50 text-blue'
  return (
    <div className={cx('flex items-center gap-2.5 rounded-[16px] px-4 py-3 text-[13px] font-semibold', t)}>
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  )
}

/** Read-only panel field (login mobile, locked KYC values). */
function ReadField({ label: lbl, value, icon, prefix, hint, className = '' }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      {lbl && <span className="text-[13px] font-semibold text-ink">{lbl}</span>}
      <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink">
        {icon && <Icon name={icon} size={18} className="text-muted" />}
        {prefix && <span className="text-muted">{prefix}</span>}
        <span className="min-w-0 flex-1 truncate">{value || '—'}</span>
      </span>
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

const daysUntil = (d) => { if (!d) return null; const t = new Date(isoDay(d)); const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 86400000) }
const hoursLeft = (d) => { if (!d) return null; const ms = new Date(d) - Date.now(); return ms > 0 ? Math.ceil(ms / 3600000) : 0 }

/* ═════════════ 16 · Profile ═════════════ */
export function LiveProfile() {
  const q = useQuery('profile', () => api.profile.get())
  const kq = useQuery('kyc', () => api.kyc.get())
  const { user } = useAuth()
  const P = q.data
  const S = P?.sections
  const comp = P?.completion
  const kycStatus = kq.data?.status
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY PROFILE" title="My profile" subtitle="Your details print on every quotation."
      titleExtra={comp && <SChip tone={comp.percent === 100 ? 'green' : 'amber'}>{comp.percent}% complete</SChip>}>
      <Loading q={q} />
      {comp && comp.percent < 100 && (
        <div className="flex items-center gap-5 rounded-[28px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] px-[26px] py-4 shadow-[0px_18px_18px_rgba(232,137,156,0.25)]">
          <Avatar name={S?.personal?.fullName || user?.name} size={72} className="border-4 bg-white text-[23px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-[18px] font-bold text-ink">Profile {comp.percent}% complete</p>
            {comp.message && <p className="text-[13px] font-medium text-[#8b3a4c]">{comp.message}</p>}
            <div className="h-[10px] w-[420px] max-w-full overflow-hidden rounded-[5px] bg-white/70">
              <div className="h-[10px] rounded-[5px] bg-navy" style={{ width: `${Math.min(100, Math.max(0, comp.percent))}%` }} />
            </div>
          </div>
          <SmallButton variant="navy" icon="plus" to="/settings/insurers">Add insurer</SmallButton>
        </div>
      )}
      {S && <PersonalContactCard s={S} />}
      {S && <ProfessionalCard s={S} options={P.options} kycStatus={kycStatus} licence={P.licence} />}
    </SettingsLayout>
  )
}

/** Merged "Personal and contact" card with inline Save section (saves the personal + contact API sections).
 *  Only the fields Figma shows are editable; model fields it omits (gender, alt mobile, address 2–5) are
 *  sent back unchanged so nothing is dropped. */
function PersonalContactCard({ s }) {
  const p = s.personal, c = s.contact
  const [f, setF] = useState({ fullName: p.fullName ?? '', dob: isoDay(p.dob), email: c.email ?? '', address1: c.address1 ?? '' })
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(async () => {
    await api.profile.updateSection('personal', { version: p.version, fullName: f.fullName, dob: f.dob ? dmy(f.dob) : null, gender: p.gender ?? null })
    return api.profile.updateSection('contact', { version: c.version, email: f.email || null, altMobile: c.altMobile ?? null, address1: f.address1 || null, address2: c.address2 ?? null, city: c.city ?? null, state: c.state ?? null, pin: c.pin ?? null })
  }, { invalidates: ['profile', 'dashboard'], quiet: true })
  const addr = [c.address1, c.address2, c.city, c.state, c.pin].filter(Boolean).join(', ')
  return (
    <SCard>
      <SHead title="Personal and contact" subtitle="Each section saves on its own"
        right={<SmallButton variant="navy" icon="check" disabled={busy} onClick={save}>Save section</SmallButton>} />
      <div className="flex gap-4">
        <Field label="Full name *" value={f.fullName} onChange={set('fullName')} error={fe.fullName} />
        <Field label="Date of birth *" type="date" value={f.dob} onChange={set('dob')} error={fe.dob} />
      </div>
      <div className="flex gap-4">
        <Field label="Email *" value={f.email} onChange={set('email')} error={fe.email} />
        <ReadField label="Login mobile" prefix="+91" value={fmtMobile(c.loginMobile)} hint="Change it in Security." />
      </div>
      {/* Figma shows one Address line → bound to address 1; the rest of the stored address is preserved on save. */}
      <Field label="Address *" value={f.address1} onChange={set('address1')} error={fe.address1} placeholder={addr || 'Address'} />
      <ErrorNote error={error} />
    </SCard>
  )
}

/** "Professional" card: inline Save section (professional + business sections). "Name on quotations" sits here. */
function ProfessionalCard({ s, options, kycStatus, licence }) {
  const pr = s.professional, b = s.business
  const [f, setF] = useState({
    advisorType: pr.advisorType ?? '', licenceNumber: pr.licenceNumber ?? '', licenceValidUntil: isoDay(pr.licenceValidUntil),
    categories: pr.categories ?? [], displayName: b.displayName ?? '',
  })
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(async () => {
    await api.profile.updateSection('professional', {
      version: pr.version, advisorType: f.advisorType || null, licenceNumber: f.licenceNumber || null,
      licenceValidUntil: f.licenceValidUntil ? dmy(f.licenceValidUntil) : null, experienceYears: pr.experienceYears ?? null, categories: f.categories,
    })
    return api.profile.updateSection('business', { version: b.version, displayName: f.displayName || null, gstin: b.gstin ?? null })
  }, { invalidates: ['profile', 'dashboard'], quiet: true })
  const kycTone = { PENDING_REVIEW: 'violet', VERIFIED: 'green', REJECTED: 'red', NOT_SUBMITTED: 'gray' }
  return (
    <SCard>
      <SHead title="Professional" subtitle="Changing your licence number sends KYC for review again"
        right={<div className="flex items-center gap-2">
          {kycStatus && <SChip tone={kycTone[kycStatus] || 'gray'} icon="clock">KYC {label(kycStatus).toLowerCase()}</SChip>}
          <SmallButton variant="navy" icon="check" disabled={busy} onClick={save}>Save section</SmallButton>
        </div>} />
      <div className="flex gap-4">
        <Field label="Advisor type *" type="select" value={f.advisorType} onChange={set('advisorType')} error={fe.advisorType}
          options={['', ...(options?.advisorTypes ?? [])].map((g) => ({ value: g, label: g || 'Choose' }))} />
        <Field label="IRDAI licence number *" value={f.licenceNumber} onChange={set('licenceNumber')} error={fe.licenceNumber} />
      </div>
      <div className="flex gap-4">
        <Field label="Licence valid until *" type="date" value={f.licenceValidUntil} onChange={set('licenceValidUntil')} error={fe.licenceValidUntil} />
        <Field label="Name on quotations" value={f.displayName} onChange={set('displayName')} error={fe.displayName} placeholder={b.effectiveDisplayName || ''} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-semibold text-ink">Authorised categories *</span>
        {(options?.categories ?? []).map((cat) => {
          const on = f.categories.includes(cat)
          return (
            <button key={cat} type="button" onClick={() => set('categories')(on ? f.categories.filter((x) => x !== cat) : [...f.categories, cat])}
              className={cx('flex h-[34px] items-center gap-1.5 rounded-[18px] border px-3.5 text-[13px] font-semibold', on ? 'border-[#1f5fd6] bg-[#e8f0fd] text-[#1f5fd6]' : 'border-[#e8ecf3] bg-white text-muted')}>
              {on && <Icon name="check" size={14} />}{cat}
            </button>
          )
        })}
      </div>
      {fe.categories && <span className="text-[12px] text-[#b4323c]">{fe.categories}</span>}
      {licence?.message && <Note tone="amber">{licence.message}</Note>}
      <ErrorNote error={error} />
    </SCard>
  )
}

/* ═════════════ S03 · KYC ═════════════ */
const KYC_TONE = { NOT_SUBMITTED: 'gray', PENDING_REVIEW: 'violet', VERIFIED: 'green', REJECTED: 'red' }
export function LiveKyc() {
  const q = useQuery('kyc', () => api.kyc.get())
  const [f, setF] = useState(null)
  const k = q.data
  const form = f ?? { pan: k?.pan ?? '', nameOnPan: k?.nameOnPan ?? '', panFileId: k?.panFile?.id ?? null, licenceFileId: k?.licenceFile?.id ?? null, declaration: false }
  const set = (key) => (v) => setF({ ...form, [key]: v })
  const { act, busy, error, fieldErrors: fe } = useAct()
  const confirm = error?.code === 'CONFIRMATION_REQUIRED' ? [error.messageId] : []
  const submit = () => act(() => api.kyc.submit({ version: k.version, pan: form.pan.toUpperCase(), nameOnPan: form.nameOnPan, panFileId: form.panFileId, licenceFileId: form.licenceFileId, declaration: form.declaration, confirm }), {
    invalidates: ['kyc', 'profile'], quiet: true, onDone: () => setF(null),
  })
  const locked = k?.status === 'PENDING_REVIEW'
  const submitted = k && ['PENDING_REVIEW', 'VERIFIED', 'REJECTED'].includes(k.status)
  const verified = k?.status === 'VERIFIED'
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  KYC" title="KYC" subtitle="SkyUp verifies you once. Changes to PAN or licence send it back for review."
      titleExtra={k && <SChip tone={KYC_TONE[k.status]} icon={k.status === 'PENDING_REVIEW' ? 'clock' : undefined}>{label(k.status)}</SChip>}>
      <Loading q={q} />
      {k && (
        <SCard>
          <SHead title="Review status" subtitle={`${k.submittedAt ? `Submitted ${fmtDate(k.submittedAt)}` : 'Not submitted yet'} · target 2 working days`} />
          <div className="flex items-center gap-2.5">
            <Step done={submitted} title="Submitted" sub={k.submittedAt ? fmtDate(k.submittedAt, { year: false }) : '—'} icon="check" />
            <Conn on={submitted} />
            <Step done={verified} current={locked} title="Under review" sub="SkyUp" icon="clock" num="2" />
            <Conn on={verified} />
            <Step done={verified} title="Verified" sub={k.verifiedAt ? fmtDate(k.verifiedAt, { year: false }) : '—'} icon="check" num="3" />
          </div>
          {k.message && <Note icon={k.status === 'PENDING_REVIEW' ? 'clock' : 'alert'}>{k.message}</Note>}
          {k.rejection && <Note tone="amber">{k.rejection.message}</Note>}
        </SCard>
      )}
      {k && (
        <SCard>
          <SHead title="Documents" subtitle={locked ? 'Locked while under review' : 'PAN and licence for verification'}
            right={locked && <SChip tone="gray" icon="lock">Read only</SChip>} />
          <div className="flex gap-3">
            <Field label="PAN *" value={form.pan} onChange={set('pan')} error={fe.pan} disabled={locked} />
            <Field label="Name as on PAN *" value={form.nameOnPan} onChange={set('nameOnPan')} error={fe.nameOnPan} disabled={locked} />
          </div>
          {(k.panFile || k.licenceFile) && (
            <div className="flex gap-3.5">
              <DocPreview bg="bg-[#e9e3fc]" icon="card" title="PAN card" file={k.panFile} />
              <DocPreview bg="bg-[#fde8c9]" icon="shield" title="IRDAI licence" file={k.licenceFile} />
            </div>
          )}
          {!locked && (
            <>
              <div className="flex gap-3">
                <FilePick label="PAN card *" purpose="KYC_PAN" value={form.panFileId} onChange={set('panFileId')} />
                <FilePick label="Licence or POSP certificate *" purpose="KYC_LICENCE" value={form.licenceFileId} onChange={set('licenceFileId')} />
              </div>
              <Field type="checkbox" label="I declare these documents are mine and true." value={form.declaration} onChange={set('declaration')} />
              <ErrorNote error={error} />
              <SmallButton variant="navy" icon="send" className="self-start" disabled={busy} onClick={submit}>
                {confirm.length ? 'Confirm and submit' : k.status === 'VERIFIED' ? 'Submit changes for review' : 'Submit for review'}
              </SmallButton>
            </>
          )}
        </SCard>
      )}
    </SettingsLayout>
  )
}
function Step({ done, current, title, sub, icon, num }) {
  const disc = done ? 'bg-navy text-white' : current ? 'border-2 border-[#5b3fb8] bg-white text-[#5b3fb8]' : 'bg-panel text-muted'
  return (
    <div className="flex items-center gap-2.5">
      <span className={cx('flex size-9 items-center justify-center rounded-[18px] text-[13px] font-bold', disc)}>
        {done || current ? <Icon name={icon} size={16} /> : (num || '')}
      </span>
      <div className="flex flex-col gap-px">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        <p className="text-[11px] font-medium text-muted">{sub}</p>
      </div>
    </div>
  )
}
const Conn = ({ on }) => <div className={cx('h-[2px] w-[90px] shrink-0', on ? 'bg-navy' : 'bg-[#e8ecf3]')} />
function DocPreview({ bg, icon, title, file }) {
  const open = () => { if (file?.id) window.open(api.files.url(file.id), '_blank', 'noopener') }
  return (
    <div className={cx('flex flex-1 items-center gap-3.5 rounded-[20px] p-4', bg)}>
      <span className="flex size-11 items-center justify-center rounded-full bg-white/80"><Icon name={icon} size={20} className="text-ink" /></span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="truncate text-[12px] font-medium text-[#5b6b80]">{file ? `${file.name || file.filename || 'File'} · uploaded` : 'Not uploaded'}</p>
      </div>
      {file?.id && (
        <button type="button" onClick={open} className="flex size-[34px] items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
          <Icon name="eye" size={14.3} className="text-ink" />
        </button>
      )}
    </div>
  )
}

/** Upload a file (POST /files) and return its id. */
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
          try { const r = await api.files.upload(f, purpose); onChange(r.data.id) } catch (x) { setErr(x.message) } finally { setBusy(false) }
        }} />
      </span>
      {err && <span className="text-[12px] font-medium text-[#b4323c]">{err}</span>}
    </label>
  )
}

/* ═════════════ S04 · My insurers ═════════════ */
export function LiveInsurers() {
  const q = useQuery('my-insurers', () => api.myInsurers.list())
  const [dlg, setDlg] = useState(null)
  const { act } = useAct()
  const rows = q.data || []
  const active = rows.filter((m) => m.status === 'ACTIVE').length
  const insurerState = (m) => {
    const d = daysUntil(m.validUntil)
    if (d != null && d < 0) return { tone: 'red', icon: 'x', text: 'Expired', expired: true }
    if (m.status !== 'ACTIVE') return { tone: 'gray', text: label(m.status) }
    if (d != null && d <= 90) return { tone: 'amber', icon: 'clock', text: `Expires in ${d} days` }
    return { tone: 'green', icon: 'check', text: 'Active' }
  }
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY INSURERS" title="My insurers" subtitle="Quotations need an active agent code for the insurer."
      actions={<HeadButton variant="pink" icon="plus" onClick={() => setDlg({ add: true })}>Add insurer</HeadButton>}>
      <Loading q={q} />
      {rows.length > 0 && (
        <SCard>
          <SHead title="Insurers and agent codes" subtitle={`${rows.length} added · ${active} active`} />
          {rows.map((m) => {
            const st = insurerState(m)
            return (
              <div key={m.id} className={cx('flex items-center gap-3.5 rounded-[20px] p-3.5', st.expired ? 'border border-[#f2c4c8] bg-[#fff7f7]' : 'bg-panel')}>
                <Avatar name={m.insurer?.name} size={42} className="border-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-ink">{m.insurer?.name ?? '—'}</p>
                  <p className="truncate text-[12px] font-medium text-muted">Agent code {m.agentCode}{m.validUntil ? ` · valid until ${fmtDate(isoDay(m.validUntil))}` : ''}</p>
                </div>
                <SChip tone={st.tone} icon={st.icon}>{st.text}</SChip>
                <SmallButton variant="outline" onClick={() => setDlg({ m })}>{st.expired ? 'Update code' : 'Edit'}</SmallButton>
                {m.status === 'ACTIVE'
                  ? <SmallButton variant="danger" onClick={() => setDlg({ deact: m })}>Deactivate</SmallButton>
                  : <SmallButton variant="outline" onClick={() => act(() => api.myInsurers.activate(m.id, { version: m.version }), { invalidates: ['my-insurers', 'products'] })}>Activate</SmallButton>}
              </div>
            )
          })}
        </SCard>
      )}
      {!q.loading && rows.length === 0 && <SCard><p className="text-[13px] font-medium text-muted">No insurers yet. Add the insurers you hold an agent code with.</p></SCard>}
      <Note>Deactivating an insurer stops new quotations for it. Existing quotations and policies stay.</Note>
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
// NOTE (business decision pending): Figma copy says plans are "bought on the website only", but the in-app
// Razorpay buy()/openCheckout path below is kept wired to the plan buttons. Whether checkout happens on the
// website or in-app is an open product decision — do not delete either until it is settled.
const PLAN_FEATURES = {
  NORMAL: [
    ['Leads, customers, quotations, policies', true], ['Best fit and comparisons', true], ['Renewal reminder emails', true],
    ['Referrers', true], ['Assistant users', false], ['Dedicated WhatsApp number', false], ['Automated WhatsApp greetings', false],
  ],
  PREMIUM: [
    ['Everything in Normal', true], ['Up to 2 assistant users', true], ['Dedicated WhatsApp Business number', true],
    ['Automated greetings and reminders', true], ['WhatsApp wallet (₹1 / message)', true], ['Priority support', true],
  ],
}
export function LiveBilling() {
  const q = useQuery('billing', () => api.billing.get())
  const { user } = useAuth()
  const [cycles, setCycles] = useState({ NORMAL: 'MONTHLY', PREMIUM: 'MONTHLY' })
  const { act, busy, error } = useAct()
  const b = q.data
  // Razorpay: create the order, open Checkout, then the API verifies the signature and activates the plan.
  const buy = (plan) => act(async () => {
    const o = (await api.billing.createOrder({ plan, cycle: cycles[plan] })).data
    if (o.gateway !== 'razorpay') throw new Error('Online payments are in test mode on this server.')
    const paid = await openCheckout(o, { name: user?.name, contact: user?.mobile })
    if (!paid) return { meta: { message: 'Payment cancelled. Nothing was charged.' } }
    const v = await api.billing.verifyOrder(o.orderId, paid)
    return { meta: { message: v.data.message } }
  }, { invalidates: ['billing', 'profile'], quiet: true })
  const trialDays = b?.status === 'TRIAL' ? daysUntil(b.endsAt) : null
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY PLAN" title="My plan and billing" subtitle="Plans and wallet recharges are bought on the website only."
      titleExtra={trialDays != null && <SChip tone="blue" icon="clock">Trial · {trialDays} days left</SChip>}>
      <Loading q={q} />
      {b && (
        <>
          <div className="flex gap-5">
            {['NORMAL', 'PREMIUM'].map((plan) => {
              const cyc = cycles[plan], other = cyc === 'MONTHLY' ? 'YEARLY' : 'MONTHLY'
              const prem = plan === 'PREMIUM'
              const price = b.prices?.[plan]?.[cyc], alt = b.prices?.[plan]?.[other]
              const current = b.plan === plan && b.status === 'ACTIVE'
              return (
                <div key={plan} className={cx('flex flex-1 flex-col gap-[18px] rounded-[28px] p-6', prem ? 'bg-linear-to-b from-[#1a3460] to-[#0e1f3b] text-white shadow-[0px_24px_22px_-18px_rgba(19,41,75,0.3)]' : 'bg-white text-ink shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]')}>
                  <div className="flex items-center gap-2.5">
                    <p className="flex-1 text-[20px] font-bold">{label(plan)}</p>
                    {prem && <span className="rounded-[12px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-[#13294b]">Most popular</span>}
                  </div>
                  <div className="flex items-end gap-1.5">
                    <p className="text-[36px] font-bold tracking-[-0.72px]">{price != null ? fmtMoney(price) : '—'}</p>
                    <p className={cx('text-[13px] font-medium', prem ? 'text-[#c9d6ea]' : 'text-muted')}> / {cyc === 'YEARLY' ? 'year' : 'month'} + GST</p>
                  </div>
                  <p className={cx('text-[13px] font-semibold', prem ? 'text-[#f7b9c4]' : 'text-[#1f5fd6]')}>{alt != null ? `or ${fmtMoney(alt)} / ${other === 'YEARLY' ? 'year' : 'month'}` : ''}</p>
                  <div className={cx('flex gap-1 self-start rounded-[20px] p-1', prem ? 'bg-white/10' : 'bg-panel')}>
                    {['MONTHLY', 'YEARLY'].map((c) => {
                      const on = cyc === c
                      return <button key={c} type="button" onClick={() => setCycles((x) => ({ ...x, [plan]: c }))}
                        className={cx('rounded-[16px] px-4 py-[7px] text-[12px] font-semibold', on ? (prem ? 'bg-white text-[#13294b]' : 'bg-navy text-white') : (prem ? 'text-[#c9d6ea]' : 'text-muted'))}>{label(c)}</button>
                    })}
                  </div>
                  {PLAN_FEATURES[plan].map(([text, yes]) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <span className={cx('flex size-[22px] items-center justify-center rounded-[11px]', yes ? (prem ? 'bg-[#f7b9c4]' : 'bg-[#e7f4ee]') : 'bg-[#eef1f5]')}>
                        <Icon name={yes ? 'check' : 'x'} size={12} className={yes ? (prem ? 'text-[#13294b]' : 'text-[#127650]') : 'text-muted'} />
                      </span>
                      <p className={cx('text-[13px] font-medium', yes ? (prem ? 'text-white' : 'text-ink') : 'text-muted')}>{text}</p>
                    </div>
                  ))}
                  <SmallButton variant={prem ? 'pink' : 'navy'} icon="arrow" size="lg" className="w-full justify-center" disabled={busy} onClick={() => buy(plan)}>
                    {current ? 'Renew' : `Choose ${label(plan)}`}
                  </SmallButton>
                </div>
              )
            })}
          </div>
          <ErrorNote error={error} />
          {b.plan === 'PREMIUM' && !b.nextPlan && <SmallButton variant="outline" className="self-start" onClick={() => act(() => api.billing.downgrade({ confirm: true }), { invalidates: ['billing'] })}>Move to Normal at renewal</SmallButton>}
          <SCard>
            <SHead title="Billing history" subtitle="A GST invoice is emailed after each payment" right={<SChip tone="violet" icon="user-plus">Paid to SkyUp</SChip>} />
            {(b.invoices || []).map((i) => (
              <div key={i.id} className="flex items-center gap-4 rounded-[18px] bg-panel px-[18px] py-3.5">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-ink">{i.title || `${label(i.plan)} · ${label(i.cycle)}`}</p>
                  <p className="truncate text-[12px] font-medium text-muted">{[i.invoiceNumber, i.period || (i.createdAt && fmtDate(i.createdAt))].filter(Boolean).join(' · ')}</p>
                </div>
                <p className="text-[14px] font-bold text-ink">{fmtMoney(i.total, { decimals: 2 })}</p>
                <SChip tone={i.status === 'PAID' ? 'green' : i.total ? 'blue' : 'blue'}>{i.status ? label(i.status) : i.total ? 'Paid' : 'Free'}</SChip>
              </div>
            ))}
            {!(b.invoices || []).length && <p className="text-[13px] font-medium text-muted">No payments yet.</p>}
            <p className="text-[12px] font-medium text-muted">Sample prices, pending confirmation (DEC-06). No proration or refunds in this release.</p>
          </SCard>
        </>
      )}
    </SettingsLayout>
  )
}

/* ═════════════ S05 · WhatsApp wallet ═════════════ */
const RECHARGE_PRESETS = [500, 1000, 2000]
export function LiveWallet() {
  const q = useQuery('wallet', () => api.wallet.get())
  const { user } = useAuth()
  const [preset, setPreset] = useState(1000)
  const [custom, setCustom] = useState('')
  const { act, busy, error } = useAct()
  const w = q.data
  const amount = preset === 'custom' ? Number(custom) : preset
  const min = w?.minimumRecharge ?? 500
  const valid = amount > 0 && amount >= min
  const recharge = () => act(async () => {
    const o = (await api.wallet.recharge({ amount: Number(amount) })).data
    if (o.gateway !== 'razorpay') throw new Error('Online payments are in test mode on this server.')
    const paid = await openCheckout(o, { name: user?.name, contact: user?.mobile })
    if (!paid) return { meta: { message: 'Payment cancelled. Nothing was charged.' } }
    await api.wallet.verifyRecharge(o.orderId, paid)
    return { meta: { message: `Wallet recharged with ₹${o.amount}.` } }
  }, { invalidates: ['wallet'], quiet: true })
  const msgs = w && w.pricePerMessage ? Math.floor(w.balance / w.pricePerMessage) : null
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  WHATSAPP WALLET" title="WhatsApp wallet" subtitle="Pays for automated WhatsApp greetings and reminders. Premium only."
      titleExtra={<SChip tone="red" icon="star" className="bg-[#fde8ec] text-[#b4325a]">Premium</SChip>}>
      <Loading q={q} />
      {w && (
        <>
          <div className="flex gap-[18px]">
            <div className="flex w-[440px] max-w-[48%] flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 text-white shadow-[0px_24px_22px_-18px_rgba(19,41,75,0.3)]">
              <div className="flex items-center gap-2.5">
                <p className="flex-1 text-[14px] font-semibold text-[#c9d6ea]">Balance</p>
                <span className="rounded-[12px] bg-[#f3f0fa] px-2.5 py-[5px] text-[11px] font-bold text-[#5b3fb8]">Paid to SkyUp</span>
              </div>
              <p className="text-[38px] font-bold tracking-[-0.76px]">{fmtMoney(w.balance, { decimals: 2 })}</p>
              <p className="text-[12px] font-medium text-[#c9d6ea]">
                {msgs != null ? `About ${msgs} messages at ${fmtMoney(w.pricePerMessage, { decimals: 2 })} each` : ''}{w.lowBalanceBelow != null ? ` · alert below ${fmtMoney(w.lowBalanceBelow)}` : ''}
              </p>
            </div>
            <SCard className="flex-1">
              <SHead title="Recharge" subtitle={`Smallest recharge ${fmtMoney(min)}`} />
              <div className="flex gap-2">
                {RECHARGE_PRESETS.map((p) => (
                  <button key={p} type="button" onClick={() => setPreset(p)}
                    className={cx('flex-1 rounded-[16px] py-2.5 text-[13px] font-bold', preset === p ? 'bg-navy text-white' : 'bg-panel text-ink')}>{fmtMoney(p)}</button>
                ))}
                <button type="button" onClick={() => setPreset('custom')}
                  className={cx('flex-1 rounded-[16px] py-2.5 text-[13px] font-bold', preset === 'custom' ? 'bg-navy text-white' : 'bg-panel text-ink')}>Custom</button>
              </div>
              {preset === 'custom' && <Field label="Amount (₹)" type="number" value={custom} onChange={setCustom} hint={`Minimum ${fmtMoney(min)}`} />}
              <ErrorNote error={error} />
              <SmallButton variant="navy" icon="card" size="lg" className="w-full justify-center" disabled={busy || !valid} onClick={recharge}>
                Pay {amount > 0 ? fmtMoney(amount) : '₹0'} + GST
              </SmallButton>
            </SCard>
          </div>
          {w.message && <Note tone="amber">{w.message}</Note>}
          <SCard>
            <SHead title="Transactions" />
            {w.transactions.map((t) => {
              const credit = t.amount >= 0
              return (
                <div key={t.id} className="flex items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
                  <span className={cx('flex size-[38px] items-center justify-center rounded-[19px]', credit ? 'bg-[#e7f4ee]' : 'bg-white')}>
                    <Icon name={credit ? 'download' : 'chat'} size={16} className={credit ? 'text-[#127650]' : 'text-ink'} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-[13px] font-bold text-ink">{label(t.type)}{t.reason ? ` · ${t.reason}` : ''}</p>
                    <p className="text-[12px] font-medium text-muted">{fmtDateTime(t.at)}</p>
                  </div>
                  <p className={cx('text-[14px] font-bold', credit ? 'text-[#127650]' : 'text-ink')}>{credit ? '+ ' : '− '}{fmtMoney(Math.abs(t.amount), { decimals: 2 })}</p>
                  {t.status && t.status !== 'SUCCESS' && t.status !== 'DONE' && <SChip tone={t.status === 'FAILED' ? 'red' : 'amber'}>{label(t.status)}</SChip>}
                </div>
              )
            })}
            {!w.transactions.length && <p className="text-[13px] font-medium text-muted">No transactions yet.</p>}
          </SCard>
        </>
      )}
    </SettingsLayout>
  )
}

/* ═════════════ S06 · Assistants ═════════════ */
const ASSISTANT_CAN = ['Add and work leads', 'Add customers and documents', 'Prepare quotations and proposals', 'Log renewal contacts']
const ASSISTANT_CANNOT = ['Record payments or submit proposals', 'Mark leads lost or reopen them', 'See commission or full PAN and Aadhaar', 'Change plan, wallet or team']
export function LiveAssistants() {
  const q = useQuery('assistants', () => api.assistants.list())
  const [add, setAdd] = useState(false)
  const { act } = useAct()
  const d = q.data
  const canAdd = d?.planAllows && d.items.length < (d.limit ?? 2)
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  ASSISTANTS" title="Assistants" subtitle="Up to 2 on Premium. Included in your trial."
      titleExtra={d && <SChip tone="blue">{d.items.length} of {d.limit ?? 2}</SChip>}
      actions={d?.planAllows && <HeadButton variant="pink" icon="user-plus" onClick={() => setAdd(true)}>Add assistant</HeadButton>}>
      <Loading q={q} />
      {d && !d.planAllows && <SNote>Assistants are part of the Premium plan.</SNote>}
      {d && (
        <SCard>
          <SHead title="Assistants" />
          {d.items.map((a) => {
            const recent = (a.recentActions || []).slice(0, 2).map((x) => label(x.action) + (x.entityRef ? ` ${x.entityRef}` : '')).join(' · ')
            return (
              <div key={a.id} className="flex items-center gap-3.5 rounded-[22px] bg-panel p-4">
                <Avatar name={a.name} size={52} className="bg-[#e9e3fc] text-[17px]" />
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="text-[15px] font-bold text-ink">{a.name}</p>
                  <p className="truncate text-[12px] font-medium text-muted">{fmtMobile(a.mobile)} · {a.lastLoginAt ? `last login ${fmtDateTime(a.lastLoginAt)}` : 'not signed in yet'}</p>
                  {recent && <p className="truncate text-[12px] font-medium text-[#5b6b80]">Recent: {recent}</p>}
                </div>
                <SChip tone={a.status === 'ACTIVE' ? 'green' : a.status === 'INVITED' ? 'blue' : 'gray'} icon={a.status === 'ACTIVE' ? 'check' : undefined}>{label(a.status)}</SChip>
                {a.status !== 'DISABLED'
                  ? <SmallButton variant="danger" onClick={() => act(() => api.assistants.disable(a.id, { version: a.version }), { invalidates: ['assistants'] })}>Disable</SmallButton>
                  : <SmallButton variant="outline" onClick={() => act(() => api.assistants.enable(a.id, { version: a.version }), { invalidates: ['assistants'] })}>Enable</SmallButton>}
              </div>
            )
          })}
          {canAdd && (
            <button type="button" onClick={() => setAdd(true)} className="flex items-center justify-center gap-3 rounded-[22px] border border-dashed border-[#c3ccd8] p-[18px] text-[13px] font-semibold text-muted">
              <Icon name="user-plus" size={18} />Add {d.items.length ? 'a second assistant' : 'an assistant'}
            </button>
          )}
          {!d.items.length && !canAdd && <p className="text-[13px] font-medium text-muted">No assistants yet (up to {d.limit ?? 2}).</p>}
        </SCard>
      )}
      {d && (
        <div className="flex gap-[18px]">
          <div className="flex flex-1 flex-col gap-2.5 rounded-[28px] bg-[#f5fbf8] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <p className="text-[15px] font-bold text-[#127650]">Assistants can</p>
            {ASSISTANT_CAN.map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-[#e7f4ee]"><Icon name="check" size={12} className="text-[#127650]" /></span>
                <p className="text-[13px] font-medium text-ink">{t}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2.5 rounded-[28px] bg-[#fff7f7] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <p className="text-[15px] font-bold text-[#b4323c]">Assistants cannot</p>
            {ASSISTANT_CANNOT.map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-[#fbebec]"><Icon name="x" size={12} className="text-[#b4323c]" /></span>
                <p className="text-[13px] font-medium text-ink">{t}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {add && <PersonDialog title="Add assistant" body="They sign in with this mobile number. Adding asks for an OTP on your phone." onSave={(b) => api.assistants.create(b)} inv="assistants" onClose={() => setAdd(false)} />}
    </SettingsLayout>
  )
}
function PersonDialog({ title, body, onSave, inv, onClose, withNote }) {
  const [f, setF] = useState({ name: '', mobile: '', note: '' })
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => {
    const mob = cleanMobile(f.mobile)
    check({ name: !f.name.trim() && 'Enter a name.', mobile: mobileError(f.mobile, { required: true }) })
    return onSave({ name: f.name.trim(), mobile: mob, ...(withNote && f.note ? { note: f.note } : {}) })
  }, { invalidates: [inv], quiet: true, onDone: (r) => { if (r?.data?.whatsappUrl) window.open(r.data.whatsappUrl, '_blank', 'noopener'); onClose() } })
  return (
    <ActionDialog title={title} body={body} confirm="Add" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Full name *" value={f.name} onChange={set('name')} error={fe.name} />
      <Field label="Mobile *" type="mobile" value={f.mobile} onChange={set('mobile')} error={fe.mobile} />
      {withNote && <Field label="Note" type="textarea" value={f.note} onChange={set('note')} />}
    </ActionDialog>
  )
}

/* ═════════════ S07 · Referrers ═════════════ */
export function LiveReferrers() {
  const q = useQuery('referrers', () => api.referrers.list())
  const [add, setAdd] = useState(false)
  const [open, setOpen] = useState(null)
  const { act } = useAct()
  const { toast } = useToast()
  const rows = q.data || []
  const summary = q.meta?.summary || {}
  const sum = (k) => rows.reduce((a, r) => a + (Number(r[k]) || 0), 0)
  // Figma purple strip; funnel aggregates come from the list summary when present, else what the rows expose.
  const stats = [
    ['Referrals', summary.referrals ?? sum('sent')],
    ['Became leads', summary.becameLeads ?? (q.meta?.summary ? 0 : '—')],
    ['Became customers', summary.becameCustomers ?? sum('converted')],
    ['Policies taken', summary.policiesTaken ?? '—'],
  ]
  const share = (r) => {
    if (!r.link) return
    if (navigator.share) navigator.share({ title: 'Referral link', url: r.link }).catch(() => {})
    else { navigator.clipboard?.writeText(r.link); toast('Link copied.') }
  }
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  REFERRERS" title="Referrers" subtitle="People who send you leads. Each link is valid for 365 days."
      actions={<HeadButton variant="pink" icon="plus" onClick={() => setAdd(true)}>Add referrer</HeadButton>}>
      <Loading q={q} />
      <div className="flex gap-5 rounded-[26px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] px-[26px] py-5">
        {stats.map(([lbl, val]) => (
          <div key={lbl} className="flex flex-1 flex-col gap-0.5">
            <p className="text-[26px] font-bold tracking-[-0.52px] text-ink">{val}</p>
            <p className="text-[12px] font-semibold text-[#5b3fb8]">{lbl}</p>
          </div>
        ))}
      </div>
      {rows.length > 0 && (
        <SCard>
          <SHead title="Referrers" subtitle={`${rows.length}${summary.limit ? ` of ${summary.limit}` : ''}`} />
          {rows.map((r) => {
            const code = r.code || (r.link ? r.link.split('/').pop() : null)
            const detail = r.status === 'INVITED' ? 'Invite valid 7 days'
              : [`${r.sent} sent`, r.converted ? `${r.converted} converted` : null, code ? `link ${code}` : null].filter(Boolean).join(' · ')
            return (
              <div key={r.id} className="flex flex-col gap-2.5 rounded-[20px] bg-panel p-3.5">
                <div className="flex items-center gap-3.5">
                  <Avatar name={r.name} size={44} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-[14px] font-bold text-ink">{r.name}</p>
                    <p className="truncate text-[12px] font-medium text-muted">{detail}</p>
                  </div>
                  <SChip tone={r.status === 'ACTIVE' ? 'green' : r.status === 'INVITED' ? 'blue' : 'gray'}>{label(r.status)}</SChip>
                  <SmallButton variant="outline" icon="chat" onClick={() => share(r)}>Share invite</SmallButton>
                  <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} className="flex size-9 items-center justify-center rounded-[18px] bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
                    <Icon name="more" size={15} className="text-ink" />
                  </button>
                </div>
                {open === r.id && (
                  <div className="flex items-center gap-2.5 rounded-[14px] bg-white px-3.5 py-2.5">
                    {r.link && <><Icon name="link" size={15} className="text-muted" /><span className="flex-1 truncate text-[13px] font-semibold text-ink">{r.link}</span>
                      <SmallButton variant="ghost" icon="list" onClick={() => { navigator.clipboard?.writeText(r.link); toast('Link copied.') }}>Copy</SmallButton>
                      <SmallButton variant="outline" icon="refresh" onClick={() => act(() => api.referrers.newLink(r.id, {}), { invalidates: ['referrers'] })}>New link</SmallButton></>}
                    {r.status !== 'DISABLED'
                      ? <SmallButton variant="danger" onClick={() => act(() => api.referrers.disable(r.id, {}), { invalidates: ['referrers'] })}>Disable</SmallButton>
                      : <SmallButton variant="outline" onClick={() => act(() => api.referrers.enable(r.id, {}), { invalidates: ['referrers'] })}>Enable</SmallButton>}
                  </div>
                )}
              </div>
            )
          })}
        </SCard>
      )}
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
  const activeGrant = rows.find((g) => g.status === 'ACTIVE')
  const past = rows.filter((g) => g.status !== 'ACTIVE')
  const left = activeGrant ? hoursLeft(activeGrant.endsAt) : null
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  SUPPORT ACCESS" title="Support access" subtitle="SkyUp sees your customers only if you allow it. Read only, up to 24 hours."
      titleExtra={activeGrant && <SChip tone="green" icon="eye">Active now</SChip>}
      actions={<HeadButton variant="navy" icon="eye" onClick={() => setGive(true)}>Give access</HeadButton>}>
      <Loading q={q} />
      {activeGrant && (
        <div className="flex items-center gap-4 rounded-[28px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-6">
          <span className="flex size-[76px] flex-col items-center justify-center rounded-full bg-white text-[#5b3fb8]">
            <span className="text-[20px] font-bold">{left != null ? `${left}h` : '—'}</span><span className="text-[10px] font-semibold">left</span>
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-[17px] font-bold text-ink">{activeGrant.to} (SkyUp support) can view your customers</p>
            <p className="text-[13px] font-medium leading-5 text-[#5b3fb8]">Reason: {activeGrant.reason} · ends {fmtDateTime(activeGrant.endsAt)}</p>
          </div>
          <SmallButton variant="danger" icon="x" size="lg" onClick={() => act(() => api.supportGrants.end(activeGrant.id, {}), { invalidates: ['support-grants'] })}>End access now</SmallButton>
        </div>
      )}
      {activeGrant && (activeGrant.log || []).length > 0 && (
        <SCard>
          <SHead title="Records they opened" subtitle="Updated live · also in your activity log" />
          {[...activeGrant.log].reverse().map((l, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
              <span className="flex size-9 items-center justify-center rounded-[18px] bg-white"><Icon name="eye" size={16} className="text-ink" /></span>
              <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink">{l.what ?? l.action}{l.recordId ? ` · ${l.recordId}` : ''}</p>
              <p className="text-[12px] font-medium text-muted">{fmtDateTime(l.at)}</p>
            </div>
          ))}
        </SCard>
      )}
      {past.length > 0 && (
        <SCard>
          <SHead title="Past access" />
          {past.map((g) => (
            <div key={g.id} className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">{g.to} (SkyUp support)</p>
                <p className="truncate text-[12px] font-medium text-muted">{fmtDateTime(g.startsAt)} to {fmtDateTime(g.endsAt)} · {(g.log || []).length} records opened</p>
              </div>
              <SChip tone="gray">{label(g.status)}</SChip>
            </div>
          ))}
        </SCard>
      )}
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
  const save = () => act(() => {
    if (!reason.trim()) throw Object.assign(new Error('Enter a reason.'), { fieldErrors: { reason: 'Required' } })
    return api.supportGrants.give({ granteeUserId: who || opts[0]?.value, reason })
  }, { invalidates: ['support-grants'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Give support access" body="Asks for an OTP on your phone. Access ends on its own." icon="eye" confirm="Give access" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="SkyUp person *" type="select" value={who || opts[0]?.value} onChange={setWho} options={opts} />
      <Field label="Reason *" value={reason} onChange={setReason} error={fe.reason} />
    </ActionDialog>
  )
}

/* ═════════════ S09 · Export my data ═════════════ */
const EXPORT_PARTS = [
  ['customers', 'Customers and family'], ['leads', 'Leads'], ['quotations', 'Quotations and comparisons'], ['payments', 'Payments'],
  ['policies', 'Policies and nominees'], ['renewals', 'Renewals'], ['communications', 'Communications log'], ['documents', 'Documents list'],
]
export function LiveExport() {
  const q = useQuery('exports', () => api.exports.list())
  const [parts, setParts] = useState(EXPORT_PARTS.map(([k]) => k))
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const { act, busy, error } = useAct()
  const { toast, toastError } = useToast()
  // No dedicated export-OTP endpoint exists; the OTP step reuses the generic step-up challenge (closest match).
  const sendCode = () => act(() => api.auth.stepUpOtp(), { success: 'Code sent to your mobile.', onDone: () => setOtpSent(true) })
  const request = () => act(async () => {
    if (otp) await api.auth.stepUpVerify(otp)
    return api.exports.request({ include: parts })
  }, { invalidates: ['exports'], onDone: () => { setOtp(''); setOtpSent(false) } })
  const download = async (id) => {
    try {
      const { data, meta } = await api.exports.download(id)
      const a = document.createElement('a'); a.href = URL.createObjectURL(data); a.download = meta.filename || 'bimayantra-export.zip'; a.click()
    } catch (e) { toastError(e) }
  }
  const expTone = { READY: 'green', FAILED: 'red', PENDING: 'violet', PREPARING: 'violet', EXPIRED: 'gray' }
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  EXPORT MY DATA" title="Export my data" subtitle="One ZIP of CSV files with your records. Works in read-only mode too.">
      <SCard>
        <SHead title="New export" subtitle="Choose what to include" />
        <div className="flex flex-wrap gap-2.5">
          {EXPORT_PARTS.map(([key, lbl]) => {
            const on = parts.includes(key)
            return (
              <button key={key} type="button" onClick={() => setParts(on ? parts.filter((x) => x !== key) : [...parts, key])}
                className="flex w-[calc(50%-5px)] items-center gap-3 rounded-[16px] bg-panel p-3.5 text-left">
                <span className={cx('flex size-[22px] items-center justify-center rounded-[7px]', on ? 'bg-navy' : 'border border-[#c3ccd8] bg-white')}>{on && <Icon name="check" size={14} className="text-white" />}</span>
                <span className="text-[13px] font-semibold text-ink">{lbl}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-end gap-3.5">
          <ReadField label="OTP sent to your mobile" className="pointer-events-none opacity-0 absolute -z-10" />
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink">OTP sent to your mobile</span>
            <span className={cx('flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4', otpSent ? 'border-2 border-[#1f5fd6]' : '')}>
              <Icon name="lock" size={18} className="text-muted" />
              <input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" placeholder={otpSent ? 'Enter code' : 'Send a code first'}
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint" />
              <button type="button" onClick={sendCode} className="text-[12px] font-semibold text-blue">{otpSent ? 'Resend' : 'Send code'}</button>
            </span>
          </label>
          <SmallButton variant="navy" icon="download" size="lg" disabled={busy || !parts.length} onClick={request}>Request export</SmallButton>
        </div>
        <Note tone="amber">The file contains your customers’ personal data. Keep it safe. The download link works for 24 hours.</Note>
        <ErrorNote error={error} />
      </SCard>
      <SCard>
        <SHead title="Exports" />
        <Loading q={q} />
        {(q.data || []).map((j) => (
          <div key={j._id ?? j.id} className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-bold text-ink">{(j.include || []).map((p) => EXPORT_PARTS.find(([k]) => k === p)?.[1] || label(p)).join(', ') || 'All'}</p>
              <p className="text-[12px] font-medium text-muted">{fmtDateTime(j.createdAt)}</p>
            </div>
            <SChip tone={expTone[j.status] || 'amber'}>{j.status === 'PENDING' || j.status === 'PREPARING' ? 'Being prepared' : j.status === 'EXPIRED' ? 'Link expired' : label(j.status)}</SChip>
            {j.status === 'READY' && <SmallButton variant="outline" icon="download" onClick={() => download(j._id ?? j.id)}>Download</SmallButton>}
          </div>
        ))}
        {q.data && !q.data.length && <p className="text-[13px] font-medium text-muted">No exports yet.</p>}
      </SCard>
    </SettingsLayout>
  )
}

/* ═════════════ S10 · Activity log ═════════════ */
const ACTION_STYLE = (action = '') => {
  const a = action.toLowerCase()
  if (a.includes('aadhaar') || a.includes('pan') || a.includes('view')) return { icon: 'eye', bg: 'bg-[#fde8c9]' }
  if (a.includes('support') || a.includes('access') || a.includes('grant')) return { icon: 'lock', bg: 'bg-[#e9e3fc]' }
  if (a.includes('lead')) return { icon: 'user-plus', bg: 'bg-[#d9eafd]' }
  if (a.includes('quot') || a.includes('revision')) return { icon: 'quote', bg: 'bg-[#fde8c9]' }
  if (a.includes('upload') || a.includes('document')) return { icon: 'upload', bg: 'bg-[#d4f1e7]' }
  if (a.includes('open')) return { icon: 'eye', bg: 'bg-[#e9e3fc]' }
  return { icon: 'list', bg: 'bg-panel' }
}
const dayLabel = (d) => { const n = daysUntil(d); return n === 0 ? 'TODAY' : n === -1 ? 'YESTERDAY' : fmtDate(d).toUpperCase() }
export function LiveActivityLog() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')
  const q = useQuery(['audit', page], () => api.audit.list({ page, limit: 25 }))
  const { toastError } = useToast()
  const meta = q.meta || {}
  const entries = q.data || []
  const assistantNames = useMemo(() => [...new Set(entries.filter((e) => /ASSISTANT/i.test(e.actorRole || '')).map((e) => e.actorName).filter(Boolean))], [entries])
  const tabs = ['All', 'You', ...assistantNames, 'System', 'SkyUp']
  const matchTab = (e) => {
    if (tab === 'All') return true
    if (tab === 'You') return /ADVISOR|OWNER|SELF/i.test(e.actorRole || '')
    if (tab === 'System') return /SYSTEM/i.test(e.actorRole || '')
    if (tab === 'SkyUp') return /SUPPORT|STAFF|SKYUP/i.test(e.actorRole || '')
    return e.actorName === tab
  }
  const filtered = entries.filter((e) => matchTab(e) && (!search || `${e.action} ${e.entityRef || ''} ${e.actorName || ''}`.toLowerCase().includes(search.toLowerCase())))
  const groups = []
  for (const e of filtered) {
    const d = dayLabel(e.at)
    if (!groups.length || groups[groups.length - 1].day !== d) groups.push({ day: d, items: [] })
    groups[groups.length - 1].items.push(e)
  }
  const exportCsv = async () => {
    try {
      const { data, meta: m } = await api.audit.export({})
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/csv' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = m?.filename || 'activity-log.csv'; a.click()
    } catch (e) { toastError(e) }
  }
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  ACTIVITY LOG" title="Activity log" subtitle="Everything done in your account. Entries cannot be changed or deleted."
      actions={<HeadButton variant="white" icon="download" onClick={exportCsv}>Export CSV</HeadButton>}>
      <div className="flex items-center gap-3">
        <span className="flex h-[46px] w-[300px] items-center gap-2.5 rounded-[24px] bg-white px-4 shadow-[0px_6px_16px_-10px_rgba(19,41,75,0.1)]">
          <Icon name="search" size={16} className="text-faint" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activity" className="flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-[#9aa4b5]" />
        </span>
        <div className="flex gap-1 rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-10px_rgba(19,41,75,0.1)]">
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={cx('rounded-[21px] px-4 py-[9px] text-[13px] font-semibold', tab === t ? 'bg-navy text-white' : 'text-[#5b6b80]')}>{t}</button>
          ))}
        </div>
      </div>
      <SCard>
        <Loading q={q} />
        {groups.map((g) => (
          <div key={g.day} className="flex flex-col gap-1.5">
            <p className="px-2 pt-2.5 pb-1 text-[11px] font-bold tracking-[0.44px] text-muted">{g.day}</p>
            {g.items.map((e) => {
              const st = ACTION_STYLE(e.action)
              return (
                <div key={e.id} className="flex items-center gap-3.5 rounded-[16px] px-2 py-2.5">
                  <span className={cx('flex size-[38px] items-center justify-center rounded-[19px]', st.bg)}><Icon name={st.icon} size={17} className="text-ink" /></span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-[13px] font-bold text-ink">{label(e.action)}{e.entityRef ? ` · ${e.entityRef}` : ''}</p>
                    <p className="text-[12px] font-medium text-muted">{fmtDateTime(e.at)} · {e.actorName ?? label(e.actorRole)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        {!q.loading && !filtered.length && <p className="px-2 py-4 text-[13px] font-medium text-muted">No activity for this filter.</p>}
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
const CHANGE_STEPS = [
  ['OTP on current number', 'Proves it is you'], ['Enter new number', 'Must not already have access'], ['OTP on new number', 'Other devices log out'],
]
export function LiveSecurity() {
  const q = useQuery('sessions', () => api.auth.sessions())
  const { user } = useAuth()
  const { act } = useAct()
  const [dlg, setDlg] = useState(false)
  const sessions = q.data || []
  const others = sessions.filter((s) => !s.current)
  const logoutAll = () => act(async () => { for (const s of others) await api.auth.endSession(s.id) }, { invalidates: ['sessions'], success: 'Signed out of other devices.' })
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  SECURITY" title="Security" subtitle="Login is by mobile and OTP only. No passwords.">
      <SCard>
        <SHead title="Signed-in devices" subtitle="Up to 3 at a time. The oldest ends when a fourth signs in." />
        <Loading q={q} />
        {sessions.map((s) => {
          const phone = /app|android|ios|mobile/i.test(`${s.device || ''} ${s.client || ''}`)
          return (
            <div key={s.id} className={cx('flex items-center gap-3.5 rounded-[20px] p-3.5', s.current ? 'border border-[#c9daf8] bg-[#f3f7ff]' : 'bg-panel')}>
              <span className="flex size-[42px] items-center justify-center rounded-[21px] bg-white"><Icon name={phone ? 'phone' : 'grid'} size={18} className="text-ink" /></span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{s.device ?? label(s.client)}</p>
                <p className="truncate text-[12px] font-medium text-muted">{[s.location || s.ip, s.current ? 'active now' : fmtDateTime(s.lastActiveAt)].filter(Boolean).join(' · ')}</p>
              </div>
              {s.current
                ? <SChip tone="blue">This device</SChip>
                : <SmallButton variant="outline" icon="logout" onClick={() => act(() => api.auth.endSession(s.id), { invalidates: ['sessions'] })}>Log out</SmallButton>}
            </div>
          )
        })}
        {others.length > 0 && <SmallButton variant="danger" icon="logout" className="self-start" onClick={logoutAll}>Log out all other devices</SmallButton>}
      </SCard>
      <SCard>
        <SHead title="Login mobile" subtitle={`+91 ${fmtMobile(user?.mobile)}`} />
        <div className="flex gap-3.5">
          {CHANGE_STEPS.map(([t, s], i) => (
            <div key={t} className={cx('flex flex-1 items-center gap-3 rounded-[20px] p-4', i === 0 ? 'border border-[#1f5fd6] bg-[#f3f7ff]' : 'bg-panel')}>
              <span className={cx('flex size-8 items-center justify-center rounded-[16px] text-[13px] font-bold', i === 0 ? 'bg-navy text-white' : 'bg-white text-muted')}>{i + 1}</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">{t}</p>
                <p className="text-[11px] font-medium text-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>
        <SmallButton variant="navy" icon="phone" className="self-start" onClick={() => setDlg(true)}>Change mobile number</SmallButton>
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
    else if (step === 'new') {
      const r = await act(() => { check({ mobile: mobileError(mobile, { required: true, label: 'New mobile' }) }); return api.auth.mobileNewOtp({ changeToken: token, newMobile: cleanMobile(mobile) }) }, { quiet: true }); if (r) setStep('new-code')
    }
    else { const r = await act(() => api.auth.mobileNewVerify({ changeToken: token, newMobile: cleanMobile(mobile), code }), { quiet: true }); if (r) { onClose(); logout() } }
  }
  const text = { current: 'We send a code to your current mobile first.', 'current-code': 'Enter the code sent to your current mobile.', new: 'Enter the new mobile number.', 'new-code': 'Enter the code sent to the new mobile. You will sign in again after the change.' }[step]
  const badMobile = step === 'new' && cleanMobile(mobile).length === 10 ? mobileError(mobile, { label: 'New mobile' }) : (error?.fieldErrors?.mobile ?? '')
  return (
    <ActionDialog title="Change login mobile" body={text} icon="phone" confirm={step === 'current' ? 'Send code' : step === 'new' ? 'Send code to new mobile' : 'Verify'} busy={busy} error={error} onConfirm={next} onClose={onClose}>
      {(step === 'current-code' || step === 'new-code') && <Field label="Code" value={code} onChange={setCode} inputMode="numeric" />}
      {step === 'new' && <Field label="New mobile" type="mobile" value={mobile} onChange={setMobile} error={badMobile || undefined} />}
    </ActionDialog>
  )
}
