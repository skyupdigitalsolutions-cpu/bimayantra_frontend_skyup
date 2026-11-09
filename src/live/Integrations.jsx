// Settings → Integrations: the advisor connects their own messaging accounts.
//   WhatsApp (MSG91): WhatsApp messages go from the advisor's own number through their MSG91 account
//   Email (Brevo):    emails go from the advisor's own verified sender through their Brevo account
// Without a connection Bimayantra's own providers send, as before.
//   GET /integrations · PUT /integrations/:provider (checked with the provider first) · POST …/test · DELETE …
// Keys are never shown back: only the last 4 characters.
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SettingsLayout, SCard, SHead, SChip, SBtn } from '../screens/settings/_parts'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, useQuery } from '../api'
import { fmtDateTime } from '../api/format'
import { useToast } from '../components/LiveToast'
import { ActionDialog, ErrorNote, useAct, inputCls } from './kit'

const TABS = [
  { key: 'msg91', provider: 'MSG91', label: 'WhatsApp', icon: 'chat', name: 'WhatsApp', via: 'MSG91' },
  { key: 'brevo', provider: 'BREVO', label: 'Email', icon: 'mail', name: 'Email', via: 'Brevo' },
]

const HOW = {
  MSG91: {
    title: 'How to get your MSG91 details',
    steps: [
      'Log in to msg91.com → click your profile → Authkey, and copy your Auth key (keep it secret).',
      'Go to WhatsApp → Integrated numbers and copy the number you send from, with country code (e.g. 919876543210).',
      'Paste both below and press Connect. We check them with MSG91 before saving.',
      'Copy the webhook address shown after connecting into MSG91 → WhatsApp → Webhook, so delivery reports and STOP replies reach Bimayantra.',
    ],
    after: 'Your WhatsApp templates are sent to Meta for approval on your number. Each message waits until its template is approved there. Messages sent this way are billed by MSG91, not your Bimayantra wallet.',
  },
  BREVO: {
    title: 'How to get your Brevo details',
    steps: [
      'Log in to brevo.com → your name (top right) → SMTP & API → API keys → Generate a new API key, and copy it.',
      'Go to Senders, domains & dedicated IPs → Senders and add the email you send from. Verify it (or its domain).',
      'Paste the key and that sender below and press Connect. We check them with Brevo before saving.',
      'Copy the webhook address shown after connecting into Brevo → Transactional → Settings → Webhook, with the events Delivered, Opened, Hard bounce, Unsubscribed, Spam and Blocked.',
    ],
    after: 'Renewal reminders and quotation emails then go from your sender, and replies come to you.',
  },
}

const TPL_TONE = { APPROVED: 'green', PENDING: 'amber', NOT_SUBMITTED: 'gray', REJECTED: 'red' }
const TPL_LABEL = { APPROVED: 'Approved', PENDING: 'Waiting for Meta', NOT_SUBMITTED: 'Not sent yet', REJECTED: 'Rejected' }

export default function LiveIntegrations() {
  const [sp, setSp] = useSearchParams()
  const tab = TABS.find((t) => t.key === sp.get('tab')) ?? TABS[0]
  const q = useQuery('integrations', () => api.integrations.list())
  const data = q.data ?? {}
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  INTEGRATIONS" title="Integrations" subtitle="Connect your own WhatsApp and email providers.">
      <SCard className="gap-0 p-0">
        <div role="tablist" className="flex border-b border-line px-2">
          {TABS.map((t) => {
            const on = t.key === tab.key
            const c = data[t.provider]
            const dot = !c ? 'bg-[#aab3c2]' : c.status === 'ACTIVE' ? 'bg-[#1fae63]' : 'bg-[#e0a43a]'
            return (
              <button key={t.key} role="tab" aria-selected={on} type="button" onClick={() => setSp({ tab: t.key }, { replace: true })}
                className={cx('relative flex flex-1 flex-col items-center gap-1.5 px-4 pt-4 pb-3 text-[14px] font-semibold transition', on ? 'text-[#127650]' : 'text-muted hover:text-ink')}>
                <span className="relative"><Icon name={t.icon} size={20} /><span className={cx('absolute -top-0.5 -right-1 size-2 rounded-full ring-2 ring-white', dot)} /></span>
                {t.label}
                <span className="text-[11px] font-medium text-muted">via {t.via}</span>
                {on && <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-t-full bg-[#1fae63]" />}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-4 p-6">
          {q.error && <ErrorNote error={q.error} />}
          {q.loading && !q.data && <p className="text-[13px] font-medium text-muted">Loading…</p>}
          {q.data && <ProviderPanel key={tab.provider} tab={tab} conn={data[tab.provider]} />}
        </div>
      </SCard>
    </SettingsLayout>
  )
}

function ProviderPanel({ tab, conn }) {
  const { toast } = useToast()
  const how = HOW[tab.provider]
  const isWa = tab.provider === 'MSG91'
  const [f, setF] = useState(() => (isWa
    ? { authKey: '', waNumber: conn?.config?.waNumber ?? '' }
    : { apiKey: '', fromEmail: conn?.config?.fromEmail ?? '', fromName: conn?.config?.fromName ?? '', replyTo: conn?.config?.replyTo ?? '' }))
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const [show, setShow] = useState(false)
  const [confirmOff, setConfirmOff] = useState(false)
  const { act, busy, error, fieldErrors: fe, reset } = useAct()
  const test = useAct()
  const secretKey = isWa ? 'authKey' : 'apiKey'
  const ready = isWa ? f.authKey.trim() && f.waNumber.trim() : f.apiKey.trim() && f.fromEmail.trim() && f.fromName.trim()
  const save = () => act(() => api.integrations.connect(tab.key, { ...f, ...(isWa ? {} : { replyTo: f.replyTo.trim() || null }) }), {
    invalidates: ['integrations'], quiet: true,
    onDone: (r) => { setF((s) => ({ ...s, [secretKey]: '', ...(r?.data?.config?.waNumber ? { waNumber: r.data.config.waNumber } : {}) })); setShow(false) }, // show the number as saved (with 91)
  })
  const copy = async (text) => { try { await navigator.clipboard.writeText(text); toast('Webhook address copied.') } catch { toast('Couldn’t copy. Select the address and copy it yourself.', 'error') } }

  return (
    <>
      {conn && (
        <div className={cx('flex items-center gap-3 rounded-[18px] border px-4 py-3.5', conn.status === 'ACTIVE' ? 'border-[#b9e6cd] bg-[#eefaf3]' : 'border-[#f1d6a6] bg-[#fdf6ea]')}>
          <span className={cx('size-2.5 shrink-0 rounded-full', conn.status === 'ACTIVE' ? 'bg-[#1fae63]' : 'bg-[#e0a43a]')} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className={cx('text-[15px] font-bold', conn.status === 'ACTIVE' ? 'text-[#127650]' : 'text-[#8a5a12]')}>
              {conn.status === 'ACTIVE' ? `${tab.name} is connected and active` : `${tab.name} needs attention`}
            </p>
            <p className="text-[12px] font-medium text-muted">
              {isWa ? `Number ${conn.config.waNumber}` : `${conn.config.fromName} <${conn.config.fromEmail}>`} · key ending {conn.keyLast4}
              {conn.lastCheckedAt ? ` · checked ${fmtDateTime(conn.lastCheckedAt)}` : ''}
            </p>
            {conn.status !== 'ACTIVE' && conn.lastError && <p className="text-[12px] font-semibold text-[#8a5a12]">{conn.lastError}</p>}
          </div>
          <SBtn variant="white" icon="refresh" disabled={test.busy} onClick={() => test.act(() => api.integrations.test(tab.key), { invalidates: ['integrations'] })}>{test.busy ? 'Checking…' : 'Test'}</SBtn>
          <SBtn variant="danger" onClick={() => setConfirmOff(true)}>Disconnect</SBtn>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-[18px] bg-panel p-5">
        <p className="text-[12px] font-bold tracking-[0.6px] text-ink-2 uppercase">{how.title}</p>
        <ol className="flex flex-col gap-2.5">
          {how.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-[14px] leading-[21px] font-medium text-ink">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#127650]">{i + 1}</span>{s}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3.5">
        <SHead title={conn ? 'Change details' : `Connect ${tab.via}`} subtitle={conn ? 'Enter the key again to save any change. It is checked before saving.' : how.after} />
        <Input label={isWa ? 'MSG91 auth key' : 'Brevo API key'} req error={fe[secretKey]}>
          <span className={cx(inputCls, 'flex items-center gap-2', fe[secretKey] && 'ring-2 ring-[#b4323c]')}>
            <input type={show ? 'text' : 'password'} value={f[secretKey]} onChange={(e) => { set(secretKey)(e.target.value); reset() }} autoComplete="off" spellCheck={false}
              placeholder={conn ? `•••• ${conn.keyLast4} (enter to replace)` : isWa ? 'Paste your auth key' : 'xkeysib-…'} className="min-w-0 flex-1 bg-transparent outline-none placeholder:font-medium placeholder:text-faint" />
            <button type="button" aria-label={show ? 'Hide key' : 'Show key'} onClick={() => setShow(!show)} className="text-muted hover:text-ink"><Icon name="eye" size={16} /></button>
          </span>
        </Input>
        {isWa ? (
          <Input label="WhatsApp number" req hint="With country code, as integrated in MSG91, e.g. 919876543210." error={fe.waNumber}>
            <input value={f.waNumber} onChange={(e) => set('waNumber')(e.target.value)} inputMode="numeric" placeholder="919876543210" className={cx(inputCls, fe.waNumber && 'ring-2 ring-[#b4323c]')} />
          </Input>
        ) : (
          <>
            <div className="flex gap-3">
              <Input label="Sender email" req hint="Must be a verified sender in Brevo." error={fe.fromEmail}>
                <input value={f.fromEmail} onChange={(e) => set('fromEmail')(e.target.value)} type="email" placeholder="you@yourdomain.in" className={cx(inputCls, fe.fromEmail && 'ring-2 ring-[#b4323c]')} />
              </Input>
              <Input label="Sender name" req hint="What customers see as the sender." error={fe.fromName}>
                <input value={f.fromName} onChange={(e) => set('fromName')(e.target.value)} placeholder="e.g. Asha Rao Insurance" className={cx(inputCls, fe.fromName && 'ring-2 ring-[#b4323c]')} />
              </Input>
            </div>
            <Input label="Reply-to email" hint="Optional. Where customer replies go; blank = the sender email." error={fe.replyTo}>
              <input value={f.replyTo} onChange={(e) => set('replyTo')(e.target.value)} type="email" placeholder="help@yourdomain.in" className={cx(inputCls, fe.replyTo && 'ring-2 ring-[#b4323c]')} />
            </Input>
          </>
        )}
        {error && !Object.keys(fe).length && <ErrorNote error={error} />}
        <div className="flex items-center gap-3">
          <SBtn size="lg" icon="check" disabled={!ready || busy} onClick={save} className="disabled:cursor-not-allowed disabled:opacity-50">{busy ? `Checking with ${tab.via}…` : conn ? 'Save changes' : 'Connect'}</SBtn>
          {!conn && <p className="text-[12px] font-medium text-muted">Until you connect, Bimayantra sends {isWa ? 'WhatsApp messages' : 'emails'} for you.</p>}
        </div>
      </div>

      {conn && (
        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <SHead title="Webhook address" subtitle={isWa ? 'Paste in MSG91 → WhatsApp → Webhook. Delivery reports and STOP replies come back here.' : 'Paste in Brevo → Transactional → Settings → Webhook. Delivery, bounces and unsubscribes come back here.'} />
          <div className="flex items-center gap-2 rounded-[16px] bg-[#0e1f3b] py-2 pr-2 pl-4">
            <span className="min-w-0 flex-1 text-[12px] font-semibold break-all text-[#c9d6ea]">{conn.webhookUrl}</span>
            <SBtn variant="pink" icon="link" onClick={() => copy(conn.webhookUrl)}>Copy</SBtn>
          </div>
          <p className="text-[12px] font-medium text-muted">Keep it private: anyone with this address could post delivery reports for your account.</p>
        </div>
      )}

      {conn && isWa && <Templates conn={conn} />}

      {confirmOff && (
        <ActionDialog title={`Disconnect ${tab.via}?`} tone="danger" confirm="Disconnect" icon={tab.icon}
          body={`Your ${isWa ? 'auth key and number' : 'API key and sender'} are deleted from Bimayantra. ${isWa ? 'WhatsApp messages' : 'Emails'} go through Bimayantra’s account again${isWa ? ', paid from your wallet' : ''}.`}
          busy={busy} error={error} onClose={() => setConfirmOff(false)}
          onConfirm={() => act(() => api.integrations.disconnect(tab.key), { invalidates: ['integrations'], onDone: () => setConfirmOff(false) })} />
      )}
    </>
  )
}

function Templates({ conn }) {
  const c = conn.templateCounts ?? {}
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-4">
      <SHead title="WhatsApp templates on your number" subtitle="Meta approves each template on your number. A message waits until its template is approved." right={
        <div className="flex gap-1.5">
          <SChip tone="green">{c.approved ?? 0} approved</SChip>
          {!!c.pending && <SChip tone="amber">{c.pending} waiting</SChip>}
          {!!c.rejected && <SChip tone="red">{c.rejected} rejected</SChip>}
        </div>
      } />
      {!conn.templates?.length && <p className="text-[13px] font-medium text-muted">Templates are sent to Meta within 10 minutes of connecting.</p>}
      {(conn.templates ?? []).map((t) => (
        <div key={`${t.templateId}-${t.version}`} className="flex items-center gap-3 rounded-[14px] bg-panel px-3.5 py-2.5">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[13px] font-semibold text-ink">{t.name ?? 'Template'}</span>
            {t.status === 'REJECTED' && t.reason && <span className="text-[12px] font-medium text-[#b4323c]">{t.reason}</span>}
          </div>
          <SChip tone={TPL_TONE[t.status] ?? 'gray'}>{TPL_LABEL[t.status] ?? t.status}</SChip>
        </div>
      ))}
    </div>
  )
}

function Input({ label, req, hint, error, children }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-ink">{label}{req && <span className="text-[#b4323c]"> *</span>}</span>
      {children}
      {error ? <span className="text-[12px] font-semibold text-[#b4323c]">{error}</span> : hint && <span className="text-[12px] font-medium text-muted">{hint}</span>}
    </label>
  )
}
