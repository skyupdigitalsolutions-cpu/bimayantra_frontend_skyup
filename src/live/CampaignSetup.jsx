// CN1–CN9 · connect and set up a channel · CC1–CC3 / CL1 · ad-form answers — on the live API.
//   /campaigns/setup/:id   sources (Pages / ad accounts): GET|PUT /campaigns/connections/:id/sources
//                          forms + field mapping + pipeline: GET /campaigns/forms?connectionId · PUT /campaigns/forms/:id
//                          website: POST /campaigns/connections/:id/embed-forms · test lead: GET /campaigns/submissions
//   <LeadAnswersDialog>    GET /campaigns/leads/:leadId/answers
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Dropdown } from '../components/pickers'
import { Header, HeadButton, Panel, PanelHead, SmallButton, StatusChip } from '../screens/catalogue/_parts'
import { api, useQuery } from '../api'
import { fmtDateTime } from '../api/format'
import { ActionDialog, Field, ErrorNote, useAct, label } from './kit'
import { LoadingPanel, ErrorPanel } from './common'

const TARGETS = [['name', 'Full name'], ['first_name', 'First name'], ['last_name', 'Last name'], ['mobile', 'Mobile'], ['email', 'Email'], ['city', 'City'], ['consent', 'Consent tick'], ['ignore', 'Keep as answer only']]
const CH = { META: 'Meta Ads', GOOGLE: 'Google Ads', LINKEDIN: 'LinkedIn Ads', WEBSITE: 'Website' }

export function LiveCampaignSetup() {
  const { id } = useParams()
  const conns = useQuery('campaigns:connections', () => api.campaigns.connections())
  const c = (conns.data || []).find((x) => x.id === id)
  const sources = useQuery(['campaigns:sources', id], () => api.campaigns.sources(id), { enabled: !!c && c.channel !== 'WEBSITE' })
  const forms = useQuery(['campaigns:forms', id], () => api.campaigns.forms({ connectionId: id }))
  const subs = useQuery(['campaigns:subs', id], () => api.campaigns.submissions({ connectionId: id }))
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const [picked, setPicked] = useState(null)
  const [embed, setEmbed] = useState(false)
  const { act, busy } = useAct()
  if (conns.error) return <ErrorPanel active="campaigns" error={conns.error} back="/campaigns" />
  if (!conns.data) return <LoadingPanel active="campaigns" />
  if (!c) return <ErrorPanel active="campaigns" error={{ message: 'This connection was not found.' }} back="/campaigns" />
  const sel = picked ?? (sources.data || []).filter((s) => s.subscribed).map((s) => s.id)
  return (
    <AppLayout active="campaigns">
      <Header back="/campaigns" breadcrumb={`CAMPAIGNS  /  ${CH[c.channel].toUpperCase()}`} title={`${CH[c.channel]} · ${c.name ?? 'Connection'}`} titleExtra={<StatusChip tone={c.status === 'CONNECTED' ? 'green' : 'amber'}>{label(c.status)}</StatusChip>}
        subtitle="Choose what to listen to, map the form questions, and pick the pipeline new leads go into."
        actions={<>{c.channel !== 'WEBSITE' && <HeadButton variant="white" icon="refresh" disabled={busy} onClick={() => act(() => api.campaigns.syncNow(c.id), { invalidates: ['campaigns'] })}>Sync now</HeadButton>}<HeadButton variant="white" icon="arrow" to="/campaigns">Back to campaigns</HeadButton></>} />
      {c.status === 'RECONNECT_NEEDED' && (
        <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-[#fbf1e1] px-4 py-3 text-[13px] font-semibold text-[#8a5a12]"><Icon name="alert" size={16} /><span className="flex-1">Sign-in has expired. New leads are kept and imported after you sign in again.</span>
          <SmallButton variant="navy" disabled={busy} onClick={() => act(() => api.campaigns.startOAuth(c.channel.toLowerCase(), { connectionId: c.id }), { success: false, onDone: (r) => r?.data?.url && window.location.assign(r.data.url) })}>Sign in again</SmallButton></div>
      )}
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          {c.channel !== 'WEBSITE' && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title={c.channel === 'META' ? 'Facebook Pages' : 'Ad accounts'} subtitle="Leads come only from the ones you tick." right={<SmallButton variant="navy" disabled={busy || !picked} onClick={() => act(() => api.campaigns.saveSources(c.id, { ids: sel }), { invalidates: ['campaigns'], onDone: () => setPicked(null) })}>Save</SmallButton>} />
              {(sources.data || []).map((s) => (
                <Field key={s.id} type="checkbox" label={s.name} value={sel.includes(s.id)} onChange={(on) => setPicked(on ? [...sel, s.id] : sel.filter((x) => x !== s.id))} />
              ))}
              {sources.data && !sources.data.length && <p className="text-[13px] font-medium text-muted">Nothing found on this account. Check the permissions you gave when signing in.</p>}
              <ErrorNote error={sources.error} />
            </Panel>
          )}
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Forms" subtitle="Map each question to a lead field. Unmapped answers are kept on the lead." right={c.channel === 'WEBSITE' && <SmallButton variant="navy" icon="plus" onClick={() => setEmbed(true)}>New website form</SmallButton>} />
            {(forms.data || []).map((f) => <FormCard key={f._id ?? f.id} f={f} pipes={pipes.data || []} />)}
            {forms.data && !forms.data.length && <p className="text-[13px] font-medium text-muted">{c.channel === 'WEBSITE' ? 'No forms yet. Create one, or post leads to the webhook.' : 'No lead forms found yet. They appear after Sync now.'}</p>}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          {c.channel === 'WEBSITE' && (
            <Panel className="flex flex-col gap-2">
              <PanelHead title="Webhook" subtitle="For your own site or form builder" />
              {c.webhookUrl && <code className="rounded-[12px] bg-panel px-3 py-2 text-[12px] break-all text-ink">{c.webhookUrl}</code>}
              {c.keyLast4 && <p className="text-[12px] font-medium text-muted">Key ends with …{c.keyLast4}. Replace it from the Campaigns page.</p>}
            </Panel>
          )}
          <Panel className="flex flex-col gap-2">
            <PanelHead title="Latest leads received" subtitle="A test lead shows up here" right={<SmallButton variant="ghost" icon="refresh" onClick={() => subs.refetch()}>Refresh</SmallButton>} />
            {(subs.data || []).slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-[12px]">
                <StatusChip tone={s.status === 'IMPORTED' ? 'green' : s.status === 'FAILED' ? 'rose' : 'amber'}>{label(s.status)}</StatusChip>
                <span className="flex-1 truncate font-medium text-ink">{s.formName ?? ''} {s.reason ? `· ${s.reason}` : ''}</span>
                {s.leadId && <Link to={`/leads/${s.leadId}`} className="font-semibold text-blue">Lead</Link>}
                <span className="text-muted">{fmtDateTime(s.createdAt)}</span>
              </div>
            ))}
            {subs.data && !subs.data.length && <p className="text-[13px] font-medium text-muted">Nothing received yet.</p>}
          </Panel>
        </div>
      </div>
      {embed && <EmbedDialog c={c} onClose={() => setEmbed(false)} />}
    </AppLayout>
  )
}

function FormCard({ f, pipes }) {
  const questions = f.fields?.length ? f.fields.map((q) => q.key) : Object.keys(f.fieldMap || {})
  const [map, setMap] = useState(f.fieldMap || {})
  const [pipelineId, setPipe] = useState(f.pipelineId ?? '')
  const [campaignName, setCampaign] = useState(f.campaignName ?? '')
  const { act, busy } = useAct()
  const id = f._id ?? f.id
  const publicUrl = f.publicKey ? `${window.location.origin}/forms/${f.publicKey}` : null
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-line p-4">
      <div className="flex items-center gap-3">
        <p className="flex-1 text-[14px] font-bold text-ink">{f.name}</p>
        <StatusChip tone={f.active === false ? 'neutral' : 'green'}>{f.active === false ? 'Off' : 'Active'}</StatusChip>
        <SmallButton variant="ghost" disabled={busy} onClick={() => act(() => api.campaigns.saveForm(id, { active: f.active === false }), { invalidates: ['campaigns'] })}>{f.active === false ? 'Turn on' : 'Turn off'}</SmallButton>
      </div>
      <div className="flex gap-3">
        <Field label="Campaign name" value={campaignName} onChange={setCampaign} />
        <Field label="Pipeline" type="select" value={pipelineId} onChange={setPipe} options={[{ value: '', label: 'Default pipeline' }, ...pipes.map((p) => ({ value: p.id, label: p.name }))]} />
      </div>
      {questions.map((q) => (
        <div key={q} className="flex items-center gap-3 text-[13px]">
          <span className="w-[260px] truncate font-semibold text-ink">{f.fields?.find((x) => x.key === q)?.label ?? q}</span>
          <Icon name="arrow" size={14} className="text-muted" />
          <Dropdown value={map[q] ?? 'ignore'} onChange={(v) => setMap({ ...map, [q]: v })} options={TARGETS} className="flex-1" buttonClassName="h-[40px]" />
        </div>
      ))}
      {publicUrl && <p className="text-[12px] font-medium text-muted">Form link: <span className="font-semibold text-ink">{publicUrl}</span></p>}
      <SmallButton variant="navy" className="self-start" disabled={busy} onClick={() => act(() => api.campaigns.saveForm(id, { fieldMap: map, pipelineId: pipelineId || null, campaignName: campaignName || null }), { invalidates: ['campaigns'] })}>Save form</SmallButton>
    </div>
  )
}

function EmbedDialog({ c, onClose }) {
  const [f, setF] = useState({ name: 'Website enquiry', campaignName: '', consentText: 'I agree to be contacted about insurance.' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  return (
    <ActionDialog title="New website form" body="A ready-made form with name, mobile, email, city and consent. Embed it on your site or share its link." confirm="Create form" busy={busy} error={error}
      onConfirm={() => act(() => api.campaigns.embedForms(c.id, { name: f.name, campaignName: f.campaignName || undefined, consentText: f.consentText || undefined }), { invalidates: ['campaigns'], onDone: onClose, quiet: true })} onClose={onClose}>
      <Field label="Form name *" value={f.name} onChange={set('name')} error={fe.name} />
      <Field label="Campaign name" value={f.campaignName} onChange={set('campaignName')} />
      <Field label="Consent text" type="textarea" value={f.consentText} onChange={set('consentText')} />
    </ActionDialog>
  )
}

/** CC1–CC3 / CL1: the answers a lead gave on the ad or website form. */
export function LeadAnswersDialog({ leadId, name, onClose }) {
  const q = useQuery(['campaigns:answers', leadId], () => api.campaigns.leadAnswers(leadId))
  return (
    <ActionDialog title={`Form answers${name ? ` · ${name}` : ''}`} onClose={onClose} width={620}>
      {(q.data || []).map((s) => (
        <div key={s.id} className="flex flex-col gap-1.5 rounded-[16px] bg-panel p-4">
          <p className="text-[12px] font-semibold text-muted">{CH[s.channel] ?? s.channel}{s.campaign ? ` · ${s.campaign}` : ''} · {fmtDateTime(s.at)}</p>
          {(Array.isArray(s.answers) ? s.answers : Object.entries(s.answers || {}).map(([k, v]) => ({ label: k, value: v }))).map((a, i) => (
            <div key={i} className="flex justify-between gap-3 text-[13px]"><span className="font-medium text-muted">{a.label ?? a.key ?? a.question}</span><span className="text-right font-semibold text-ink">{String(a.value ?? '—')}</span></div>
          ))}
        </div>
      ))}
      {q.data && !q.data.length && <p className="text-[13px] font-medium text-muted">This lead did not come from a form.</p>}
      <ErrorNote error={q.error} />
    </ActionDialog>
  )
}

/** Small inline answers block for the lead page (CL1). Renders nothing for leads that did not come from a form. */
export function LeadAnswersInline({ leadId }) {
  const q = useQuery(['campaigns:answers', leadId], () => api.campaigns.leadAnswers(leadId))
  const s = q.data?.[0]
  if (!s) return null
  const rows = Array.isArray(s.answers) ? s.answers : Object.entries(s.answers || {}).map(([k, v]) => ({ label: k, value: v }))
  return (
    <div className="flex flex-col gap-2 rounded-[24px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <p className="text-[16px] font-bold text-ink">Answers from {CH[s.channel] ?? 'the form'}</p>
      <p className="text-[12px] font-medium text-muted">{s.campaign ?? ''} · {fmtDateTime(s.at)}</p>
      {rows.map((a, i) => <div key={i} className="flex justify-between gap-3 text-[13px]"><span className="font-medium text-muted">{a.label ?? a.key}</span><span className="text-right font-semibold text-ink">{String(a.value ?? '—')}</span></div>)}
    </div>
  )
}