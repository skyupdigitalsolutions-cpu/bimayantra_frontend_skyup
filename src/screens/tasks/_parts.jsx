// Dashboard building blocks shared by 01 · Dashboard (5:27), TK1–TK6 task states and R1–R3 responsive frames.
// Breakpoints: base = mobile (R2, 390), md = tablet (R1, 834), xl = desktop (1440 frames, pixel-identical).
import { createContext, useContext, useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import RawIcon from '../../components/Icon'

// Figma keeps icon strokes at 1.6px whatever the icon size, so strokes must not scale with the viewBox.
export function Icon({ className = '', ...rest }) {
  return <RawIcon className={`[&_path]:[vector-effect:non-scaling-stroke] ${className}`} {...rest} />
}
import { cx } from '../../components/ui'
import { useLockScroll } from '../sales/_overlay'
import {
  greeting as GREETING, quickActions, quickActionsTablet, quickActionsMobile, leadStatuses as LEAD_STATUSES, followAlerts as FOLLOW_ALERTS, taskTabs, PRIORITY,
  tasks as baseTasks, createdTask, rescheduleOptions, activities as ACTIVITIES, activitiesCompact as ACTIVITIES_COMPACT, leadSources as LEAD_SOURCES, leadSourcesTablet as LEAD_SOURCES_T,
  leadSourcesMobile as LEAD_SOURCES_M, renewals as RENEWALS, catalogueTypes as CATALOGUE_TYPES, taskTypes, upcomingTasks, overdueTasks, completedTasks, leadRows, leadPipelines,
} from '../../data/tasks'
import { useDismiss, useCtrlK, NoMatches } from './_filter'

/**
 * Live data for the dashboard (src/live/Dashboard.jsx). When it is absent every section shows the Figma mock
 * data, so the TK1–TK6 / R1–R3 prototype frames keep working unchanged.
 */
export const DashLive = createContext(null)
const useLive = () => useContext(DashLive)

export const SH_CARD = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
export const SH_SOFT = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'
export const SH_NAVY = 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]'
export const PINK_BTN = 'bg-linear-to-b from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)] hover:brightness-[1.03]'
const CARD = `rounded-[24px] bg-white p-4 md:rounded-[28px] md:p-6 ${SH_CARD}`

/* ───────────────────────── small atoms ───────────────────────── */

export function SearchBox({ className = 'w-[240px]' }) {
  useCtrlK()
  return (
    <label className={cx('flex h-[50px] shrink-0 items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]', className)}>
      <Icon name="search" size={18} className="text-muted" />
      <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
      <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
    </label>
  )
}

export function RoundIcon({ icon, size = 44, iconSize = 18.5, className = '', to, ...rest }) {
  const cls = cx('flex shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT, className)
  const inner = <Icon name={icon} size={iconSize} />
  if (to) return <Link to={to} className={cls} style={{ width: size, height: size }} {...rest}>{inner}</Link>
  return <button type="button" className={cls} style={{ width: size, height: size }} {...rest}>{inner}</button>
}

function MoreLink({ to, children, desktop = 'View all', mobile = 'All', tablet = 'View all', arrowTablet = true }) {
  return (
    <Link to={to ?? '#'} className="flex shrink-0 items-center gap-1 text-[12px] font-bold text-blue hover:underline xl:gap-1.5 xl:text-[13px]">
      <span className="md:hidden">{mobile}</span>
      <span className="hidden md:inline xl:hidden">{tablet}</span>
      <span className="hidden xl:inline">{children ?? desktop}</span>
      <Icon name="arrow" size={13} className={cx('hidden xl:block xl:size-3.5', arrowTablet && 'md:block')} />
    </Link>
  )
}

export function Chip({ className = '', icon, children }) {
  return (
    <span className={cx('inline-flex h-[25px] shrink-0 items-center gap-[5px] rounded-[14px] px-3 text-[12px] font-semibold whitespace-nowrap', icon && 'pl-2', className)}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

export function Check({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange?.(!checked) }}
      className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white', className)}
    >
      {checked && <Icon name="check" size={15} />}
    </button>
  )
}

/** Priority segmented control (High / Medium / Low) */
export function PriorityTabs({ value, onChange }) {
  return (
    <div className={cx('flex w-fit gap-1 rounded-[26px] bg-white p-[5px]', SH_SOFT)}>
      {['High', 'Medium', 'Low'].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange?.(p)}
          className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold', p === value ? 'bg-navy text-white' : 'text-slate hover:text-ink')}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

/* ───────────────────────── Header + quick actions ───────────────────────── */

function DashHeader() {
  const live = useLive()
  const greeting = live?.greeting ?? GREETING
  return (
    <>
      <header className="flex items-center gap-2.5 md:col-span-2 xl:row-start-1 xl:mb-2.5 xl:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1 xl:gap-1.5">
          <h1 className="text-[20px] font-bold tracking-[-0.2px] text-ink md:text-[24px] xl:text-[24px] md:text-[30px] xl:tracking-[-0.6px]">{greeting.title}</h1>
          <p className="text-[12px] font-medium text-[#b4323c] md:text-[13px] md:text-muted xl:text-[14px]">
            <span className="md:hidden">{greeting.subMobile}</span>
            <span className="hidden md:inline xl:hidden">{greeting.subTablet}</span>
            <span className="hidden xl:inline">{greeting.sub}</span>
          </p>
        </div>
        <RoundIcon icon="bell" className="hidden md:flex" to="/notifications" aria-label="Notifications" />
        <Link
          onClick={(e) => { if (live?.tasks) { e.preventDefault(); live.tasks.onAdd() } }}
          to="/tasks"
          className={cx('hidden h-9 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold md:flex xl:h-[46px] xl:rounded-[24px] xl:pr-5 xl:pl-4 xl:text-[14px]', PINK_BTN)}
        >
          <Icon name="plus" size={16} className="xl:size-[18px]" />
          Add task
        </Link>
      </header>
      <Link
        to="/tasks"
        className={cx('flex h-[46px] items-center justify-center gap-2 rounded-[24px] text-[14px] font-semibold md:hidden', PINK_BTN)}
      >
        <Icon name="plus" size={18} />
        Add task
      </Link>
    </>
  )
}

function QuickTile({ a, v }) {
  const S = {
    m: { tile: 'h-[82px] min-w-0 flex-1 gap-1.5 rounded-[18px] px-1.5', circle: 'size-9', icon: 16, text: 'text-[11px]' },
    t: { tile: 'h-[93px] w-[124px] shrink-0 gap-2 rounded-[20px] px-3.5', circle: 'size-10', icon: 18, text: 'text-[12px]' },
    d: { tile: 'h-[97px] min-w-0 flex-1 gap-2 rounded-[20px] px-1.5', circle: 'size-11', icon: 19, text: 'text-[12px]' },
  }[v]
  return (
    <Link
      to={a.to}
      className={cx(
        'flex flex-col items-center justify-center border transition hover:-translate-y-0.5',
        S.tile,
        a.active ? cx('border-[#f4afbe]', v === 'd' ? 'bg-[#fff8f9]' : 'bg-white') : 'border-line bg-white',
      )}
    >
      <span className={cx('flex items-center justify-center rounded-full', S.circle, a.active ? 'bg-navy text-white' : 'bg-panel text-ink')}>
        <Icon name={a.icon} size={S.icon} />
      </span>
      <span className={cx('text-center font-semibold whitespace-nowrap text-ink', S.text)}>{a.label}</span>
    </Link>
  )
}

function QuickActions() {
  return (
    <div className="md:col-span-2 xl:row-start-2">
      <div className="flex gap-2 md:hidden">{quickActionsMobile.map((a) => <QuickTile key={a.label} a={a} v="m" />)}</div>
      <div className="hidden gap-2.5 overflow-x-auto [scrollbar-width:none] md:flex xl:hidden">{quickActionsTablet.map((a) => <QuickTile key={a.label} a={a} v="t" />)}</div>
      <div className="hidden gap-2.5 xl:flex">{quickActions.map((a) => <QuickTile key={a.label} a={a} v="d" />)}</div>
    </div>
  )
}

/* ───────────────────────── Leads at a glance ───────────────────────── */

function CardHead({ title, sub, right, className = '' }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {sub}
      </div>
      {right}
    </div>
  )
}

const Sub = ({ children, className = '' }) => <p className={cx('text-[12px] font-medium text-muted', className)}>{children}</p>

function LeadsGlance() {
  const live = useLive()
  const leadStatuses = live?.leadStatuses ?? LEAD_STATUSES
  const followAlerts = live?.followAlerts ?? FOLLOW_ALERTS
  const total = live ? leadStatuses[0].value : 16
  return (
    <section className={cx(CARD, 'flex flex-col gap-3 md:col-span-2 xl:row-start-3 xl:gap-4')}>
      <CardHead
        title="Leads at a glance"
        sub={<Sub><span className="xl:hidden">{total} leads</span><span className="hidden xl:inline">{total} leads in all pipelines · tap a status to open the filtered list</span></Sub>}
        right={<MoreLink to="/leads/list" desktop="View all leads" />}
      />
      <div className="flex flex-wrap gap-2 md:gap-2.5 xl:flex-nowrap xl:items-start xl:gap-3">
        {leadStatuses.map((s) => (
          <Link
            key={s.key}
            to={s.key === 'total' ? '/leads/list' : `/leads/list?status=${s.key}`}
            className={cx(
              'flex w-[100px] flex-col gap-0.5 rounded-[14px] p-2.5 transition hover:brightness-[0.98] md:w-[145px] md:gap-1 md:rounded-[18px] md:p-3 xl:w-auto xl:min-w-0 xl:flex-1 xl:gap-2 xl:rounded-[22px] xl:p-4',
              s.dark ? 'bg-rail' : s.bg,
              s.hideMobile && 'hidden md:flex',
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cx('hidden size-[30px] items-center justify-center rounded-full xl:flex', s.dark ? 'bg-white/10 text-white' : 'bg-white/80 text-ink')}>
                <Icon name={s.icon} size={15} />
              </span>
              <span className={cx('text-[11px] font-bold md:text-[12px]', s.dark ? 'text-[#c9d6ea]' : 'text-ink-2')}>{s.label}</span>
            </span>
            <span className={cx('text-[18px] font-bold md:text-[22px] xl:text-[28px] xl:tracking-[-0.6px]', s.dark ? 'text-white' : 'text-ink')}>{s.value}</span>
            {s.caption && <span className={cx('hidden text-[11px] font-medium xl:block', s.dark ? 'text-[#c9d6ea]' : 'text-muted')}>{s.caption}</span>}
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:gap-2.5 xl:gap-3">
        {followAlerts.map((a) => (
          <Link
            key={a.key}
            to={a.to ?? '/leads/list'}
            className={cx('flex items-center gap-2.5 rounded-[14px] p-3 md:flex-1 md:rounded-[16px] xl:gap-3.5 xl:rounded-[20px] xl:border xl:px-4 xl:py-3.5', a.bg, a.border, a.fg)}
          >
            <span className="flex shrink-0 items-center justify-center xl:size-10 xl:rounded-full xl:bg-white">
              <Icon name={a.icon} size={15} className="md:size-4 xl:size-[18px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[12px] font-bold md:text-[13px]">
                <span className="md:hidden">{a.titleMobile}</span>
                <span className="hidden md:inline xl:hidden">{a.titleTablet}</span>
                <span className="hidden xl:inline">{a.title}</span>
              </span>
              <span className="hidden text-[12px] font-medium xl:block">{a.sub}</span>
            </span>
            <span className="text-[18px] font-bold md:text-[20px] xl:text-[26px]">{a.count}</span>
            <Icon name="chev-right" size={15} className="md:hidden xl:block xl:size-[18px]" />
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── My Tasks & Follow-ups ───────────────────────── */

function ActionBtn({ icon, to, onClick, label }) {
  const cls = cx('flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile', SH_SOFT)
  if (to) return <Link to={to} aria-label={label} className={cls}><Icon name={icon} size={12.6} /></Link>
  return <button type="button" aria-label={label} onClick={onClick} className={cls}><Icon name={icon} size={12.6} /></button>
}

function ReschedulePopover({ task, onPick, onCustom }) {
  return (
    <div className="absolute top-[60px] right-3 z-20 flex w-[300px] flex-col gap-1 rounded-[20px] bg-white p-3 shadow-[0px_20px_44px_-10px_rgba(19,41,75,0.3)]">
      <p className="px-2 pt-1.5 pb-2 text-[12px] font-bold text-muted">Reschedule · {task.title}</p>
      {(onPick ? LIVE_RESCHEDULE : rescheduleOptions).map((o) => (
        <Link key={o.label} to="/" onClick={(e) => { if (onPick) { e.preventDefault(); onPick(o.preset) } }} className={cx('flex h-9 items-center gap-2.5 rounded-[12px] px-2.5 hover:bg-[#f3f7ff]', o.on && 'bg-[#f3f7ff]')}>
          <Icon name="clock" size={15} className="text-muted" />
          <span className="flex-1 text-[13px] font-semibold text-ink">{o.label}</span>
          <span className="text-[12px] font-medium text-muted">{o.when}</span>
        </Link>
      ))}
      <Link to="/" onClick={(e) => { if (onCustom) { e.preventDefault(); onCustom() } }} className="flex h-9 w-fit items-center gap-2.5 rounded-[12px] px-2.5 hover:bg-[#f3f7ff]">
        <Icon name="calendar" size={15} className="text-blue" />
        <span className="text-[13px] font-bold text-blue">Pick a date and time</span>
      </Link>
    </div>
  )
}

/** Live reschedule presets (POST /tasks/:id/reschedule { preset }) */
const LIVE_RESCHEDULE = [
  { label: 'Later today', when: '+ 2 hours', preset: 'later_today' },
  { label: 'Tomorrow', when: '10:00 AM', preset: 'tomorrow' },
  { label: 'This Friday', when: '10:00 AM', preset: 'this_friday' },
  { label: 'Next Monday', when: '10:00 AM', preset: 'next_monday' },
]

/** Green "Mark done" pill, or a quiet "Reopen" once the task is done. */
function MarkDonePill({ done, onClick, small }) {
  return (
    <button type="button" onClick={onClick}
      className={cx('inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition', small ? 'h-7 px-2.5 text-[11px]' : 'h-[30px] px-3 text-[12px]',
        done ? 'border border-line bg-white text-ink-2 hover:bg-tile' : 'bg-[#127650] text-white shadow-[0px_6px_14px_-6px_rgba(18,118,80,0.5)] hover:bg-[#0f6544]')}>
      <Icon name={done ? 'refresh' : 'check'} size={small ? 12 : 13} />{done ? 'Reopen' : 'Mark done'}
    </button>
  )
}
function ViewMorePill({ onClick, small }) {
  return (
    <button type="button" onClick={onClick}
      className={cx('inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-white font-semibold whitespace-nowrap text-ink hover:bg-tile', small ? 'h-7 px-2.5 text-[11px]' : 'h-[30px] px-3 text-[12px]')}>
      <Icon name="eye" size={small ? 12 : 13} />View more
    </button>
  )
}
/** Who the task is about, or a clear "not linked" line (no empty avatar / dash). */
function TaskWho({ t }) {
  if (t.whoKind === 'No record') return <span className="font-medium text-muted">Not linked to a record</span>
  return (
    <Link to={t.to} className="flex items-center gap-1.5 hover:underline">
      <span className={cx('flex size-5 items-center justify-center rounded-full border-2 border-white text-[6px] font-bold text-navy', t.avBg)}>{t.initials}</span>
      <span className="font-bold text-blue">{t.who}</span>
      <span className="font-medium text-muted">· {t.whoKind}</span>
    </Link>
  )
}

function TaskRow({ t, done, onToggle, popover, onReschedule, onEdit, onPick, onCustom, onView }) {
  return (
    <div
      className={cx(
        'relative flex items-center gap-3 rounded-[18px] py-3 pr-3 pl-3.5',
        t.fresh ? 'h-[79px] border-2 border-[#9cd8bd] bg-[#f5fbf8]' : cx('h-[77px] border border-line', done ? 'bg-[#f7fbf9]' : 'bg-white'),
      )}
    >
      <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full text-ink', t.iconBg)}><Icon name={t.icon} size={16} /></span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          {onView
            ? <button type="button" onClick={() => onView(t)} className={cx('min-w-0 truncate text-left text-[14px] font-bold hover:underline', done ? 'text-muted line-through' : 'text-ink')}>{t.title}</button>
            : <p className={cx('min-w-0 truncate text-[14px] font-bold', done ? 'text-muted line-through' : 'text-ink')}>{t.title}</p>}
          <Chip className={PRIORITY[t.priority]}>{t.priority}</Chip>
          {done ? <Chip icon="clock" className="bg-[#e7f4ee] text-[#127650]">Done</Chip> : <Chip icon="clock" className="bg-blue-50 text-blue">Open</Chip>}
        </div>
        <div className="flex h-5 items-center gap-2 text-[12px] whitespace-nowrap">
          <TaskWho t={t} />
          <span className="font-bold text-line">·</span>
          <span className="flex items-center gap-[5px]">
            <Icon name="calendar" size={13} className="text-muted" />
            <span className="font-semibold text-ink-2">{t.when}</span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {!done && (onEdit ? <ActionBtn icon="edit" onClick={() => onEdit(t)} label="Edit task" /> : <ActionBtn icon="edit" to="/tasks" label="Edit task" />)}
        {!done && <ActionBtn icon="calendar" onClick={onReschedule} label="Reschedule" />}
        {onView ? <ViewMorePill onClick={() => onView(t)} /> : <ActionBtn icon="arrow" to={t.to} label="Open" />}
        <MarkDonePill done={done} onClick={onToggle} />
      </div>
      {popover && <ReschedulePopover task={t} onPick={onPick} onCustom={onCustom} />}
    </div>
  )
}

function TaskCardMobile({ t, done, onToggle, onView }) {
  return (
    <div className={cx('flex items-start gap-2.5 rounded-[16px] border border-line p-3', done ? 'bg-[#f7fbf9]' : 'bg-white')}>
      <span className={cx('flex size-8 shrink-0 items-center justify-center rounded-full text-ink', t.iconBg)}><Icon name={t.icon} size={14} /></span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-px">
        <p className={cx('text-[13px] leading-[18px] font-bold', done ? 'text-muted line-through' : 'text-ink')}>{t.title}</p>
        {t.whoKind === 'No record' ? <span className="text-[12px] font-medium text-muted">Not linked to a record</span> : <Link to={t.to} className="text-[12px] font-semibold text-blue">{t.who}{t.whoKind === 'Lead' ? ' · Lead' : ''}</Link>}
        <div className="flex items-center gap-1.5">
          <Icon name="calendar" size={12} className="text-muted" />
          <span className="text-[11px] font-semibold text-ink-2">{t.time}</span>
          <Chip className={PRIORITY[t.priority]}>{t.priority}</Chip>
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <MarkDonePill small done={done} onClick={onToggle} />
          {onView && <ViewMorePill small onClick={() => onView(t)} />}
        </div>
      </div>
    </div>
  )
}

/**
 * state: undefined | 'created' (TK3) | 'completed' (TK5) ; reschedule: index of the task with the popover open (TK6)
 */
export function TasksSection({ state, reschedule = null }) {
  const live = useLive()
  if (live?.tasks) return <LiveTasksSection live={live} />
  return <PrototypeTasksSection state={state} reschedule={reschedule} />
}

/** The design-frame version (no API): kept separate so its hooks are never called conditionally. */
function PrototypeTasksSection({ state, reschedule }) {
  const lists = {
    today: state === 'created' ? [createdTask, ...baseTasks] : baseTasks,
    upcoming: upcomingTasks,
    overdue: overdueTasks,
    completed: completedTasks,
  }
  const [tab, setTab] = useState('today')
  const [done, setDone] = useState(() => ({ ...Object.fromEntries(completedTasks.map((t) => [t.id, true])), ...(state === 'completed' ? { t1: true } : {}) }))
  const [pop, setPop] = useState(reschedule)
  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }))
  const tabs = taskTabs.map((t) => ({ ...t, count: lists[t.key].length }))
  const list = lists[tab]
  const pick = (k) => { setTab(k); setPop(null) }

  return (
    <section className={cx(CARD, 'flex flex-col gap-3 md:col-span-2 md:gap-3.5 xl:col-span-1 xl:col-start-1 xl:row-start-4')}>
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[17px] font-bold text-ink md:text-[18px]">My Tasks &amp; Follow-ups</p>
          <Sub>
            <span className="md:hidden">10 open · 2 overdue</span>
            <span className="hidden md:inline">What you need to do · 10 open, 2 overdue</span>
          </Sub>
        </div>
        <Link to="/tasks" className={cx('hidden h-9 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold md:flex', PINK_BTN)}>
          <Icon name="plus" size={16} />Add task
        </Link>
        <Link to="/tasks" aria-label="Add task" className={cx('flex size-8 items-center justify-center rounded-full bg-white text-ink md:hidden', SH_SOFT)}>
          <Icon name="plus" size={13.4} />
        </Link>
      </div>

      {/* tabs: separate pills on mobile, segmented control from tablet up */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] md:w-fit md:gap-1 md:rounded-[22px] md:bg-panel md:p-1">
        {tabs.map((t) => {
          const on = t.key === tab
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => pick(t.key)}
              className={cx(
                'flex h-[29px] shrink-0 items-center gap-1.5 rounded-[16px] px-2.5 text-[12px] font-semibold md:h-8 md:gap-2 md:rounded-[18px] md:px-3.5 md:text-[13px]',
                on ? 'bg-navy text-white' : 'bg-panel text-slate md:bg-transparent',
              )}
            >
              <span className="md:hidden">{t.short}</span>
              <span className="hidden md:inline">{t.label}</span>
              <span
                className={cx(
                  'text-[11px] font-bold md:rounded-[9px] md:px-2 md:py-px',
                  on ? 'text-white md:bg-white/20' : t.red ? 'text-[#b4323c] md:bg-[#fbebec]' : 'text-muted md:bg-white',
                )}
              >
                {t.count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="hidden flex-col gap-2 md:flex">
        {list.map((t, i) => (
          <TaskRow key={t.id} t={t} done={!!done[t.id]} onToggle={() => toggle(t.id)} popover={pop === i} onReschedule={() => setPop(pop === i ? null : i)} />
        ))}
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        {list.filter((t) => !t.hideMobile).map((t) => <TaskCardMobile key={t.id} t={t} done={!!done[t.id]} onToggle={() => toggle(t.id)} />)}
      </div>
      {list.length === 0 && (
        <NoMatches
          className="rounded-[18px] border border-line px-4 py-4"
          text="Nothing here"
          sub="No tasks in this tab."
        />
      )}

      <Link to="/tasks" className="flex w-fit items-center gap-1 text-[12px] font-bold text-blue hover:underline md:gap-1.5 md:text-[13px]">
        View all tasks <Icon name="arrow" size={13} className="md:size-3.5" />
      </Link>
    </section>
  )
}

/** Same card as TasksSection, fed by GET /tasks (tab counts from the API) with real actions. */
function LiveTasksSection({ live }) {
  const { tasks: T } = live
  const [tab, setTab] = useState('today')
  const [pop, setPop] = useState(null)
  // The dashboard has no search bar (search lives on the list pages: Tasks, Leads, Policy holders…)
  const list = T.lists[tab] || []
  const tabs = taskTabs.map((t) => ({ ...t, count: T.counts[t.key] ?? 0 }))
  const pick = (k) => { setTab(k); setPop(null); T.onTab?.(k) }
  const open = (T.counts.today ?? 0) + (T.counts.upcoming ?? 0) + (T.counts.overdue ?? 0)
  return (
    <section className={cx(CARD, 'flex flex-col gap-3 md:col-span-2 md:gap-3.5 xl:col-span-1 xl:col-start-1 xl:row-start-4')}>
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[17px] font-bold text-ink md:text-[18px]">My Tasks &amp; Follow-ups</p>
          <Sub>
            <span className="md:hidden">{open} open · {T.counts.overdue ?? 0} overdue</span>
            <span className="hidden md:inline">What you need to do · {open} open, {T.counts.overdue ?? 0} overdue</span>
          </Sub>
        </div>
        <button type="button" onClick={() => T.onAdd()} className={cx('hidden h-9 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold md:flex', PINK_BTN)}>
          <Icon name="plus" size={16} />Add task
        </button>
        <button type="button" onClick={() => T.onAdd()} aria-label="Add task" className={cx('flex size-8 items-center justify-center rounded-full bg-white text-ink md:hidden', SH_SOFT)}>
          <Icon name="plus" size={13.4} />
        </button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] md:w-fit md:gap-1 md:rounded-[22px] md:bg-panel md:p-1">
        {tabs.map((t) => {
          const on = t.key === tab
          return (
            <button key={t.key} type="button" onClick={() => pick(t.key)}
              className={cx('flex h-[29px] shrink-0 items-center gap-1.5 rounded-[16px] px-2.5 text-[12px] font-semibold md:h-8 md:gap-2 md:rounded-[18px] md:px-3.5 md:text-[13px]', on ? 'bg-navy text-white' : 'bg-panel text-slate md:bg-transparent')}>
              <span className="md:hidden">{t.short}</span>
              <span className="hidden md:inline">{t.label}</span>
              <span className={cx('text-[11px] font-bold md:rounded-[9px] md:px-2 md:py-px', on ? 'text-white md:bg-white/20' : t.red ? 'text-[#b4323c] md:bg-[#fbebec]' : 'text-muted md:bg-white')}>{t.count}</span>
            </button>
          )
        })}
      </div>
      {T.loading && !list.length && <p className="px-1 text-[13px] font-medium text-muted">Loading tasks…</p>}
      <div className="hidden flex-col gap-2 md:flex">
        {list.map((t, i) => (
          <TaskRow key={t.id} t={t} done={t.done} onToggle={() => T.onToggle(t)} popover={pop === i}
            onReschedule={() => setPop(pop === i ? null : i)} onEdit={T.onEdit}
            onPick={(preset) => { setPop(null); T.onReschedule(t, preset) }} onCustom={() => { setPop(null); T.onEdit(t) }} onView={T.onView} />
        ))}
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        {list.map((t) => <TaskCardMobile key={t.id} t={t} done={t.done} onToggle={() => T.onToggle(t)} onView={T.onView} />)}
      </div>
      {!T.loading && list.length === 0 && (
        <NoMatches className="rounded-[18px] border border-line px-4 py-4" text="Nothing here" sub="No tasks in this tab." />
      )}
      <Link to="/tasks" className="flex w-fit items-center gap-1 text-[12px] font-bold text-blue hover:underline md:gap-1.5 md:text-[13px]">
        View all tasks <Icon name="arrow" size={13} className="md:size-3.5" />
      </Link>
    </section>
  )
}

/* ───────────────────────── Recent activities ───────────────────────── */

function RecentActivities() {
  const live = useLive()
  const activities = live?.activities ?? ACTIVITIES
  const activitiesCompact = live?.activitiesCompact ?? ACTIVITIES_COMPACT
  return (
    <section className={cx(CARD, 'flex flex-col self-start xl:col-start-2 xl:row-span-2 xl:row-start-4 xl:gap-1')}>
      <CardHead
        title="Recent activities"
        sub={<Sub className="md:hidden xl:block">What already happened</Sub>}
        right={<MoreLink to="/settings/activity" arrowTablet={false} />}
      />
      {/* compact list: mobile + tablet */}
      <div className="mt-2.5 flex flex-col gap-2.5 md:mt-2 md:gap-2 xl:hidden">
        {activitiesCompact.length === 0 && <p className="text-[12px] font-medium text-muted">Nothing yet.</p>}
        {activitiesCompact.map((a, i) => (
          <div key={a.t + i} className={cx('flex items-center gap-2.5', a.hideMobile && 'hidden md:flex')}>
            <span className={cx('flex size-[30px] shrink-0 items-center justify-center rounded-full text-ink', a.bg)}><Icon name={a.icon} size={14} /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <p className="text-[12px] font-bold text-ink"><span className="md:hidden">{a.m}</span><span className="hidden md:inline">{a.t}</span></p>
              <p className="text-[11px] font-medium text-muted"><span className="md:hidden">{a.ms}</span><span className="hidden md:inline">{a.ts}</span></p>
            </div>
          </div>
        ))}
      </div>
      {/* full timeline: desktop */}
      <div className="hidden flex-col gap-1 xl:flex">
        {activities.map((a, i) =>
          a.group ? (
            <p key={a.group + i} className="pt-3 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">{a.group}</p>
          ) : (
            <div key={i} className="flex gap-3 py-1.5">
              <span className={cx('flex size-[34px] shrink-0 items-center justify-center rounded-full text-ink', a.bg)}><Icon name={a.icon} size={15} /></span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[3px]">
                <p className="max-w-[250px] text-[13px] leading-[18px] font-bold text-ink">{a.title}</p>
                <p className="flex gap-1.5 text-[12px]"><span className="font-bold text-blue">{a.who}</span><span className="font-medium text-muted">{a.at}</span></p>
                {a.chip && <Chip className={a.chip[1]}>{a.chip[0]}</Chip>}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

/* ───────────────────────── Lead sources ───────────────────────── */

const leadsBySource = (keys) => `/leads/list?source=${keys}`
const PIPE_COLORS = ['bg-[#1f5fd6]', 'bg-[#127650]', 'bg-[#5b3fb8]', 'bg-[#e8899c]']

function LeadSourcesCard() {
  const live = useLive()
  const leadSources = live?.leadSources ?? LEAD_SOURCES
  const leadSourcesTablet = live?.leadSourcesTablet ?? LEAD_SOURCES_T
  const leadSourcesMobile = live?.leadSourcesMobile ?? LEAD_SOURCES_M
  const sourceTotal = live ? live.leadSourcesTotal : 16
  const [by, setBy] = useState('source')
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, setOpen)
  const pipeRows = live?.pipeRows ?? leadPipelines.map((p, i) => ({ name: p, n: leadRows.filter((r) => r.pipeline === p).length, color: PIPE_COLORS[i] }))
  const maxN = Math.max(1, ...pipeRows.map((r) => r.n))
  const pipeTotal = Math.max(1, live ? pipeRows.reduce((a, r) => a + r.n, 0) : leadRows.length)
  return (
    <section className={cx(CARD, 'flex flex-col gap-2 self-start md:gap-2.5 xl:col-start-1 xl:row-start-5 xl:gap-3')}>
      <CardHead
        title="Lead sources"
        sub={<Sub><span className="xl:hidden">This month</span><span className="hidden xl:inline">This month · {sourceTotal} leads</span></Sub>}
        right={
          <div ref={ref} className="relative hidden xl:block">
            <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-[12px] font-bold text-blue">
              {by === 'source' ? 'By source' : 'By pipeline'} <Icon name="chev-down" size={13} className={open ? 'rotate-180' : ''} />
            </button>
            {open && (
              <div role="listbox" className="absolute top-7 right-0 z-30 flex w-[180px] flex-col gap-0.5 rounded-[16px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
                {[['source', 'By source'], ['pipeline', 'By pipeline']].map(([k, l]) => (
                  <button key={k} type="button" role="option" aria-selected={by === k} onClick={() => { setBy(k); setOpen(false) }} className={cx('flex h-9 items-center gap-2 rounded-[10px] px-2.5 text-left text-[13px] font-semibold text-ink hover:bg-[#f3f7ff]', by === k && 'bg-[#f3f7ff]')}>
                    <span className="flex-1">{l}</span>
                    {by === k && <Icon name="check" size={14} className="text-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />
      {/* mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        {leadSourcesMobile.map((s) => (
          <Link key={s.name} to={leadsBySource(s.keys)} className="flex w-[294px] items-center gap-2">
            <span className="w-[90px] text-[12px] font-semibold text-ink">{s.name}</span>
            <span className="h-2 w-[180px] rounded-[4px] bg-panel"><span className={cx('block h-full rounded-[4px]', s.color)} style={{ width: `${s.w * 100}%` }} /></span>
            <span className="ml-auto text-[12px] font-bold text-ink">{s.n}</span>
          </Link>
        ))}
      </div>
      {/* tablet */}
      <div className="hidden flex-col gap-2.5 md:flex xl:hidden">
        {leadSourcesTablet.map((s) => (
          <Link key={s.name} to={leadsBySource(s.keys)} className="flex flex-col gap-1">
            <span className="flex text-[12px] text-ink"><span className="flex-1 font-semibold">{s.name}</span><span className="font-bold">{s.n}</span></span>
            <span className="h-2 rounded-[4px] bg-panel"><span className={cx('block h-full rounded-[4px]', s.color)} style={{ width: `${s.w * 100}%` }} /></span>
          </Link>
        ))}
      </div>
      {/* desktop */}
      <div className="hidden flex-col gap-3 xl:flex">
        {by === 'source'
          ? leadSources.map((s) => (
            <Link key={s.name} to={leadsBySource(s.keys)} className="flex items-center gap-3">
              <span className="flex w-[200px] shrink-0 flex-col gap-px">
                <span className="text-[13px] font-semibold text-ink">{s.name}</span>
                {s.sub && <span className="text-[11px] font-medium text-muted">{s.sub}</span>}
              </span>
              <span className="h-2.5 w-[380px] shrink-0 rounded-[5px] bg-panel"><span className={cx('block h-full rounded-[5px]', s.color)} style={{ width: s.width }} /></span>
              <span className="ml-auto text-[12px] font-bold text-ink">{s.value}</span>
            </Link>
          ))
          : pipeRows.map((s) => (
            <Link key={s.name} to={s.to ?? `/leads/list?pipeline=${s.name}`} className="flex items-center gap-3">
              <span className="w-[200px] shrink-0 text-[13px] font-semibold text-ink">{s.name}</span>
              <span className="h-2.5 w-[380px] shrink-0 rounded-[5px] bg-panel"><span className={cx('block h-full rounded-[5px]', s.color)} style={{ width: (380 * s.n) / maxN }} /></span>
              <span className="ml-auto text-[12px] font-bold text-ink">{s.n} · {Math.round((s.n / pipeTotal) * 100)}%</span>
            </Link>
          ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Renewals due ───────────────────────── */

function RenewalBig({ r }) {
  return (
    <Link to={r.to ?? '/renewals'} className="flex w-[232px] shrink-0 flex-col items-center rounded-[30px] bg-white px-[18px] pt-6 pb-[22px] transition hover:-translate-y-0.5">
      <span className={cx('flex size-[60px] items-center justify-center rounded-full border-[3px] border-white text-[18px] font-bold text-navy shadow-[0px_6px_14px_-4px_rgba(19,41,75,0.1)]', r.avBg)}>{r.initials}</span>
      <p className="mt-3 text-[15px] font-bold text-ink">{r.name}</p>
      <p className="mt-1 text-[12px] font-medium text-muted">{r.insurer}</p>
      <div className="mt-3.5 flex w-full flex-col items-center gap-[3px] rounded-[16px] bg-pink-100 py-3">
        <p className="text-[13px] font-semibold text-ink">{r.plan}</p>
        <p className={cx('text-[11px] font-medium', r.urgent ? 'text-rose' : 'text-slate')}>{r.due}</p>
      </div>
      <div className="mt-2.5 flex w-full gap-2">
        {[['Renews', r.renews], ['Premium', r.premium]].map(([k, v]) => (
          <div key={k} className="flex flex-1 flex-col gap-1 rounded-[14px] bg-panel-2 px-3 py-2.5">
            <p className="text-[11px] font-medium text-blue">{k}</p>
            <p className="text-[13px] font-semibold whitespace-nowrap text-ink">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2.5" onClick={(e) => e.preventDefault()}>
        {['phone', 'chat', 'quote'].map((i) => (
          <button key={i} type="button" aria-label={i} className="flex size-10 items-center justify-center rounded-full bg-navy text-white hover:bg-navy-700"><Icon name={i} size={18} /></button>
        ))}
      </div>
    </Link>
  )
}

const DaysChip = ({ r }) => <Chip className="bg-[#fbf1e1] text-[#8a5a12]">{r.days}</Chip>

function RenewalsCard() {
  const live = useLive()
  const renewals = live?.renewals ?? RENEWALS
  return (
    <section className={cx(CARD, 'flex flex-col gap-2.5 self-start md:col-span-2 md:gap-3 xl:col-span-1 xl:col-start-1 xl:row-start-6 xl:gap-4')}>
      <CardHead
        title="Renewals due"
        sub={<Sub><span className="xl:hidden">Ending soon</span><span className="hidden xl:inline">Upcoming renewals, soonest first</span></Sub>}
        right={<MoreLink to="/renewals" arrowTablet={false} />}
      />
      {renewals.length === 0 && <p className="text-[13px] font-medium text-muted">No renewals coming up.</p>}
      {/* mobile: soonest renewal only */}
      {renewals[0] && (
      <Link to={renewals[0].to ?? '/renewals'} className="flex items-center gap-2.5 rounded-[16px] bg-pink-100 p-3 md:hidden">
        <span className="flex size-[34px] items-center justify-center rounded-full border-2 border-white bg-white text-[11px] font-bold text-navy">{renewals[0].initials}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="text-[13px] font-bold text-ink">{renewals[0].mobileTitle ?? 'Kavya Hegde · FamilySure'}</span>
          <span className="text-[11px] font-medium text-rose-ink">{renewals[0].mobileSub ?? 'Ends 03 Dec · ₹21,340'}</span>
        </span>
        <DaysChip r={renewals[0]} />
      </Link>
      )}
      {/* tablet */}
      <div className="hidden gap-2.5 md:flex xl:hidden">
        {renewals.map((r) => (
          <Link key={r.name} to={r.to ?? '/renewals'} className="flex h-[112px] flex-1 flex-col items-center justify-center gap-1.5 rounded-[16px] bg-panel p-3">
            <span className={cx('flex size-9 items-center justify-center rounded-full border-2 border-white text-[12px] font-bold text-navy', r.avBg)}>{r.initials}</span>
            <span className="text-[12px] font-bold text-ink">{r.name}</span>
            <DaysChip r={r} />
          </Link>
        ))}
      </div>
      {/* desktop */}
      <div className="hidden gap-5 xl:flex">{renewals.map((r) => <RenewalBig key={r.name} r={r} />)}</div>
    </section>
  )
}

/* ───────────────────────── Insurance catalogue (desktop only) ───────────────────────── */

function CatalogueCard() {
  const live = useLive()
  const catalogueTypes = live?.catalogueTypes ?? CATALOGUE_TYPES
  const verified = live?.catalogueVerified ?? { text: '9 products · 5 insurers · 1 new', fresh: 1 }
  return (
    <section className={cx(CARD, 'hidden flex-col gap-3 self-start xl:col-start-2 xl:row-start-6 xl:flex')}>
      <CardHead title="Insurance catalogue" sub={<Sub>Products you can quote</Sub>} right={<MoreLink to="/products" desktop="Products" />} />
      <div className="flex flex-wrap gap-2">
        {catalogueTypes.map((c) => (
          <Link key={c.label} to="/products" className={cx('flex h-[58px] w-[172px] items-center gap-2.5 rounded-[18px] p-3 hover:brightness-[0.98]', c.bg)}>
            <span className="flex size-[34px] items-center justify-center rounded-full bg-white/80 text-ink"><Icon name={c.icon} size={16} /></span>
            <span className="flex flex-col gap-px">
              <span className="text-[13px] font-bold text-ink">{c.label}</span>
              <span className="text-[11px] font-medium text-slate">{c.sub}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link to="/best-fit" className="flex h-16 items-center gap-3 rounded-[18px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-3.5">
        <span className="flex size-9 items-center justify-center rounded-full bg-white/80 text-violet"><Icon name="sparkle" size={16} /></span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-bold text-ink">Run Best fit</span>
          <span className="text-[12px] font-medium text-violet">Rank products for a customer</span>
        </span>
        <Icon name="arrow" size={16} className="text-ink" />
      </Link>
      <Link to="/products" className="flex h-16 items-center gap-3 rounded-[18px] bg-panel p-3.5">
        <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="shield" size={16} /></span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-bold text-ink">Verified by SkyUp</span>
          <span className="text-[12px] font-medium text-muted">{verified.text}</span>
        </span>
        {verified.fresh > 0 && <Chip icon="star" className="bg-pink-100 text-[#b4325a]">{verified.fresh} new</Chip>}
      </Link>
    </section>
  )
}

/* ───────────────────────── Overlays ───────────────────────── */

export function Toast({ children }) {
  return (
    <div data-overlay="toast" role="status" className="fixed inset-x-4 bottom-24 z-40 flex items-center gap-2.5 rounded-[18px] bg-navy px-4 py-3 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)] md:inset-x-auto md:top-[120px] md:right-10 md:bottom-auto xl:top-[128px] xl:right-16">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#16845b] text-white"><Icon name="check" size={13} /></span>
      <p className="min-w-0 flex-1 text-[13px] font-semibold text-white md:whitespace-nowrap">{children}</p>
      <Link to="/" className="text-[13px] font-bold text-pink-300 hover:underline">Undo</Link>
    </div>
  )
}

const ERR = 'text-[#b4323c]'

function FieldLabel({ children, error }) {
  return <span className={cx('text-[13px] font-semibold', error ? ERR : 'text-ink')}>{children}</span>
}

function Box({ error, focus, className = '', children }) {
  return (
    <div
      className={cx(
        'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue/20',
        error && 'border-2 border-[#b4323c]',
        focus && 'border-2 border-blue',
        className,
      )}
    >
      {children}
    </div>
  )
}

const inputCls = 'min-w-0 flex-1 bg-transparent font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint'

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '5:30 PM', '6:00 PM']

const DRAWER_PRESETS = {
  empty: { heading: 'Add task', sub: 'A reminder for yourself', title: '', desc: '', type: null, related: false, date: '', time: '', priority: 'Medium' },
  errors: { heading: 'Add task', sub: 'A reminder for yourself', title: '', desc: '', type: null, related: false, date: '20-10-2026', time: '', priority: 'Medium', errors: true },
  edit: { heading: 'Edit task', sub: 'Created 25 Oct by you', title: 'Share renewal quotation', desc: 'Send QT-202610-00014 on WhatsApp and email.', type: 'Renewal', related: true, date: '26-10-2026', time: '4:00 PM', priority: 'High', edit: true },
  filled: { heading: 'Add task', sub: 'A reminder for yourself', title: 'Call Rohan’s parents about cover', desc: '', type: 'Call', related: true, date: '26-10-2026', time: '5:30 PM', priority: 'Medium', focusTitle: true },
}

/**
 * Add / edit task drawer (desktop + tablet) that becomes a bottom sheet on mobile (R3).
 * mode: empty (TK1) | errors (TK2) | edit (TK4) | filled (R3)
 */
export function TaskDrawer({ mode = 'empty', closeTo = '/', saveTo }) {
  const p = DRAWER_PRESETS[mode]
  const navigate = useNavigate()
  const [title, setTitle] = useState(p.title)
  const [desc, setDesc] = useState(p.desc)
  const [type, setType] = useState(p.type)
  const [date, setDate] = useState(p.date)
  const [time, setTime] = useState(p.time)
  const [priority, setPriority] = useState(p.priority)
  const [related, setRelated] = useState(p.related)
  const err = !!p.errors
  const target = saveTo ?? { empty: '/tasks', errors: '/tasks', edit: '/', filled: '/' }[mode]
  useLockScroll()

  return (
    <>
      <Link to={closeTo} aria-label="Close" data-overlay="scrim" className="fixed inset-0 z-40 bg-[#0e1f3b]/40" />
      <form
        data-overlay={typeof window !== 'undefined' && window.innerWidth < 768 ? 'sheet' : 'drawer'}
        onSubmit={(e) => { e.preventDefault(); navigate(target) }}
        className={cx(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col gap-3 overflow-y-auto rounded-t-[28px] bg-white px-[18px] pt-2.5 pb-7 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]',
          'md:inset-x-auto md:top-4 md:right-4 md:bottom-auto md:max-h-[calc(100vh-32px)] md:min-h-[min(928px,calc(100vh-32px))] md:w-[500px] md:gap-4 md:rounded-[32px] md:px-7 md:pt-7 md:pb-6',
          'xl:top-6 xl:right-6 xl:max-h-[calc(100vh-48px)] xl:min-h-[min(928px,calc(100vh-48px))]',
        )}
      >
        <span className="mx-auto h-[5px] w-10 shrink-0 rounded-[3px] bg-[#d5dbe5] md:hidden" />
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[18px] font-bold text-ink md:text-[20px] md:tracking-[-0.2px]">{p.heading}</p>
            <p className="hidden text-[12px] font-medium text-muted md:block">{p.sub}</p>
          </div>
          <Link to={closeTo} aria-label="Close" className={cx('flex size-8 items-center justify-center rounded-full bg-white text-ink md:size-9 md:bg-panel md:shadow-none', SH_SOFT)}>
            <Icon name="x" size={13.4} className="md:size-4" />
          </Link>
        </div>

        {err && (
          <div className="flex shrink-0 items-center gap-2.5 rounded-[14px] border border-[#f2c4c8] bg-[#fff7f7] px-3.5 py-3">
            <Icon name="alert" size={16} className={ERR} />
            <p className={cx('text-[13px] font-bold', ERR)}>Fix 3 things to save this task.</p>
          </div>
        )}

        <label className="flex shrink-0 flex-col gap-2">
          <FieldLabel>Task title *</FieldLabel>
          <Box error={err} focus={p.focusTitle}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Call back about family floater" className={inputCls} />
          </Box>
          {err && <span className={cx('text-[12px] font-medium', ERR)}>Enter a title.</span>}
        </label>

        <label className="hidden shrink-0 flex-col gap-2 md:flex">
          <FieldLabel>Description</FieldLabel>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Optional notes"
            className="h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint focus:ring-2 focus:ring-blue/20"
          />
        </label>

        <div className="flex shrink-0 flex-col gap-1.5 md:gap-2">
          <FieldLabel error={err}>Task type *</FieldLabel>
          <div className="flex flex-wrap gap-1.5 md:pr-1">
            {taskTypes.map((t) => {
              const on = t === type
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cx(
                    'rounded-[14px] px-[11px] py-1.5 text-[12px] font-semibold md:rounded-[16px] md:px-3 md:py-[7px]',
                    on ? 'bg-navy text-white' : cx('border bg-white text-ink-2 hover:text-ink', err ? 'border-[#f2c4c8]' : 'border-line'),
                  )}
                >
                  {t === 'Collect documents' ? <><span className="md:hidden">Documents</span><span className="hidden md:inline">{t}</span></> : t}
                </button>
              )
            })}
          </div>
        </div>
        {err && <p className={cx('-mt-1 text-[12px] font-medium md:-mt-0', ERR)}>Choose a task type.</p>}

        <label className="flex shrink-0 flex-col gap-2">
          <FieldLabel>
            <span className="md:hidden">Related (optional)</span>
            <span className="hidden md:inline">Related lead or policy holder (optional)</span>
          </FieldLabel>
          <Box>
            {related ? (
              <>
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-pink-200 text-[10px] font-bold text-navy">KH</span>
                <span className="flex-1">Kavya Hegde · Policy holder</span>
                <button type="button" aria-label="Clear" onClick={() => setRelated(false)} className="hidden text-muted hover:text-ink"><Icon name="x" size={14} /></button>
              </>
            ) : (
              <>
                <Icon name="search" size={18} className="text-muted" />
                <input placeholder="Search name or mobile" className={inputCls} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setRelated(true))} />
              </>
            )}
          </Box>
        </label>

        <div className="flex shrink-0 gap-2.5 md:gap-3">
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <FieldLabel><span className="md:hidden">Date *</span><span className="hidden md:inline">Due date *</span></FieldLabel>
            <Box error={err && !!date}>
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="dd-mm-yyyy" className={inputCls} />
              <Icon name="calendar" size={18} className="text-muted" />
            </Box>
            {err && <span className={cx('text-[12px] font-medium', ERR)}>Date can’t be in the past.</span>}
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <FieldLabel><span className="md:hidden">Time *</span><span className="hidden md:inline">Due time *</span></FieldLabel>
            <Box className="relative">
              <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">--:--</option>
                {TIMES.map((t) => <option key={t}>{t}</option>)}
              </SelectCompat>
            </Box>
          </label>
        </div>

        {p.edit && (
          <div className="flex shrink-0 items-center gap-3 rounded-[16px] bg-panel p-3.5">
            <div className="flex w-[116px] flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">Status: Open</p>
              <p className="text-[11px] font-medium whitespace-nowrap text-muted">Mark it done here or tick it in the list.</p>
            </div>
            <Link to="/tasks" className="flex h-9 items-center gap-2 rounded-[18px] border border-line bg-white pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-tile">
              <Icon name="check" size={16} />Mark as completed
            </Link>
            <button type="button" className="flex h-9 items-center rounded-[18px] border border-[#f2c4c8] bg-white px-3.5 text-[13px] font-semibold text-[#b4323c]">Cancel task</button>
          </div>
        )}

        <div className="flex shrink-0 flex-col gap-1.5 md:gap-2">
          <FieldLabel>Priority</FieldLabel>
          <PriorityTabs value={priority} onChange={setPriority} />
        </div>

        <div className="hidden shrink-0 items-center gap-2.5 rounded-[16px] bg-blue-50 px-4 py-3 md:flex">
          <Icon name="clock" size={16} className="text-blue" />
          <p className="text-[13px] font-semibold text-blue">Shows in My Tasks on the due date. No messages are sent to the customer.</p>
        </div>

        <span className="hidden min-h-px grow md:block" />

        <div className="sticky bottom-0 z-10 -mx-[18px] -mt-3 flex shrink-0 gap-2.5 bg-white px-[18px] pt-3 shadow-[0_28px_0_0_#fff] md:-mx-7 md:px-7 md:shadow-[0_24px_0_0_#fff]">
          <Link to={closeTo} className="hidden h-[46px] w-[220px] items-center justify-center rounded-[24px] border border-line bg-white text-[14px] font-semibold text-ink hover:bg-tile md:flex">
            Cancel
          </Link>
          <button type="submit" className={cx('flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[24px] bg-navy text-[15px] font-semibold text-white hover:bg-navy-700 md:h-[46px] md:text-[14px]', SH_NAVY)}>
            <Icon name="check" size={18} />
            {p.edit ? 'Save changes' : 'Save task'}
          </button>
        </div>
      </form>
    </>
  )
}

/* ───────────────────────── Screen ───────────────────────── */

/**
 * The advisor dashboard. Responsive (R1 tablet / R2 mobile) and used as the base for every TK state.
 *  drawer: TaskDrawer mode ; tasks: 'created' | 'completed' ; reschedule: task index ; toast: text
 */
export function DashboardScreen({ drawer, tasks, reschedule, toast, closeTo, live, liveDrawer }) {
  return (
    <DashLive.Provider value={live ?? null}>
    <AppLayout active="dashboard" responsive mobileTitle="Home" mobileSearch={false} lockScroll={!!drawer}>
      <div className="grid grid-cols-1 gap-y-3.5 md:grid-cols-2 md:gap-x-3.5 md:gap-y-[18px] xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-5">
        <DashHeader />
        <QuickActions />
        <LeadsGlance />
        <TasksSection state={tasks} reschedule={reschedule} />
        <RecentActivities />
        <LeadSourcesCard />
        <RenewalsCard />
        <CatalogueCard />
      </div>
      {toast && <Toast>{toast}</Toast>}
      {drawer && <TaskDrawer mode={drawer} closeTo={closeTo} />}
      {liveDrawer}
    </AppLayout>
    </DashLive.Provider>
  )
}
