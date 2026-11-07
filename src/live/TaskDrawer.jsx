// Add / edit task drawer (TK1–TK4 design) wired to POST /tasks, PATCH /tasks/:id, /done, /cancel.
// Related record search uses GET /search (leads, policy holders).
import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { PriorityTabs, SH_NAVY, SH_SOFT } from '../screens/tasks/_parts'
import { useLockScroll } from '../screens/sales/_overlay'
import { api, useMutation, useDebounced, invalidate } from '../api'
import { istDay, fmtTime, initials, avatarClass } from '../api/format'
import { TASK_TYPE_LABEL, TASK_TYPE_CODE } from './views'
import { useToast } from '../components/LiveToast'

const ERR = 'text-[#b4323c]'
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '17:30', '18:00', '19:00']
const label12 = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
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
  const { toast } = useToast()
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
    { invalidates: ['tasks', 'dashboard', 'lead'], onSuccess: (r) => { toast(r.meta?.message || 'Task updated.'); onClose() } })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'Enter a title.'
    if (!type) errs.taskType = 'Choose a task type.'
    if (!date) errs.dueDate = 'Choose a date.'
    if (!time) errs.dueTime = 'Choose a time.'
    setLocal(errs)
    if (Object.keys(errs).length) return
    save.run()
  }
  const fe = { ...save.fieldErrors, ...local }
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

        <div className="flex shrink-0 gap-2.5 md:gap-3">
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <Label error={fe.dueDate}>Due date *</Label>
            <Box error={fe.dueDate}><input type="date" min={istDay()} value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} /></Box>
            {fe.dueDate && <span className={cx('text-[12px] font-medium', ERR)}>{fe.dueDate}</span>}
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <Label error={fe.dueTime}>Due time *</Label>
            <Box className="relative" error={fe.dueTime}>
              <select value={time} onChange={(e) => setTime(e.target.value)} className={cx('min-w-0 flex-1 appearance-none bg-transparent outline-none', time ? 'font-semibold text-ink' : 'font-medium text-faint')}>
                <option value="">--:--</option>
                {[...new Set([...(time && !TIMES.includes(time) ? [time] : []), ...TIMES])].map((t) => <option key={t} value={t}>{label12(t)}</option>)}
              </select>
              <Icon name="chev-down" size={18} className="pointer-events-none text-muted" />
            </Box>
            {fe.dueTime && <span className={cx('text-[12px] font-medium', ERR)}>{fe.dueTime}</span>}
          </label>
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
  const wrap = (p) => p.then((r) => { invalidate('tasks', 'dashboard', 'lead'); toast(r.meta?.message || 'Task updated.') }).catch(toastError)
  return {
    toggle: (t) => wrap(t.done ? api.tasks.reopen(t.id, t.version) : api.tasks.done(t.id, t.version)),
    reschedule: (t, preset) => wrap(api.tasks.reschedule(t.id, { version: t.version, preset })),
    cancel: (t) => wrap(api.tasks.cancel(t.id, t.version)),
  }
}