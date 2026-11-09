// Connect a lead channel (Meta, Google Ads, LinkedIn, website) with its details, edit them later, and finish the
// Meta / LinkedIn sign-in when the browser comes back.
//   POST /campaigns/connections            Google / website: name, defaultStatus, key?, campaignIds?, formIds?, contactPageUrl?
//   POST /campaigns/connections/manual     own Meta / LinkedIn app: page or account, token, secret + details
//   POST /campaigns/oauth/:channel/start   sign in; details are saved after the return (PUT …/settings)
//   PUT  /campaigns/connections/:id/settings
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { Modal, cx } from '../components/ui'
import { Dropdown } from '../components/pickers'
import { api, useQuery, invalidate } from '../api'
import { useToast } from '../components/LiveToast'
import { check, useAct, ErrorNote } from './kit'

const STARTS = [['NEW', 'New'], ['CONTACTED', 'Contacted'], ['QUALIFIED', 'Qualified'], ['FOLLOW_UP', 'Follow-up']]
export const START_LABEL = Object.fromEntries(STARTS)
const LOOK = {
  META: { title: 'Connect Meta Campaign', icon: 'chart', tint: 'bg-[#e8f0fd] text-[#1877f2]', btn: 'bg-[#1877f2] hover:bg-[#1466d8]', name: 'Meta', namePh: 'e.g. Summer Sale 2025', signIn: 'Sign in with Facebook', app: 'Use my own Meta app' },
  LINKEDIN: { title: 'Connect LinkedIn Campaign', icon: 'users', tint: 'bg-[#e6f0f9] text-[#0a66c2]', btn: 'bg-[#0a66c2] hover:bg-[#0958a8]', name: 'LinkedIn', namePh: 'e.g. Term plans – Q3', signIn: 'Sign in with LinkedIn', app: 'Use my own LinkedIn app' },
  GOOGLE: { title: 'Connect Google Ads Campaign', icon: 'search', tint: 'bg-[#fde8ec] text-[#ea4335]', btn: 'bg-[#ea4335] hover:bg-[#d33426]', name: 'Google Ads', namePh: 'e.g. Google Search — Branding Q2' },
  WEBSITE: { title: 'Connect Website Contact Form', icon: 'grid', tint: 'bg-[#e7f4ee] text-[#127650]', btn: 'bg-[#127650] hover:bg-[#0f6544]', name: 'Website', namePh: 'e.g. Contact Page, Homepage Form' },
}
const PENDING = 'skyup:pending-connect'
const KEY_RE = /^[A-Za-z0-9_-]{16,100}$/
const ID_RE = /^[A-Za-z0-9_-]{1,40}$/
const URL_RE = /^https:\/\/[^\s]+\.[^\s]+$/i
const ids = (s) => [...new Set(String(s || '').split(/[\s,]+/).map((x) => x.trim()).filter(Boolean))]
const badIds = (s) => ids(s).some((x) => !ID_RE.test(x)) && 'Use digits only, separated by commas.'
const newSecret = (ch) => `skyup_${ch === 'GOOGLE' ? 'google' : 'website'}_${Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20)}`

/* ───────── small form pieces (the look of the connect screens) ───────── */
const Section = ({ children, sub }) => (
  <div className="flex flex-col gap-1 pt-1">
    <p className="text-[12px] font-bold tracking-[0.08em] text-muted uppercase">{children}</p>
    {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
  </div>
)
function Row({ label, req, opt, hint, error, children, className = '' }) {
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-1.5', className)}>
      <span className={cx('text-[13px] font-bold', error ? 'text-[#b4323c]' : 'text-ink')}>
        {label}{req && <span className="text-[#e5484d]"> *</span>}{opt && <span className="font-medium text-muted"> (optional)</span>}
      </span>
      {children}
      {error ? <span className="text-[12px] font-medium text-[#b4323c]">{error}</span> : hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}
const boxCls = (error) => cx('h-[48px] w-full rounded-[14px] border bg-[#f6f7fb] px-4 text-[14px] font-medium text-ink outline-none placeholder:text-faint focus:border-blue focus:bg-white', error ? 'border-[#b4323c]' : 'border-[#e6e9f0]')
const Input = ({ value, onChange, error, ...rest }) => <input value={value} onChange={(e) => onChange(e.target.value)} className={boxCls(error)} {...rest} />
function Secret({ value, onChange, error, placeholder, onGenerate }) {
  const [show, setShow] = useState(false)
  return (
    <span className={cx(boxCls(error), 'flex items-center gap-2 pr-2 focus-within:border-blue focus-within:bg-white')}>
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
      <button type="button" onClick={() => setShow((x) => !x)} className="flex h-8 items-center gap-1 rounded-[10px] px-2 text-[12px] font-semibold text-muted hover:bg-panel hover:text-ink"><Icon name="eye" size={14} />{show ? 'Hide' : 'Show'}</button>
      {onGenerate && <button type="button" onClick={() => { onGenerate(); setShow(true) }} className="h-8 rounded-[10px] px-2.5 text-[12px] font-semibold text-blue hover:bg-blue-50">Generate</button>}
    </span>
  )
}
function Select({ value, onChange, options, className = '' }) {
  return <Dropdown value={value} onChange={onChange} options={options} className={className} buttonClassName="h-[48px] rounded-[14px] border border-[#e6e9f0] bg-[#f6f7fb]" />
}
function CopyField({ label, value, hint }) {
  const { toast } = useToast()
  const copy = async () => { try { await navigator.clipboard.writeText(value); toast(`${label} copied.`) } catch { toast(`Couldn’t copy. Select the ${label.toLowerCase()} and copy it.`, 'error') } }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <span className="flex items-center gap-2 rounded-[14px] border border-[#e6e9f0] bg-[#f6f7fb] py-1.5 pr-1.5 pl-4">
        <code className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{value}</code>
        <button type="button" onClick={copy} className="flex h-9 items-center gap-1.5 rounded-[11px] bg-white px-3 text-[12px] font-semibold text-ink shadow-[0px_4px_10px_-6px_rgba(19,41,75,0.3)] hover:bg-tile"><Icon name="link" size={13} />Copy</button>
      </span>
      {hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </div>
  )
}
function Shell({ look, title, sub, onClose, footer, children }) {
  return (
    <Modal onClose={onClose} width={620} className="flex max-h-[90vh] flex-col overflow-hidden p-0!">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-[14px]', look.tint)}><Icon name={look.icon} size={20} /></span>
        <div className="flex min-w-0 flex-1 flex-col"><p className="text-[18px] font-bold tracking-[-0.2px] text-ink">{title}</p><p className="text-[12px] font-medium text-muted">{sub}</p></div>
        <button type="button" onClick={onClose} aria-label="Close" className="flex size-9 items-center justify-center rounded-[11px] border border-line text-muted hover:bg-tile"><Icon name="x" size={15} /></button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">{children}</div>
      <div className="flex gap-3 border-t border-line px-6 py-4">{footer}</div>
    </Modal>
  )
}

/* ───────── Connect ───────── */
/** channel: META | LINKEDIN | GOOGLE | WEBSITE. platforms: GET /campaigns/platforms (is sign-in set up?). */
export function ConnectDialog({ channel, platforms, onClose }) {
  const navigate = useNavigate()
  const look = LOOK[channel]
  const social = channel === 'META' || channel === 'LINKEDIN'
  const signInReady = !!platforms?.[channel]?.configured
  const [method, setMethod] = useState(social ? (signInReady ? 'oauth' : 'manual') : 'webhook')
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const [f, setF] = useState({ name: '', defaultStatus: 'NEW', pipelineId: '', adSetName: '', parentCampaign: '', category: '', contactPageUrl: '', key: '', campaignIds: '', formIds: '',
    pageId: '', pageToken: '', appSecret: '', verifyToken: '', accountUrn: '', accessToken: '', clientSecret: '' })
  const [edited, setEdited] = useState(() => new Set())
  const [out, setOut] = useState(null)
  const { act, busy, error, fieldErrors } = useAct()
  const set = (k) => (v) => { setF((s) => ({ ...s, [k]: v })); setEdited((x) => new Set(x).add(k)) }
  const fe = (k) => (edited.has(k) ? undefined : Object.entries(fieldErrors).find(([x]) => x === k || x.startsWith(`${k}.`))?.[1])

  const details = {
    name: f.name.trim(), pipelineId: f.pipelineId || null, defaultStatus: f.defaultStatus,
    ...(social ? { adSetName: f.adSetName.trim() || null, parentCampaign: f.parentCampaign.trim() || null, category: f.category.trim() || null } : {}),
  }
  const required = f.name.trim() && (
    channel === 'GOOGLE' || channel === 'WEBSITE' ? f.key.trim()
      : method === 'oauth' ? true
        : channel === 'META' ? f.pageId.trim() && f.pageToken.trim() && f.appSecret.trim()
          : f.accountUrn.trim() && f.accessToken.trim() && f.clientSecret.trim())

  const validate = () => ({
    name: (!f.name.trim() && `Enter the ${channel === 'WEBSITE' ? 'source' : 'campaign'} name.`) || (f.name.trim().length < 2 && 'Use at least 2 characters.'),
    key: (channel === 'GOOGLE' || channel === 'WEBSITE') && ((!f.key.trim() && 'Enter a key, or press Generate.') || (!KEY_RE.test(f.key.trim()) && 'Use 16 to 100 letters, digits, hyphens or underscores, with no spaces.')),
    contactPageUrl: channel === 'WEBSITE' && f.contactPageUrl.trim() && !URL_RE.test(f.contactPageUrl.trim()) && 'Enter a full web address starting with https://.',
    campaignIds: channel === 'GOOGLE' && badIds(f.campaignIds),
    formIds: (channel === 'GOOGLE' || method === 'manual') && badIds(f.formIds),
    pageId: method === 'manual' && channel === 'META' && !/^\d{5,25}$/.test(f.pageId.trim()) && 'Enter the numeric Page ID.',
    pageToken: method === 'manual' && channel === 'META' && f.pageToken.trim().length < 20 && 'Paste the full Page access token.',
    appSecret: method === 'manual' && channel === 'META' && f.appSecret.trim().length < 16 && 'Paste the App secret (at least 16 characters).',
    accountUrn: method === 'manual' && channel === 'LINKEDIN' && !/^urn:li:(sponsoredAccount|organization):\d+$/.test(f.accountUrn.trim()) && 'Use urn:li:sponsoredAccount:123 or urn:li:organization:123.',
    accessToken: method === 'manual' && channel === 'LINKEDIN' && f.accessToken.trim().length < 20 && 'Paste the full access token.',
    clientSecret: method === 'manual' && channel === 'LINKEDIN' && f.clientSecret.trim().length < 8 && 'Paste the client secret.',
  })

  const submit = () => {
    setEdited(new Set())
    if (method === 'oauth') {
      return act(() => {
        check(validate())
        try { sessionStorage.setItem(PENDING, JSON.stringify({ channel, details, at: Date.now() })) } catch { /* the details can be set from Settings */ }
        return api.campaigns.startOAuth(channel.toLowerCase(), {})
      }, { success: false, quiet: true, onDone: (r) => r?.data?.url && window.location.assign(r.data.url) })
    }
    if (method === 'manual') {
      return act(() => {
        check(validate())
        const creds = channel === 'META'
          ? { pageId: f.pageId.trim(), pageToken: f.pageToken.trim(), appSecret: f.appSecret.trim(), verifyToken: f.verifyToken.trim() || null }
          : { accountUrn: f.accountUrn.trim(), accessToken: f.accessToken.trim(), clientSecret: f.clientSecret.trim() }
        return api.campaigns.connectManual({ channel, ...details, ...creds, formIds: ids(f.formIds) })
      }, { invalidates: ['campaigns'], quiet: true, success: 'Connected.', onDone: (r) => setOut({ kind: 'manual', ...r.data }) })
    }
    return act(() => {
      check(validate())
      return api.campaigns.connect({
        channel, ...details, key: f.key.trim(),
        ...(channel === 'WEBSITE' ? { contactPageUrl: f.contactPageUrl.trim() || null } : { campaignIds: ids(f.campaignIds), formIds: ids(f.formIds) }),
      })
    }, { invalidates: ['campaigns'], quiet: true, onDone: (r) => setOut({ kind: 'webhook', ...r.data }) })
  }

  /* ── after connecting: what to paste where ── */
  if (out) {
    const c = out.connection
    return (
      <Shell look={look} title="Connected" sub="New leads will arrive in your pipeline on their own" onClose={onClose}
        footer={<>
          <button type="button" onClick={onClose} className="h-[46px] flex-1 rounded-[23px] border border-line text-[14px] font-semibold text-ink hover:bg-tile">Done</button>
          <button type="button" onClick={() => { onClose(); navigate(`/campaigns/setup/${c.id}`) }} className={cx('h-[46px] flex-[2] rounded-[23px] text-[14px] font-semibold text-white', look.btn)}>Open forms and fields</button>
        </>}>
        {out.kind === 'webhook' && (
          <>
            <div className="flex items-start gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3 text-[#8a5a12]"><Icon name="alert" size={16} className="mt-0.5 shrink-0" />
              <p className="text-[13px] font-semibold">{channel === 'GOOGLE' ? 'In Google Ads: Lead form → Lead delivery → Webhook. Paste the URL and the key, then press “Send test data”.' : 'Send your form’s posts to this URL with the secret in the X-Bimayantra-Key header (or a “key” field). Or create a ready-made form under Forms and fields.'}</p></div>
            <CopyField label="Webhook URL" value={c.webhookUrl} />
            <CopyField label={channel === 'GOOGLE' ? 'Key' : 'Webhook secret'} value={out.key} hint="Shown only once. Keep it somewhere safe; you can replace it later." />
          </>
        )}
        {out.kind === 'manual' && (
          <>
            <div className="flex items-start gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3 text-[#1f5fd6]"><Icon name="alert" size={16} className="mt-0.5 shrink-0" />
              <p className="text-[13px] font-semibold">{channel === 'META' ? 'In your Meta app: Webhooks → Page → subscribe to “leadgen”. Use this callback URL and verify token.' : 'Your LinkedIn account was subscribed to lead notifications at this URL.'}</p></div>
            <CopyField label="Callback URL" value={out.webhookUrl ?? c.webhookUrl} />
            {out.verifyToken && <CopyField label="Verify token" value={out.verifyToken} hint="Shown only once." />}
          </>
        )}
        <div className="flex flex-wrap gap-2 text-[12px] font-semibold text-ink-2">
          <span className="rounded-[12px] bg-panel px-2.5 py-1">New leads start as {START_LABEL[c.defaultStatus] ?? 'New'}</span>
          {c.category && <span className="rounded-[12px] bg-panel px-2.5 py-1">Category · {c.category}</span>}
          {c.campaignFilter?.length > 0 && <span className="rounded-[12px] bg-panel px-2.5 py-1">Campaigns · {c.campaignFilter.join(', ')}</span>}
          {c.formFilter?.length > 0 && <span className="rounded-[12px] bg-panel px-2.5 py-1">Forms · {c.formFilter.join(', ')}</span>}
        </div>
      </Shell>
    )
  }

  const pipelineOptions = [['', 'Default pipeline'], ...(pipes.data || []).map((p) => [p.id, p.name])]
  return (
    <Shell look={look} title={look.title} sub="Auto-import leads into your pipeline" onClose={onClose}
      footer={<>
        <button type="button" onClick={onClose} className="h-[48px] rounded-[24px] border border-line px-6 text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
        <button type="button" disabled={busy || !required} onClick={submit} className={cx('h-[48px] flex-1 rounded-[24px] text-[14px] font-semibold text-white transition disabled:opacity-40', look.btn)}>
          {busy ? 'Connecting…' : method === 'oauth' ? `Continue to ${look.name} sign-in` : 'Connect & Start Receiving Leads'}
        </button>
      </>}>
      <Section>{channel === 'WEBSITE' ? 'Source info' : 'Campaign info'}</Section>
      <Row label={channel === 'WEBSITE' ? 'Source name' : 'Campaign name'} req error={fe('name')}><Input value={f.name} onChange={set('name')} placeholder={look.namePh} maxLength={100} error={fe('name')} /></Row>
      {channel === 'WEBSITE' && (
        <Row label="Contact page URL" opt error={fe('contactPageUrl')} hint="The page your form is on, for your reference.">
          <Input value={f.contactPageUrl} onChange={set('contactPageUrl')} placeholder="e.g. https://yourwebsite.com/contact" inputMode="url" error={fe('contactPageUrl')} />
        </Row>
      )}
      <div className="flex gap-3">
        <Row label="Default status" hint="The stage new leads start in."><Select value={f.defaultStatus} onChange={set('defaultStatus')} options={STARTS} /></Row>
        <Row label="Pipeline" hint="Where new leads go."><Select value={f.pipelineId} onChange={set('pipelineId')} options={pipelineOptions} /></Row>
      </div>
      {social && (
        <>
          <Row label="Ad set name" opt hint="Differentiates multiple ad sets within the same campaign"><Input value={f.adSetName} onChange={set('adSetName')} placeholder="e.g. Retargeting - Mumbai" maxLength={100} /></Row>
          <Row label="Parent campaign" opt hint="Groups related ad sets together on this page"><Input value={f.parentCampaign} onChange={set('parentCampaign')} placeholder="e.g. Summer Sale 2025" maxLength={100} /></Row>
          <Row label="Category" opt hint="Groups campaigns by category on the Campaigns page"><Input value={f.category} onChange={set('category')} placeholder="e.g. Health, Motor, Term" maxLength={100} /></Row>

          <Section>How to connect</Section>
          <div className="grid grid-cols-2 gap-2.5">
            {[['oauth', look.signIn, signInReady ? 'Recommended · one click' : 'Not set up by SkyUp yet'], ['manual', look.app, 'Paste your app’s IDs and token']].map(([k, t, s]) => (
              <button key={k} type="button" disabled={k === 'oauth' && !signInReady} onClick={() => setMethod(k)}
                className={cx('flex flex-col items-start gap-0.5 rounded-[16px] border-2 p-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50', method === k ? 'border-blue bg-[#f3f7ff]' : 'border-line hover:bg-tile')}>
                <span className="text-[14px] font-bold text-ink">{t}</span><span className="text-[12px] font-medium text-muted">{s}</span>
              </button>
            ))}
          </div>
          {method === 'oauth' && <p className="rounded-[14px] bg-panel px-4 py-3 text-[12px] leading-5 font-medium text-ink-2">You’ll sign in to {look.name}, then choose the {channel === 'META' ? 'Pages' : 'ad accounts'} to import leads from. The details above are saved to the connection when you come back.</p>}
          {method === 'manual' && channel === 'META' && (
            <>
              <div className="flex gap-3">
                <Row label="Page ID" req error={fe('pageId')}><Input value={f.pageId} onChange={set('pageId')} placeholder="e.g. 104523987654321" inputMode="numeric" error={fe('pageId')} /></Row>
                <Row label="Verify token" opt hint="Blank = we make one."><Input value={f.verifyToken} onChange={set('verifyToken')} placeholder="any text" /></Row>
              </div>
              <Row label="Page access token" req error={fe('pageToken')} hint="Needs leads_retrieval and pages_manage_metadata."><Secret value={f.pageToken} onChange={set('pageToken')} placeholder="EAAG…" error={fe('pageToken')} /></Row>
              <Row label="App secret" req error={fe('appSecret')} hint="Meta app → Settings → Basic. Used to check every lead is really from Meta."><Secret value={f.appSecret} onChange={set('appSecret')} placeholder="32 characters" error={fe('appSecret')} /></Row>
              <Row label="Lead form IDs" opt error={fe('formIds')} hint="Only these forms are imported. Blank = every form on the Page."><Input value={f.formIds} onChange={set('formIds')} placeholder="e.g. 1234567890, 9876543210" error={fe('formIds')} /></Row>
            </>
          )}
          {method === 'manual' && channel === 'LINKEDIN' && (
            <>
              <Row label="Ad account or organization URN" req error={fe('accountUrn')}><Input value={f.accountUrn} onChange={set('accountUrn')} placeholder="urn:li:sponsoredAccount:123456789" error={fe('accountUrn')} /></Row>
              <Row label="Access token" req error={fe('accessToken')}><Secret value={f.accessToken} onChange={set('accessToken')} placeholder="AQV…" error={fe('accessToken')} /></Row>
              <Row label="Client secret" req error={fe('clientSecret')}><Secret value={f.clientSecret} onChange={set('clientSecret')} placeholder="from your LinkedIn app" error={fe('clientSecret')} /></Row>
              <Row label="Lead form URNs" opt error={fe('formIds')} hint="Only these forms are imported. Blank = every form."><Input value={f.formIds} onChange={set('formIds')} placeholder="e.g. 12345, 67890" error={fe('formIds')} /></Row>
            </>
          )}
        </>
      )}

      {channel === 'GOOGLE' && (
        <>
          <Section>Google Ads config</Section>
          <Row label="Webhook key" req error={fe('key')} hint="Create any secret string, or press Generate. Paste this exact value in Google Ads → Lead form → Lead delivery → Webhook → Key.">
            <Secret value={f.key} onChange={set('key')} placeholder="e.g. skyup_google_2025_key" error={fe('key')} onGenerate={() => set('key')(newSecret('GOOGLE'))} />
          </Row>
          <div className="flex gap-3">
            <Row label="Campaign ID" opt error={fe('campaignIds')} hint="Filter leads by campaign. Blank = accept all."><Input value={f.campaignIds} onChange={set('campaignIds')} placeholder="e.g. 1234567890" inputMode="numeric" error={fe('campaignIds')} /></Row>
            <Row label="Form ID" opt error={fe('formIds')} hint="Filter leads by lead form. Blank = accept all."><Input value={f.formIds} onChange={set('formIds')} placeholder="e.g. 9876543210" inputMode="numeric" error={fe('formIds')} /></Row>
          </div>
          <div className="flex items-start gap-2.5 rounded-[16px] border border-[#f6d8c4] bg-[#fff6ef] px-4 py-3 text-[#b4502a]"><Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            <div className="text-[13px]"><p className="font-bold">Webhook URL to enter in Google Ads</p><p className="font-medium">Shown after you connect, with a Copy button. Leads from other campaigns or forms are kept as “Skipped” so you can import them later.</p></div></div>
        </>
      )}
      {channel === 'WEBSITE' && (
        <>
          <Section>Webhook config</Section>
          <Row label="Webhook secret" req error={fe('key')} hint="Your form sends this with every lead so only your site can post. Press Generate for a strong one.">
            <Secret value={f.key} onChange={set('key')} placeholder="e.g. skyup_website_2025_key" error={fe('key')} onGenerate={() => set('key')(newSecret('WEBSITE'))} />
          </Row>
        </>
      )}
      <ErrorNote error={error} />
    </Shell>
  )
}

/* ───────── Settings (edit later) ───────── */
export function ConnectionSettingsDialog({ c, onClose }) {
  const look = LOOK[c.channel] ?? LOOK.WEBSITE
  const pipes = useQuery('pipelines', () => api.pipelines.list())
  const manual = c.mode === 'MANUAL'
  const [f, setF] = useState({ name: c.name ?? '', pipelineId: c.pipelineId ?? '', defaultStatus: c.defaultStatus ?? 'NEW', adSetName: c.adSetName ?? '', parentCampaign: c.parentCampaign ?? '',
    category: c.category ?? '', contactPageUrl: c.contactPageUrl ?? '', campaignIds: (c.campaignFilter ?? []).join(', '), formIds: (c.formFilter ?? []).join(', ') })
  const { act, busy, error, fieldErrors } = useAct()
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const fe = (k) => Object.entries(fieldErrors).find(([x]) => x === k || x.startsWith(`${k}.`))?.[1]
  const save = () => act(() => {
    check({
      name: f.name.trim().length < 2 && 'Use at least 2 characters.',
      contactPageUrl: c.channel === 'WEBSITE' && f.contactPageUrl.trim() && !URL_RE.test(f.contactPageUrl.trim()) && 'Enter a full web address starting with https://.',
      campaignIds: c.channel === 'GOOGLE' && badIds(f.campaignIds), formIds: (c.channel === 'GOOGLE' || manual) && badIds(f.formIds),
    })
    const body = { name: f.name.trim(), pipelineId: f.pipelineId || null, defaultStatus: f.defaultStatus, adSetName: f.adSetName.trim(), parentCampaign: f.parentCampaign.trim(), category: f.category.trim(),
      ...(c.channel === 'WEBSITE' ? { contactPageUrl: f.contactPageUrl.trim() } : {}), ...(c.channel === 'GOOGLE' ? { campaignIds: ids(f.campaignIds) } : {}) }
    if (c.channel === 'GOOGLE') body.formIds = ids(f.formIds)
    // own-app Meta / LinkedIn keep their form filter on the manual endpoint
    return Promise.all([api.campaigns.saveSettings(c.id, body), manual ? api.campaigns.updateManual(c.id, { formIds: ids(f.formIds) }) : null]).then(([r]) => r)
  }, { invalidates: ['campaigns'], quiet: true, onDone: onClose })
  return (
    <Shell look={look} title={`${c.name} · settings`} sub="Applies to leads that arrive from now on" onClose={onClose}
      footer={<>
        <button type="button" onClick={onClose} className="h-[48px] rounded-[24px] border border-line px-6 text-[14px] font-semibold text-ink hover:bg-tile">Cancel</button>
        <button type="button" disabled={busy} onClick={save} className={cx('h-[48px] flex-1 rounded-[24px] text-[14px] font-semibold text-white disabled:opacity-50', look.btn)}>{busy ? 'Saving…' : 'Save settings'}</button>
      </>}>
      <Row label="Name" req error={fe('name')}><Input value={f.name} onChange={set('name')} maxLength={100} error={fe('name')} /></Row>
      <div className="flex gap-3">
        <Row label="Default status"><Select value={f.defaultStatus} onChange={set('defaultStatus')} options={STARTS} /></Row>
        <Row label="Pipeline"><Select value={f.pipelineId} onChange={set('pipelineId')} options={[['', 'Default pipeline'], ...(pipes.data || []).map((p) => [p.id, p.name])]} /></Row>
      </div>
      {c.channel === 'WEBSITE' && <Row label="Contact page URL" opt error={fe('contactPageUrl')}><Input value={f.contactPageUrl} onChange={set('contactPageUrl')} placeholder="https://yourwebsite.com/contact" error={fe('contactPageUrl')} /></Row>}
      {c.channel === 'GOOGLE' && (
        <div className="flex gap-3">
          <Row label="Campaign IDs" opt error={fe('campaignIds')} hint="Blank = accept all."><Input value={f.campaignIds} onChange={set('campaignIds')} placeholder="1234567890" error={fe('campaignIds')} /></Row>
          <Row label="Form IDs" opt error={fe('formIds')} hint="Blank = accept all."><Input value={f.formIds} onChange={set('formIds')} placeholder="9876543210" error={fe('formIds')} /></Row>
        </div>
      )}
      {manual && <Row label={c.channel === 'META' ? 'Lead form IDs' : 'Lead form URNs'} opt error={fe('formIds')} hint="Blank = every form."><Input value={f.formIds} onChange={set('formIds')} error={fe('formIds')} /></Row>}
      <Row label="Ad set name" opt><Input value={f.adSetName} onChange={set('adSetName')} maxLength={100} /></Row>
      <Row label="Parent campaign" opt><Input value={f.parentCampaign} onChange={set('parentCampaign')} maxLength={100} /></Row>
      <Row label="Category" opt hint="Shown on this connection’s campaigns."><Input value={f.category} onChange={set('category')} maxLength={100} /></Row>
      <ErrorNote error={error} />
    </Shell>
  )
}

/* ───────── Coming back from Meta / LinkedIn sign-in ───────── */
/** Reads ?connected= / ?error= once, saves the details typed before sign-in, tells the person, and opens the setup page. */
export function useConnectReturn() {
  const [sp, setSp] = useSearchParams()
  const navigate = useNavigate()
  const { toast, toastError } = useToast()
  useEffect(() => {
    const id = sp.get('connected')
    const failed = sp.get('error')
    if (!id && !failed) return
    const channel = sp.get('channel') ?? ''
    const name = LOOK[channel]?.name ?? 'the platform'
    let pending = null
    try { pending = JSON.parse(sessionStorage.getItem(PENDING) || 'null'); sessionStorage.removeItem(PENDING) } catch { /* nothing saved */ }
    setSp({}, { replace: true })
    if (failed) { toast(`Sign-in to ${name} didn’t finish: ${sp.get('reason') || 'it was cancelled'}`, 'error', 9000); return }
    const fresh = pending && pending.channel === channel && Date.now() - pending.at < 3_600_000
    ;(fresh ? api.campaigns.saveSettings(id, pending.details) : Promise.resolve())
      .catch((e) => toastError(e))
      .finally(() => {
        invalidate('campaigns')
        toast(`Signed in to ${name}. Choose the ${channel === 'META' ? 'Pages' : 'ad accounts'} to import leads from.`)
        navigate(`/campaigns/setup/${id}`)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
