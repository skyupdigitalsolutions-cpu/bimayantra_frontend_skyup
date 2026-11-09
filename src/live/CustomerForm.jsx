// F3 · New customer and PE1 · Edit details on the live API: POST /customers (Idempotency-Key, duplicate warnings
// with "Save anyway"), PATCH /customers/:id (version). Lists (genders, states, contact preferences) come from
// GET /reference.
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import LeadShell, { FormCard, Row, FField, TInput, SInput, AfterSave, cardShadow } from '../screens/flow-lead/_parts'
import { api, useQuery, useMutation, ApiError } from '../api'
import { cleanMobile, fmtMobile, titleCase, typeMobile, mobileError, isEmail } from '../api/format'
import { DatePicker } from '../components/pickers'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { LoadingPanel, ErrorPanel } from './common'

const PREF = { WHATSAPP: 'WhatsApp', PHONE_CALL: 'Phone call', EMAIL: 'Email' }
const AFTER = [['Customer created', 'Gets the next CU number'], ['Record consent', 'Personal data and messages'], ['Add family and documents', 'Aadhaar, PAN, vehicles'], ['Run Best fit or quote', 'Then pay, propose, issue']]
const NONE = '—'
/** "1988-04-12" (API) ⇄ <input type=date>; the API takes DD-MM-YYYY. */
const toInput = (v) => (v ? String(v).slice(0, 10) : '')
const toApi = (v) => (v ? v.split('-').reverse().join('-') : null)

export default function LiveCustomerForm({ mode = 'new' }) {
  const { id } = useParams()
  const editing = mode === 'edit'
  const c = useQuery(['customer', id], () => api.customers.get(id), { enabled: editing })
  if (editing && c.error) return <ErrorPanel active="customers" error={c.error} back="/customers" />
  if (editing && !c.data) return <LoadingPanel active="customers" />
  return <Form key={c.data?.version ?? 'new'} c={editing ? c.data : null} />
}

function DateBox({ value, onChange, error }) {
  return (
    <DatePicker value={value} onChange={onChange} invalid={!!error} max="today" placeholder="Choose date of birth" />
  )
}
const Err = ({ children }) => (children ? <span data-field-error className="text-[12px] font-semibold text-[#b4323c]">{children}</span> : null)
/** After a failed save, bring the first problem (banner or field message) into view — Save is at the bottom of the page. */
const scrollToProblem = () => requestAnimationFrame(() => {
  const el = document.querySelector('[data-form-banner], [data-field-error]')
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.closest('[data-field]')?.querySelector('input, button')?.focus({ preventScroll: true })
})

function Form({ c }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { reference } = useAuth()
  const genders = reference?.genders ?? []
  const states = reference?.states ?? []
  const prefs = reference?.preferredContacts ?? Object.keys(PREF)
  const [f, setF] = useState(() => ({
    name: c?.name ?? '', dob: toInput(c?.dob), gender: c?.gender ?? '', mobile: c ? fmtMobile(c.mobile) : '', altMobile: c?.altMobile ? fmtMobile(c.altMobile) : '',
    email: c?.email ?? '', preferredContact: c?.preferredContact ?? '', occupation: c?.occupation ?? '', anniversary: toInput(c?.anniversary),
    addressLine1: c?.address?.line1 ?? '', addressLine2: c?.address?.line2 ?? '', city: c?.address?.city ?? c?.city ?? '', state: c?.address?.state ?? '', pin: c?.address?.pin ?? '',
  }))
  const [clientErr, setClientErr] = useState({})
  const set = (k) => (v) => {
    setF((s) => ({ ...s, [k]: v }))
    setClientErr((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }
  const [warnings, setWarnings] = useState(null)

  // Client-side checks before hitting the API: required name + mobile, 10-digit mobile(s), email format.
  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = "Enter the customer's full name."
    const mErr = mobileError(f.mobile, { required: true })
    if (mErr) e.mobile = mErr
    const aErr = mobileError(f.altMobile, { label: 'Alternate mobile' })
    if (aErr) e.altMobile = aErr
    else if (f.altMobile.trim() && cleanMobile(f.altMobile) === cleanMobile(f.mobile)) e.altMobile = 'Alternate mobile can’t be the same as the primary.'
    if (f.email.trim() && !isEmail(f.email)) e.email = 'Enter a valid email address.'
    return e
  }
  const submit = (opts = {}) => {
    const e = validate()
    setClientErr(e)
    if (Object.keys(e).length) { toast('Please correct the highlighted fields.', 'error'); scrollToProblem(); return }
    save.run(opts)
  }

  const save = useMutation(async ({ confirm = [] }, o) => {
    const body = {
      name: f.name.trim(), mobile: cleanMobile(f.mobile), altMobile: cleanMobile(f.altMobile) || null, email: f.email.trim() || null,
      dob: toApi(f.dob), gender: f.gender || null, preferredContact: f.preferredContact || null, occupation: f.occupation.trim() || null,
      anniversary: toApi(f.anniversary), addressLine1: f.addressLine1.trim() || null, addressLine2: f.addressLine2.trim() || null,
      city: f.city.trim() || null, state: f.state || null, pin: f.pin.trim() || null, confirm: confirm.length ? confirm : undefined,
    }
    return c ? api.customers.update(c.id, { version: c.version, ...body }) : api.customers.create(body, o)
  }, {
    invalidates: ['customers', 'customer', 'customers:stats', 'dashboard'],
    onSuccess: (r) => { toast(r.meta?.message || 'Saved.'); setWarnings(null); navigate(`/customers/${r.data.id}`) },
    onError: (e) => { if (e instanceof ApiError && e.code === 'CONFIRMATION_REQUIRED') setWarnings(e.details?.warnings ?? [{ message: e.message, messageId: e.messageId }]) },
  })
  const fe = { ...save.fieldErrors, ...clientErr }
  // Server-side field errors, a general error or duplicate warnings: show them instead of leaving the user at the bottom.
  useEffect(() => { if (save.error || warnings) scrollToProblem() }, [save.error, warnings])
  const general = save.error && save.error.code !== 'CONFIRMATION_REQUIRED' ? save.error.message : null // with field errors this is the API's summary
  const opt = (list, labelOf) => [NONE, ...list.map(labelOf)]
  const pick = (list, labelOf, k) => (v) => set(k)(v === NONE ? '' : list.find((x) => labelOf(x) === v) ?? '')
  const genderLabel = (g) => titleCase(g)
  const prefLabel = (p) => PREF[p] ?? titleCase(p)

  const action = (
    <button type="button" disabled={save.busy} onClick={() => submit()} className="inline-flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)] hover:bg-navy-700 disabled:opacity-60">
      <Icon name="check" size={18} />{save.busy ? 'Saving…' : c ? 'Save changes' : 'Save customer'}
    </button>
  )

  return (
    <LeadShell
      active="customers"
      breadcrumb={c ? `POLICY HOLDERS  /  ${c.name.toUpperCase()}  /  EDIT DETAILS` : 'POLICY HOLDERS  /  NEW CUSTOMER'}
      title={c ? `Edit ${c.name}` : 'New customer'}
      subtitle={c ? `${c.number} · changes are kept in the activity history` : 'Add someone directly, without a lead.'}
      actions={action}
      side={
        <>
          <aside className={cx('flex flex-col gap-3 rounded-[28px] bg-rail p-6', cardShadow)}>
            <span className="flex size-12 items-center justify-center rounded-full bg-white/10"><Icon name="lock" size={22} className="text-pink-300" /></span>
            <p className="text-[16px] font-bold text-white">PAN and Aadhaar come later</p>
            <p className="text-[13px] leading-[20px] font-medium text-[#c9d6ea]">Record consent to store personal data first, on the Consent tab. Numbers are stored encrypted and always shown masked.</p>
          </aside>
          {!c && <AfterSave tone="mt-[60px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7]" steps={AFTER} />}
        </>
      }
    >
      {(general || warnings) && (
        <div data-form-banner className={cx('mb-[18px] flex scroll-mt-28 items-center gap-2.5 rounded-[16px] px-3.5 py-3', warnings ? 'bg-[#fbf1e1] text-[#8a5a12]' : 'border border-[#f2c4c8] bg-[#fff7f7] text-[#b4323c]')}>
          <Icon name="alert" size={18} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">{(warnings ?? [{ message: general }]).map((w, i) => <p key={i} className="text-[13px] font-bold">{w.message}</p>)}</div>
          {warnings && <button type="button" onClick={() => save.run({ confirm: warnings.map((w) => w.messageId) })} className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Save anyway</button>}
        </div>
      )}
      <FormCard title="Identity" gap={16}>
        <Row>
          <FField label="Full name *"><TInput value={f.name} onChange={set('name')} /><Err>{fe.name}</Err></FField>
          <FField label="Date of birth" hint="Some products need it at quotation."><DateBox value={f.dob} onChange={set('dob')} error={fe.dob} /><Err>{fe.dob}</Err></FField>
          <FField label="Gender"><SInput value={f.gender ? genderLabel(f.gender) : NONE} onChange={pick(genders, genderLabel, 'gender')} options={opt(genders, genderLabel)} /><Err>{fe.gender}</Err></FField>
        </Row>
      </FormCard>

      <FormCard title="Contact" gap={16} className="mt-[18px]">
        <Row>
          <FField label="Primary mobile *"><TInput prefix="+91" value={f.mobile} onChange={(v) => set('mobile')(typeMobile(v))} placeholder="98765 43210" /><Err>{fe.mobile}</Err></FField>
          <FField label="Alternate mobile"><TInput prefix="+91" value={f.altMobile} onChange={(v) => set('altMobile')(typeMobile(v))} placeholder="Optional" /><Err>{fe.altMobile}</Err></FField>
          <FField label="Email"><TInput leading="mail" value={f.email} onChange={set('email')} /><Err>{fe.email}</Err></FField>
        </Row>
        <Row>
          <FField label="Preferred contact"><SInput value={f.preferredContact ? prefLabel(f.preferredContact) : NONE} onChange={pick(prefs, prefLabel, 'preferredContact')} options={opt(prefs, prefLabel)} /></FField>
          <FField label="Occupation"><TInput value={f.occupation} onChange={set('occupation')} /><Err>{fe.occupation}</Err></FField>
          <FField label="Wedding anniversary"><DateBox value={f.anniversary} onChange={set('anniversary')} error={fe.anniversary} /><Err>{fe.anniversary}</Err></FField>
        </Row>
      </FormCard>

      <FormCard title="Address" gap={16} className="mt-[18px]">
        <FField label="Address"><TInput value={f.addressLine1} onChange={set('addressLine1')} /><Err>{fe.addressLine1}</Err></FField>
        <Row>
          <FField label="City"><TInput value={f.city} onChange={set('city')} /><Err>{fe.city}</Err></FField>
          <FField label="State"><SInput value={f.state || NONE} onChange={pick(states, (x) => x, 'state')} options={opt(states, (x) => x)} /><Err>{fe.state}</Err></FField>
          <FField label="PIN code"><TInput value={f.pin} onChange={set('pin')} /><Err>{fe.pin}</Err></FField>
        </Row>
      </FormCard>
    </LeadShell>
  )
}