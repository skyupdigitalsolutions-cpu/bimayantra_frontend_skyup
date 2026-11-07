// F-03 · Proposal wizard on the live API (R1–R7, 09) at /proposals/:id/edit, and PRC (cancel a draft, B-02).
//   Members (locked, PRP-06) → Declarations → Nominees → KYC check → Premium (recorded payment) → Review and submit.
// PUT /proposals/:id {version, declarations, nominees} saves; GET /proposals/:id returns `readiness` (what Submit still needs);
// POST …/submit (advisor only) creates the policy record; POST …/cancel abandons a draft.
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Stepper, cx } from '../components/ui'
import { Header } from '../screens/catalogue/_parts'
import { api, invalidate, useQuery } from '../api'
import { fmtMoney } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { ActionDialog, ErrorNote, Field, useAct } from './kit'
import { ErrorPanel, LoadingPanel } from './common'

const STEPS = ['Members', 'Declarations', 'Nominees', 'KYC check', 'Premium', 'Review']
const CARD = 'rounded-[28px] bg-white p-7 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const YES_NO = [{ value: '', label: 'Choose' }, { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]
const CANCEL_REASONS = ['Customer changed mind', 'Wrong quotation selected', 'Started by mistake', 'Other']

export default function LiveProposalWizard() {
  const { id } = useParams()
  const q = useQuery(['proposal', id], () => api.proposals.get(id))
  if (q.error) return <ErrorPanel active="proposals" error={q.error} back="/proposals" />
  if (!q.data) return <LoadingPanel active="proposals" />
  if (q.data.status !== 'DRAFT') return <ErrorPanel active="proposals" error={{ message: 'This proposal is no longer a draft, so it cannot be edited.' }} back={`/proposals/${id}`} />
  return <Wizard key={q.data.id} p={q.data} />
}

function Wizard({ p }) {
  const navigate = useNavigate()
  const { can } = useAuth()
  const [step, setStep] = useState(0)
  const [decl, setDecl] = useState(() => Object.fromEntries((p.members ?? []).map((m) => [m.name, Object.fromEntries((p.questions ?? []).map((qn) => [qn, p.declarations?.find((d) => d.member === m.name)?.answers?.[qn] ?? {}]))])))
  const [nominees, setNominees] = useState(() => (p.nominees ?? []).map((n) => ({ ...n, dob: n.dob?.slice(0, 10) ?? '', appointee: n.appointee ? { ...n.appointee, dob: n.appointee.dob?.slice(0, 10) ?? '' } : null })))
  const [cancel, setCancel] = useState(false)
  const { act, busy, error, fieldErrors } = useAct()
  const readiness = p.readiness ?? { problems: [] }

  const answered = (a) => a && a.answer !== undefined
  const body = () => ({
    version: p.version,
    declarations: (p.members ?? []).map((m) => ({
      member: m.name,
      answers: Object.fromEntries(Object.entries(decl[m.name] ?? {}).filter(([, a]) => answered(a)).map(([k, a]) => [k, a.answer ? { answer: true, condition: a.condition?.trim() || undefined, since: a.since?.trim() || undefined, treatment: a.treatment?.trim() || undefined } : { answer: false }])),
    })).filter((d) => Object.keys(d.answers).length),
    nominees: nominees.map((n) => ({ name: n.name.trim(), relationship: n.relationship.trim(), dob: n.dob, share: Number(n.share), appointee: n.appointee?.name ? { name: n.appointee.name.trim(), dob: n.appointee.dob } : null })),
  })
  const save = (next) => act(() => api.proposals.save(p.id, body()), { invalidates: ['proposal', 'proposals'], quiet: true, success: false, onDone: () => setStep(next) })
  const submit = () => act(() => api.proposals.submit(p.id, { version: p.version }), {
    invalidates: ['proposal', 'proposals', 'policies', 'payments'], quiet: true, onDone: () => navigate(`/proposals/${p.id}`), // act() already shows the API's message
  })
  const total = nominees.reduce((t, n) => t + (Number(n.share) || 0), 0)

  return (
    <AppLayout active="proposals">
      <Header breadcrumb={`SALES  /  PROPOSALS  /  ${p.number}`} title={p.number} subtitle="Prepare the proposal, then submit it. Submitting creates the policy record." />
      <Stepper className="mt-4" steps={STEPS} current={step} />
      <div className={cx('mt-5 flex flex-col gap-5', CARD)}>
        {step === 0 && (
          <>
            <p className="text-[19px] font-bold text-ink">Covered members</p>
            <p className="rounded-[14px] bg-panel px-4 py-3 text-[13px] font-semibold text-ink-2">Covered members are locked for this proposal. Revise the quotation to change them.</p>
            {(p.members ?? []).map((m) => <p key={m.name} className="text-[14px] font-bold text-ink">{m.name} <span className="font-medium text-muted">· {m.relationship}{m.age != null ? ` · ${m.age} years` : ''}</span></p>)}
          </>
        )}
        {step === 1 && (
          <>
            <p className="text-[19px] font-bold text-ink">Declarations</p>
            <p className="text-[13px] font-medium text-muted">Answer every question for every member. Declaring a condition is still right: a hidden condition can void a claim.</p>
            {(p.members ?? []).map((m) => (
              <div key={m.name} className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
                <p className="text-[14px] font-bold text-ink">{m.name}</p>
                {(p.questions ?? []).map((qn) => {
                  const a = decl[m.name]?.[qn] ?? {}
                  const put = (patch) => setDecl((s) => ({ ...s, [m.name]: { ...s[m.name], [qn]: { ...a, ...patch } } }))
                  return (
                    <div key={qn} className="flex flex-col gap-2">
                      <Field label={qn} type="select" value={a.answer === undefined ? '' : a.answer ? 'yes' : 'no'} onChange={(v) => put({ answer: v === '' ? undefined : v === 'yes' })} options={YES_NO} />
                      {a.answer && (
                        <div className="grid grid-cols-3 gap-3">
                          <Field label="Condition *" value={a.condition ?? ''} onChange={(v) => put({ condition: v })} />
                          <Field label="Since" value={a.since ?? ''} onChange={(v) => put({ since: v })} />
                          <Field label="Treatment" value={a.treatment ?? ''} onChange={(v) => put({ treatment: v })} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {p.warning && <ErrorNote error={p.warning} />}
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-[19px] font-bold text-ink">Nominees</p>
            <p className="text-[13px] font-medium text-muted">Shares must add up to 100%. A nominee under 18 needs an adult appointee.</p>
            {nominees.map((n, i) => {
              const put = (patch) => setNominees((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)))
              return (
                <div key={i} className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
                  <div className="grid grid-cols-4 gap-3">
                    <Field label="Name *" value={n.name} onChange={(v) => put({ name: v })} error={fieldErrors[`nominees.${i}.name`]} />
                    <Field label="Relationship *" value={n.relationship} onChange={(v) => put({ relationship: v })} />
                    <Field label="Date of birth *" type="date" value={n.dob} onChange={(v) => put({ dob: v })} />
                    <Field label="Share % *" type="number" value={n.share} onChange={(v) => put({ share: v })} error={fieldErrors[`nominees.${i}.share`]} />
                  </div>
                  <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                    <Field label="Appointee name (if a minor)" value={n.appointee?.name ?? ''} onChange={(v) => put({ appointee: { name: v, dob: n.appointee?.dob ?? '' } })} error={fieldErrors[`nominees.${i}.appointee`]} />
                    <Field label="Appointee date of birth" type="date" value={n.appointee?.dob ?? ''} onChange={(v) => put({ appointee: { name: n.appointee?.name ?? '', dob: v } })} />
                    <button type="button" onClick={() => setNominees((s) => s.filter((_, j) => j !== i))} className="h-[50px] px-3 text-[13px] font-semibold text-[#b4323c] underline">Remove</button>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setNominees((s) => [...s, { name: '', relationship: '', dob: '', share: nominees.length ? '' : 100, appointee: null }])} className="flex h-[42px] items-center gap-2 rounded-[22px] border border-line px-5 text-[13px] font-semibold text-ink"><Icon name="plus" size={14} />Add nominee</button>
              {nominees.length > 0 && <span className={cx('text-[13px] font-semibold', total === 100 ? 'text-[#127650]' : 'text-[#b4323c]')}>Total {total}%</span>}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <p className="text-[19px] font-bold text-ink">KYC check</p>
            <Check ok={readiness.kyc} yes="Aadhaar and PAN are confirmed for the customer." no={`Add and confirm Aadhaar and PAN for the customer in their Documents tab before submitting.`} />
            <Link to={`/customers/${p.customerId}/documents`} className="self-start text-[13px] font-semibold text-blue underline">Open the customer’s documents</Link>
          </>
        )}
        {step === 4 && (
          <>
            <p className="text-[19px] font-bold text-ink">Premium and payment</p>
            <Check ok={!!readiness.paid} yes={`Payment of ${fmtMoney(readiness.paid?.amount)} recorded (${readiness.paid?.mode ?? ''}), as recorded by the advisor.`} no="No payment is recorded on the quotation yet. Record the customer’s payment on the quotation before submitting." />
            <Link to={`/quotations/${p.quotationId}`} className="self-start text-[13px] font-semibold text-blue underline">Open the quotation</Link>
          </>
        )}
        {step === 5 && (
          <>
            <p className="text-[19px] font-bold text-ink">Review and submit</p>
            {readiness.problems.length === 0
              ? <Check ok yes="Everything the insurer needs is ready." />
              : <div className="flex flex-col gap-2">{readiness.problems.map((x, i) => <Check key={i} ok={false} no={x.message} />)}</div>}
            {!can?.('proposals.submit') && <p className="text-[13px] font-semibold text-[#8a5a12]">Only the advisor can submit a proposal.</p>}
          </>
        )}
        <ErrorNote error={error && !Object.keys(fieldErrors).length ? error : null} />
        {Object.keys(fieldErrors).length > 0 && <ErrorNote error={error} />}
        <div className="flex items-center gap-3">
          <button type="button" disabled={step === 0 || busy} onClick={() => setStep(step - 1)} className="h-[48px] w-[140px] rounded-[24px] border border-line text-[14px] font-semibold text-ink disabled:opacity-40">Back</button>
          <button type="button" onClick={() => setCancel(true)} className="text-[13px] font-semibold text-[#b4323c] underline">Cancel this proposal</button>
          <span className="flex-1" />
          {step === 1 || step === 2
            ? <button type="button" disabled={busy} onClick={() => save(step + 1)} className="h-[48px] w-[200px] rounded-[24px] bg-navy text-[14px] font-semibold text-white disabled:opacity-60">{busy ? 'Saving…' : 'Save and continue'}</button>
            : step < 5
              ? <button type="button" onClick={() => setStep(step + 1)} className="h-[48px] w-[200px] rounded-[24px] bg-navy text-[14px] font-semibold text-white">Continue</button>
              : <button type="button" disabled={busy || readiness.problems.length > 0 || !can?.('proposals.submit')} onClick={submit} className="h-[48px] w-[220px] rounded-[24px] bg-navy text-[14px] font-semibold text-white disabled:opacity-50">{busy ? 'Submitting…' : 'Submit proposal'}</button>}
        </div>
      </div>
      {cancel && <CancelProposalDialog p={p} onClose={() => setCancel(false)} onDone={() => navigate('/proposals')} />}
    </AppLayout>
  )
}

const Check = ({ ok, yes, no }) => (
  <div className={cx('flex items-start gap-2.5 rounded-[14px] px-4 py-3 text-[13px] font-semibold', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbf1e1] text-[#8a5a12]')}>
    <Icon name={ok ? 'check' : 'alert'} size={16} className="mt-px shrink-0" /><span>{ok ? yes : no}</span>
  </div>
)

/** PRC · cancel a DRAFT proposal (POST /proposals/:id/cancel). The quotation can start a new proposal afterwards. */
export function CancelProposalDialog({ p, onClose, onDone }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors } = useAct()
  const run = () => act(() => api.proposals.cancel(p.id, { version: p.version, reason, note: note.trim() || undefined }), {
    invalidates: ['proposal', 'proposals', 'quotation', 'activity'], quiet: false, onDone: () => { invalidate('proposals'); onDone?.(); onClose() },
  })
  return (
    <ActionDialog title={`Cancel proposal ${p.number}?`} icon="x" tone="danger" confirm="Cancel proposal" busy={busy} error={error} onConfirm={run} onClose={onClose}
      body="Nothing was sent to the insurer. The quotation stays as it is and you can start a new proposal from it.">
      <Field label="Reason *" type="select" value={reason} onChange={setReason} options={CANCEL_REASONS} error={fieldErrors.reason} />
      <Field label="Note" type="textarea" value={note} onChange={setNote} error={fieldErrors.note} />
    </ActionDialog>
  )
}
