// Leads list (02b / 02c / R4), New lead form (F1b / R5) and Edit lead drawer (LE1).
// Breakpoints: base = mobile (390 frames), md = tablet, xl = desktop (1440 frames).
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { cx } from '../../components/ui'
import { Icon, SearchBox, RoundIcon, Chip, Check, PriorityTabs, SH_CARD, SH_SOFT, SH_NAVY, PINK_BTN } from './_parts'
import { leadTabs, leadRows as LEAD_ROWS, SOURCE_STYLE, STATUS_CHIP, PRIORITY, sourceGroups, afterSave, leadDetail, LEAD_STATUS, leadPipelines as LEAD_PIPELINES } from '../../data/tasks'
import { matchesQuery, useHeaderSearch, DropFilter, NoMatches } from './_filter'

export const CARD = `rounded-[28px] bg-white p-6 ${SH_CARD}`

export function PageHeading({ crumb, title, extra, sub }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre text-muted">{crumb}</p>
      <div className="flex items-center gap-3">
        <h1 className="text-[30px] font-bold tracking-[-0.6px] text-ink">{title}</h1>
        {extra}
      </div>
      <p className="text-[14px] font-medium text-muted">{sub}</p>
    </div>
  )
}

/* ───────────────────────── Lead source menu (F1b select + 02c filter) ───────────────────────── */

/** mode 'select': single choice with a tick (F1b) · mode 'filter': checkboxes + Clear/Apply (02c) */
export function SourceMenu({ mode = 'select', selected, onPick, onApply, onClear, className = '' }) {
  return (
    <div className={cx('z-30 flex w-[340px] flex-col gap-0.5 rounded-[18px] bg-white p-2 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]', className)}>
      {sourceGroups.map((g) => (
        <div key={g.group} className="flex flex-col gap-0.5">
          <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.6px] text-muted">{g.group}</p>
          {g.options.map((o) => {
            const on = mode === 'filter' ? selected.includes(o.key) : selected === o.key
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => onPick(o.key)}
                className={cx('flex shrink-0 items-center gap-2.5 rounded-[12px] px-2.5 text-left hover:bg-[#f3f7ff]', o.sub ? 'h-[47px]' : 'h-[42px]', mode === 'select' && on && 'bg-[#f3f7ff]')}
              >
                {mode === 'filter' && <Check checked={on} onChange={() => onPick(o.key)} />}
                <span className={cx('flex size-[26px] shrink-0 items-center justify-center rounded-full', o.cls)}><Icon name={o.icon} size={13} /></span>
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="text-[13px] font-bold text-ink">{o.label}</span>
                  {o.sub && <span className="text-[11px] font-medium text-muted">{o.sub}</span>}
                </span>
                {mode === 'select' && on && <Icon name="check" size={15} className="text-blue" />}
              </button>
            )
          })}
        </div>
      ))}
      {mode === 'filter' && (
        <div className="flex items-start gap-2 px-2.5 pt-2 pb-1">
          <button type="button" onClick={onClear} className="flex h-9 items-center rounded-[18px] px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Clear</button>
          <button type="button" onClick={onApply} className={cx('ml-auto flex h-9 items-center gap-2 rounded-[18px] bg-navy pr-3.5 pl-3 text-[13px] font-semibold text-white', SH_NAVY)}>
            <Icon name="check" size={16} />Apply
          </button>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── Leads list ───────────────────────── */

function SourceTag({ r, withIcon = true }) {
  const s = SOURCE_STYLE[r.source]
  return (
    <span className={cx('inline-flex h-[22px] w-fit shrink-0 items-center gap-[5px] rounded-[12px] pr-2.5 text-[11px] font-bold whitespace-nowrap', withIcon ? 'pl-2' : 'pl-2.5', s.cls)}>
      {withIcon && <Icon name={s.icon} size={12} />}
      {r.sourceLabel}
    </span>
  )
}

const COLS = ['w-[250px]', 'w-[90px]', 'w-[120px]', 'w-[210px]', 'w-[180px]', 'w-[90px]', 'w-[30px]']

function LeadRow({ r, filtered }) {
  // In 02b the two Meta Ads rows carry the campaign under the chip; the Figma frame lets that cell hug its
  // content (102px), which shifts the remaining cells of those rows left. Reproduced as drawn.
  const hug = r.meta && !filtered
  return (
    <Link to={r.to ?? '/leads/1'} className="flex h-[66px] items-center gap-4 px-6 hover:bg-panel-2">
      <span className={cx('flex items-center gap-3', COLS[0])}>
        <span className={cx('flex size-[38px] items-center justify-center rounded-full border-2 border-white text-[12px] font-bold text-navy', r.avBg)}>{r.initials}</span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-ink">{r.name}</span>
          <span className="text-[12px] font-medium text-muted">{r.mobile}</span>
        </span>
      </span>
      <span className={cx('text-[13px] font-medium text-ink', COLS[1])}>{r.pipeline}</span>
      <span className={COLS[2]}><Chip className={STATUS_CHIP[r.status]}>{r.status}</Chip></span>
      <span className={cx('flex flex-col gap-[3px]', hug ? 'w-[102px]' : COLS[3], hug && 'mt-[17px]')}>
        <SourceTag r={r} />
        {hug && <span className="text-[11px] font-medium whitespace-nowrap text-muted">{r.campaign}</span>}
      </span>
      <span className={cx('text-[13px]', r.overdue ? 'font-bold text-[#b4323c]' : 'font-medium text-ink', COLS[4])}>{r.next}</span>
      <span className={COLS[5]}><Chip className={PRIORITY[r.priority]}>{r.priority}</Chip></span>
      <Icon name="chev-right" size={18} className="text-muted" />
    </Link>
  )
}

function LeadCardMobile({ r }) {
  return (
    <Link to={r.to ?? '/leads/1'} className="flex flex-col gap-2 rounded-[20px] bg-white p-3.5">
      <span className="flex items-center gap-2.5">
        <span className={cx('flex size-[34px] items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-navy', r.avBg)}>{r.initials}</span>
        <span className="min-w-0 flex-1 text-[14px] font-bold text-ink">{r.name}</span>
        <Chip className={STATUS_CHIP[r.status]}>{r.status}</Chip>
      </span>
      <span className="flex h-[22px] items-center gap-2">
        <SourceTag r={r} withIcon={false} />
        {r.overdue && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#b4323c]">
            <Icon name="alert" size={12} />{r.next}
          </span>
        )}
      </span>
    </Link>
  )
}

const SRC_LABEL = Object.fromEntries(sourceGroups.flatMap((g) => g.options.map((o) => [o.key, o.label])))
const PAGE = 8

/** API source code → the design's source key (filters) */
export const SOURCE_KEY = {
  META_ADS: 'meta', GOOGLE_ADS: 'google', LINKEDIN_ADS: 'other', WEBSITE: 'website', WEBSITE_FORM: 'website', SOCIAL_MEDIA: 'social',
  REFERRED_BY_CLIENT: 'ref-client', REFERRED_BY_REFERRER: 'ref-referrer', WALK_IN: 'walkin', CAMPAIGN: 'campaign', MANUAL_ENTRY: 'manual', OTHER: 'other', PAID_ADS: 'other',
}
const asKeys = (v) => (v ? v.split(',').map((x) => SOURCE_KEY[x] ?? x) : [])

/**
 * filtered: 02c state (Meta Ads source filter applied, dropdown open). Also reads ?status= ?source= ?pipeline= ?followUp=
 * live: { rows, pipelines, loading } from src/live/LeadsList.jsx (rows in the same shape as data/tasks leadRows)
 */
export function LeadsListScreen({ filtered = false, live }) {
  const leadRows = live?.rows ?? LEAD_ROWS
  const leadPipelines = live?.pipelines ?? LEAD_PIPELINES
  const [params, setParams] = useSearchParams()
  const pSource = params.get('source') && asKeys(params.get('source')).join(',')
  const followUp = params.get('followUp')
  const [tab, setTab] = useState(() => { const st = (params.get('status') || '').toLowerCase().replace('_', ''); return LEAD_STATUS[st] ? st : 'all' })
  const [menu, setMenu] = useState(filtered && !pSource)
  const [sources, setSources] = useState(() => (pSource ? pSource.split(',') : filtered ? ['meta'] : []))
  const [picked, setPicked] = useState(sources)
  const [pipeline, setPipeline] = useState(() => (params.get('pipeline') ? params.get('pipeline') : 'all'))
  const [hq, clearHq] = useHeaderSearch()
  const [mq, setMq] = useState('')
  const [showAll, setShowAll] = useState(false)

  const counts = useMemo(() => Object.fromEntries(leadTabs.map((t) => [t.key, t.key === 'all' ? leadRows.length : leadRows.filter((r) => r.status === LEAD_STATUS[t.key]).length])), [leadRows])
  const tabs = leadTabs.map((t) => ({ ...t, count: counts[t.key] }))
  const base = (r) => (tab === 'all' || r.status === LEAD_STATUS[tab]) && (!sources.length || sources.includes(r.srcKey)) && (pipeline === 'all' || r.pipeline === pipeline)
    && (!followUp || (followUp === 'overdue' ? r.overdue : r.dueToday))
  const q = hq || mq
  const rows = leadRows.filter((r) => base(r) && matchesQuery(q, r.name, r.mobile, r.sourceLabel, r.status, r.pipeline, r.campaign))
  const hasFilter = tab !== 'all' || sources.length > 0 || pipeline !== 'all' || !!q.trim() || !!followUp
  const onlySource = sources.length > 0 && tab === 'all' && pipeline === 'all' && !q.trim()
  const visible = showAll ? rows : rows.slice(0, PAGE)
  const more = rows.length > visible.length
  const pristine = !hasFilter
  const mobileRows = live ? rows : pristine ? leadRows.filter((r) => r.mobileOrder).sort((a, b) => a.mobileOrder - b.mobileOrder) : rows
  const toggle = (k) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))
  const apply = () => { setSources(picked); setMenu(false); setShowAll(false) }
  const clearSources = () => { setPicked([]); setSources([]); setMenu(false) }
  const removeSource = (k) => { setSources((xs) => xs.filter((x) => x !== k)); setPicked((xs) => xs.filter((x) => x !== k)) }
  const clearAll = () => { setTab('all'); clearSources(); setPipeline('all'); clearHq(); setMq(''); if (followUp) setParams({}, { replace: true }) }
  const sourceLabel = sources.length === 0 ? 'Source: All' : sources.length === 1 ? `Source: ${SRC_LABEL[sources[0]]}` : `Source: ${sources.length} selected`
  const pickTab = (k) => { setTab(k); setShowAll(false) }
  const pipeOptions = [{ key: 'all', label: 'All' }, ...leadPipelines.map((p) => ({ key: p, label: p, count: leadRows.filter((r) => r.pipeline === p).length }))]
  const footer = !hasFilter
    ? more ? `${visible.length} of ${leadRows.length} leads · scroll for more` : `${leadRows.length} of ${leadRows.length} leads`
    : `${more ? `${visible.length} of ${rows.length} matching · ` : ''}${rows.length} of ${leadRows.length} leads · filtered${onlySource ? ' by source' : ''}`

  return (
    <AppLayout active="leads" responsive mobileTitle="Leads">
      {/* ── tablet + desktop header ── */}
      <div className="hidden items-start justify-between gap-4 md:flex">
        <PageHeading crumb="LEADS" title="Leads" sub="Every lead across your pipelines." />
        <div className="mt-1 flex items-center gap-3">
          <SearchBox className="hidden xl:flex" />
          <RoundIcon icon="bell" className="hidden xl:flex" aria-label="Notifications" />
          <div className={cx('hidden h-10 gap-1 rounded-[24px] bg-white p-1 xl:flex', 'shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]')}>
            <Link to="/leads" className="flex items-center gap-1.5 rounded-[20px] px-3.5 text-[13px] font-semibold text-muted hover:text-ink">
              <Icon name="columns" size={16} />Board
            </Link>
            <span className="flex items-center gap-1.5 rounded-[20px] bg-navy px-3.5 text-[13px] font-semibold text-white">
              <Icon name="list" size={16} />List
            </span>
          </div>
          <Link to="/leads/new" className={cx('flex h-[46px] items-center gap-2 rounded-[24px] pr-5 pl-4 text-[14px] font-semibold', PINK_BTN)}>
            <Icon name="plus" size={18} />New lead
          </Link>
        </div>
      </div>

      {/* ── desktop filters + table ── */}
      <div className="hidden xl:block">
        <div className="mt-[13px] flex h-11 items-center gap-2.5">
          <div className={cx('flex gap-1 rounded-[26px] bg-white p-[5px]', SH_SOFT)}>
            {tabs.map((t) => {
              const on = t.key === tab
              return (
                <button key={t.key} type="button" onClick={() => pickTab(t.key)} className={cx('flex h-[34px] items-center gap-2 rounded-[21px] px-4 text-[13px] font-semibold', on ? 'bg-navy text-white' : 'text-slate hover:text-ink')}>
                  {t.label}
                  <span className={cx('rounded-[9px] px-2 py-px text-[11px] font-bold', on ? 'bg-white/20' : 'bg-panel text-muted')}>{t.count}</span>
                </button>
              )
            })}
          </div>
          <div className="relative ml-auto">
            <button
              type="button"
              aria-expanded={menu}
              onClick={() => { setPicked(sources); setMenu((m) => !m) }}
              className={cx(
                'flex h-11 items-center gap-2 rounded-[22px] px-3.5 text-[13px] font-semibold',
                sources.length ? 'border-[1.5px] border-blue bg-blue-50 text-blue' : 'border border-line bg-white text-ink',
              )}
            >
              <Icon name="filter" size={15} className={sources.length ? 'text-blue' : 'text-muted'} />
              {sourceLabel}
              <Icon name="chev-down" size={15} className={sources.length ? 'text-blue' : 'text-muted'} />
            </button>
            {menu && <SourceMenu mode="filter" selected={picked} onPick={toggle} onApply={apply} onClear={clearSources} className="absolute top-[52px] right-0" />}
          </div>
          <DropFilter label="Pipeline" value={pipeline} options={pipeOptions} onChange={(v) => { setPipeline(v); setShowAll(false) }} />
        </div>

        <div className={cx('mt-5 overflow-hidden rounded-[28px] bg-white', SH_CARD)}>
          <div className="flex gap-4 rounded-t-[28px] bg-[#fafbfd] px-6 py-3.5 text-[12px] font-semibold text-muted">
            {['Lead', 'Pipeline', 'Status', 'Source', 'Next follow-up', 'Priority', ''].map((h, i) => <span key={i} className={COLS[i]}>{h}</span>)}
          </div>
          {visible.map((r) => (
            <div key={r.id} className="border-t border-line">
              <LeadRow r={r} filtered={filtered} />
            </div>
          ))}
          {live?.loading && <p className="border-t border-line px-6 py-5 text-[13px] font-medium text-muted">Loading leads…</p>}
          {!live?.loading && rows.length === 0 && <NoMatches className="border-t border-line" onClear={clearAll} sub="No leads fit the current status, source, pipeline or search." />}
          {more ? (
            <button type="button" onClick={() => setShowAll(true)} className="flex h-[43px] w-full items-center px-6 text-left text-[12px] font-medium text-muted hover:text-ink">
              {footer}
            </button>
          ) : (
            <p className="flex h-[43px] items-center px-6 text-[12px] font-medium text-muted">{footer}</p>
          )}
        </div>
        {followUp && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-muted">Filtered:</span>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="flex h-[25px] items-center gap-1.5 rounded-[14px] bg-blue-50 pr-2 pl-3 text-[12px] font-bold text-blue">
              Follow-up · {followUp === 'overdue' ? 'Overdue' : 'Due today'}<Icon name="x" size={12} />
            </button>
          </div>
        )}
        {sources.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-muted">Filtered:</span>
            {sources.map((k) => (
              <button key={k} type="button" onClick={() => removeSource(k)} aria-label={`Remove source ${SRC_LABEL[k]}`} className="flex h-[25px] items-center gap-1.5 rounded-[14px] bg-blue-50 pr-2 pl-3 text-[12px] font-bold text-blue">
                Source · {SRC_LABEL[k]}<Icon name="x" size={12} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── mobile + tablet list (R4) ── */}
      <div className="flex flex-col gap-3.5 md:mt-6 xl:hidden">
        <label className="flex h-11 items-center gap-2 rounded-[22px] border border-line bg-white px-3.5">
          <Icon name="search" size={16} className="text-muted" />
          <input value={mq} onChange={(e) => setMq(e.target.value)} placeholder="Name or mobile" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
        </label>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {tabs.filter((t) => ['all', 'new', 'contacted', 'followup'].includes(t.key) || t.key === tab).map((t) => {
            const on = t.key === tab
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => pickTab(t.key)}
                className={cx('flex shrink-0 items-center gap-1.5 rounded-[16px] px-[11px] text-[12px] font-semibold', on ? 'h-[29px] bg-navy text-white' : 'h-[31px] border border-line bg-white text-slate')}
              >
                {t.label}<span className={cx('text-[11px] font-bold', on ? 'text-white' : 'text-muted')}>{t.count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative flex gap-2">
          <button type="button" aria-expanded={menu} onClick={() => { setPicked(sources); setMenu((m) => !m) }} className={cx('flex h-[33px] items-center gap-1.5 rounded-[16px] px-3 text-[12px] font-semibold', sources.length ? 'border-[1.5px] border-blue bg-blue-50 text-blue' : 'border border-line bg-white text-ink')}>
            <Icon name="filter" size={13} className={sources.length ? 'text-blue' : 'text-muted'} />{sourceLabel}
          </button>
          <DropFilter label="Pipeline" size="sm" icon="chev-down" chevron={false} align="left" value={pipeline} options={pipeOptions} onChange={setPipeline} />
          {menu && <SourceMenu mode="filter" selected={picked} onPick={toggle} onApply={apply} onClear={clearSources} className="absolute top-[41px] left-0 max-w-[calc(100vw-32px)] xl:hidden" />}
        </div>
        <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2">
          {mobileRows.map((r) => <LeadCardMobile key={r.id} r={r} />)}
          {mobileRows.length === 0 && <NoMatches className="rounded-[20px] bg-white px-4 md:col-span-2" onClear={clearAll} />}
        </div>
      </div>
      <Link
        to="/leads/new"
        aria-label="New lead"
        className="fixed right-5 bottom-[110px] z-30 flex size-14 items-center justify-center rounded-full bg-linear-to-b from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_22px_-4px_rgba(232,137,156,0.3)] md:hidden"
      >
        <Icon name="plus" size={24} />
      </Link>
    </AppLayout>
  )
}

/* ───────────────────────── New lead ───────────────────────── */

export const box = 'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue/20'
export const inp = 'min-w-0 flex-1 bg-transparent font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint'

export function F({ label, hint, className = '', children }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}

export function SelectBox({ value, onChange, options, className = '', focus }) {
  return (
    <div className={cx(box, 'relative', focus && 'border-2 border-blue', className)}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent font-semibold outline-none">
        {options.map((o) => (typeof o === 'object' ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o}>{o}</option>))}
      </select>
      <Icon name="chev-down" size={18} className="pointer-events-none text-muted" />
    </div>
  )
}

const SOURCE_LABEL = Object.fromEntries(sourceGroups.flatMap((g) => g.options.map((o) => [o.key, o.label])))
const INTERESTS = ['Health', 'Motor', 'Life and Term', 'Travel']

/** F1b (dropdown open) on desktop/tablet; R5 mobile form below md. */
export function NewLeadScreen({ sourceOpen = false }) {
  const navigate = useNavigate()
  const [name, setName] = useState('Sunil Shetty')
  const [pipeline, setPipeline] = useState('Health')
  const [mobile, setMobile] = useState('98450 77120')
  const [email, setEmail] = useState('sunil.s@example.in')
  const [source, setSource] = useState('ref-referrer')
  const [mSource, setMSource] = useState('Meta Ads')
  const [open, setOpen] = useState(sourceOpen)
  const [priority, setPriority] = useState('Medium')
  const [interest, setInterest] = useState(['Health', 'Life and Term'])
  const [campaign, setCampaign] = useState('Diwali family floater')
  const pick = (k) => {
    setSource(k)
    setOpen(false)
    if (sourceOpen) navigate('/leads/new')
  }

  return (
    <AppLayout active="leads" responsive mobileTitle="New lead" mobileBack="/leads/list" mobileTab={null}>
      {/* ── mobile (R5) ── */}
      <form onSubmit={(e) => { e.preventDefault(); navigate('/leads/list') }} className="flex flex-col gap-3.5 md:hidden">
        <F label="Lead name *"><div className={box}><input value={name} onChange={(e) => setName(e.target.value)} className={inp} /></div></F>
        <F label="Primary mobile *"><div className={box}><span className="text-muted">+91</span><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inp} /></div></F>
        <F label="Pipeline *"><SelectBox value={pipeline} onChange={setPipeline} options={['Health', 'Motor', 'Life', 'Term']} /></F>
        <F label="Lead source *"><SelectBox value={mSource} onChange={setMSource} options={Object.values(SOURCE_LABEL)} focus /></F>
        <F label="Ad or campaign name (optional)"><div className={box}><input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={inp} /></div></F>
        <F label="Next follow-up"><div className={box}><input defaultValue="28-10-2026 · 11:00 AM" className={inp} /><Icon name="calendar" size={18} className="text-muted" /></div></F>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Priority</span>
          <PriorityTabs value={priority} onChange={setPriority} />
        </div>
        <button type="submit" className={cx('flex h-[54px] items-center justify-center gap-2 rounded-[24px] bg-navy text-[15px] font-semibold text-white', SH_NAVY)}>
          <Icon name="check" size={18} />Save lead
        </button>
      </form>

      {/* ── tablet + desktop (F1 / F1b) ── */}
      <div className={cx('relative hidden md:block', open && 'xl:min-h-[1200px]')}>
        <div className="flex items-start justify-between gap-4">
          <PageHeading crumb="LEADS  /  NEW LEAD" title="New lead" sub="Name, mobile and source are enough to start." />
          <div className="mt-1 flex items-center gap-3">
            <SearchBox className="hidden xl:flex" />
            <RoundIcon icon="bell" aria-label="Notifications" />
          </div>
        </div>

        <div className="mt-[21px] flex flex-col gap-5 xl:flex-row">
          <div className="flex min-w-0 flex-col gap-4 xl:w-[760px]">
            <section className={cx(CARD, 'flex flex-col gap-3.5')}>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-col gap-[3px]">
                  <p className="text-[17px] font-bold text-ink">Contact</p>
                  <p className="text-[12px] font-medium text-muted">We check for duplicates as you type</p>
                </div>
                <Chip className="bg-blue-50 text-blue">Health pipeline</Chip>
              </div>
              <div className="flex gap-3.5">
                <F label="Lead name *"><div className={box}><input value={name} onChange={(e) => setName(e.target.value)} className={inp} /></div></F>
                <F label="Pipeline *"><SelectBox value={pipeline} onChange={setPipeline} options={['Health', 'Motor', 'Life', 'Term']} /></F>
              </div>
              <div className="flex gap-3.5">
                <F label="Primary mobile *"><div className={cx(box, 'border-2 border-blue')}><span className="text-muted">+91</span><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inp} /></div></F>
                <F label="Alternate mobile"><div className={box}><span className="text-muted">+91</span><input placeholder="Optional" className={inp} /></div></F>
                <F label="Email"><div className={box}><Icon name="mail" size={18} className="text-muted" /><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></div></F>
              </div>
              <div className="flex items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-3.5 py-3 text-[#8a5a12]">
                <Icon name="alert" size={18} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[13px] font-bold">Anitha Kulkarni (CU-000320) already uses this mobile.</p>
                  <p className="text-[12px] font-medium">Families often share a phone. Save anyway if this is a different person.</p>
                </div>
                <Link to="/customers/1" className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Open customer</Link>
              </div>
            </section>

            <section className={cx(CARD, 'flex flex-col gap-3.5')}>
              <p className="text-[17px] font-bold text-ink">Source and interest</p>
              <div className="flex gap-3.5">
                <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[13px] font-semibold text-ink">Lead source *</span>
                  <button type="button" onClick={() => setOpen((o) => !o)} className={cx(box, 'border-2 border-blue text-left')}>
                    <span className="flex-1 truncate">{SOURCE_LABEL[source]}</span>
                    <Icon name="chev-down" size={18} className="text-muted" />
                  </button>
                  {open && <SourceMenu mode="select" selected={source} onPick={pick} className="absolute top-[82px] left-0" />}
                </div>
                <F label="Referrer *">
                  <div className={box}>
                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#fde8c9] text-[10px] font-bold text-navy">MK</span>
                    <span className="flex-1">Manjunath K</span>
                    <Icon name="chev-down" size={18} className="text-muted" />
                  </div>
                </F>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[13px] font-semibold text-ink">Priority</span>
                  <PriorityTabs value={priority} onChange={setPriority} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-ink">Insurance interest</span>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => {
                    const on = interest.includes(i)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInterest((x) => (on ? x.filter((y) => y !== i) : [...x, i]))}
                        className={cx('flex h-[34px] items-center gap-1.5 rounded-[18px] border text-[13px] font-semibold', on ? 'border-blue bg-blue-50 pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted')}
                      >
                        {on && <Icon name="check" size={14} />}{i}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <F label="Next follow-up" hint="Creates a follow-up task.">
                  <div className={box}><input defaultValue="28-10-2026" className={inp} /><Icon name="calendar" size={18} className="text-muted" /></div>
                </F>
                <F label="Time"><SelectBox value="11:00 AM" onChange={() => {}} options={['11:00 AM']} /></F>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-5 md:flex-row xl:w-[400px] xl:flex-col xl:gap-28">
            <section className={cx('flex flex-1 flex-col gap-3.5 rounded-[28px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-6 xl:flex-none', SH_CARD)}>
              <p className="text-[16px] font-bold text-ink">After you save</p>
              {afterSave.map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span className={cx('flex size-[30px] items-center justify-center rounded-full text-[12px] font-bold', s.on ? 'border-2 border-blue bg-white text-blue' : 'bg-white/50 text-muted')}>{s.n}</span>
                  <span className="flex flex-col gap-px">
                    <span className="text-[13px] font-bold text-ink">{s.t}</span>
                    <span className="text-[11px] font-medium text-slate">{s.s}</span>
                  </span>
                </div>
              ))}
            </section>
            <section className={cx(CARD, 'flex flex-1 flex-col gap-2.5 self-start xl:flex-none xl:self-stretch')}>
              <p className="text-[15px] font-bold text-ink">Faster entry</p>
              <p className="text-[13px] leading-5 font-medium text-muted">Leads from your referral links arrive here on their own, with consent already recorded.</p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex h-[70px] items-center gap-3 rounded-[30px] bg-white py-3 pr-3 pl-6 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1)] xl:mt-[67px]">
          <button type="button" onClick={() => navigate(-1)} className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
          <span className="flex-1" />
          <button type="button" className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">Save and add another</button>
          <Link to="/leads/1" className={cx('flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white', SH_NAVY)}>
            <Icon name="check" size={18} />Save lead
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

/* ───────────────────────── Lead detail + Edit lead drawer (LE1) ───────────────────────── */

function LeadDetailBase() {
  const btnWhite = 'flex h-9 items-center gap-2 rounded-[18px] border border-line bg-white pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-tile'
  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:gap-0 [&>div:first-child]:xl:w-[339px] [&>div:first-child]:xl:shrink-0 [&>div:first-child]:xl:whitespace-nowrap">
        <PageHeading
          crumb="LEADS  /  RAMESH GOWDA"
          title="Ramesh Gowda"
          extra={<Chip icon="clock" className="bg-[#fbf1e1] text-[#8a5a12]">Follow-up</Chip>}
          sub="LD-2610-00042 · Health pipeline · Created 12 Oct 2026"
        />
        <div className="mt-1 flex flex-wrap items-center gap-3 xl:shrink-0 xl:flex-nowrap">
          <SearchBox className="hidden xl:flex" />
          <RoundIcon icon="bell" aria-label="Notifications" />
          <button type="button" className="flex h-[46px] items-center gap-2 rounded-[24px] border border-line bg-white pr-5 pl-4 text-[14px] font-semibold text-ink"><Icon name="refresh" size={18} />Change status</button>
          <Link to="/leads" className={cx('flex h-[46px] items-center gap-2 rounded-[24px] pr-5 pl-4 text-[14px] font-semibold', PINK_BTN)}><Icon name="user-plus" size={18} />Convert to customer</Link>
          <button type="button" className={cx('flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white', SH_NAVY)}><Icon name="phone" size={18} />Log contact</button>
        </div>
      </div>

      <div className="mt-[53px] flex flex-col gap-5 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-5 xl:w-[760px]">
          <section className="flex h-[144px] items-center gap-6 rounded-[32px] bg-pink-hero p-7 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
            <span className="flex size-[88px] items-center justify-center rounded-full border-4 border-white bg-white text-[28px] font-bold text-navy">RG</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">Ramesh Gowda</p>
              <p className="text-[13px] font-medium text-rose-ink">Family floater for 4 · wants no room-rent cap</p>
              <div className="flex gap-2">
                <Chip className="bg-pink-100 text-[#b4325a]">High priority</Chip>
                <Chip icon="link" className="bg-[#eef1f5] text-ink-2">Referral · Manjunath K</Chip>
              </div>
            </div>
            <div className="flex gap-2.5">
              {['phone', 'chat'].map((i) => <span key={i} className="flex size-12 items-center justify-center rounded-full bg-navy text-white"><Icon name={i} size={20.2} /></span>)}
              <span className={cx('flex size-12 items-center justify-center rounded-full bg-white text-ink', SH_SOFT)}><Icon name="mail" size={20.2} /></span>
            </div>
          </section>
          <section className={cx(CARD, 'flex flex-col gap-4')}>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[17px] font-bold text-ink">Details</p>
                <p className="text-[12px] font-medium text-muted">Contact and source</p>
              </div>
              <Link to="/leads" className="flex h-9 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-tile"><Icon name="edit" size={16} />Edit</Link>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {leadDetail.kv.map(([k, v]) => (
                <div key={k} className="flex w-[220px] flex-col gap-1">
                  <span className="text-[12px] font-medium text-muted">{k}</span>
                  <span className="text-[14px] font-semibold text-ink">{v}</span>
                </div>
              ))}
            </div>
          </section>
          <section className={cx(CARD, 'flex flex-col gap-4')}>
            <div className="flex flex-col gap-[3px]">
              <p className="text-[17px] font-bold text-ink">Activity</p>
              <p className="text-[12px] font-medium text-muted">Contacts and stage changes</p>
            </div>
            {leadDetail.events.map((e) => (
              <div key={e.t} className="flex gap-3.5">
                <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-full text-ink', e.bg)}><Icon name={e.icon} size={18} /></span>
                <div className="flex flex-col items-start gap-[3px]">
                  <p className="text-[14px] font-semibold text-ink">{e.t}</p>
                  <p className="text-[12px] font-medium text-muted">{e.s}</p>
                  {e.note && <p className="rounded-[12px] bg-panel px-3 py-2 text-[12px] font-medium text-ink-2">{e.note}</p>}
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="flex flex-col gap-5 xl:w-[400px]">
          <section className={cx('flex flex-col gap-4 rounded-[28px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-6', SH_CARD)}>
            <div className="flex items-center gap-3">
              <p className="flex-1 text-[17px] font-bold text-ink">Next follow-up</p>
              <Chip icon="alert" className="bg-[#fbebec] text-[#b4323c]">Overdue 2 days</Chip>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 items-center justify-center rounded-full bg-white text-ink"><Icon name="calendar" size={24} /></span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[22px] font-bold text-ink">24 Oct 2026</p>
                <p className="text-[13px] font-medium text-[#8a5a12]">11:00 AM · Call back</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button type="button" className={cx('flex h-9 items-center gap-2 rounded-[18px] bg-navy pr-3.5 pl-3 text-[13px] font-semibold text-white', SH_NAVY)}><Icon name="calendar" size={16} />Reschedule</button>
              <button type="button" className={btnWhite}><Icon name="check" size={16} />Mark done</button>
            </div>
          </section>
          <section className={cx(CARD, 'flex flex-col gap-4')}>
            <div className="flex flex-col gap-[3px]">
              <p className="text-[17px] font-bold text-ink">Stage history</p>
              <p className="text-[12px] font-medium text-muted">Every move is saved</p>
            </div>
            {leadDetail.stages.map((s) => (
              <div key={s.s} className="flex items-center gap-3.5">
                <span className={cx('size-3.5 rounded-full', s.dot)} />
                <div className="flex flex-col items-start gap-1">
                  <Chip className={s.cls}>{s.chip}</Chip>
                  <span className="text-[12px] font-medium text-muted">{s.s}</span>
                </div>
              </div>
            ))}
          </section>
          <section className={cx(CARD, 'flex flex-col gap-4')}>
            <div className="flex flex-col gap-[3px]">
              <p className="text-[17px] font-bold text-ink">Close this lead</p>
              <p className="text-[12px] font-medium text-muted">Lost needs a reason. You can reopen it later.</p>
            </div>
            <button type="button" className="flex h-9 w-fit items-center gap-2 rounded-[18px] border border-[#f2c4c8] bg-white pr-3.5 pl-3 text-[13px] font-semibold text-[#b4323c]"><Icon name="x" size={16} />Mark as lost</button>
          </section>
        </div>
      </div>
    </>
  )
}

export function EditLeadScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('Ramesh Gowda')
  const [mobile, setMobile] = useState('98860 12345')
  const [email, setEmail] = useState('ramesh.g@example.in')
  const [campaign, setCampaign] = useState('Diwali family floater · Oct 2026')
  const [pipeline, setPipeline] = useState('Health')
  const [priority, setPriority] = useState('High')
  const [srcOpen, setSrcOpen] = useState(false)
  const [source, setSource] = useState('meta')
  const src = sourceGroups.flatMap((g) => g.options).find((o) => o.key === source)

  return (
    <AppLayout active="leads" responsive mobileTitle="Edit lead" mobileBack="/leads/1" mobileTab={null} lockScroll>
      <LeadDetailBase />
      <Link to="/leads/1" aria-label="Close" data-overlay="scrim" className="fixed inset-0 z-40 bg-[#0e1f3b]/40 md:top-4 md:right-4 md:bottom-4 md:left-[104px] md:rounded-[32px] xl:top-6 xl:right-6 xl:bottom-6 xl:left-[156px] xl:rounded-[40px]" />
      <form
        data-overlay="drawer"
        onSubmit={(e) => { e.preventDefault(); navigate('/leads/1') }}
        className={cx(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col gap-4 overflow-y-auto rounded-t-[28px] bg-white px-[18px] pt-6 pb-7 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]',
          'md:inset-x-auto md:top-10 md:right-10 md:bottom-10 md:max-h-[928px] md:w-[500px] md:rounded-[32px] md:px-7 md:pt-7 md:pb-6 xl:top-12 xl:right-12 xl:bottom-12',
        )}
      >
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Edit lead</p>
            <p className="text-[12px] font-medium text-muted">Ramesh Gowda · LD-2610-00042</p>
          </div>
          <Link to="/leads/1" aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink"><Icon name="x" size={16} /></Link>
        </div>
        <F label="Lead name *" className="flex-none"><div className={box}><input value={name} onChange={(e) => setName(e.target.value)} className={inp} /></div></F>
        <div className="flex shrink-0 gap-3">
          <F label="Primary mobile *"><div className={box}><span className="text-muted">+91</span><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inp} /></div></F>
          <F label="Email"><div className={box}><Icon name="mail" size={18} className="text-muted" /><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} /></div></F>
        </div>
        <div className="relative flex shrink-0 flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Lead source *</span>
          <button type="button" onClick={() => setSrcOpen((o) => !o)} className="flex h-[50px] items-center gap-2.5 rounded-[16px] border-2 border-blue bg-white px-3.5 text-left">
            <span className={cx('inline-flex h-[22px] items-center gap-[5px] rounded-[12px] pr-2.5 pl-2 text-[11px] font-bold', src.cls)}><Icon name={src.icon} size={12} />{src.label}</span>
            <span className="flex-1" />
            <Icon name="chev-down" size={18} className="text-muted" />
          </button>
          {srcOpen && <SourceMenu mode="select" selected={source} onPick={(k) => { setSource(k); setSrcOpen(false) }} className="absolute top-[82px] left-0" />}
        </div>
        <F label="Ad or campaign name (optional)" hint="Helps you see which ads bring leads." className="flex-none">
          <div className={box}><input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={inp} /></div>
        </F>
        <div className="flex shrink-0 gap-3">
          <F label="Pipeline"><SelectBox value={pipeline} onChange={setPipeline} options={['Health', 'Motor', 'Life', 'Term']} /></F>
          <F label="Priority"><SelectBox value={priority} onChange={setPriority} options={['High', 'Medium', 'Low']} /></F>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-[16px] bg-blue-50 px-4 py-3">
          <Icon name="clock" size={16} className="text-blue" />
          <p className="text-[13px] font-semibold text-blue">Changing the source keeps the earlier value in the lead’s history.</p>
        </div>
        <span className="min-h-px grow" />
        <div className="sticky bottom-0 z-10 -mx-[18px] -mt-4 flex shrink-0 gap-2.5 bg-white px-[18px] pt-4 shadow-[0_28px_0_0_#fff] md:-mx-7 md:px-7 md:shadow-[0_24px_0_0_#fff]">
          <Link to="/leads/1" className="flex h-[46px] flex-1 items-center justify-center rounded-[24px] border border-line bg-white text-[14px] font-semibold text-ink hover:bg-tile md:w-[220px] md:flex-none">Cancel</Link>
          <button type="submit" className={cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] bg-navy text-[14px] font-semibold text-white', SH_NAVY)}>
            <Icon name="check" size={18} />Save changes
          </button>
        </div>
      </form>
    </AppLayout>
  )
}