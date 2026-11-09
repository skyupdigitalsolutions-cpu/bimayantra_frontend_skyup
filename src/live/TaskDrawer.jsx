// Add / edit task drawer (TK1–TK4 design) wired to POST /tasks, PATCH /tasks/:id, /done, /cancel.
// Related record search uses GET /search (leads, policy holders).
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { Modal, cx } from '../components/ui'
import { DatePicker, TimePicker } from '../components/pickers'
import { PriorityTabs, SH_NAVY, SH_SOFT } from '../screens/tasks/_parts'
import { useLockScroll } from '../screens/sales/_overlay'
import { api, useMutation, useDebounced, invalidate } from '../api'
import { istDay, fmtTime, fmtWhen, fmtDateTime, initials, avatarClass, titleCase } from '../api/format'
import { TASK_TYPE_LABEL, TASK_TYPE_CODE } from './views'
import { useToast } from '../components/LiveToast'

const ERR = 'text-[#b4323c]'
/** "HH:mm" now in India, for blocking past slots today */
const istNowHHMM = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return istDay(d) }
const to24 = (d) => { const t = fmtTime(d); const m = /(\d+):(\d+) (AM|PM)/.exec(t); if (!m) return ''; let h = Number(m[1]) % 12; if (m[3] === 'PM') h += 12; return `${String(h).padStart(2, '0')}:${m[2]}` }

function Box({ error, className = '', children }) {
  return (
    <div className={cx('flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue/20', error && 'border-2 border-[#b4323c]', className)}>
      {children}
    </div>
  )
}
const inputCls = 'min-w-0 flex-1 bg-transparent font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint'
const Label = ({ error, children }) => <span className={cx('text-[13px] font-semibold', error ? ERR : 'text-ink')}>{children}</span>

/**
 * task: API task (edit) or null (add). related: preset { type: 'LEAD'|'CUSTOMER', id, name } for "Add follow-up" from a record.
 */
export default function TaskDrawer({ task = null, related: presetRelated = null, onClose }) {
  useLockScroll()
  const { toast, toastError } = useToast()
  const edit = !!task
  const [title, setTitle] = useState(task?.title ?? '')
  const [notes, setNotes] = useState(task?.notes ?? '')
  const [type, setType] = useState(task?.taskType ?? null)
  const [date, setDate] = useState(task ? istDay(task.dueAt) : '')
  const [time, setTime] = useState(task ? to24(task.dueAt) : '')
  const [priority, setPriority] = useState(task ? (task.priority === 'HIGH' ? 'High' : task.priority === 'LOW' ? 'Low' : 'Medium') : 'Medium')
  const [related, setRelated] = useState(task?.linked ? { type: task.linked.type, id: task.linked.id, name: task.linked.name } : presetRelated)
  const [q, setQ] = useState('')
  const dq = useDebounced(q, 300)
  const [hits, setHits] = useState([])
  const [local, setLocal] = useState({})

  useEffect(() => {
    if (dq.trim().length < 2) return setHits([])
    api.search.all(dq.trim()).then(({ data }) => {
      const items = (data?.groups || []).filter((g) => g.group === 'LEADS' || g.group === 'CUSTOMERS').flatMap((g) => g.items)
      setHits(items.slice(0, 6))
    }).catch(() => setHits([]))
  }, [dq])

  const save = useMutation((_, o) => {
    const body = {
      title: title.trim(), notes: notes.trim() || null, taskType: type ? TASK_TYPE_CODE[type] ?? type : null,
      priority: priority.toUpperCase(), dueDate: date, dueTime: time,
    }
    if (edit) return api.tasks.update(task.id, { version: task.version, ...body })
    return api.tasks.create({ ...body, ...(related ? { linkedType: related.type, linkedId: related.id } : {}) }, o)
  }, { invalidates: ['tasks', 'dashboard', 'lead'], onSuccess: (r) => { toast(r.meta?.message || 'Task saved.'); onClose() } })
  const status = useMutation((action) => (action === 'done' ? api.tasks.done(task.id, task.version) : api.tasks.cancel(task.id, task.version)),
    { invalidates: ['tasks', 'dashboard', 'lead'], onSuccess: (r) => { toast(r.meta?.message || 'Task updated.'); onClose() }, onError: (e) => toastError(e) })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'Enter a title.'
    if (!type) errs.taskType = 'Choose a task type.'
    if (!date) errs.dueDate = 'Choose a date.'
    else if (date < istDay()) errs.dueDate = 'The date can’t be in the past.'
    if (!time) errs.dueTime = 'Choose a time.'
    else if (date === istDay() && time <= istNowHHMM() && !(edit && time === to24(task.dueAt) && date === istDay(task.dueAt))) errs.dueTime = 'That time has already passed today.'
    setLocal(errs)
    if (Object.keys(errs).length) return
    save.run()
  }
  const fe = Object.fromEntries(Object.entries({ ...save.fieldErrors, ...local }).filter(([, v]) => v))
  const errCount = Object.keys(fe).length
  const typeLabel = type ? TASK_TYPE_LABEL[type] ?? type : null

  return (
    <>
      <button type="button" aria-label="Close" data-overlay="scrim" onClick={onClose} className="fixed inset-0 z-40 bg-[#0e1f3b]/40" />
      <form data-overlay="drawer" onSubmit={submit}
        className={cx(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col gap-3 overflow-y-auto rounded-t-[28px] bg-white px-[18px] pt-2.5 pb-7 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]',
          'md:inset-x-auto md:top-4 md:right-4 md:bottom-auto md:max-h-[calc(100vh-32px)] md:min-h-[min(928px,calc(100vh-32px))] md:w-[500px] md:gap-4 md:rounded-[32px] md:px-7 md:pt-7 md:pb-6',
          'xl:top-6 xl:right-6 xl:max-h-[calc(100vh-48px)] xl:min-h-[min(928px,calc(100vh-48px))]',
        )}>
        <span className="mx-auto h-[5px] w-10 shrink-0 rounded-[3px] bg-[#d5dbe5] md:hidden" />
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[18px] font-bold text-ink md:text-[20px] md:tracking-[-0.2px]">{edit ? 'Edit task' : 'Add task'}</p>
            <p className="hidden text-[12px] font-medium text-muted md:block">{edit ? `Due ${task.dueShown ?? ''}` : 'A reminder for yourself'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className={cx('flex size-8 items-center justify-center rounded-full bg-white text-ink md:size-9 md:bg-panel md:shadow-none', SH_SOFT)}>
            <Icon name="x" size={14} />
          </button>
        </div>

        {(errCount > 0 || save.error) && (
          <div className="flex shrink-0 items-center gap-2.5 rounded-[14px] border border-[#f2c4c8] bg-[#fff7f7] px-3.5 py-3">
            <Icon name="alert" size={16} className={ERR} />
            <p className={cx('text-[13px] font-bold', ERR)}>{errCount > 1 ? `Fix ${errCount} things to save this task.` : save.error?.message || Object.values(fe)[0]}</p>
          </div>
        )}

        <label className="flex shrink-0 flex-col gap-2">
          <Label error={fe.title}>Task title *</Label>
          <Box error={fe.title}><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Call back about family floater" className={inputCls} autoFocus /></Box>
          {fe.title && <span className={cx('text-[12px] font-medium', ERR)}>{fe.title}</span>}
        </label>

        <label className="hidden shrink-0 flex-col gap-2 md:flex">
          <Label>Description</Label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes"
            className="h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint focus:ring-2 focus:ring-blue/20" />
        </label>

        <div className="flex shrink-0 flex-col gap-1.5 md:gap-2">
          <Label error={fe.taskType}>Task type *</Label>
          <div className="flex flex-wrap gap-1.5 md:pr-1">
            {Object.values(TASK_TYPE_LABEL).map((t) => (
              <button key={t} type="button" onClick={() => setType(TASK_TYPE_CODE[t])}
                className={cx('rounded-[14px] px-[11px] py-1.5 text-[12px] font-semibold md:rounded-[16px] md:px-3 md:py-[7px]', t === typeLabel ? 'bg-navy text-white' : cx('border bg-white text-ink-2 hover:text-ink', fe.taskType ? 'border-[#f2c4c8]' : 'border-line'))}>
                {t}
              </button>
            ))}
          </div>
          {fe.taskType && <span className={cx('text-[12px] font-medium', ERR)}>{fe.taskType}</span>}
        </div>

        <div className="relative flex shrink-0 flex-col gap-2">
          <Label>Related lead or policy holder (optional)</Label>
          <Box error={fe.linkedId}>
            {related ? (
              <>
                <span className={cx('flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy', avatarClass(related.name))}>{initials(related.name)}</span>
                <span className="flex-1">{related.name} · {related.type === 'LEAD' ? 'Lead' : 'Policy holder'}</span>
                {!edit && <button type="button" aria-label="Clear" onClick={() => setRelated(null)} className="text-muted hover:text-ink"><Icon name="x" size={14} /></button>}
              </>
            ) : (
              <>
                <Icon name="search" size={18} className="text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or mobile" className={inputCls} />
              </>
            )}
          </Box>
          {!related && hits.length > 0 && (
            <div className="absolute top-[82px] right-0 left-0 z-10 flex flex-col gap-0.5 rounded-[16px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
              {hits.map((h) => (
                <button key={h.id} type="button" onClick={() => { setRelated({ type: h.type, id: h.id, name: h.title }); setQ(''); setHits([]) }}
                  className="flex h-11 items-center gap-2.5 rounded-[10px] px-2.5 text-left hover:bg-[#f3f7ff]">
                  <span className={cx('flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-navy', avatarClass(h.title))}>{initials(h.title)}</span>
                  <span className="flex flex-1 flex-col"><span className="text-[13px] font-semibold text-ink">{h.title}</span><span className="text-[11px] font-medium text-muted">{h.type === 'LEAD' ? 'Lead' : 'Policy holder'} · {h.subtitle}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <div className="flex gap-2.5 md:gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Label error={fe.dueDate}>Due date *</Label>
              <DatePicker value={date} min={istDay()} clearable={false} invalid={!!fe.dueDate} quick={false}
                onChange={(v) => { setDate(v); setLocal((x) => ({ ...x, dueDate: undefined })); if (v === istDay() && time && time <= istNowHHMM()) setTime('') }} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Label error={fe.dueTime}>Due time *</Label>
              <TimePicker value={time} after={date === istDay() ? istNowHHMM() : undefined} invalid={!!fe.dueTime} from="08:00" to="21:00" step={30}
                onChange={(v) => { setTime(v); setLocal((x) => ({ ...x, dueTime: undefined })) }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[['Today', 0], ['Tomorrow', 1], ['In 3 days', 3], ['Next week', 7]].map(([l, n]) => (
              <button key={l} type="button" onClick={() => { const v = addDays(n); setDate(v); setLocal((x) => ({ ...x, dueDate: undefined })); if (n === 0 && time && time <= istNowHHMM()) setTime('') }}
                className={cx('h-7 rounded-[14px] border px-2.5 text-[12px] font-semibold', date === addDays(n) ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-ink-2 hover:bg-tile')}>{l}</button>
            ))}
          </div>
          {(fe.dueDate || fe.dueTime) && <span className={cx('text-[12px] font-medium', ERR)}>{fe.dueDate || fe.dueTime}</span>}
        </div>

        {edit && (
          <div className="flex shrink-0 items-center gap-3 rounded-[16px] bg-panel p-3.5">
            <div className="flex w-[116px] flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">Status: Open</p>
              <p className="text-[11px] font-medium whitespace-nowrap text-muted">Mark it done here or tick it in the list.</p>
            </div>
            <button type="button" disabled={status.busy} onClick={() => status.run('done')} className="flex h-9 items-center gap-2 rounded-[18px] border border-line bg-white pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-tile">
              <Icon name="check" size={16} />Mark as completed
            </button>
            <button type="button" disabled={status.busy} onClick={() => status.run('cancel')} className="flex h-9 items-center rounded-[18px] border border-[#f2c4c8] bg-white px-3.5 text-[13px] font-semibold text-[#b4323c]">Cancel task</button>
          </div>
        )}

        <div className="flex shrink-0 flex-col gap-1.5 md:gap-2">
          <Label>Priority</Label>
          <PriorityTabs value={priority} onChange={setPriority} />
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 rounded-[16px] bg-blue-50 px-4 py-3 md:flex">
          <Icon name="clock" size={16} className="text-blue" />
          <p className="text-[13px] font-semibold text-blue">Shows in My Tasks on the due date. No messages are sent to the customer.</p>
        </div>
        <span className="hidden min-h-px grow md:block" />
        <div className="sticky bottom-0 z-10 -mx-[18px] -mt-3 flex shrink-0 gap-2.5 bg-white px-[18px] pt-3 shadow-[0_28px_0_0_#fff] md:-mx-7 md:px-7 md:shadow-[0_24px_0_0_#fff]">
          <button type="button" onClick={onClose} className="hidden h-[46px] w-[220px] items-center justify-center rounded-[24px] border border-line bg-white text-[14px] font-semibold text-ink hover:bg-tile md:flex">Cancel</button>
          <button type="submit" disabled={save.busy} className={cx('flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[24px] bg-navy text-[15px] font-semibold text-white hover:bg-navy-700 disabled:opacity-60 md:h-[46px] md:text-[14px]', SH_NAVY)}>
            <Icon name="check" size={18} />
            {save.busy ? 'Saving…' : edit ? 'Save changes' : 'Save task'}
          </button>
        </div>
      </form>
    </>
  )
}

/** Shared task actions for the dashboard and the All tasks page. */
export function useTaskActions() {
  const { toast, toastError } = useToast()
  const wrap = (p) => p.then((r) => { invalidate('tasks', 'dashboard', 'lead'); toast(r.meta?.message || 'Task updated.'); return true }).catch((e) => { toastError(e); return false })
  return {
    toggle: (t) => wrap(t.done ? api.tasks.reopen(t.id, t.version) : api.tasks.done(t.id, t.version)),
    reschedule: (t, preset) => wrap(api.tasks.reschedule(t.id, { version: t.version, preset })),
    cancel: (t) => wrap(api.tasks.cancel(t.id, t.version)),
  }
}
/* ───────── Task details (View more) · Mark done, reschedule, edit, cancel ───────── */
const PRIORITY_CLS = { High: 'bg-[#fde8ec] text-[#b4325a]', Medium: 'bg-[#fbf1e1] text-[#8a5a12]', Low: 'bg-[#eef1f5] text-[#44526a]' }
const STATUS_INFO = {
  open: ['Open', 'clock', 'bg-[#e8f0fd] text-[#1f5fd6]'], overdue: ['Overdue', 'alert', 'bg-[#fbebec] text-[#b4323c]'],
  done: ['Done', 'check', 'bg-[#e7f4ee] text-[#127650]'], cancelled: ['Cancelled', 'x', 'bg-[#eef1f5] text-[#44526a]'],
}
const taskStatus = (raw) => (raw.status === 'DONE' ? 'done' : raw.status === 'CANCELLED' ? 'cancelled' : raw.overdue ? 'overdue' : 'open')
const RESCHEDULE = [['Later today', 'later_today'], ['Tomorrow 10 AM', 'tomorrow'], ['This Friday', 'this_friday'], ['Next Monday', 'next_monday']]

/** Green "Mark done" pill (or "Reopen" once done). */
export function MarkDoneButton({ done, busy, onClick, size = 'md', className = '' }) {
  return (
    <button type="button" disabled={busy} onClick={(e) => { e.stopPropagation(); onClick() }}
      className={cx('inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition disabled:opacity-60',
        size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-8 px-3 text-[12px]',
        done ? 'border border-line bg-white text-ink-2 hover:bg-tile' : 'bg-[#127650] text-white hover:bg-[#0f6544]', className)}>
      <Icon name={done ? 'refresh' : 'check'} size={13} />{busy ? 'Saving…' : done ? 'Reopen' : 'Mark done'}
    </button>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex gap-4 border-b border-line py-2.5 last:border-0">
      <span className="w-[120px] shrink-0 text-[12px] font-semibold text-muted">{label}</span>
      <span className="min-w-0 flex-1 text-[13px] font-semibold text-ink">{children}</span>
    </div>
  )
}

/** task: a taskView() row (has .raw). actions: useTaskActions(). onEdit(task) opens the edit drawer. */
export function TaskDetailsDialog({ task: t, actions, onEdit, onClose }) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const r = t.raw || {}
  const st = taskStatus(r)
  const open = st === 'open' || st === 'overdue'
  const [stLabel, stIcon, stCls] = STATUS_INFO[st]
  const type = r.taskType || (r.kind === 'LEAD_FOLLOW_UP' ? 'FOLLOW_UP' : null)
  const run = async (key, fn) => { setBusy(key); const ok = await fn(); setBusy(null); if (ok) onClose() }
  const linkTo = r.linked ? (r.linked.type === 'LEAD' ? `/leads/${r.linked.id}` : `/customers/${r.linked.id}`) : null
  const dueDays = r.dueAt ? Math.floor((new Date(istDay()) - new Date(istDay(r.dueAt))) / 86400000) : 0

  return (
    <Modal onClose={onClose} width={560}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-full text-ink', t.iconBg)}><Icon name={t.icon} size={19} /></span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className={cx('text-[19px] leading-6 font-bold tracking-[-0.2px]', st === 'done' || st === 'cancelled' ? 'text-muted line-through' : 'text-ink')}>{t.title}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className={cx('inline-flex h-6 items-center gap-1 rounded-[12px] px-2.5 text-[12px] font-bold', stCls)}><Icon name={stIcon} size={12} />{stLabel}</span>
              <span className={cx('inline-flex h-6 items-center rounded-[12px] px-2.5 text-[12px] font-semibold', PRIORITY_CLS[t.priority] ?? PRIORITY_CLS.Medium)}>{t.priority} priority</span>
              {type && <span className="inline-flex h-6 items-center rounded-[12px] bg-panel px-2.5 text-[12px] font-semibold text-ink-2">{TASK_TYPE_LABEL[type] ?? titleCase(type)}</span>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink hover:bg-line"><Icon name="x" size={16} /></button>
        </div>

        <div className="flex flex-col rounded-[18px] bg-panel px-4 py-1">
          <Row label="Due">
            {r.dueAt ? fmtWhen(r.dueAt) : '—'}
            {st === 'overdue' && dueDays > 0 && <span className="ml-2 text-[12px] font-bold text-[#b4323c]">Overdue by {dueDays} day{dueDays === 1 ? '' : 's'}</span>}
          </Row>
          <Row label="Related to">
            {r.linked
              ? <a href={linkTo} onClick={(e) => { e.preventDefault(); onClose(); navigate(linkTo) }} className="text-blue hover:underline">{r.linked.name} <span className="font-medium text-muted">· {r.linked.type === 'LEAD' ? 'Lead' : 'Policy holder'}</span></a>
              : <span className="font-medium text-muted">Not linked to a lead or policy holder</span>}
          </Row>
          {r.kind === 'LEAD_FOLLOW_UP' && <Row label="Source">Follow-up set on the lead</Row>}
          {r.createdAt && <Row label="Created">{fmtDateTime(r.createdAt)}{r.createdBy?.name ? ` · ${r.createdBy.name}` : ''}</Row>}
          {r.updatedAt && r.updatedAt !== r.createdAt && <Row label="Last updated">{fmtDateTime(r.updatedAt)}</Row>}
          {r.doneAt && <Row label="Completed">{fmtDateTime(r.doneAt)}{r.doneBy?.name ? ` · ${r.doneBy.name}` : ''}</Row>}
          {r.cancelledAt && <Row label="Cancelled">{fmtDateTime(r.cancelledAt)}</Row>}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-bold tracking-wide text-muted uppercase">Notes</p>
          <p className={cx('rounded-[16px] border border-line px-4 py-3 text-[13px] leading-5 whitespace-pre-wrap', r.notes ? 'font-medium text-ink' : 'font-medium text-muted')}>{r.notes || 'No notes for this task.'}</p>
        </div>

        {open && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-bold tracking-wide text-muted uppercase">Reschedule</p>
            <div className="flex flex-wrap gap-1.5">
              {RESCHEDULE.map(([l, preset]) => (
                <button key={preset} type="button" disabled={!!busy} onClick={() => run(preset, () => actions.reschedule(t, preset))}
                  className="flex h-8 items-center gap-1.5 rounded-[16px] border border-line bg-white px-3 text-[12px] font-semibold text-ink hover:bg-tile disabled:opacity-60">
                  <Icon name="clock" size={13} className="text-muted" />{busy === preset ? 'Moving…' : l}
                </button>
              ))}
              <button type="button" onClick={() => { onClose(); onEdit(t) }} className="flex h-8 items-center gap-1.5 rounded-[16px] px-2 text-[12px] font-bold text-blue hover:bg-blue-50">
                <Icon name="calendar" size={13} />Pick a date and time
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 border-t border-line pt-4">
          {open && (confirmCancel
            ? <button type="button" disabled={!!busy} onClick={() => run('cancel', () => actions.cancel(t))} className="h-[42px] rounded-[21px] bg-[#b4323c] px-4 text-[13px] font-semibold text-white disabled:opacity-60">{busy === 'cancel' ? 'Cancelling…' : 'Yes, cancel task'}</button>
            : <button type="button" onClick={() => setConfirmCancel(true)} className="h-[42px] rounded-[21px] border border-[#f2c4c8] px-4 text-[13px] font-semibold text-[#b4323c] hover:bg-[#fdf6f7]">Cancel task</button>)}
          <span className="flex-1" />
          {open && <button type="button" onClick={() => { onClose(); onEdit(t) }} className="flex h-[42px] items-center gap-2 rounded-[21px] border border-line px-4 text-[13px] font-semibold text-ink hover:bg-tile"><Icon name="edit" size={14} />Edit</button>}
          {st !== 'cancelled' && (
            <button type="button" disabled={!!busy} onClick={() => run('toggle', () => actions.toggle(t))}
              className={cx('flex h-[42px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold disabled:opacity-60', st === 'done' ? 'border border-line text-ink hover:bg-tile' : 'bg-[#127650] text-white hover:bg-[#0f6544]')}>
              <Icon name={st === 'done' ? 'refresh' : 'check'} size={15} />{busy === 'toggle' ? 'Saving…' : st === 'done' ? 'Reopen task' : 'Mark done'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
