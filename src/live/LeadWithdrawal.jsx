// Q97 (client decision): a person withdrew their ad-form submission (LinkedIn "DELETED"). Their answers are already
// cleared; the advisor keeps the lead or removes it with its tasks.
//   POST /leads/:id/withdrawal/keep {version} · POST /leads/:id/remove {version, reason?}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { api } from '../api'
import { fmtDateTime } from '../api/format'
import { ActionDialog, Field, useAct } from './kit'

const CH = { LINKEDIN: 'LinkedIn', META: 'Meta', GOOGLE: 'Google', WEBSITE: 'website' }

export function WithdrawalCard({ lead }) {
  const w = lead.withdrawal
  const [ask, setAsk] = useState(false)
  const { act, busy } = useAct()
  const kept = w.decision === 'KEPT'
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-[#f1d9a8] bg-[#fff9ef] p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#fbf1e1] text-[#8a5a12]"><Icon name="alert" size={18} /></span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[15px] font-bold text-ink">{lead.name} withdrew their {CH[w.channel] ?? w.channel} form</p>
          <p className="text-[12px] font-medium text-[#8a5a12]">{fmtDateTime(w.at)} · their form answers were cleared{kept ? ' · you kept the lead' : ''}</p>
        </div>
      </div>
      {!kept && <p className="text-[13px] font-medium text-ink-2">Keep the lead if you are still in touch with them, or remove it with its tasks.</p>}
      <div className="flex gap-2">
        {!kept && <button type="button" disabled={busy} onClick={() => act(() => api.leads.keepAfterWithdrawal(lead.id, lead.version), { invalidates: ['lead', 'leads'] })} className="flex h-10 items-center rounded-[20px] border border-line bg-white px-4 text-[13px] font-semibold text-ink hover:bg-tile">Keep lead</button>}
        {lead.canRemove && <button type="button" onClick={() => setAsk(true)} className="flex h-10 items-center gap-2 rounded-[20px] border border-[#f2c4c8] bg-white px-4 text-[13px] font-semibold text-[#b4323c] hover:bg-[#fdf6f7]"><Icon name="x" size={15} />Remove lead</button>}
      </div>
      {ask && <RemoveDialog lead={lead} onClose={() => setAsk(false)} />}
    </div>
  )
}

function RemoveDialog({ lead, onClose }) {
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const { act, busy, error } = useAct()
  return (
    <ActionDialog title={`Remove ${lead.name}?`} body="The lead, its follow-ups and its tasks are deleted. This cannot be undone. The audit log keeps only the lead number and the reason." icon="x" tone="danger" confirm="Remove lead" busy={busy} error={error} onClose={onClose}
      onConfirm={() => act(() => api.leads.remove(lead.id, { version: lead.version, reason: reason || null }), { invalidates: ['leads', 'lead', 'dashboard', 'tasks', 'pipelines'], quiet: true, onDone: () => navigate('/leads', { replace: true }) })}>
      <Field label="Reason (optional)" value={reason} onChange={setReason} placeholder="e.g. Person asked to be removed" />
    </ActionDialog>
  )
}