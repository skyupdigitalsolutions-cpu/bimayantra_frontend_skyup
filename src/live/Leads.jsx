// Leads: 02 board, 02b list, F1b new lead / LE1 edit lead, F2 convert — all on the live API.
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { PageHeader, cx } from '../components/ui'
import { LeadCard, PillButton } from '../screens/sales/_parts'
import { matchesQuery, useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { LeadsListScreen, SOURCE_KEY, SourceMenu, PageHeading, F, SelectBox, CARD, box, inp } from '../screens/tasks/_leads'
import { Chip, PriorityTabs, SH_CARD, SH_NAVY } from '../screens/tasks/_parts'
import { api, useQuery, useMutation, useDebounced, invalidate, ApiError } from '../api'
import { avatarClass, cleanMobile, daysFromToday, fmtMobile, fmtShortWhen, initials, istDay, titleCase, LEAD_STATUS_LABEL, STAGE_TO_STATUS } from '../api/format'
import { leadCardView } from './views'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { LoadingPanel, ErrorPanel } from './common'

/** Board columns (design tokens, not data): the four open stages. */
const leadStages = [
  { key: 'new', label: 'New', bg: '#e3eefd', ink: '#1f5fd6', dash: 'rgba(31,95,214,0.3)' },
  { key: 'contacted', label: 'Contacted', bg: '#eee9fc', ink: '#5b3fb8', dash: 'rgba(91,63,184,0.3)' },
  { key: 'qualified', label: 'Qualified', bg: '#e2f4ec', ink: '#127650', dash: 'rgba(18,118,80,0.3)' },
  { key: 'followup', label: 'Follow-up', bg: '#fceedc', ink: '#8a5a12', dash: 'rgba(138,90,18,0.3)' },
]

/** All leads of the account (pages of 100, up to 1,000) — the list and board filter on the client. */
function useAllLeads(query = {}) {
  const key = ['leads', JSON.stringify(query)]
  return useQuery(key, async () => {
    const out = []
    let page = 1
    let pages = 1
    do {
      const r = await api.leads.list({ ...query, page, limit: 100 })
      out.push(...r.data)
      pages = Math.min(r.meta?.pages ?? 1, 10)
      page++
    } while (page <= pages)
    return { data: out, meta: { total: out.length } }
  })
}

/* ───────────────────────── 02 · Board ───────────────────────── */
function ViewToggle() {
  return (
    <div className="flex gap-1 rounded-[24px] bg-white p-1 shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
      <span className="flex items-center gap-1.5 rounded-[20px] bg-navy px-3.5 py-2 text-[13px] font-semibold text-white"><Icon name="columns" size={16} />Board</span>
      <Link to="/leads/list" className="flex items-center gap-1.5 rounded-[20px] px-3.5 py-2 text-[13px] font-semibold text-muted hover:text-ink"><Icon name="list" size={16} />List</Link>
    </div>
  )
}

export function LiveLeadsBoard() {
  const navigate = useNavigate()
  const { toast, toastError } = useToast()
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const leads = useAllLeads({ status: 'NEW,CONTACTED,QUALIFIED,FOLLOW_UP' })
  const [pipe, setPipe] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [overrides, setOverrides] = useState({}) // optimistic stage while the move saves
  const [q, clearQ] = useHeaderSearch()
  const pipeId = pipe ?? pipes.data?.[0]?.id
  const items = useMemo(() => (leads.data || []).map(leadCardView).map((l) => (overrides[l.id] ? { ...l, stage: overrides[l.id] } : l)), [leads.data, overrides])
  const tabs = (pipes.data || []).map((p) => ({ key: p.id, label: p.name, count: items.filter((l) => l.pipeline === p.id).length }))
  const shown = items.filter((l) => l.pipeline === pipeId && matchesQuery(q, l.name, l.phone, l.note, l.source.label, l.chips.map((c) => c.label)))

  const move = async (stage) => {
    const l = items.find((x) => x.id === dragId)
    setDragId(null)
    if (!l || l.stage === stage) return
    const to = STAGE_TO_STATUS[stage]
    if (!l.allowedMoves.includes(to)) return toast(`${LEAD_STATUS_LABEL[l.status]} → ${LEAD_STATUS_LABEL[to]} is not allowed.`, 'error')
    if (to === 'FOLLOW_UP') return navigate(`/leads/${l.id}?action=status&to=FOLLOW_UP`) // needs a date
    setOverrides((o) => ({ ...o, [l.id]: stage }))
    try {
      const r = await api.leads.changeStatus(l.id, { version: l.version, status: to })
      toast(r.meta?.message || 'Status changed.')
      invalidate('leads', 'pipelines', 'dashboard', 'lead')
    } catch (e) {
      toastError(e)
    } finally {
      setOverrides((o) => { const n = { ...o }; delete n[l.id]; return n })
    }
  }

  if (pipes.error || leads.error) return <ErrorPanel active="leads" error={pipes.error || leads.error} />
  return (
    <AppLayout active="leads" panelClass="pb-7!">
      <PageHeader title="Leads" subtitle="Drag a card to an allowed stage. Lost needs a reason."
        actions={<><ViewToggle /><PillButton variant="pink" icon="plus" to="/leads/new">New lead</PillButton></>} />
      <div className="mt-[30px] flex gap-2.5">
        {tabs.map((p) => {
          const on = p.key === pipeId
          return (
            <button key={p.key} type="button" onClick={() => setPipe(p.key)}
              className={cx('flex items-center gap-2.5 rounded-[22px] border py-2.5 pr-2.5 pl-[18px] text-[13px] font-semibold', on ? 'border-navy bg-navy py-[9px] text-white' : 'border-line bg-white text-ink hover:bg-tile')}>
              {p.label}
              <span className={cx('rounded-[10px] px-[9px] py-0.5 text-[12px] font-bold', on ? 'bg-white/15 text-white' : 'bg-panel text-muted')}>{p.count}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-[19px]">
        {q.trim() && shown.length === 0 && (
          <NoMatches className="mb-4 w-fit min-w-[520px] rounded-[24px] bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]" sub={`No leads match “${q.trim()}”.`} onClear={clearQ} />
        )}
        {leads.loading && !leads.data && <p className="mb-4 text-[13px] font-medium text-muted">Loading leads…</p>}
        <div className="flex gap-5 overflow-x-auto pb-2">
          {leadStages.map((s) => (
            <Column key={s.key} stage={s} items={shown.filter((l) => l.stage === s.key)} dragId={dragId} setDragId={setDragId} onDrop={move} pipelineId={pipeId} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

function Column({ stage, items, dragId, setDragId, onDrop, pipelineId }) {
  const [over, setOver] = useState(false)
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(stage.key) }}
      className={cx('flex min-h-[760px] w-[280px] shrink-0 flex-col items-center gap-3 rounded-[28px] p-3.5 transition', over && 'ring-2 ring-inset')}
      style={{ background: stage.bg, '--tw-ring-color': stage.dash }}>
      <div className="flex w-full items-center gap-2 px-1.5 py-1">
        <span className="size-2.5 rounded-full" style={{ background: stage.ink }} />
        <p className="text-[15px] font-bold text-ink">{stage.label}</p>
        <span className="flex-1" />
        <span className="rounded-[10px] bg-white px-2.5 py-[3px] text-[12px] font-bold" style={{ color: stage.ink }}>{items.length}</span>
      </div>
      {items.map((l) => (
        <LeadCard key={l.id} lead={l} to={`/leads/${l.id}`} draggable dragging={dragId === l.id}
          onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragId(l.id) }} onDragEnd={() => setDragId(null)} />
      ))}
      <Link to={`/leads/new?pipelineId=${pipelineId ?? ''}`} className="flex h-[46px] w-full shrink-0 items-center justify-center gap-2 rounded-[20px] border border-dashed text-[13px] font-semibold hover:bg-white/40" style={{ borderColor: stage.dash, color: stage.ink }}>
        <Icon name="plus" size={16} />Add lead
      </Link>
    </div>
  )
}

/* ───────────────────────── 02b · List ───────────────────────── */
const STYLE_OF = { meta: 'meta', google: 'google', website: 'website', social: 'social', 'ref-client': 'referral', 'ref-referrer': 'referral', walkin: 'walkin', campaign: 'campaign', manual: 'campaign', other: 'campaign' }

export function LiveLeadsList() {
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const leads = useAllLeads()
  const names = useMemo(() => Object.fromEntries((pipes.data || []).map((p) => [p.id, p.name])), [pipes.data])
  const rows = useMemo(() => (leads.data || []).map((l) => {
    const d = l.nextFollowUpAt ? daysFromToday(l.nextFollowUpAt) : null
    const open = l.status !== 'CONVERTED' && l.status !== 'LOST'
    const srcKey = SOURCE_KEY[l.sourceCode] ?? 'other'
    return {
      id: l.id, to: `/leads/${l.id}`, initials: initials(l.name), avBg: avatarClass(l.name), name: l.name, mobile: fmtMobile(l.mobile),
      pipeline: names[l.pipelineId] ?? '—', status: LEAD_STATUS_LABEL[l.status], source: STYLE_OF[srcKey], srcKey, sourceLabel: l.source,
      next: l.nextFollowUpAt && open ? `${fmtShortWhen(l.nextFollowUpAt)}${d < 0 ? ' · overdue' : ''}` : '—',
      overdue: open && d !== null && d < 0, dueToday: open && d === 0, priority: titleCase(l.priority),
    }
  }), [leads.data, names])
  if (leads.error) return <ErrorPanel active="leads" error={leads.error} />
  return <LeadsListScreen live={{ rows, pipelines: (pipes.data || []).map((p) => p.name), loading: leads.loading && !leads.data }} />
}

/* ───────────────────────── F1b · New lead / LE1 · Edit lead ───────────────────────── */
const KEY_TO_CODE = { meta: 'META_ADS', google: 'GOOGLE_ADS', website: 'WEBSITE', social: 'SOCIAL_MEDIA', 'ref-client': 'REFERRED_BY_CLIENT', 'ref-referrer': 'REFERRED_BY_REFERRER', walkin: 'WALK_IN', campaign: 'CAMPAIGN', manual: 'MANUAL_ENTRY', other: 'OTHER' }
const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const t12 = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
const err = (m) => (m ? <span className="text-[12px] font-medium text-[#b4323c]">{m}</span> : null)
const errBox = (m) => (m ? 'border-2 border-[#b4323c]' : '')

export function LiveLeadForm({ mode = 'new' }) {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const editing = mode === 'edit'
  const lead = useQuery(['lead', id], () => api.leads.get(id), { enabled: editing })
  if (editing && lead.error) return <ErrorPanel active="leads" error={lead.error} back="/leads" />
  if (editing && !lead.data) return <LoadingPanel active="leads" />
  return <LeadFormInner key={lead.data?.version ?? 'new'} lead={editing ? lead.data : null} presetPipeline={sp.get('pipelineId')} />
}

function LeadFormInner({ lead, presetPipeline }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { reference } = useAuth()
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const referrers = useQuery('referrers', () => api.referrers.list())
  const interests = reference?.insuranceTypes ?? ['Health', 'Motor', 'Life', 'Term', 'Travel']
  const offered = new Set((reference?.leadSourceOptions ?? []).map((o) => o.code))
  const [f, setF] = useState(() => ({
    name: lead?.name ?? '', pipelineId: lead?.pipelineId ?? presetPipeline ?? '', mobile: lead ? fmtMobile(lead.mobile) : '', altMobile: lead?.altMobile ? fmtMobile(lead.altMobile) : '',
    email: lead?.email ?? '', source: lead ? (SOURCE_KEY[lead.sourceCode] ?? 'other') : 'walkin', referrerId: lead?.referrer?.id ?? '',
    referredBy: lead?.referredBy ? { id: lead.referredBy.id, name: lead.referredBy.name } : null, campaign: lead?.campaign ?? '',
    priority: lead ? titleCase(lead.priority) : 'Medium', interests: lead?.interests ?? [], date: lead?.nextFollowUpAt ? istDay(lead.nextFollowUpAt) : '',
    time: '11:00', notes: lead?.notes ?? '',
  }))
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const [open, setOpen] = useState(false)
  const [dup, setDup] = useState(null)
  const [warnings, setWarnings] = useState(null) // 409 CONFIRMATION_REQUIRED
  const [clientQ, setClientQ] = useState('')
  const dq = useDebounced(clientQ, 300)
  const [clientHits, setClientHits] = useState([])
  const code = KEY_TO_CODE[f.source]
  const needs = (reference?.leadSourceOptions ?? []).find((o) => o.code === code) ?? {}

  useEffect(() => { if (!f.pipelineId && pipes.data?.[0]) set('pipelineId')(pipes.data[0].id) }, [pipes.data]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (dq.trim().length < 2) return setClientHits([])
    api.customers.list({ search: dq.trim(), status: 'ACTIVE', limit: 6 }).then((r) => setClientHits(r.data)).catch(() => setClientHits([]))
  }, [dq])

  // Duplicate check when the mobile is complete (P-12: "when the mobile field loses focus")
  const checkDup = async () => {
    const m = cleanMobile(f.mobile)
    if (m.length !== 10) return setDup(null)
    try {
      const { data } = await api.leads.duplicateCheck({ mobile: m, name: f.name || undefined, excludeId: lead?.id })
      setDup(data.exact || data.sameMobile.length || data.customers.length ? data : null)
    } catch { setDup(null) }
  }

  const save = useMutation(async ({ again, confirm = [] }, o) => {
    const body = {
      pipelineId: f.pipelineId, name: f.name.trim(), mobile: cleanMobile(f.mobile), altMobile: cleanMobile(f.altMobile) || null,
      email: f.email.trim() || null, source: code, referrerId: needs.needs === 'REFERRER' ? f.referrerId || null : null,
      referredByCustomerId: needs.needs === 'CLIENT' ? f.referredBy?.id ?? null : null, campaign: needs.campaignName ? f.campaign.trim() || null : null,
      interests: f.interests, priority: f.priority.toUpperCase(), nextFollowUpAt: f.date ? `${f.date}T${f.time}:00+05:30` : null,
      notes: f.notes.trim() || null, confirm,
    }
    const r = lead ? await api.leads.update(lead.id, { version: lead.version, ...body }) : await api.leads.create(body, o)
    return { ...r, again }
  }, {
    invalidates: ['leads', 'lead', 'pipelines', 'dashboard', 'tasks'],
    onSuccess: (r) => {
      toast(r.meta?.message || 'Lead saved.')
      setWarnings(null)
      if (r.again) { setF((s) => ({ ...s, name: '', mobile: '', altMobile: '', email: '', notes: '', date: '' })); setDup(null) }
      else navigate(`/leads/${r.data.id}`)
    },
    onError: (e) => { if (e instanceof ApiError && e.code === 'CONFIRMATION_REQUIRED') setWarnings(e.details?.warnings ?? [{ message: e.message, messageId: e.messageId }]) },
  })
  const submit = (again = false) => save.run({ again })
  const saveAnyway = () => save.run({ confirm: warnings.map((w) => w.messageId) })
  const fe = save.fieldErrors
  const generalError = save.error && !save.error.fields?.length && save.error.code !== 'CONFIRMATION_REQUIRED' ? save.error.message : null
  const pipeName = pipes.data?.find((p) => p.id === f.pipelineId)?.name ?? '—'
  const sourceLabel = (reference?.allLeadSources ?? []).find((s) => s.code === code)?.label ?? code

  return (
    <AppLayout active="leads">
      <div className="flex items-start justify-between gap-4">
        <PageHeading crumb={lead ? `LEADS  /  ${lead.name.toUpperCase()}  /  EDIT` : 'LEADS  /  NEW LEAD'} title={lead ? `Edit ${lead.name}` : 'New lead'} sub={lead ? `${lead.number} · changes are saved to the lead history` : 'Name, mobile and source are enough to start.'} />
      </div>
      <div className="mt-[21px] flex flex-col gap-5 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-4 xl:w-[760px]">
          {(generalError || warnings) && (
            <div className={cx('flex items-center gap-2.5 rounded-[16px] px-3.5 py-3', warnings ? 'bg-[#fbf1e1] text-[#8a5a12]' : 'border border-[#f2c4c8] bg-[#fff7f7] text-[#b4323c]')}>
              <Icon name="alert" size={18} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                {(warnings ?? [{ message: generalError }]).map((w, i) => <p key={i} className="text-[13px] font-bold">{w.message}</p>)}
              </div>
              {warnings && <button type="button" onClick={saveAnyway} className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Save anyway</button>}
            </div>
          )}
          <section className={cx(CARD, 'flex flex-col gap-3.5')}>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]"><p className="text-[17px] font-bold text-ink">Contact</p><p className="text-[12px] font-medium text-muted">We check for duplicates as you type</p></div>
              <Chip className="bg-blue-50 text-blue">{pipeName} pipeline</Chip>
            </div>
            <div className="flex gap-3.5">
              <F label="Lead name *"><div className={cx(box, errBox(fe.name))}><input value={f.name} onChange={(e) => set('name')(e.target.value)} onBlur={checkDup} className={inp} autoFocus /></div>{err(fe.name)}</F>
              <F label="Pipeline *"><SelectBox value={f.pipelineId} onChange={set('pipelineId')} options={(pipes.data || []).map((p) => ({ value: p.id, label: p.name }))} />{err(fe.pipelineId)}</F>
            </div>
            <div className="flex gap-3.5">
              <F label="Primary mobile *"><div className={cx(box, errBox(fe.mobile))}><span className="text-muted">+91</span><input value={f.mobile} onChange={(e) => set('mobile')(e.target.value)} onBlur={checkDup} inputMode="tel" className={inp} /></div>{err(fe.mobile)}</F>
              <F label="Alternate mobile"><div className={cx(box, errBox(fe.altMobile))}><span className="text-muted">+91</span><input value={f.altMobile} onChange={(e) => set('altMobile')(e.target.value)} placeholder="Optional" inputMode="tel" className={inp} /></div>{err(fe.altMobile)}</F>
              <F label="Email"><div className={cx(box, errBox(fe.email))}><Icon name="mail" size={18} className="text-muted" /><input value={f.email} onChange={(e) => set('email')(e.target.value)} className={inp} /></div>{err(fe.email)}</F>
            </div>
            {dup && (
              <div className={cx('flex items-center gap-2.5 rounded-[16px] px-3.5 py-3', dup.exact ? 'bg-[#fbebec] text-[#b4323c]' : 'bg-[#fbf1e1] text-[#8a5a12]')}>
                <Icon name="alert" size={18} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {dup.exact && <p className="text-[13px] font-bold">{dup.exact.name} ({dup.exact.number}) is already an open lead with this mobile.</p>}
                  {dup.sameMobile.map((d) => <p key={d.id} className="text-[13px] font-bold">Lead {d.name} ({d.number}) uses this mobile.</p>)}
                  {dup.customers.map((d) => <p key={d.id} className="text-[13px] font-bold">{d.name} ({d.number}) already uses this mobile.</p>)}
                  {!dup.exact && <p className="text-[12px] font-medium">Families often share a phone. Save anyway if this is a different person.</p>}
                </div>
                {dup.exact ? <Link to={`/leads/${dup.exact.id}`} className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Open lead</Link>
                  : dup.customers[0] && <Link to={`/customers/${dup.customers[0].id}`} className="flex h-9 shrink-0 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">Open customer</Link>}
              </div>
            )}
          </section>

          <section className={cx(CARD, 'flex flex-col gap-3.5')}>
            <p className="text-[17px] font-bold text-ink">Source and interest</p>
            <div className="flex gap-3.5">
              <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-[13px] font-semibold text-ink">Lead source *</span>
                <button type="button" onClick={() => setOpen((o) => !o)} className={cx(box, open && 'border-2 border-blue', errBox(fe.source), 'text-left')}>
                  <span className="flex-1 truncate">{sourceLabel}</span><Icon name="chev-down" size={18} className="text-muted" />
                </button>
                {err(fe.source)}
                {open && <SourceMenu mode="select" selected={f.source} onPick={(k) => { if (offered.size && !offered.has(KEY_TO_CODE[k])) return; set('source')(k); setOpen(false) }} className="absolute top-[82px] left-0" />}
              </div>
              {needs.needs === 'REFERRER' && (
                <F label="Referrer *">
                  <SelectBox value={f.referrerId} onChange={set('referrerId')} options={[{ value: '', label: 'Choose a referrer' }, ...(referrers.data || []).filter((r) => r.status === 'ACTIVE').map((r) => ({ value: r.id, label: r.name }))]} />
                  {err(fe.referrerId)}
                </F>
              )}
              {needs.needs === 'CLIENT' && (
                <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[13px] font-semibold text-ink">Referred by client *</span>
                  <div className={cx(box, errBox(fe.referredByCustomerId))}>
                    {f.referredBy ? (<><span className={cx('flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy', avatarClass(f.referredBy.name))}>{initials(f.referredBy.name)}</span><span className="flex-1">{f.referredBy.name}</span><button type="button" onClick={() => set('referredBy')(null)}><Icon name="x" size={14} className="text-muted" /></button></>)
                      : (<><Icon name="search" size={16} className="text-muted" /><input value={clientQ} onChange={(e) => setClientQ(e.target.value)} placeholder="Search policy holder" className={inp} /></>)}
                  </div>
                  {err(fe.referredByCustomerId)}
                  {!f.referredBy && clientHits.length > 0 && (
                    <div className="absolute top-[82px] right-0 left-0 z-20 flex flex-col rounded-[14px] bg-white p-1.5 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
                      {clientHits.map((c) => <button key={c.id} type="button" onClick={() => { set('referredBy')({ id: c.id, name: c.name }); setClientQ('') }} className="rounded-[10px] px-2.5 py-2 text-left text-[13px] font-semibold text-ink hover:bg-[#f3f7ff]">{c.name} <span className="text-muted">· {c.number}</span></button>)}
                    </div>
                  )}
                </div>
              )}
              {needs.campaignName && (
                <F label={needs.campaignName === 'REQUIRED' ? 'Campaign name *' : 'Ad or campaign name'}>
                  <div className={cx(box, errBox(fe.campaign))}><input value={f.campaign} onChange={(e) => set('campaign')(e.target.value)} className={inp} /></div>{err(fe.campaign)}
                </F>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-2"><span className="text-[13px] font-semibold text-ink">Priority</span><PriorityTabs value={f.priority} onChange={set('priority')} /></div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-ink">Insurance interest</span>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => {
                  const on = f.interests.includes(i)
                  return (
                    <button key={i} type="button" onClick={() => set('interests')(on ? f.interests.filter((y) => y !== i) : [...f.interests, i])}
                      className={cx('flex h-[34px] items-center gap-1.5 rounded-[18px] border text-[13px] font-semibold', on ? 'border-blue bg-blue-50 pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted')}>
                      {on && <Icon name="check" size={14} />}{i}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <F label="Next follow-up" hint="Creates a follow-up task."><div className={cx(box, errBox(fe.nextFollowUpAt))}><input type="date" min={istDay()} value={f.date} onChange={(e) => set('date')(e.target.value)} className={inp} /></div>{err(fe.nextFollowUpAt)}</F>
              <F label="Time"><SelectBox value={f.time} onChange={set('time')} options={TIMES.map((t) => ({ value: t, label: t12(t) }))} /></F>
            </div>
            <F label="Notes"><textarea value={f.notes} onChange={(e) => set('notes')(e.target.value)} className="h-20 resize-none rounded-[16px] bg-panel px-4 pt-3 text-[14px] font-semibold text-ink outline-none" />{err(fe.notes)}</F>
          </section>
        </div>
        <div className="flex flex-col gap-5 xl:w-[400px]">
          <section className={cx('flex flex-col gap-2.5 rounded-[28px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-6', SH_CARD)}>
            <p className="text-[16px] font-bold text-ink">{lead ? 'Editing' : 'After you save'}</p>
            <p className="text-[13px] leading-5 font-medium text-slate">{lead ? 'Status is changed from the lead page, not here. Moving the follow-up date moves its task.' : 'The lead is created as New. A follow-up date creates a task. Convert it to a customer when it is ready.'}</p>
          </section>
        </div>
      </div>
      <div className="mt-6 flex h-[70px] items-center gap-3 rounded-[30px] bg-white py-3 pr-3 pl-6 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1)]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
        <span className="flex-1" />
        {!lead && <button type="button" disabled={save.busy} onClick={() => submit(true)} className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">Save and add another</button>}
        <button type="button" disabled={save.busy} onClick={() => submit(false)} className={cx('flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white disabled:opacity-60', SH_NAVY)}>
          <Icon name="check" size={18} />{save.busy ? 'Saving…' : lead ? 'Save changes' : 'Save lead'}
        </button>
      </div>
    </AppLayout>
  )
}

/* ───────────────────────── F2 · Convert lead to customer ───────────────────────── */
const GENDERS = [['', 'Not given'], ['MALE', 'Male'], ['FEMALE', 'Female'], ['TRANSGENDER', 'Transgender'], ['PREFER_NOT_TO_SAY', 'Prefer not to say']]
const CONTACTS = [['', 'Not given'], ['WHATSAPP', 'WhatsApp'], ['PHONE_CALL', 'Phone call'], ['EMAIL', 'Email']]

export function LiveConvertLead() {
  const { id } = useParams()
  const lead = useQuery(['lead', id], () => api.leads.get(id))
  if (lead.error) return <ErrorPanel active="leads" error={lead.error} back="/leads" />
  if (!lead.data) return <LoadingPanel active="leads" />
  return <ConvertInner lead={lead.data} />
}

function ConvertInner({ lead }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const dup = useQuery(['customers-dup', lead.mobile], () => api.customers.duplicateCheck({ mobile: cleanMobile(lead.mobile), name: lead.name }))
  const matches = [...(dup.data?.exact ? [dup.data.exact] : []), ...(dup.data?.sameMobile ?? [])]
  const exact = dup.data?.exact
  const [choice, setChoice] = useState(null) // 'new' | customer id
  const mode = exact ? exact.id : choice ?? 'new'
  const [f, setF] = useState({ dob: '', gender: '', email: lead.email ?? '', preferredContact: '', city: '', pin: '', occupation: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const [confirm, setConfirm] = useState([])
  const save = useMutation((extra, o) => {
    const link = mode !== 'new'
    const customer = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''))
    return api.leads.convert(lead.id, { version: lead.version, mode: link ? 'LINK' : 'CREATE', ...(link ? { customerId: mode } : { customer }), confirm: [...confirm, ...(extra?.confirm ?? [])] }, o)
  }, {
    invalidates: ['leads', 'lead', 'customers', 'pipelines', 'dashboard', 'tasks'],
    onSuccess: (r) => { toast(r.meta?.message || 'Converted.'); navigate(`/customers/${r.data.customer.id}`) },
    onError: (e) => { if (e.code === 'CONFIRMATION_REQUIRED') setConfirm(e.details?.warnings?.map((w) => w.messageId) ?? [e.messageId]) },
  })
  const fe = save.fieldErrors
  const field = ({ label, k, type = 'text', options }) => (
    <F key={k} label={label}>
      {options ? <SelectBox value={f[k]} onChange={(v) => setF((s) => ({ ...s, [k]: v }))} options={options.map(([value, l]) => ({ value, label: l }))} />
        : <div className={cx(box, errBox(fe[k]))}><input type={type} value={f[k]} onChange={set(k)} className={inp} /></div>}
      {err(fe[k])}
    </F>
  )
  if (!lead.canConvert) return <ErrorPanel active="leads" error={{ message: `${lead.name} is ${LEAD_STATUS_LABEL[lead.status]} and cannot be converted.` }} back={`/leads/${lead.id}`} />
  return (
    <AppLayout active="leads">
      <PageHeading crumb={`LEADS  /  ${lead.name.toUpperCase()}  /  CONVERT`} title={`Convert ${lead.name}`} extra={<Chip className="bg-blue-50 text-blue">{LEAD_STATUS_LABEL[lead.status]}</Chip>} sub={`${lead.number} · ${lead.pipelineName ?? ''} pipeline · ${LEAD_STATUS_LABEL[lead.status]}`} />
      <div className="mt-[21px] flex flex-col gap-5 xl:flex-row">
        <div className="flex min-w-0 flex-col gap-4 xl:w-[760px]">
          {save.error && !save.error.fields?.length && (
            <div className="flex items-center gap-2.5 rounded-[16px] border border-[#f2c4c8] bg-[#fff7f7] px-3.5 py-3 text-[13px] font-bold text-[#b4323c]">
              <Icon name="alert" size={18} /><span className="flex-1">{save.error.message}</span>
              {save.error.code === 'CONFIRMATION_REQUIRED' && <button type="button" onClick={() => save.run()} className="flex h-9 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink">Create anyway</button>}
            </div>
          )}
          {matches.length > 0 && (
            <section className={cx(CARD, 'flex flex-col gap-3.5')}>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-col gap-[3px]">
                  <p className="text-[17px] font-bold text-ink">{exact ? 'This customer already exists' : 'Another customer uses this mobile'}</p>
                  <p className="text-[12px] font-medium text-muted">{matches.map((m) => `${m.name} (${m.number})`).join(' · ')} · {fmtMobile(lead.mobile)}</p>
                </div>
                <Chip icon="alert" className="bg-[#fbf1e1] text-[#8a5a12]">Check</Chip>
              </div>
              {[...(exact ? [] : [{ key: 'new', title: `Create a new customer for ${lead.name}`, text: 'Their own record. The other customer stays as they are.' }]),
                ...matches.map((m) => ({ key: m.id, title: `Link to ${m.name}`, text: exact ? 'Same name and mobile: the lead joins this customer.' : `Use this if ${lead.name} is actually ${m.name}’s record.` }))].map((c) => {
                const on = mode === c.key
                return (
                  <button key={c.key} type="button" role="radio" aria-checked={on} onClick={() => setChoice(c.key)}
                    className={cx('flex items-center gap-3.5 rounded-[20px] p-4 text-left', on ? 'border-[1.5px] border-blue bg-[#f3f7ff]' : 'bg-panel hover:bg-[#eef1f8]')}>
                    <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
                    <span className="flex flex-col gap-0.5"><span className="text-[14px] font-bold text-ink">{c.title}</span><span className="text-[12px] font-medium text-muted">{c.text}</span></span>
                  </button>
                )
              })}
            </section>
          )}
          {mode === 'new' && (
            <section className={cx(CARD, 'flex flex-col gap-4')}>
              <div><p className="text-[17px] font-bold text-ink">Customer details</p><p className="text-[12px] font-medium text-muted">Name and mobile come from the lead. Complete the rest now or later.</p></div>
              <div className="flex gap-3.5">
                <F label="Full name"><div className={cx(box, 'text-muted')}>{lead.name}</div></F>
                {field({ label: "Date of birth", k: "dob", type: "date" })}
                {field({ label: "Gender", k: "gender", options: GENDERS })}
              </div>
              <div className="flex gap-3.5">
                <F label="Primary mobile"><div className={cx(box, 'text-muted')}>+91 {fmtMobile(lead.mobile)}</div></F>
                {field({ label: "Email", k: "email" })}
                {field({ label: "Preferred contact", k: "preferredContact", options: CONTACTS })}
              </div>
              <div className="flex gap-3.5">
                {field({ label: "City", k: "city" })}
                {field({ label: "PIN code", k: "pin" })}
                {field({ label: "Occupation", k: "occupation" })}
              </div>
            </section>
          )}
        </div>
        <aside className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)] xl:w-[400px]">
          <p className="text-[15px] font-bold text-ink">When you save</p>
          {['Lead moves to Converted and closes', 'Open follow-up tasks are cancelled', 'Consent from the lead carries over', 'You land on the customer'].map((t) => (
            <div key={t} className="flex items-center gap-2.5"><span className="flex size-[22px] items-center justify-center rounded-full bg-[#e7f4ee]"><Icon name="check" size={12} className="text-[#127650]" /></span><span className="text-[13px] font-medium text-ink-2">{t}</span></div>
          ))}
        </aside>
      </div>
      <div className="mt-6 flex h-[70px] items-center gap-3 rounded-[30px] bg-white py-3 pr-3 pl-6 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.1)]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-[46px] items-center rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
        <span className="flex-1" />
        <button type="button" disabled={save.busy || dup.loading} onClick={() => save.run()} className={cx('flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pr-5 pl-4 text-[14px] font-semibold text-white disabled:opacity-60', SH_NAVY)}>
          <Icon name="user-plus" size={18} />{save.busy ? 'Saving…' : mode === 'new' ? 'Save customer' : 'Link and convert'}
        </button>
      </div>
    </AppLayout>
  )
}