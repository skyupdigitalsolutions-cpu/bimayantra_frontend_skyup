// TSK · All tasks and NTF · Notifications on the live API.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SegTabs, StatusChip, RingAvatar, Tick } from '../screens/catalogue/_parts'
import { SH8 } from '../screens/states-records/_parts'
import { matchesQuery, useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { api, useQuery, invalidate } from '../api'
import { fmtWhen, fmtShortWhen, daysFromToday } from '../api/format'
import { taskView, TASK_TYPE_LABEL } from './views'
import TaskDrawer, { useTaskActions } from './TaskDrawer'
import { useToast } from '../components/LiveToast'

/* ───────── TSK · All tasks ───────── */
const STATUS_TABS = [['OVERDUE', 'Overdue'], ['TODAY', 'Today'], ['UPCOMING', 'Upcoming'], ['DONE', 'Done'], ['CANCELLED', 'Cancelled']]
const TYPE_TABS = [['all', 'All types'], ...Object.entries(TASK_TYPE_LABEL)]
const PRIORITY = { High: 'rose', Medium: 'amber', Low: 'neutral' }
const COLS = [['Task', 330], ['Related to', 210], ['Due', 200], ['Priority', 100], ['Status', 120], ['', 90]]

export function LiveAllTasks() {
  const [tab, setTab] = useState('TODAY')
  const [type, setType] = useState('all')
  const [drawer, setDrawer] = useState(null)
  const [q, clearQ] = useHeaderSearch()
  const actions = useTaskActions()
  const list = useQuery(['tasks', tab, type], () => api.tasks.list(tab, type === 'all' ? undefined : type))
  const counts = list.data?.counts || {}
  const rows = (list.data?.tasks || []).map(taskView).filter((t) => matchesQuery(q, t.title, t.who, t.when, t.priority))
  const statusOf = (t) => (t.raw.status === 'DONE' ? 'done' : t.raw.status === 'CANCELLED' ? 'cancelled' : t.raw.overdue ? 'overdue' : 'open')
  const CHIP = {
    overdue: <StatusChip tone="rose" icon="alert">Overdue</StatusChip>, open: <StatusChip tone="sky" icon="clock">Open</StatusChip>,
    done: <StatusChip tone="green" icon="check">Done</StatusChip>, cancelled: <StatusChip tone="neutral" icon="x">Cancelled</StatusChip>,
  }
  return (
    <AppLayout active="dashboard">
      <Header breadcrumb={'DASHBOARD  /  TASKS'} title="Tasks" subtitle="Everything you need to do, across leads and policy holders."
        actions={<HeadButton icon="plus" onClick={() => setDrawer({})}>Add task</HeadButton>} />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={STATUS_TABS.map(([key, label]) => ({ key, label, count: counts[key] ?? 0 }))} value={tab} onChange={setTab} />
        <SegTabs items={TYPE_TABS.map(([key, label]) => ({ key, label }))} value={type} onChange={setType} />
      </div>
      <div className={cx('mt-5 w-[1180px] overflow-hidden rounded-[28px] bg-white', SH8)}>
        <div className="flex gap-4 bg-[#fafbfd] px-6 py-3.5">
          {COLS.map(([l, w]) => <p key={w + l} className="shrink-0 text-[12px] font-semibold text-muted" style={{ width: w }}>{l}</p>)}
        </div>
        {rows.map((t) => {
          const st = statusOf(t)
          return (
            <div key={t.id} className="flex h-[53px] items-center gap-4 border-t border-line px-6">
              <div className="flex w-[330px] shrink-0 items-center gap-2.5">
                <Tick checked={st === 'done'} onChange={() => st !== 'cancelled' && actions.toggle(t)} />
                <p className={cx('truncate text-[13px] font-bold', st === 'cancelled' ? 'text-muted' : 'text-ink')}>{t.title}</p>
              </div>
              <Link to={t.to} className="flex w-[210px] shrink-0 items-center gap-2">
                <RingAvatar initials={t.initials} bg={t.avBg} size={26} text={8} />
                <p className="truncate text-[12px] font-semibold text-blue">{t.who}{t.whoKind === 'Lead' ? ' · Lead' : ''}</p>
              </Link>
              <p className={cx('w-[200px] shrink-0 text-[12px] font-semibold whitespace-nowrap', st === 'overdue' ? 'text-[#b4323c]' : 'text-ink-2')}>{t.when}</p>
              <div className="w-[100px] shrink-0"><StatusChip tone={PRIORITY[t.priority]}>{t.priority}</StatusChip></div>
              <div className="w-[120px] shrink-0">{CHIP[st]}</div>
              <div className="flex w-[90px] shrink-0 gap-1.5">
                {(st === 'open' || st === 'overdue') && (
                  <>
                    <button type="button" aria-label="Edit task" onClick={() => setDrawer({ task: t.raw })} className="flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile"><Icon name="edit" size={11.8} /></button>
                    <button type="button" aria-label="Move to tomorrow" title="Move to tomorrow, 10:00 AM" onClick={() => actions.reschedule(t, 'tomorrow')} className="flex size-7 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile"><Icon name="calendar" size={11.8} /></button>
                  </>
                )}
              </div>
            </div>
          )
        })}
        {list.loading && !rows.length && <p className="border-t border-line px-6 py-5 text-[13px] font-medium text-muted">Loading tasks…</p>}
        {!list.loading && rows.length === 0 && (
          <NoMatches className="border-t border-line" text={q.trim() ? 'No matches' : 'Nothing here'} sub={q.trim() ? 'No tasks fit this search.' : 'No tasks in this tab.'} onClear={q.trim() ? clearQ : undefined} />
        )}
      </div>
      {drawer && <TaskDrawer task={drawer.task} onClose={() => setDrawer(null)} />}
    </AppLayout>
  )
}

/* ───────── NTF · Notifications ───────── */
const N_TABS = [['ALL', 'All'], ['UNREAD', 'Unread'], ['LEADS', 'Leads'], ['RENEWALS', 'Renewals'], ['PAYMENTS', 'Payments'], ['CATALOGUE', 'Catalogue'], ['KYC', 'KYC'], ['ACCOUNTS', 'Account']]
const N_STYLE = {
  LEADS: ['user-plus', 'bg-[#d9eafd]'], RENEWALS: ['refresh', 'bg-[#fde8c9]'], PAYMENTS: ['card', 'bg-[#fde8c9]'], CATALOGUE: ['star', 'bg-[#e9e3fc]'],
  KYC: ['shield', 'bg-[#d4f1e7]'], ACCOUNTS: ['users', 'bg-[#eef1f5]'], CORRECTIONS: ['edit', 'bg-[#e9e3fc]'], TEMPLATES: ['chat', 'bg-[#d4f1e7]'], OTHER: ['bell', 'bg-[#eef1f5]'],
}
const LINK_TO = { LEAD: (id) => `/leads/${id}`, CUSTOMER: (id) => `/customers/${id}`, QUOTATION: (id) => `/quotations/${id}`, POLICY: (id) => `/policies?open=${id}`, RENEWAL: (id) => `/renewals?open=${id}`, TASK: () => '/tasks' }

export function LiveNotifications() {
  const [tab, setTab] = useState('ALL')
  const [q, clearQ] = useHeaderSearch()
  const navigate = useNavigate()
  const { toast, toastError } = useToast()
  const list = useQuery(['notifications', tab], () => api.notifications.list({ filter: tab }))
  const count = useQuery('notifications:count', () => api.notifications.count())
  const items = (list.data?.items || []).filter((n) => matchesQuery(q, n.title, n.subtitle, n.message))
  const unread = count.data?.unread ?? 0
  const tabs = N_TABS.map(([key, label]) => ({ key, label, ...(key === 'UNREAD' ? { count: unread } : {}) }))
  const readAll = () => api.notifications.readAll().then((r) => { toast(r.meta?.message || 'All marked read.'); invalidate('notifications') }).catch(toastError)
  const open = async (n) => {
    try { await api.notifications.open(n.id) } catch { /* opening still works */ }
    invalidate('notifications')
    const to = n.link && LINK_TO[n.link.type]?.(n.link.id)
    if (to) navigate(to)
  }
  return (
    <AppLayout active="dashboard">
      <Header breadcrumb="NOTIFICATIONS" title="Notifications" subtitle="Kept for 30 days."
        actions={<HeadButton variant="white" icon="check" onClick={readAll}>Mark all read</HeadButton>} />
      <SegTabs items={tabs} value={tab} onChange={setTab} className="mt-[13px]" />
      <div className={cx('mt-5 flex w-[1180px] flex-col gap-1.5 rounded-[28px] bg-white p-6', SH8)}>
        {items.map((n) => {
          const [icon, bg] = N_STYLE[n.category] || N_STYLE.OTHER
          const d = daysFromToday(n.createdAt)
          return (
            <button key={n.id} type="button" onClick={() => open(n)} className={cx('flex items-start gap-3.5 rounded-[16px] p-3.5 text-left hover:bg-panel-2', !n.read && 'bg-[#f7f9ff]')}>
              <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-[20px]', bg)}><Icon name={icon} size={18} className="text-ink" /></span>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="text-[14px] leading-[18px] font-bold text-ink">{n.title ?? n.message}</p>
                {n.subtitle && <p className="text-[12px] leading-[15px] font-medium text-muted">{n.subtitle}</p>}
                <p className="text-[11px] leading-[14px] font-semibold text-muted">{d === 0 ? fmtWhen(n.createdAt) : d === -1 ? `Yesterday, ${fmtShortWhen(n.createdAt)}` : fmtWhen(n.createdAt)}</p>
              </div>
              {!n.read ? <StatusChip tone="sky">Unread</StatusChip> : <p className="text-[11px] font-semibold text-muted">Read</p>}
            </button>
          )
        })}
        {list.loading && !items.length && <p className="px-3.5 py-3.5 text-[13px] font-medium text-muted">Loading…</p>}
        {!list.loading && items.length === 0 && (
          <NoMatches className="px-3.5 py-3.5" text={q.trim() ? 'No matches' : 'All caught up'} sub={q.trim() ? `No notifications match “${q.trim()}”.` : 'No notifications here right now.'} onClear={q.trim() ? clearQ : undefined} />
        )}
      </div>
    </AppLayout>
  )
}