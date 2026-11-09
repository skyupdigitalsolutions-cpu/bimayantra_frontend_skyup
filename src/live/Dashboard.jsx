// 01 · Dashboard (Figma 5:27, responsive R1/R2) fed by the P-08 widget endpoints. Each widget is its own call,
// so one failure never blanks the page: a failing widget keeps an empty state.
import { useMemo, useState } from 'react'
import { DashboardScreen } from '../screens/tasks/_parts'
import { api, useQuery } from '../api'
import { fmtDate, fmtLongToday, fmtMoney, fmtTime, greetingWord, initials, avatarClass, daysFromToday } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { taskView, activityViews } from './views'
import TaskDrawer, { useTaskActions, TaskDetailsDialog } from './TaskDrawer'

const TAB_API = { today: 'TODAY', upcoming: 'UPCOMING', overdue: 'OVERDUE', completed: 'DONE' }
const STATUS_TILES = [
  ['NEW', 'new', 'New', 'user-plus', 'bg-[#d9eafd]'],
  ['CONTACTED', 'contacted', 'Contacted', 'phone', 'bg-[#e9e3fc]'],
  ['QUALIFIED', 'qualified', 'Qualified', 'check', 'bg-[#d4f1e7]'],
  ['FOLLOW_UP', 'followup', 'Follow-up', 'clock', 'bg-[#fde8c9]'],
  ['CONVERTED', 'converted', 'Converted', 'users', 'bg-[#e7f4ee]'],
  ['LOST', 'lost', 'Lost', 'x', 'bg-[#eef1f5]'],
]
const SOURCE_COLORS = ['bg-[#1f5fd6]', 'bg-[#127650]', 'bg-[#e8899c]', 'bg-[#5b3fb8]', 'bg-[#8a5a12]', 'bg-[#9aa4b5]']
const PIPE_COLORS = ['bg-[#1f5fd6]', 'bg-[#127650]', 'bg-[#5b3fb8]', 'bg-[#e8899c]', 'bg-[#8a5a12]', 'bg-[#9aa4b5]']
const TYPE_STYLE = { health: ['heart', 'bg-[#fde8c9]'], motor: ['car', 'bg-[#d9eafd]'], life: ['users', 'bg-[#e9e3fc]'], term: ['umbrella', 'bg-[#fde8ec]'], travel: ['plane', 'bg-[#d4f1e7]'] }
const leadsList = (q) => `/leads/list${q ? `?${q}` : ''}`

export default function LiveDashboard() {
  const { user } = useAuth()
  const actions = useTaskActions()
  const [drawer, setDrawer] = useState(null) // { task } | {}
  const [view, setView] = useState(null) // task shown in "View more"

  const counts = useQuery('dashboard:lead-status', () => api.dashboard.leadStatusCounts())
  const follow = useQuery('dashboard:follow-ups', () => api.dashboard.followUps())
  const sources = useQuery('dashboard:lead-sources', () => api.dashboard.leadSources())
  const activity = useQuery('dashboard:activity', () => api.dashboard.recentActivity())
  const catalogue = useQuery('dashboard:catalogue', () => api.dashboard.catalogueSummary())
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const renewals = useQuery('dashboard:renewals-due', () => api.dashboard.renewalsDue())
  // Tasks: all four tabs so the counts and lists are ready when a tab is picked
  const tToday = useQuery('tasks:TODAY', () => api.tasks.list('TODAY'))
  const tUp = useQuery('tasks:UPCOMING', () => api.tasks.list('UPCOMING'))
  const tOver = useQuery('tasks:OVERDUE', () => api.tasks.list('OVERDUE'))
  const tDone = useQuery('tasks:DONE', () => api.tasks.list('DONE'))

  const live = useMemo(() => {
    const first = (user?.name || '').split(' ')[0]
    const tc = tToday.data?.counts || tUp.data?.counts || {}
    const overdueFollow = follow.data?.overdue ?? 0
    const greeting = {
      title: `${greetingWord()}, ${first}`,
      sub: `${fmtLongToday()} · ${tc.TODAY ?? 0} task${(tc.TODAY ?? 0) === 1 ? '' : 's'} today · ${overdueFollow} overdue follow-up${overdueFollow === 1 ? '' : 's'}`,
      subTablet: fmtLongToday(),
      subMobile: `${fmtLongToday().replace(/^(\w{3})\w*,/, '$1,')} · ${overdueFollow} overdue follow-up${overdueFollow === 1 ? '' : 's'}`,
    }

    const by = counts.data?.byStatus || {}
    const leadStatuses = [
      { key: 'total', label: 'Total', value: counts.data?.total ?? 0, icon: 'grid', caption: 'All statuses', dark: true, to: leadsList() },
      ...STATUS_TILES.map(([code, key, label, icon, bg]) => ({ key, label, value: by[code] ?? 0, icon, bg, hideMobile: code === 'LOST', ...(code === 'CONVERTED' ? { caption: 'This month' } : {}) })),
    ]
    const followAlerts = [
      { key: 'today', title: 'Follow-ups due today', titleTablet: 'Follow-ups due today', titleMobile: 'Follow-ups due today', sub: follow.data?.firstToday ? `${follow.data.firstToday.name} · ${fmtTime(follow.data.firstToday.at)}${(follow.data.dueToday ?? 0) > 1 ? ` · +${follow.data.dueToday - 1} more` : ''}` : 'Nothing due today', count: follow.data?.dueToday ?? 0, icon: 'calendar', fg: 'text-[#8a5a12]', bg: 'bg-[#fff9ef]', border: 'border-[#f1d9a8]', to: leadsList('followUp=today') },
      { key: 'overdue', title: 'Overdue follow-ups', titleTablet: 'Follow-ups overdue', titleMobile: 'Overdue follow-ups', sub: follow.data?.firstOverdue ? `${follow.data.firstOverdue.name} · ${follow.data.firstOverdue.daysLate} day${follow.data.firstOverdue.daysLate === 1 ? '' : 's'} late` : 'None overdue', count: overdueFollow, icon: 'alert', fg: 'text-[#b4323c]', bg: 'bg-[#fff7f7]', border: 'border-[#f2c4c8]', to: leadsList('followUp=overdue') },
    ]

    const src = sources.data?.sources || []
    const max = Math.max(1, ...src.map((s) => s.count))
    const leadSources = src.map((s, i) => ({ name: s.label, value: `${s.count} · ${Math.round(s.percent)}%`, width: Math.round((380 * s.count) / max), color: SOURCE_COLORS[i % SOURCE_COLORS.length], keys: s.code || s.label }))
    const leadSourcesTablet = src.map((s, i) => ({ name: s.label, n: s.count, w: s.count / max, color: SOURCE_COLORS[i % SOURCE_COLORS.length], keys: s.code || s.label }))
    const pipeRows = (pipes.data || []).map((p, i) => ({ name: p.name, n: Object.values(p.counts || {}).reduce((a, b) => a + b, 0), color: PIPE_COLORS[i % PIPE_COLORS.length], to: leadsList(`pipelineId=${p.id}`) }))

    const renewalRows = (renewals.data?.items || []).map((r) => {
      const name = r.customer?.name ?? '—'
      const d = daysFromToday(r.dueDate)
      return {
        initials: initials(name), avBg: avatarClass(name), name, insurer: r.policy?.insurer ?? '—',
        plan: r.policy?.product ?? '—', due: d >= 0 ? `Due in ${d} days` : `${-d} days overdue`, urgent: d <= 45,
        renews: fmtDate(r.dueDate), premium: fmtMoney(r.premium ?? r.policy?.premium),
        days: d >= 0 ? `${d} days` : `${-d} days late`, to: `/renewals?open=${r.id}`,
        mobileTitle: `${name} · ${r.policy?.product ?? ''}`, mobileSub: `Ends ${fmtDate(r.dueDate, { year: false })} · ${fmtMoney(r.premium)}`,
      }
    })

    const types = catalogue.data?.types || []
    const catalogueTypes = types.slice(0, 5).map((t) => {
      const [icon, bg] = TYPE_STYLE[t.name.toLowerCase().split(' ')[0]] || ['box', 'bg-[#eef1f5]']
      return { label: t.name, sub: t.products ? `${t.products} product${t.products === 1 ? '' : 's'}` : 'Coming soon', icon, bg }
    })
    const fresh = types.reduce((a, t) => a + (t.newLast30Days || 0), 0)

    const list = (q) => (q.data?.tasks || []).map(taskView)
    const tasks = {
      loading: tToday.loading,
      lists: { today: list(tToday), upcoming: list(tUp), overdue: list(tOver), completed: list(tDone) },
      counts: { today: tc.TODAY, upcoming: tc.UPCOMING, overdue: tc.OVERDUE, completed: tc.DONE },
      onAdd: () => setDrawer({}),
      onEdit: (t) => setDrawer({ task: t.raw }),
      onView: (t) => setView(t),
      onToggle: actions.toggle,
      onReschedule: actions.reschedule,
      onTab: (k) => ({ today: tToday, upcoming: tUp, overdue: tOver, completed: tDone })[k]?.refetch(),
    }

    return {
      greeting, leadStatuses, followAlerts, tasks,
      ...activityViews(activity.data?.events),
      leadSources, leadSourcesTablet, leadSourcesMobile: leadSourcesTablet.slice(0, 4), leadSourcesTotal: sources.data?.total ?? 0, pipeRows,
      renewals: renewalRows,
      catalogueTypes, catalogueVerified: { text: [`${catalogue.data?.total ?? 0} products`, catalogue.data?.insurers != null && `${catalogue.data.insurers} insurers`, `${fresh} new`].filter(Boolean).join(' · '), fresh },
      TAB_API,
    }
  }, [user, counts.data, follow.data, sources.data, activity.data, catalogue.data, pipes.data, renewals.data, tToday, tUp, tOver, tDone, actions])

  return (
    <DashboardScreen
      live={live}
      liveDrawer={<>
        {drawer && <TaskDrawer task={drawer.task} onClose={() => setDrawer(null)} />}
        {view && <TaskDetailsDialog task={view} actions={actions} onEdit={(t) => setDrawer({ task: t.raw })} onClose={() => setView(null)} />}
      </>}
    />
  )
}