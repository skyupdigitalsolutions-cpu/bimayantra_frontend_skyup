// 03 · Lead detail (Figma 8:809) with the LS1–LS6 actions as real dialogs:
//   GET /leads/:id, GET /leads/:id/timeline, POST /leads/:id/status, POST /leads/:id/contacts, PATCH /leads/:id,
//   POST /tasks/:id/done (follow-up task). Convert opens /leads/:id/convert, Edit opens /leads/:id/edit.
import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import LeadDetailBase from '../screens/sales/_lead'
import { Scrim, Dialog, Drawer, DialogTitle, DialogText, DialogIcon, RadioOption, FieldLabel, TextField, SelectField, AreaField, FootButton } from '../screens/states-lead/_parts'
import { api, useQuery, useMutation, invalidate } from '../api'
import { daysFromToday, fmtDate, fmtDateTime, fmtMobile, fmtTime, initials, istDay, titleCase, LEAD_STATUS_LABEL, cleanMobile } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { LoadingPanel, ErrorPanel } from './common'
import { LeadAnswersInline } from './CampaignSetup'
import { WithdrawalCard } from './LeadWithdrawal'

const STATUS_CHIP = {
  NEW: { tone: 'blue', icon: 'user-plus' }, CONTACTED: { tone: 'violet', icon: 'phone' }, QUALIFIED: { tone: 'green', icon: 'check' },
  FOLLOW_UP: { tone: 'amber', icon: 'clock' }, CONVERTED: { tone: 'green', icon: 'check' }, LOST: { tone: 'gray', icon: 'x' },
}
const STAGE_DOT = { NEW: '#1f5fd6', CONTACTED: '#5b3fb8', QUALIFIED: '#127650', FOLLOW_UP: '#b7791f', CONVERTED: '#127650', LOST: '#7a8699' }
const STAGE_TONE = { NEW: 'blue', CONTACTED: 'violet', QUALIFIED: 'green', FOLLOW_UP: 'amber', CONVERTED: 'green', LOST: 'gray' }
const MOVE_SUB = { NEW: 'Not contacted yet', CONTACTED: 'You spoke to them', QUALIFIED: 'Needs and budget confirmed', FOLLOW_UP: 'Asks for a follow-up date', LOST: 'Asks for a reason' }
const OUTCOMES = [
  { key: 'SPOKE_TO_CUSTOMER', title: 'Spoke to the customer' },
  { key: 'NOT_REACHABLE', title: 'Not reachable' },
  { key: 'ASKED_TO_CALL_BACK', title: 'Asked to call back', sub: 'Sets a follow-up date' },
]
const CHANNELS = ['Call', 'WhatsApp', 'Email', 'Meeting']
const CHANNEL_CODE = { Call: 'CALL', WhatsApp: 'WHATSAPP', Email: 'EMAIL', Meeting: 'MEETING' }
const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const t12 = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
const TIME_OPTIONS = TIMES.map((t) => ({ value: t, label: t12(t) }))
/** IST date + time → ISO with offset, as the API's futureDateTime() expects */
const atIst = (date, time) => (date && time ? `${date}T${time}:00+05:30` : null)

function leadView(l, timeline) {
  const d = l.nextFollowUpAt ? daysFromToday(l.nextFollowUpAt) : null
  const followChip = d === null ? null : d < 0 ? { tone: 'red', icon: 'alert', label: `Overdue ${-d} day${d === -1 ? '' : 's'}` } : d === 0 ? { tone: 'amber', icon: 'clock', label: 'Today' } : { tone: 'blue', icon: 'clock', label: `In ${d} day${d === 1 ? '' : 's'}` }
  const sourceExtra = l.referrer ? ` · ${l.referrer.name}` : l.referredBy ? ` · ${l.referredBy.name}` : l.campaign ? ` · ${l.campaign}` : ''
  const contactRows = (l.contacts || []).map((c) => ({ at: c.at, icon: c.outcome === 'SPOKE_TO_CUSTOMER' ? 'phone' : 'chat', bg: '#fde8c9', title: `${c.channelLabel ? `${c.channelLabel}: ` : 'Contact logged: '}${c.outcomeLabel}`, meta: `${fmtDateTime(c.at)} · ${c.by ?? '—'}`, note: c.note }))
  const stageRows = (l.stageHistory || []).map((h) => ({ at: h.at, icon: h.from ? 'refresh' : 'user-plus', bg: h.from ? '#e9e3fc' : '#d4f1e7', title: h.from ? `Moved to ${h.toLabel}` : 'Lead created', meta: `${fmtDateTime(h.at)} · ${h.by ?? '—'}`, note: h.note || h.reason || null }))
  const ICON = { FOLLOW_UP: ['calendar', '#fde8c9'], TASK: ['check', '#e7f4ee'], MESSAGE: ['chat', '#d4f1e7'], QUOTATION: ['quote', '#e9e3fc'], CALL: ['phone', '#d9eafd'] }
  const otherRows = (timeline?.items || []).filter((i) => ICON[i.type]).map((i) => ({
    at: i.at, icon: ICON[i.type][0], bg: ICON[i.type][1],
    title: i.type === 'FOLLOW_UP' ? `Follow-up: ${i.title}` : i.type === 'TASK' ? `Task: ${i.title}` : i.title,
    meta: `${fmtDateTime(i.at)}${i.detail ? ` · ${titleCase(i.detail)}` : ''}`,
  }))
  const activity = [...contactRows, ...stageRows, ...otherRows].sort((a, b) => new Date(b.at) - new Date(a.at))
  const lostAt = (l.stageHistory || []).find((h) => h.to === 'LOST')?.at
  return {
    state: l.status === 'LOST' ? 'lost' : l.status === 'CONVERTED' ? 'converted' : 'open',
    name: l.name, initials: initials(l.name),
    summary: [l.interests?.join(', '), l.notes].filter(Boolean).join(' · ') || 'No notes yet',
    meta: `${l.number} · ${l.pipelineName ?? '—'} pipeline · Created ${fmtDate(l.createdAt)}`,
    details: [
      ['Primary mobile', fmtMobile(l.mobile)],
      ['Alternate mobile', l.altMobile ? fmtMobile(l.altMobile) : '—'],
      ['Email', l.email || '—'],
      ['Source', l.source],
      ...(l.referrer ? [['Referrer', l.referrer.name]] : []),
      ...(l.referredBy ? [['Referred by', `${l.referredBy.name} (${l.referredBy.number})`]] : []),
      ...(l.campaign ? [['Campaign', l.campaign]] : []),
      ['Insurance interest', l.interests?.length ? l.interests.join(', ') : '—'],
    ],
    activity,
    stages: (l.stageHistory || []).map((h, i) => ({ dot: i === 0 ? STAGE_DOT[h.to] : '#c3ccd8', tone: STAGE_TONE[h.to], label: h.toLabel, meta: `${fmtDate(h.at, { year: false })}, ${fmtTime(h.at)} · ${h.by ?? '—'}` })),
    statusChip: { ...STATUS_CHIP[l.status], label: LEAD_STATUS_LABEL[l.status] },
    priorityChip: { tone: l.priority === 'HIGH' ? 'high' : 'gray', label: `${titleCase(l.priority)} priority` },
    sourceLabel: `${l.source}${sourceExtra}`,
    tel: cleanMobile(l.mobile), email: l.email,
    canConvert: l.canConvert,
    follow: l.nextFollowUpAt ? { big: fmtDate(l.nextFollowUpAt), small: `${fmtTime(l.nextFollowUpAt)} · ${l.followUpTask?.title ?? 'Follow-up'}`, chip: followChip, taskId: l.followUpTask?.id } : null,
    lostCard: { title: `Lost on ${fmtDate(lostAt, { year: false })}`, big: l.lostReason ?? '—', small: l.lostNote ?? 'No note' },
    convertedCard: { title: `Converted on ${fmtDate(l.convertedAt, { year: false })}`, big: l.customer?.number ?? '—', small: `${l.customer?.name ?? ''} · policy holder` },
    customerTo: l.customer ? `/customers/${l.customer.id}` : '/customers',
  }
}

export default function LiveLeadDetail() {
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const navigate = useNavigate()
  const { toastError, toast } = useToast()
  const lead = useQuery(['lead', id], () => api.leads.get(id))
  const timeline = useQuery(['lead', id, 'timeline'], () => api.leads.timeline(id))
  const [dialog, setDialog] = useState(() => (sp.get('action') ? { kind: sp.get('action'), to: sp.get('to') } : null))
  const close = () => { setDialog(null); if (sp.get('action')) setSp({}, { replace: true }) }

  const data = useMemo(() => (lead.data ? leadView(lead.data, timeline.data) : null), [lead.data, timeline.data])

  if (lead.error) return <ErrorPanel active="leads" error={lead.error} back="/leads" />
  if (!data) return <LoadingPanel active="leads" />
  const l = lead.data

  const followUpDone = async () => {
    try {
      const t = l.followUpTask
      if (!t) return toast('The follow-up task is no longer open.', 'error')
      const r = await api.tasks.done(t.id, t.version)
      toast(r.meta?.message || 'Task done.')
      invalidate('lead', 'tasks', 'dashboard')
    } catch (e) { toastError(e) }
  }

  const on = {
    status: () => setDialog({ kind: 'status' }),
    contact: () => setDialog({ kind: 'contact' }),
    lost: () => setDialog({ kind: 'lost' }),
    reopen: () => setDialog({ kind: 'reopen' }),
    reschedule: () => setDialog({ kind: 'reschedule' }),
    edit: () => navigate(`/leads/${id}/edit`),
    convert: () => navigate(`/leads/${id}/convert`),
    followUpDone,
  }
  const props = { lead: l, onClose: close }
  const overlay = dialog && {
    status: <ChangeStatusDialog {...props} preset={dialog.to} onLost={() => setDialog({ kind: 'lost' })} />,
    contact: <LogContactDrawer {...props} />,
    lost: <MarkLostDialog {...props} />,
    reopen: <ReopenDialog {...props} />,
    reschedule: <RescheduleDialog {...props} />,
  }[dialog.kind]

  // CL1: a lead from an ad or website form shows the answers it came with
  return <LeadDetailBase data={data} on={on} overlay={overlay} extra={<>{l.withdrawal && <WithdrawalCard lead={l} />}<LeadAnswersInline leadId={l.id} /></>} />
}

/* ───────── shared mutation for status changes ───────── */
function useLeadWrite(lead, onClose) {
  const { toast } = useToast()
  return useMutation((fn, o) => fn(o), {
    invalidates: ['lead', 'leads', 'dashboard', 'tasks', 'pipelines'],
    onSuccess: (r) => { toast(r?.meta?.message || 'Lead saved.'); onClose() },
  })
}
const ErrorNote = ({ error }) => (error && !Object.keys(error.fieldErrors || {}).length ? (
  <div className="flex items-center gap-2.5 rounded-[14px] border border-[#f2c4c8] bg-[#fff7f7] px-3.5 py-3 text-[13px] font-semibold text-[#b4323c]"><Icon name="alert" size={16} />{error.message}</div>
) : null)

/* ───────── LS1 · Change status ───────── */
function ChangeStatusDialog({ lead, onClose, preset, onLost }) {
  const moves = lead.allowedMoves || []
  const [sel, setSel] = useState(preset && moves.includes(preset) ? preset : moves.find((m) => m !== 'LOST') ?? null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('11:00')
  const w = useLeadWrite(lead, onClose)
  const fe = w.fieldErrors
  const options = ['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'LOST'].filter((s) => s === lead.status || moves.includes(s))
  const submit = () => w.run((o) => api.leads.changeStatus(lead.id, { version: lead.version, status: sel, note: note || null, ...(sel === 'FOLLOW_UP' ? { nextFollowUpAt: atIst(date, time) } : {}) }, o))
  return (
    <>
      <Scrim onClose={onClose} />
      <Dialog top={90}>
        <DialogTitle>Change status</DialogTitle>
        <DialogText>{lead.name} is in {LEAD_STATUS_LABEL[lead.status]}. Only allowed moves are shown.</DialogText>
        {options.map((s) => (
          <RadioOption key={s} title={LEAD_STATUS_LABEL[s]} sub={s === lead.status ? 'Current status' : MOVE_SUB[s]} disabled={s === lead.status}
            selected={sel === s} onSelect={() => (s === 'LOST' ? onLost() : setSel(s))} />
        ))}
        {sel === 'FOLLOW_UP' && (
          <div className="flex gap-3">
            <TextField label="Next follow-up *" type="date" min={istDay()} value={date} onChange={setDate} className="min-w-0 flex-1 basis-0" error={fe.nextFollowUpAt} />
            <SelectField label="Time" value={time} onChange={setTime} options={TIME_OPTIONS} className="min-w-0 flex-1 basis-0" />
          </div>
        )}
        <TextField label="Note (optional)" value={note} onChange={setNote} error={fe.note} />
        {lead.canConvert && (
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3 text-blue">
            <Icon name="user-plus" size={16} />
            <p className="text-[13px] font-semibold">To convert, use Convert to customer.</p>
          </div>
        )}
        <ErrorNote error={w.error} />
        <div className="flex gap-2.5">
          <FootButton onClick={onClose}>Cancel</FootButton>
          <FootButton variant="navy" icon="check" disabled={!sel || w.busy} onClick={submit}>{w.busy ? 'Saving…' : 'Change status'}</FootButton>
        </div>
      </Dialog>
    </>
  )
}

/* ───────── LS2 · Log contact ───────── */
function LogContactDrawer({ lead, onClose }) {
  const { toast, toastError } = useToast()
  const [channel, setChannel] = useState('Call')
  const [outcome, setOutcome] = useState('SPOKE_TO_CUSTOMER')
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('11:00')
  const moves = (lead.allowedMoves || []).filter((m) => m !== 'LOST')
  const [move, setMove] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const needsDate = outcome === 'ASKED_TO_CALL_BACK' || move === 'FOLLOW_UP'

  const save = async () => {
    if (needsDate && !date) return setError({ message: 'Choose the next follow-up date.' })
    setBusy(true)
    setError(null)
    try {
      const r = await api.leads.logContact(lead.id, { outcome, channel: CHANNEL_CODE[channel], note: note.trim() || null })
      let latest = r.data // logContact returns the lead with its new version
      const when = atIst(date, time)
      if (move && move !== 'FOLLOW_UP') {
        latest = (await api.leads.changeStatus(lead.id, { version: latest.version, status: move })).data
      }
      if (when) {
        if (latest.status !== 'FOLLOW_UP' && latest.allowedMoves?.includes('FOLLOW_UP') && (move === 'FOLLOW_UP' || !move)) {
          await api.leads.changeStatus(lead.id, { version: latest.version, status: 'FOLLOW_UP', nextFollowUpAt: when })
        } else {
          await api.leads.update(lead.id, { version: latest.version, nextFollowUpAt: when })
        }
      }
      toast(r.meta?.message || 'Contact saved.')
      invalidate('lead', 'leads', 'dashboard', 'tasks', 'pipelines')
      onClose()
    } catch (e) {
      setError(e)
      if (!e.fields?.length) toastError(e)
      invalidate('lead')
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <Scrim onClose={onClose} />
      <Drawer>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Log contact</p>
            <p className="text-[12px] font-medium text-muted">{lead.name} · {fmtMobile(lead.mobile)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line"><Icon name="x" size={16} /></button>
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>How did you contact them? *</FieldLabel>
          <div className="flex items-start gap-1.5">
            {CHANNELS.map((c) => (
              <button key={c} type="button" onClick={() => setChannel(c)}
                className={cx('rounded-[16px] px-3 py-[7px] text-[12px] font-semibold', c === channel ? 'bg-navy text-white' : 'border border-line bg-white text-ink-2 hover:bg-tile')}>{c}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Outcome *</FieldLabel>
          {OUTCOMES.map((o) => <RadioOption key={o.key} {...o} selected={outcome === o.key} onSelect={() => setOutcome(o.key)} />)}
        </div>
        <AreaField label="Note" value={note} onChange={setNote} />
        <div className="flex gap-3">
          <TextField label={needsDate ? 'Next follow-up *' : 'Next follow-up'} type="date" min={istDay()} value={date} onChange={setDate} className="min-w-0 flex-1 basis-0" error={error?.fieldErrors?.nextFollowUpAt} />
          <SelectField label="Time" value={time} onChange={setTime} options={TIME_OPTIONS} className="min-w-0 flex-1 basis-0" />
        </div>
        <SelectField label="Move lead to (optional)" value={move} onChange={setMove} options={[{ value: '', label: `Keep in ${LEAD_STATUS_LABEL[lead.status]}` }, ...moves.map((m) => ({ value: m, label: LEAD_STATUS_LABEL[m] }))]} />
        {error && <ErrorNote error={error.fieldErrors ? error : { message: error.message }} />}
        <div className="sticky bottom-0 z-10 -mx-7 mt-auto flex shrink-0 gap-2.5 bg-white px-7 pt-3 shadow-[0_24px_0_0_#fff]">
          <FootButton onClick={onClose}>Cancel</FootButton>
          <FootButton variant="navy" icon="check" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save contact'}</FootButton>
        </div>
      </Drawer>
    </>
  )
}

/* ───────── LS3 · Mark as lost ───────── */
function MarkLostDialog({ lead, onClose }) {
  const { reference } = useAuth()
  const reasons = reference?.lostReasons ?? ['Not interested', 'Bought elsewhere', 'Price too high', 'Not reachable', 'Duplicate', 'Other']
  const [reason, setReason] = useState(reasons[0])
  const [note, setNote] = useState('')
  const w = useLeadWrite(lead, onClose)
  const submit = () => w.run((o) => api.leads.changeStatus(lead.id, { version: lead.version, status: 'LOST', lostReason: reason, note: note || null }, o))
  return (
    <>
      <Scrim onClose={onClose} />
      <Dialog top={110}>
        <DialogIcon icon="x" bg="#fbebec" color="#b4323c" />
        <DialogTitle>Mark {lead.name} as lost?</DialogTitle>
        <DialogText>Open follow-up tasks are cancelled. You can reopen the lead later.</DialogText>
        <SelectField label="Reason *" value={reason} onChange={setReason} options={reasons} error={w.fieldErrors.lostReason} />
        <AreaField label={reason === 'Other' ? 'Note *' : 'Note (optional)'} value={note} onChange={setNote} error={w.fieldErrors.note} />
        <ErrorNote error={w.error} />
        <div className="flex gap-2.5">
          <FootButton onClick={onClose}>Cancel</FootButton>
          <FootButton variant="danger" icon="x" disabled={w.busy} onClick={submit}>{w.busy ? 'Saving…' : 'Mark as lost'}</FootButton>
        </div>
      </Dialog>
    </>
  )
}

/* ───────── LS5 · Reopen ───────── */
function ReopenDialog({ lead, onClose }) {
  const [note, setNote] = useState('')
  const w = useLeadWrite(lead, onClose)
  const submit = () => w.run((o) => api.leads.changeStatus(lead.id, { version: lead.version, status: 'CONTACTED', note }, o))
  return (
    <>
      <Scrim onClose={onClose} />
      <Dialog top={140}>
        <DialogIcon icon="refresh" bg="#e8f0fd" color="#1f5fd6" />
        <DialogTitle>Reopen this lead?</DialogTitle>
        <DialogText>It moves back to Contacted and appears on the board again.</DialogText>
        <TextField label="Reason *" value={note} onChange={setNote} error={w.fieldErrors.note} />
        <ErrorNote error={w.error} />
        <div className="flex gap-2.5">
          <FootButton onClick={onClose}>Cancel</FootButton>
          <FootButton variant="navy" icon="refresh" disabled={w.busy || !note.trim()} onClick={submit}>{w.busy ? 'Saving…' : 'Reopen'}</FootButton>
        </div>
      </Dialog>
    </>
  )
}

/* ───────── Reschedule the follow-up ───────── */
function RescheduleDialog({ lead, onClose }) {
  const [date, setDate] = useState(lead.nextFollowUpAt ? istDay(lead.nextFollowUpAt) : '')
  const [time, setTime] = useState('11:00')
  const w = useLeadWrite(lead, onClose)
  const submit = () => {
    const when = atIst(date, time)
    if (lead.status !== 'FOLLOW_UP' && lead.allowedMoves?.includes('FOLLOW_UP')) return w.run((o) => api.leads.changeStatus(lead.id, { version: lead.version, status: 'FOLLOW_UP', nextFollowUpAt: when }, o))
    return w.run(() => api.leads.update(lead.id, { version: lead.version, nextFollowUpAt: when }))
  }
  return (
    <>
      <Scrim onClose={onClose} />
      <Dialog top={140}>
        <DialogIcon icon="calendar" bg="#fbf1e1" color="#8a5a12" />
        <DialogTitle>Reschedule follow-up</DialogTitle>
        <DialogText>The follow-up task moves with the date.</DialogText>
        <div className="flex gap-3">
          <TextField label="Date *" type="date" min={istDay()} value={date} onChange={setDate} className="min-w-0 flex-1 basis-0" error={w.fieldErrors.nextFollowUpAt} />
          <SelectField label="Time" value={time} onChange={setTime} options={TIME_OPTIONS} className="min-w-0 flex-1 basis-0" />
        </div>
        <ErrorNote error={w.error} />
        <div className="flex gap-2.5">
          <FootButton onClick={onClose}>Cancel</FootButton>
          <FootButton variant="navy" icon="check" disabled={w.busy || !date} onClick={submit}>{w.busy ? 'Saving…' : 'Save'}</FootButton>
        </div>
      </Dialog>
    </>
  )
}