// Batch 4 · Consent on the live API (P-17): CS1 record · CS2 recorded (toast) · CS3 proof · CS4 withdraw · CS5 withdrawn · CS6/CS7 personal data.
import { useState } from 'react'
import { api, useQuery } from '../api'
import { useAuth } from '../auth/AuthProvider'
import Icon from '../components/Icon'
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
