// Batch 4 · Consent on the live API (P-17): CS1 record · CS2 recorded (toast) · CS3 proof · CS4 withdraw · CS5 withdrawn · CS6/CS7 personal data.
// Consent requests (Nov 2026): the person confirms consent themselves from a link the advisor sends by email, WhatsApp
// or Telegram (RequestConsentDialog, ConsentRequests). RecordConsentDialog is only offered when the account's
// consent_customer_confirms switch is off (the API answers CU-50 otherwise).
import { useState } from 'react'
import { api, useQuery } from '../api'
import { fmtDate } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { useToast } from '../components/LiveToast'
import { SChip } from '../screens/sales/_parts'
import { ActionDialog, Field, useAct, label } from './kit'

const CHANNELS = [['WHATSAPP', 'WhatsApp'], ['EMAIL', 'Email'], ['SMS', 'SMS']]
const CHANGED = ['consents', 'customer', 'customers', 'activity']
const REASONS = [['ASKED_TO_STOP', 'Asked us to stop'], ['REPLIED_STOP', 'Replied STOP'], ['OTHER', 'Other']]

/** CS1: give consent for one person on one or more channels, or the customer's personal-data consent. */
export function RecordConsentDialog({ customer, people, presetPersonId, personalData = false, onClose }) {
  const { reference } = useAuth()
  const [personId, setPersonId] = useState(presetPersonId ?? people[0]?.id)
  const person = people.find((p) => p.id === personId)
  const [channels, setChannels] = useState(personalData ? ['PERSONAL_DATA'] : ['WHATSAPP'])
  const [howGiven, setHowGiven] = useState('')
  const [declaration, setDeclaration] = useState(false)
  const [proof, setProof] = useState(null)
  const [busyUp, setBusyUp] = useState(false)
  const { act, busy, error, fieldErrors } = useAct()
  const toggle = (c) => setChannels((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
  const save = () => act(() => api.customers.recordConsent(customer.id, {
    personType: person.type, personId, action: 'GIVE', howGiven, declaration, evidenceFileId: proof || undefined,
    ...(channels.length === 1 ? { channel: channels[0] } : { channels }),
  }), { invalidates: CHANGED, quiet: true, onDone: onClose })
  return (
    <ActionDialog title={personalData ? 'Record personal-data consent' : 'Record consent'} icon="check" confirm="Record consent" busy={busy || busyUp} error={error} onConfirm={save} onClose={onClose} width={600}
      disabled={!howGiven || !declaration || !channels.length}
      body={personalData ? `${customer.name} agrees that you may store their PAN, Aadhaar and documents.` : 'Record only what the person actually agreed to. You can withdraw it later and the history is kept.'}>
      {!personalData && (
        <>
          <Field label="Person *" type="select" value={personId} onChange={setPersonId} options={people.map((p) => ({ value: p.id, label: `${p.name} · ${p.relationship}` }))} />
          <div className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-ink">Channels *</span>
            <div className="flex gap-2">{CHANNELS.map(([c, l]) => (
              <button key={c} type="button" onClick={() => toggle(c)} className={`h-[40px] flex-1 rounded-[20px] text-[13px] font-semibold ${channels.includes(c) ? 'bg-navy text-white' : 'bg-panel text-ink'}`}>{l}</button>
            ))}</div>
            {person && channels.some((c) => c !== 'EMAIL') && !person.mobile && <p className="text-[12px] font-semibold text-[#8a5a12]">{person.name} has no mobile number saved. Add one before recording WhatsApp or SMS consent.</p>}
            {person && channels.includes('EMAIL') && !person.email && <p className="text-[12px] font-semibold text-[#8a5a12]">{person.name} has no email saved. Add one before recording email consent.</p>}
          </div>
        </>
      )}
      <Field label="How was it given? *" type="select" value={howGiven} onChange={setHowGiven} error={fieldErrors.howGiven}
        options={['', ...(reference?.consentHowGiven ?? [])].map((h) => ({ value: h, label: h || 'Choose' }))} />
      <label className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">Proof (optional, e.g. the signed form)</span>
        <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink">
          <Icon name={proof ? 'check' : 'folder'} size={16} /><span className="flex-1">{busyUp ? 'Uploading…' : proof ? 'Proof attached' : 'Choose a file'}</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return
            setBusyUp(true)
            try { setProof((await api.files.upload(f, 'CUSTOMER_DOCUMENT')).data.id) } catch { setProof(null) } finally { setBusyUp(false) }
          }} />
        </span>
      </label>
      <Field type="checkbox" label={`I confirm ${person?.name ?? 'the person'} gave this consent.`} value={declaration} onChange={setDeclaration} />
      {fieldErrors.declaration && <p className="text-[12px] font-semibold text-[#b4323c]">{fieldErrors.declaration}</p>}
    </ActionDialog>
  )
}

/** CS4 / CS6: withdraw. Personal-data withdrawal also asks the advisor to confirm they understand its effects. */
export function WithdrawConsentDialog({ customer, person, channel, onClose }) {
  const pd = channel === 'PERSONAL_DATA'
  const [reason, setReason] = useState('ASKED_TO_STOP')
  const [note, setNote] = useState('')
  const [ack, setAck] = useState(false)
  const { act, busy, error, fieldErrors } = useAct()
  const run = () => act(() => api.customers.recordConsent(customer.id, {
    personType: person.type, personId: person.id, channel, action: 'WITHDRAW', withdrawReason: reason, withdrawNote: note.trim() || undefined, acknowledgedEffects: pd ? ack : undefined,
  }), { invalidates: CHANGED, quiet: true, onDone: onClose })
  return (
    <ActionDialog title={pd ? `Withdraw personal-data consent for ${person.name}` : `Withdraw ${label(channel)} consent for ${person.name}`} icon="x" tone="danger" confirm="Withdraw consent" busy={busy} error={error} onConfirm={run} onClose={onClose}
      disabled={(reason === 'OTHER' && !note.trim()) || (pd && !ack)}
      body={pd ? 'You will not be able to add PAN, Aadhaar or documents for this customer until consent is recorded again.' : 'No more automated messages will be sent on this channel. This takes effect at once.'}>
      <Field label="Why? *" type="select" value={reason} onChange={setReason} options={REASONS.map(([v, l]) => ({ value: v, label: l }))} />
      <Field label={reason === 'OTHER' ? 'Note *' : 'Note'} type="textarea" value={note} onChange={setNote} error={fieldErrors.withdrawNote} />
      {pd && <Field type="checkbox" label="I understand the effects of withdrawing personal-data consent." value={ack} onChange={setAck} />}
    </ActionDialog>
  )
}

/** CS3 · consent proof and history of one customer. */
export function ConsentHistoryDialog({ customerId, onClose }) {
  const q = useQuery(['consents', customerId], () => api.customers.consents(customerId))
  const rows = q.data?.history ?? []
  return (
    <ActionDialog title="Consent history" icon="clock" body="Every change, newest first. Nothing is removed." onClose={onClose} width={640}>
      <div className="flex max-h-[360px] flex-col gap-2 overflow-auto">
        {rows.map((h, i) => (
          <div key={i} className="rounded-[14px] bg-panel p-3">
            <p className="text-[13px] font-bold text-ink">{h.person} · {label(h.channel)} · {label(h.to)}</p>
            <p className="text-[12px] font-medium text-muted">{new Date(h.at).toLocaleString('en-IN')}{h.howGiven ? ` · ${h.howGiven}` : ''}{h.note ? ` · ${h.note}` : ''}</p>
          </div>
        ))}
        {!rows.length && <p className="text-[13px] font-medium text-muted">{q.loading ? 'Loading…' : 'No consent recorded yet.'}</p>}
      </div>
    </ActionDialog>
  )
}

/* ───────── Consent requests: the person confirms from a link ───────── */

const ASK = [['WHATSAPP', 'WhatsApp'], ['EMAIL', 'Email'], ['SMS', 'SMS'], ['PERSONAL_DATA', 'Personal data']]
const VIA = [
  { key: 'EMAIL', label: 'Email', icon: 'mail', sub: 'Bimayantra emails the link' },
  { key: 'WHATSAPP', label: 'WhatsApp', icon: 'chat', sub: 'Send it from your WhatsApp' },
  { key: 'TELEGRAM', label: 'Telegram', icon: 'send', sub: 'Send it from your Telegram' },
]
const askLabel = (c) => ASK.find(([k]) => k === c)?.[1] ?? label(c)

/**
 * Ask a person for consent. They get a link (by email from Bimayantra, or from the advisor's own WhatsApp / Telegram),
 * open it, and agree or say no; consent is recorded on the customer only when they agree.
 *   rows: the consent grid rows (to grey out what is already given) · personalData: the customer's personal-data cell
 */
export function RequestConsentDialog({ customer, people, rows = [], personalData, presetPersonId, presetChannels, onClose }) {
  const { toast } = useToast()
  const [personId, setPersonId] = useState(presetPersonId ?? people[0]?.id)
  const person = people.find((p) => p.id === personId)
  const isCustomer = person?.type === 'CUSTOMER'
  const cells = rows.find((r) => r.person.id === personId)?.channels ?? {}
  const statusOf = (c) => (c === 'PERSONAL_DATA' ? (isCustomer ? personalData?.status : null) : cells[c]?.status)
  const blockedWhy = (c) => {
    if (c === 'PERSONAL_DATA' && !isCustomer) return 'Only for the customer'
    if (statusOf(c) === 'GIVEN') return 'Already given'
    if ((c === 'WHATSAPP' || c === 'SMS') && !person?.mobile) return 'No mobile saved'
    if (c === 'EMAIL' && !person?.email) return 'No email saved'
    return null
  }
  const [channels, setChannels] = useState(() => (presetChannels ?? ['WHATSAPP']).filter((c) => !blockedWhy(c)))
  const viaBlocked = (v) => (v === 'EMAIL' && !person?.email ? 'No email saved' : v === 'WHATSAPP' && !person?.mobile ? 'No mobile saved' : null)
  const [via, setVia] = useState(person?.email ? 'EMAIL' : person?.mobile ? 'WHATSAPP' : 'TELEGRAM')
  const [result, setResult] = useState(null)
  const { act, busy, error, fieldErrors } = useAct()
  const toggle = (c) => setChannels((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
  const pickPerson = (id) => {
    setPersonId(id)
    const p = people.find((x) => x.id === id)
    setChannels((s) => s.filter((c) => c !== 'PERSONAL_DATA' || p?.type === 'CUSTOMER'))
    if (viaBlockedFor(p, via)) setVia(p?.email ? 'EMAIL' : p?.mobile ? 'WHATSAPP' : 'TELEGRAM')
  }
  const send = () => act(() => api.customers.requestConsent(customer.id, { personType: person.type, personId, channels, via }), {
    invalidates: ['consents', 'customer', 'activity'], quiet: true, onDone: (r) => setResult(r.data),
  })
  const copy = async (link) => { try { await navigator.clipboard.writeText(link); toast('Link copied.') } catch { toast('Could not copy. Select the link and copy it.', 'error') } }

  if (result) {
    const r = result.request
    const open = result.whatsappUrl ?? result.telegramUrl
    return (
      <ActionDialog title={r.via === 'EMAIL' ? 'Consent request emailed' : `Send the request on ${VIA.find((v) => v.key === r.via)?.label}`} icon={r.via === 'EMAIL' ? 'mail' : 'send'} onClose={onClose} width={560}
        body={r.via === 'EMAIL'
          ? `${r.person.name} will get an email at ${r.sentTo}. Consent is recorded when they open the link and agree.`
          : `Open ${r.via === 'WHATSAPP' ? 'WhatsApp' : 'Telegram'} with the message ready${r.via === 'TELEGRAM' ? ', pick ' + r.person.name + "'s chat" : ''} and send it. Consent is recorded when they open the link and agree.`}>
        {open && (
          <a href={open} target="_blank" rel="noreferrer" className="flex h-[50px] items-center justify-center gap-2 rounded-[25px] bg-navy text-[15px] font-semibold text-white hover:bg-navy-700">
            <Icon name={r.via === 'WHATSAPP' ? 'chat' : 'send'} size={18} />Open {r.via === 'WHATSAPP' ? 'WhatsApp' : 'Telegram'}
          </a>
        )}
        <div className="flex flex-col gap-2 rounded-[16px] bg-panel p-3.5">
          <span className="text-[12px] font-semibold text-muted">Or copy the link and send it any other way</span>
          <div className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink select-all">{result.link}</span>
            <button type="button" onClick={() => copy(result.link)} className="flex h-9 shrink-0 items-center gap-1.5 rounded-[18px] border border-line bg-white px-3 text-[13px] font-semibold text-ink hover:bg-tile"><Icon name="link" size={15} />Copy</button>
          </div>
          <span className="text-[12px] font-medium text-muted">Valid until {fmtDate(r.expiresAt)}. It works once.</span>
        </div>
      </ActionDialog>
    )
  }

  return (
    <ActionDialog title="Request consent" icon="send" confirm={via === 'EMAIL' ? 'Email the request' : 'Create the request'} busy={busy} error={error} onConfirm={send} onClose={onClose} width={600}
      disabled={!person || !channels.length || !!viaBlocked(via)}
      body="The person gets a link, reads what they are agreeing to, and confirms it themselves. Nothing is recorded until they agree.">
      {people.length > 1 && (
        <Field label="Person *" type="select" value={personId} onChange={pickPerson} options={people.map((p) => ({ value: p.id, label: `${p.name} · ${p.relationship}` }))} />
      )}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">Ask consent for *</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ASK.map(([c, l]) => {
            const why = blockedWhy(c)
            const on = channels.includes(c) && !why
            return (
              <button key={c} type="button" disabled={!!why} onClick={() => toggle(c)} title={why ?? ''}
                className={cx('flex min-h-[48px] flex-col items-center justify-center rounded-[18px] px-2 py-1.5 text-[13px] font-semibold disabled:cursor-not-allowed', on ? 'bg-navy text-white' : 'bg-panel text-ink', why && 'opacity-55')}>
                <span className="flex items-center gap-1">{on && <Icon name="check" size={13} />}{l}</span>
                {why && <span className="text-[10px] font-medium">{why}</span>}
              </button>
            )
          })}
        </div>
        {fieldErrors.channels && <p className="text-[12px] font-semibold text-[#b4323c]">{fieldErrors.channels}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">Send the request by *</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {VIA.map((v) => {
            const why = viaBlocked(v.key)
            const on = via === v.key
            return (
              <button key={v.key} type="button" disabled={!!why} onClick={() => setVia(v.key)}
                className={cx('flex items-center gap-2.5 rounded-[18px] border px-3 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-55', on ? 'border-navy bg-[#eef1f8]' : 'border-line bg-white hover:bg-tile')}>
                <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full', on ? 'bg-navy text-white' : 'bg-panel text-ink')}><Icon name={v.icon} size={16} /></span>
                <span className="flex min-w-0 flex-col"><span className="text-[13px] font-bold text-ink">{v.label}</span><span className="text-[11px] font-medium text-muted">{why ?? v.sub}</span></span>
              </button>
            )
          })}
        </div>
        {via === 'EMAIL' && person?.email && <p className="text-[12px] font-medium text-muted">Goes to {person.email}.</p>}
      </div>
    </ActionDialog>
  )
}
const viaBlockedFor = (p, v) => (v === 'EMAIL' && !p?.email) || (v === 'WHATSAPP' && !p?.mobile)

const RSTATUS = {
  PENDING: ['amber', 'clock', 'Waiting'],
  CONFIRMED: ['green', 'check', 'Confirmed'],
  DECLINED: ['red', 'x', 'Said no'],
  CANCELLED: ['gray', null, 'Cancelled'],
  EXPIRED: ['gray', null, 'Expired'],
}
const VIA_ICON = { EMAIL: 'mail', WHATSAPP: 'chat', TELEGRAM: 'send' }

/** Recent consent requests of one customer, with what happened to each; an open one can be cancelled. */
export function ConsentRequests({ customerId, requests = [], active }) {
  const { act, busy } = useAct()
  const [cancelling, setCancelling] = useState(null)
  if (!requests.length) return <p className="text-[13px] font-medium text-muted">No consent requests yet.</p>
  return (
    <div className="flex flex-col gap-2.5">
      {requests.map((r) => {
        const [tone, icon, txt] = RSTATUS[r.status] ?? RSTATUS.CANCELLED
        const mailProblem = r.via === 'EMAIL' && ['FAILED', 'SKIPPED'].includes(r.email?.status) ? r.email.reason || 'Not sent' : null
        const asked = r.channels.map(askLabel).join(', ')
        const line = r.status === 'CONFIRMED'
          ? `Agreed to ${r.given.map(askLabel).join(', ')}${r.declined.length ? `; not ${r.declined.map(askLabel).join(', ')}` : ''}`
          : [`Sent ${fmtDate(r.createdAt, { year: false })}`, r.sentTo, r.openedAt && r.status === 'PENDING' ? 'opened' : null, r.closedReason].filter(Boolean).join(' · ')
        return (
          <div key={r.id} className="flex items-start gap-3 rounded-[16px] bg-panel p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink"><Icon name={VIA_ICON[r.via] ?? 'send'} size={16} /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-bold text-ink">{r.person.name}</p>
                <SChip tone={tone} icon={icon}>{txt}</SChip>
              </div>
              <p className="text-[12px] font-medium text-ink-2">{asked}</p>
              <p className="text-[11px] font-medium text-muted">{line}</p>
              {mailProblem && <p className="text-[11px] font-semibold text-[#b4323c]">Email not sent: {mailProblem}</p>}
            </div>
            {active && r.status === 'PENDING' && (
              <button type="button" disabled={busy && cancelling === r.id} className="shrink-0 text-[11px] font-bold text-[#b4323c] hover:underline disabled:opacity-60"
                onClick={() => { setCancelling(r.id); act(() => api.customers.cancelConsentRequest(customerId, r.id), { invalidates: ['consents'] }) }}>
                Cancel
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}