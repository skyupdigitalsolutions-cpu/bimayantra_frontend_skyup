// CA1 Campaigns overview · CA2 Campaign detail — connections, campaign KPIs, failed submissions, leads per day.
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, DataTable, StatusChip, RowChevron, StatTile, Panel, PanelHead } from '../screens/catalogue/_parts'
import { matchesQuery, useHeaderSearch } from '../screens/tasks/_filter'
import { api, useQuery } from '../api'
import { fmtDate, fmtDateTime, fmtMoney, fmtMobile } from '../api/format'
import { ActionDialog, Field, ErrorNote, useAct, label } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { LeadAnswersDialog } from './CampaignSetup'

const CH = {
  META: { name: 'Meta Ads', sub: 'Facebook and Instagram lead forms', icon: 'chart', bg: 'bg-[#e8f0fd]', oauth: 'meta' },
  GOOGLE: { name: 'Google Ads', sub: 'Lead form extensions', icon: 'search', bg: 'bg-[#fde8ec]', oauth: 'google' },
  LINKEDIN: { name: 'LinkedIn Ads', sub: 'Lead Gen Forms', icon: 'users', bg: 'bg-[#eef1f5]', oauth: 'linkedin' },
  WEBSITE: { name: 'Website form', sub: 'Your site or landing page', icon: 'grid', bg: 'bg-[#f0ecfb]', oauth: null },
}
const STATUS_TONE = { CONNECTED: 'green', ACTIVE: 'green', RECONNECT_NEEDED: 'amber', DISCONNECTED: 'neutral', NOT_SYNCING: 'amber', TURNED_OFF: 'neutral', PAUSED: 'amber' }

export function LiveCampaigns() {
  const [channel, setChannel] = useState('all')
  const [q, clearQ] = useHeaderSearch()
  const conns = useQuery('campaigns:connections', () => api.campaigns.connections())
  const camps = useQuery('campaigns:list', () => api.campaigns.list())
  const failed = useQuery('campaigns:failed', () => api.campaigns.submissions({ status: 'FAILED' }))
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  const rows = (camps.data || []).filter((r) => (channel === 'all' || r.channel === channel) && matchesQuery(q, r.name, r.channel, r.status))
  const all = camps.data || []
  const sum = (k) => all.reduce((a, r) => a + (r[k] || 0), 0)
  const spend = all.reduce((a, r) => a + (r.spend || 0), 0)
  const stats = [
    { key: 'l', bg: 'bg-blue-100', icon: 'user-plus', label: 'Leads from campaigns', value: sum('leads'), note: `${sum('newToday')} new today` },
    { key: 'c', bg: 'bg-mint-100', icon: 'check', label: 'Converted', value: sum('converted'), note: sum('leads') ? `${Math.round((sum('converted') * 100) / sum('leads'))}% of leads` : '—' },
    { key: 's', bg: 'bg-amber-100', icon: 'card', label: 'Ad spend', value: spend ? fmtMoney(spend) : '—', note: spend && sum('leads') ? `${fmtMoney(spend / sum('leads'))} per lead` : 'From connected ad accounts' },
    { key: 'f', bg: 'bg-pink-100', icon: 'alert', label: 'Not imported', value: (failed.data || []).length, note: 'Retry below' },
  ]
  const connect = (ch) => {
    const c = (conns.data || []).find((x) => x.channel === ch)
    if (CH[ch].oauth && ch !== 'GOOGLE') return act(() => api.campaigns.startOAuth(CH[ch].oauth, c ? { connectionId: c.id } : {}), { quiet: true, onDone: (r) => r?.data?.url && window.location.assign(r.data.url) })
    return setDlg({ channel: ch })
  }
  const columns = [
    { key: 'name', label: 'Campaign or form', width: 330, render: (r) => <div className="flex items-center gap-3"><span className={cx('flex size-9 items-center justify-center rounded-full', CH[r.channel]?.bg)}><Icon name={CH[r.channel]?.icon ?? 'chart'} size={16} /></span><div className="flex min-w-0 flex-col"><p className="truncate text-[14px] font-bold text-ink">{r.name}</p><p className="text-[12px] font-medium text-muted">{CH[r.channel]?.name}{r.statusReason ? ` · ${r.statusReason}` : ''}</p></div></div> },
    { key: 'leads', label: 'Leads', width: 90 },
    { key: 'newToday', label: 'Today', width: 80 },
    { key: 'converted', label: 'Converted', width: 100 },
    { key: 'spend', label: 'Spend', width: 120, render: (r) => (r.spend != null ? fmtMoney(r.spend) : '—') },
    { key: 'last', label: 'Last lead', width: 140, render: (r) => (r.lastLeadAt ? fmtDate(r.lastLeadAt, { year: false }) : '—') },
    { key: 'status', label: 'Status', width: 120, render: (r) => <StatusChip tone={STATUS_TONE[r.status] ?? 'neutral'}>{label(r.status)}</StatusChip> },
    { key: 'go', label: '', width: 30, render: (_r, hot) => <RowChevron on={hot} /> },
  ]
  if (camps.error && !camps.data) return <ErrorPanel active="campaigns" error={camps.error} />
  return (
    <AppLayout active="campaigns">
      <Header breadcrumb="CAMPAIGNS" title="Campaigns" subtitle="Leads from your ads and website arrive here on their own, in your pipeline." actions={<HeadButton variant="white" icon="list" to="/campaigns/guide">Connection guide</HeadButton>} />
      <div className="mt-[13px] flex gap-5">{stats.map((s) => <StatTile key={s.key} {...s} />)}</div>
      <div className="mt-6 flex gap-4">
        {Object.entries(CH).map(([ch, d]) => {
          const c = (conns.data || []).find((x) => x.channel === ch)
          return (
            <div key={ch} className="flex w-[280px] flex-col gap-2.5 rounded-[26px] bg-white p-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
              <div className="flex items-center gap-3"><span className={cx('flex size-10 items-center justify-center rounded-full', d.bg)}><Icon name={d.icon} size={18} /></span><div className="flex flex-1 flex-col"><p className="text-[14px] font-bold text-ink">{d.name}</p><p className="text-[11px] font-medium text-muted">{d.sub}</p></div></div>
              {c ? (
                <>
                  <div className="flex items-center gap-2"><StatusChip tone={STATUS_TONE[c.status] ?? 'neutral'}>{label(c.status)}</StatusChip><span className="text-[11px] font-medium text-muted">{c.lastLeadAt ? `last lead ${fmtDate(c.lastLeadAt, { year: false })}` : 'no leads yet'}</span></div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.status === 'CONNECTED' && <SmallButton variant="outline" icon="refresh" disabled={busy} onClick={() => act(() => api.campaigns.syncNow(c.id), { invalidates: ['campaigns'] })}>Sync now</SmallButton>}
                    {c.status === 'RECONNECT_NEEDED' && <SmallButton variant="navy" disabled={busy} onClick={() => connect(ch)}>Sign in again</SmallButton>}
                    {c.status === 'DISCONNECTED'
                      ? <SmallButton variant="outline" disabled={busy} onClick={() => act(() => api.campaigns.reconnect(c.id, {}), { invalidates: ['campaigns'] })}>Turn on</SmallButton>
                      : <SmallButton variant="danger" disabled={busy} onClick={() => act(() => api.campaigns.disconnect(c.id, {}), { invalidates: ['campaigns'] })}>Turn off</SmallButton>}
                    {c.keyLast4 && <SmallButton variant="ghost" icon="lock" onClick={() => setDlg({ rotate: c })}>Key …{c.keyLast4}</SmallButton>}
                    <SmallButton variant="outline" icon="list" to={`/campaigns/setup/${c.id}`}>Forms and fields</SmallButton>
                  </div>
                </>
              ) : <SmallButton variant="navy" icon="plus" className="self-start" disabled={busy} onClick={() => connect(ch)}>Connect</SmallButton>}
            </div>
          )
        })}
      </div>
      <SegTabs className="mt-6" items={[{ key: 'all', label: 'All' }, ...Object.keys(CH).map((k) => ({ key: k, label: CH[k].name, count: all.filter((r) => r.channel === k).length }))]} value={channel} onChange={setChannel} />
      <DataTable className="mt-5 w-[1180px]" columns={columns} rows={rows} rowTo={(r) => `/campaigns/${r.id}`} empty={camps.loading ? 'Loading…' : q.trim() ? `No campaigns match “${q.trim()}”.` : 'No campaigns yet. Connect a channel above.'} onClear={q.trim() ? clearQ : undefined} />
      {(failed.data || []).length > 0 && (
        <Panel className="mt-6 flex w-[1180px] flex-col gap-3">
          <PanelHead title="Leads not imported" subtitle="Kept with the reason. Retry after fixing the cause." />
          {failed.data.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
              <span className="w-[130px] font-semibold text-ink">{CH[s.channel]?.name ?? s.channel}</span>
              <span className="flex-1 truncate font-medium text-muted">{s.formName ?? ''} · {s.reason ?? s.error ?? ''}</span>
              <span className="font-medium text-muted">{fmtDateTime(s.createdAt)}</span>
              <SmallButton variant="outline" icon="refresh" disabled={busy} onClick={() => act(() => api.campaigns.retrySubmission(s.id), { invalidates: ['campaigns', 'leads'] })}>Retry</SmallButton>
            </div>
          ))}
        </Panel>
      )}
      {dlg?.channel && <ConnectDialog channel={dlg.channel} onClose={() => setDlg(null)} />}
      {dlg?.rotate && <RotateDialog c={dlg.rotate} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

function ConnectDialog({ channel, onClose }) {
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const [name, setName] = useState(channel === 'WEBSITE' ? 'Website' : 'Google Ads')
  const [pipelineId, setPipe] = useState('')
  const [out, setOut] = useState(null)
  const { act, busy, error } = useAct()
  const save = () => act(() => api.campaigns.connect({ channel, name, pipelineId: pipelineId || null }), { invalidates: ['campaigns'], quiet: true, onDone: (r) => setOut(r.data) })
  if (out) {
    return (
      <ActionDialog title="Connected" body="Copy the key now. It is shown only once." icon="check" onClose={onClose}>
        <Field label="Webhook URL" value={out.connection.webhookUrl ?? ''} onChange={() => {}} readOnly />
        <Field label="Key" value={out.key} onChange={() => {}} readOnly />
        <SmallButton variant="outline" icon="list" className="self-start" onClick={() => navigator.clipboard?.writeText(out.key)}>Copy key</SmallButton>
      </ActionDialog>
    )
  }
  return (
    <ActionDialog title={`Connect ${CH[channel].name}`} confirm="Connect" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Name *" value={name} onChange={setName} />
      <Field label="Pipeline for new leads" type="select" value={pipelineId} onChange={setPipe} options={[{ value: '', label: 'Default pipeline' }, ...(pipes.data || []).map((p) => ({ value: p.id, label: p.name }))]} />
    </ActionDialog>
  )
}
function RotateDialog({ c, onClose }) {
  const [key, setKey] = useState(null)
  const { act, busy, error } = useAct()
  return (
    <ActionDialog title="Replace the key?" body={key ? 'Copy the new key now. The old key stops working.' : 'The old key stops working at once. Update it where you pasted it.'} icon="lock" confirm={key ? undefined : 'Replace key'} busy={busy} error={error}
      onConfirm={key ? undefined : () => act(() => api.campaigns.rotateKey(c.id), { invalidates: ['campaigns'], quiet: true, onDone: (r) => setKey(r.data.key) })} onClose={onClose}>
      {key && <Field label="New key" value={key} onChange={() => {}} readOnly />}
    </ActionDialog>
  )
}

export function LiveCampaignDetail() {
  const [answers, setAnswers] = useState(null) // CC1–CC3
  const { id } = useParams()
  const d = useQuery(['campaign', id], () => api.campaigns.get(id))
  const leads = useQuery(['campaign', id, 'leads'], () => api.campaigns.leads(id))
  if (d.error) return <ErrorPanel active="campaigns" error={d.error} back="/campaigns" />
  if (!d.data) return <LoadingPanel active="campaigns" />
  const c = d.data
  const max = Math.max(1, ...c.leadsPerDay.map((x) => x.leads))
  const stats = [
    { key: 'l', bg: 'bg-blue-100', icon: 'user-plus', label: 'Leads', value: c.leads, note: `${c.newToday} today` },
    { key: 'c', bg: 'bg-mint-100', icon: 'check', label: 'Converted', value: c.converted, note: `${c.conversionRate}% conversion` },
    { key: 's', bg: 'bg-amber-100', icon: 'card', label: 'Spend', value: c.spend != null ? fmtMoney(c.spend) : '—', note: c.costPerLead != null ? `${fmtMoney(c.costPerLead)} per lead` : 'Not synced' },
    { key: 't', bg: 'bg-pink-100', icon: 'clock', label: 'Last lead', value: c.lastLeadAt ? fmtDate(c.lastLeadAt, { year: false }) : '—', note: label(c.status) },
  ]
  const LS = { NEW: 'sky', CONTACTED: 'violet', QUALIFIED: 'green', FOLLOW_UP: 'amber', CONVERTED: 'green', LOST: 'neutral' }
  return (
    <AppLayout active="campaigns">
      <Header breadcrumb={`CAMPAIGNS  /  ${c.name.toUpperCase()}`} title={c.name} titleExtra={<StatusChip tone={STATUS_TONE[c.status] ?? 'neutral'}>{label(c.status)}</StatusChip>} subtitle={CH[c.channel]?.name ?? c.channel} />
      <div className="mt-[13px] flex gap-5">{stats.map((s) => <StatTile key={s.key} {...s} />)}</div>
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Leads per day" subtitle="Last 14 days" />
            <div className="flex h-[140px] items-end gap-2">
              {c.leadsPerDay.map((x) => (
                <div key={x.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-ink">{x.leads || ''}</span>
                  <span className="w-full rounded-t-[6px] bg-[#1f5fd6]" style={{ height: `${(x.leads / max) * 100}px`, minHeight: 2 }} />
                  <span className="text-[9px] font-medium text-muted">{x.date.slice(8)}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="flex flex-col gap-2">
            <PanelHead title="Leads" subtitle={`${(leads.data || []).length} from this ${c.kind === 'FORM' ? 'form' : 'campaign'}`} />
            {(leads.data || []).map((l) => (
              <Link key={l.submissionId} to={`/leads/${l.leadId}`} className="flex items-center gap-3 rounded-[12px] px-2 py-2 text-[13px] hover:bg-panel-2">
                <span className="flex-1 font-semibold text-ink">{l.name} <span className="font-medium text-muted">· {l.number} · {fmtMobile(l.mobile)}</span></span>
                {l.linkedToExisting && <StatusChip tone="neutral">Existing lead</StatusChip>}
                <StatusChip tone={LS[l.leadStatus] ?? 'neutral'}>{label(l.leadStatus)}</StatusChip>
                <button type="button" onClick={(e) => { e.preventDefault(); setAnswers(l) }} className="rounded-[12px] px-2 py-1 text-[12px] font-semibold text-blue hover:bg-blue-50">Answers</button>
                <span className="w-[90px] text-right font-medium text-muted">{fmtDate(l.at, { year: false })}</span>
              </Link>
            ))}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-2">
            <PanelHead title="Leads by ad" />
            {c.leadsByAd.map((a) => <div key={a.adId} className="flex justify-between text-[13px]"><span className="truncate font-semibold text-ink">{a.name ?? a.adId}{a.adSetName ? ` · ${a.adSetName}` : ''}</span><span className="font-bold text-ink">{a.leads}</span></div>)}
            {!c.leadsByAd.length && <p className="text-[13px] font-medium text-muted">No ad breakdown for this source.</p>}
          </Panel>
          <ErrorNote error={leads.error} />
        </div>
      </div>
      {answers && <LeadAnswersDialog leadId={answers.leadId} name={answers.name} onClose={() => setAnswers(null)} />}
    </AppLayout>
  )
}