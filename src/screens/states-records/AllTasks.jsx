// Figma 286:34658 · TSK · All tasks
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SegTabs, StatusChip, RingAvatar, Tick } from '../catalogue/_parts'
import { SH8 } from './_parts'
import { tasks as seed, taskStatusTabs, taskTypeTabs } from '../../data/states-records'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

const IN_TAB = {
  open: (t) => t.status === 'open' || t.status === 'overdue',
  today: (t) => t.bucket === 'today' && t.status === 'open',
  overdue: (t) => t.status === 'overdue',
  upcoming: (t) => t.bucket === 'upcoming' && t.status === 'open',
  done: (t) => t.status === 'done',
  cancelled: (t) => t.status === 'cancelled',
}

const PRIORITY = { High: 'rose', Medium: 'amber', Low: 'neutral' }
const STATUS = {
  overdue: <StatusChip tone="rose" icon="alert">Overdue</StatusChip>,
  open: <StatusChip tone="sky" icon="clock">Open</StatusChip>,
  done: <StatusChip tone="green" icon="check">Done</StatusChip>,
  cancelled: <StatusChip tone="neutral" icon="x">Cancelled</StatusChip>,
}
const COLS = [
  ['Task', 330], ['Related to', 210], ['Due', 200], ['Priority', 100], ['Status', 120], ['', 90],
]

function MiniBtn({ icon, label }) {
  return (
    <button type="button" aria-label={label} className="flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
      <Icon name={icon} size={11.8} />
    </button>
  )
}

export default function AllTasks() {
  const [status, setStatus] = useState('open')
  const [type, setType] = useState('all')
  const [rows, setRows] = useState(seed)
  // As loaded, the table shows the six rows drawn in Figma; picking any tab switches to strict filtering.
  const [touched, setTouched] = useState(false)
  const [q, clearQ] = useHeaderSearch()
  const toggle = (id) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: r.status === 'done' ? (r.bucket === 'overdue' ? 'overdue' : 'open') : 'done' } : r)))
  const statusTabs = taskStatusTabs.map((t) => ({ ...t, count: rows.filter(IN_TAB[t.key]).length }))
  const pristine = !touched && !q.trim() && type === 'all'
  const shown = pristine
    ? rows.filter((r) => r.figma)
    : rows.filter((r) => IN_TAB[status](r) && (type === 'all' || r.kind === type) && matchesQuery(q, r.title, r.related, r.due, r.priority))
  const pickStatus = (k) => { setStatus(k); setTouched(true) }
  const pickType = (k) => { setType(k); setTouched(true) }
  const clearAll = () => { setType('all'); clearQ() }

  return (
    <AppLayout active="dashboard">
      <Header
        breadcrumb={'DASHBOARD  /  TASKS'}
        title="Tasks"
        subtitle="Everything you need to do, across leads and policy holders."
        actions={<HeadButton icon="plus" to="/x/tk1-add-task-empty">Add task</HeadButton>}
      />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={statusTabs} value={status} onChange={pickStatus} />
        <SegTabs items={taskTypeTabs} value={type} onChange={pickType} />
      </div>

      <div className={cx('mt-5 w-[1180px] overflow-hidden rounded-[28px] bg-white', SH8)}>
        <div className="flex gap-4 bg-[#fafbfd] px-6 py-3.5">
          {COLS.map(([l, w]) => (
            <p key={w + l} className="shrink-0 text-[12px] font-semibold text-muted" style={{ width: w }}>{l}</p>
          ))}
        </div>
        {shown.map((t) => {
          const done = t.status === 'done'
          const cancelled = t.status === 'cancelled'
          return (
            <div key={t.id} className="flex h-[53px] items-center gap-4 border-t border-line px-6">
              <div className="flex w-[330px] shrink-0 items-center gap-2.5">
                <Tick checked={done} onChange={() => !cancelled && toggle(t.id)} />
                <p className={cx('text-[13px] font-bold whitespace-nowrap', cancelled ? 'text-muted' : 'text-ink')}>{t.title}</p>
              </div>
              <div className="flex w-[210px] shrink-0 items-center gap-2">
                <RingAvatar initials={t.initials} bg={t.bg} size={26} text={8} />
                <p className="text-[12px] font-semibold whitespace-nowrap text-blue">{t.related}</p>
              </div>
              <p className={cx('w-[200px] shrink-0 text-[12px] font-semibold whitespace-nowrap', t.dueLate ? 'text-[#b4323c]' : 'text-ink-2')}>{t.due}</p>
              <div className="w-[100px] shrink-0"><StatusChip tone={PRIORITY[t.priority]}>{t.priority}</StatusChip></div>
              <div className="w-[120px] shrink-0">{STATUS[t.status]}</div>
              <div className="flex w-[90px] shrink-0 gap-1.5">
                <MiniBtn icon="edit" label="Edit task" />
                <MiniBtn icon="calendar" label="Reschedule" />
              </div>
            </div>
          )
        })}
        {shown.length === 0 && (
          <NoMatches
            className="border-t border-line"
            text={q.trim() || type !== 'all' ? 'No matches' : 'Nothing here'}
            sub={q.trim() || type !== 'all' ? 'No tasks fit this status, type or search.' : `No ${statusTabs.find((t) => t.key === status).label.toLowerCase()} tasks.`}
            onClear={q.trim() || type !== 'all' ? clearAll : undefined}
          />
        )}
      </div>
    </AppLayout>
  )
}
