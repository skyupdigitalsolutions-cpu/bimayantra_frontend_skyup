// Settings → Message templates: for each moment (new lead, follow-up, renewal, birthday…), what goes out on each channel.
//   Off            = nothing is sent on this channel
//   Bimayantra     = Bimayantra's ready template (email through your Brevo when connected)
//   My template    = WhatsApp: one of your approved MSG91 templates, each blank {{n}} matched to a value
//                    Email: your own subject and message, with {values}
//   GET /message-rules · PUT /message-rules/:trigger · GET /integrations/msg91/templates
import { useMemo, useState } from 'react'
import { SettingsLayout, SCard, SHead, SChip, SBtn } from '../screens/settings/_parts'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, useQuery } from '../api'
import { ErrorNote, Field, useAct, inputCls } from './kit'
import { ServerNotUpdated, serverMissing } from './Integrations'

const CH = {
  whatsapp: { label: 'WhatsApp', icon: 'chat', via: 'MSG91', provider: 'MSG91' },
  email: { label: 'Email', icon: 'mail', via: 'Brevo', provider: 'BREVO' },
}
const MODE_LABEL = { OFF: 'Off', DEFAULT: 'Bimayantra template', OWN: 'My template' }
/** Example values for the previews. */
const SAMPLE = {
  name: 'Meena', 'customer name': 'Meena', 'customer first name': 'Meena', 'member name': 'Arjun', 'advisor name': 'Asha Rao',
  'advisor mobile': '98765 43210', product: 'Family Shield', 'policy last 4': '4821', 'renewal date': '12-12-2026',
  'follow-up date': '12-12-2026', 'follow-up time': '11:30', 'quotation number': 'QT-202611-00012 R1', link: 'https://app.bimayantra.in/q/abc',
}
const fillNamed = (text) => String(text ?? '').replace(/\{([^{}]+)\}/g, (_m, k) => SAMPLE[k.trim()] ?? `{${k}}`)
const fillBlanks = (text, vars) => String(text ?? '').replace(/\{\{\s*(\d+)\s*\}\}/g, (m, n) => (vars[Number(n) - 1] ? SAMPLE[vars[Number(n) - 1]] ?? `{${vars[Number(n) - 1]}}` : m))

export default function LiveMessageRules() {
  const q = useQuery('message-rules', () => api.messageRules.list())
  const d = q.data
  const waOn = d?.connections?.MSG91 === 'ACTIVE'
  const mailOn = d?.connections?.BREVO === 'ACTIVE'
  const tq = useQuery(['msg91-templates', waOn ? 'on' : 'off'], () => (waOn ? api.integrations.msg91Templates() : Promise.resolve({ data: [] })))
  const usable = (tq.data ?? []).filter((t) => t.status === 'APPROVED' && t.supported)
  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MESSAGE TEMPLATES" title="Message templates" subtitle="Choose what goes out for each moment, and on which channel.">
      {q.error && (serverMissing(q.error) ? <ServerNotUpdated /> : <ErrorNote error={q.error} />)}
      {q.loading && !d && <p className="text-[13px] font-medium text-muted">Loading…</p>}
      {d && (
        <>
          <div className="flex gap-3">
            <Connection on={waOn} status={d.connections.MSG91} ch={CH.whatsapp} off="WhatsApp uses Bimayantra’s templates and number. Connect MSG91 to send your own approved templates from your number." />
            <Connection on={mailOn} status={d.connections.BREVO} ch={CH.email} off="Emails go from Bimayantra’s address. Connect Brevo to send from your own address; your own wording works either way." />
          </div>
          {waOn && tq.error && <ErrorNote error={tq.error} />}
          {d.triggers.map((t) => <TriggerCard key={t.trigger} t={t} waOn={waOn} templates={usable} templatesLoading={waOn && tq.loading && !tq.data} />)}
        </>
      )}
    </SettingsLayout>
  )
}

function Connection({ on, status, ch, off }) {
  return (
    <div className={cx('flex flex-1 items-start gap-3 rounded-[20px] px-4 py-3.5', on ? 'bg-[#eefaf3]' : 'bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]')}>
      <span className={cx('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full', on ? 'bg-[#d4f1e7] text-[#127650]' : 'bg-panel text-muted')}><Icon name={ch.icon} size={17} /></span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className={cx('text-[14px] font-bold', on ? 'text-[#127650]' : 'text-ink')}>
          {ch.label} {on ? `through your ${ch.via}` : status === 'ERROR' ? `· your ${ch.via} needs attention` : `· ${ch.via} not connected`}
        </p>
        {!on && <p className="text-[12px] leading-[18px] font-medium text-muted">{off}</p>}
      </div>
      {!on && <SBtn variant="white" icon="link" to={`/settings/integrations?tab=${ch.via.toLowerCase()}`}>Connect</SBtn>}
    </div>
  )
}

function TriggerCard({ t, waOn, templates, templatesLoading }) {
  const initial = useMemo(() => ({
    whatsapp: t.whatsapp ? { mode: t.whatsapp.mode, templateName: t.whatsapp.templateName ?? '', language: t.whatsapp.language ?? '', variables: t.whatsapp.variables ?? [] } : null,
    email: t.email ? { mode: t.email.mode, subject: t.email.subject ?? '', body: t.email.body ?? '' } : null,
  }), [t])
  const [f, setF] = useState(initial)
  const { act, busy, error, fieldErrors: fe, reset } = useAct()
  const dirty = JSON.stringify(f) !== JSON.stringify(initial)
  const setCh = (k, patch) => { reset(); setF((s) => ({ ...s, [k]: { ...s[k], ...patch } })) }
  const save = () => act(() => api.messageRules.save(t.trigger, {
    ...(f.whatsapp ? { whatsapp: f.whatsapp.mode === 'OWN' ? { mode: 'OWN', templateName: f.whatsapp.templateName, language: f.whatsapp.language || null, variables: f.whatsapp.variables } : { mode: f.whatsapp.mode } } : {}),
    ...(f.email ? { email: f.email.mode === 'OWN' ? { mode: 'OWN', subject: f.email.subject, body: f.email.body } : { mode: f.email.mode } } : {}),
  }), { invalidates: ['message-rules'] })
  const summary = ['whatsapp', 'email'].filter((k) => f[k] && f[k].mode !== 'OFF').map((k) => CH[k].label)
  return (
    <SCard className="gap-4">
      <SHead title={t.label} subtitle={t.when} right={<SChip tone={summary.length ? 'green' : 'gray'}>{summary.length ? `On · ${summary.join(' and ')}` : 'Off'}</SChip>} />
      {t.locked && <p className="flex items-center gap-2 rounded-[14px] bg-[#fbf1e1] px-3.5 py-2.5 text-[13px] font-semibold text-[#8a5a12]"><Icon name="star" size={15} />{t.locked.message}</p>}
      {['whatsapp', 'email'].filter((k) => f[k]).map((k) => (
        <ChannelRow key={k} k={k} t={t} v={f[k]} set={(p) => setCh(k, p)} fe={fe} waOn={waOn} templates={templates} templatesLoading={templatesLoading} disabled={!!t.locked} />
      ))}
      <ErrorNote error={error} />
      <div className="flex items-center gap-3">
        <SBtn icon="check" disabled={!dirty || busy || !!t.locked} onClick={save} className="disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</SBtn>
        {dirty && <SBtn variant="white" onClick={() => { reset(); setF(initial) }}>Undo changes</SBtn>}
      </div>
    </SCard>
  )
}

function ChannelRow({ k, t, v, set, fe, waOn, templates, templatesLoading, disabled }) {
  const ch = CH[k]
  const modes = ['OFF', 'DEFAULT', 'OWN']
  const def = k === 'whatsapp' ? t.defaults?.whatsapp : t.defaults?.email
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-panel p-4">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-[14px] font-bold text-ink"><Icon name={ch.icon} size={17} className="text-muted" />{ch.label}</span>
        <div role="radiogroup" aria-label={`${ch.label} for ${t.label}`} className="ml-auto flex gap-1 rounded-[18px] bg-white p-1">
          {modes.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={v.mode === m} disabled={disabled}
              onClick={() => set({ mode: m })}
              className={cx('rounded-[14px] px-3.5 py-[7px] text-[12px] font-semibold transition disabled:opacity-50', v.mode === m ? 'bg-navy text-white' : 'text-muted hover:text-ink')}>
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>
      {fe[`${k}.mode`] && <p className="text-[12px] font-semibold text-[#b4323c]">{fe[`${k}.mode`]}</p>}
      {v.mode === 'DEFAULT' && <DefaultPreview k={k} def={def} />}
      {v.mode === 'OWN' && k === 'whatsapp' && <OwnWhatsApp t={t} v={v} set={set} fe={fe} waOn={waOn} templates={templates} loading={templatesLoading} />}
      {v.mode === 'OWN' && k === 'email' && <OwnEmail t={t} v={v} set={set} fe={fe} />}
    </div>
  )
}

function DefaultPreview({ k, def }) {
  if (!def) return <p className="text-[12px] font-medium text-muted">Bimayantra’s template for this is not set up yet.</p>
  const subject = k === 'email' ? def.subject : null
  const body = k === 'email' ? def.body : def
  return (
    <div className="flex flex-col gap-1 rounded-[14px] bg-white px-3.5 py-3">
      <p className="text-[11px] font-semibold text-muted">Example</p>
      {subject && <p className="text-[13px] font-bold text-ink">{fillNamed(subject)}</p>}
      <p className="text-[13px] leading-5 font-medium whitespace-pre-line text-ink-2">{fillNamed(body)}</p>
    </div>
  )
}

function OwnWhatsApp({ t, v, set, fe, waOn, templates, loading }) {
  if (!waOn) {
    return (
      <p className="flex items-center gap-2 text-[13px] font-semibold text-[#8a5a12]">
        <Icon name="alert" size={15} />Connect MSG91 in Integrations to use your own templates. Until then Bimayantra’s template is sent.
      </p>
    )
  }
  const chosen = templates.find((x) => x.name === v.templateName && (!v.language || x.language === v.language)) ?? templates.find((x) => x.name === v.templateName)
  const blanks = chosen?.blanks ?? 0
  const pick = (val) => {
    const [name, language] = String(val).split('|')
    const tp = templates.find((x) => x.name === name && x.language === language)
    // Pre-fill the blanks with the trigger's values in order; the advisor adjusts them.
    set({ templateName: name, language, variables: Array.from({ length: tp?.blanks ?? 0 }, (_, i) => v.variables[i] ?? t.variables[i] ?? t.variables[0]) })
  }
  return (
    <div className="flex flex-col gap-3">
      <Field type="select" label="Your MSG91 template" value={v.templateName ? `${v.templateName}|${v.language || chosen?.language || ''}` : ''} onChange={pick}
        placeholder={loading ? 'Loading your templates…' : templates.length ? 'Choose an approved template' : 'No approved templates on your number'}
        options={templates.map((x) => [`${x.name}|${x.language}`, `${x.name} (${x.language}) · ${x.blanks} blank${x.blanks === 1 ? '' : 's'}`])}
        error={fe['whatsapp.templateName']} hint="Only approved templates without an image or document header are listed." />
      {chosen && blanks > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink">What fills each blank</p>
          {Array.from({ length: blanks }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-[52px] shrink-0 rounded-[10px] bg-white py-1.5 text-center text-[12px] font-bold text-ink-2">{`{{${i + 1}}}`}</span>
              <Field type="select" value={v.variables[i] ?? ''} options={t.variables.map((x) => [x, x.charAt(0).toUpperCase() + x.slice(1)])} placeholder="Choose a value"
                onChange={(val) => set({ variables: Array.from({ length: blanks }, (_, j) => (j === i ? val : v.variables[j] ?? '')) })} />
            </div>
          ))}
          {(fe['whatsapp.variables']) && <p className="text-[12px] font-semibold text-[#b4323c]">{fe['whatsapp.variables']}</p>}
        </div>
      )}
      {chosen && (
        <div className="flex flex-col gap-1 rounded-[14px] bg-white px-3.5 py-3">
          <p className="text-[11px] font-semibold text-muted">Example</p>
          <p className="text-[13px] leading-5 font-medium whitespace-pre-line text-ink-2">{fillBlanks(chosen.body, v.variables)}</p>
        </div>
      )}
    </div>
  )
}

function OwnEmail({ t, v, set, fe }) {
  const [focus, setFocus] = useState('body')
  const insert = (x) => set(focus === 'subject' ? { subject: `${v.subject}{${x}}` } : { body: `${v.body}{${x}}` })
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">Subject</span>
        <input value={v.subject} onFocus={() => setFocus('subject')} onChange={(e) => set({ subject: e.target.value })} placeholder={`e.g. ${t.trigger === 'FOLLOW_UP' ? 'Following up on your enquiry, {name}' : 'A note for {name}'}`}
          className={cx(inputCls, 'bg-white', fe['email.subject'] && 'ring-2 ring-[#b4323c]')} />
        {fe['email.subject'] && <span className="text-[12px] font-semibold text-[#b4323c]">{fe['email.subject']}</span>}
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">Message</span>
        <textarea value={v.body} onFocus={() => setFocus('body')} onChange={(e) => set({ body: e.target.value })} rows={6}
          placeholder={'Dear {name},\n\n…\n\nRegards,\n{advisor name}'}
          className={cx(inputCls, 'h-auto resize-y bg-white py-3 leading-5', fe['email.body'] && 'ring-2 ring-[#b4323c]')} />
        {fe['email.body'] && <span className="text-[12px] font-semibold text-[#b4323c]">{fe['email.body']}</span>}
      </label>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[12px] font-medium text-muted">Insert:</span>
        {t.variables.map((x) => (
          <button key={x} type="button" onClick={() => insert(x)} className="rounded-[10px] bg-white px-2.5 py-1 text-[12px] font-semibold text-ink-2 hover:text-ink">{`{${x}}`}</button>
        ))}
      </div>
      {(v.subject || v.body) && (
        <div className="flex flex-col gap-1 rounded-[14px] bg-white px-3.5 py-3">
          <p className="text-[11px] font-semibold text-muted">Example</p>
          {v.subject && <p className="text-[13px] font-bold text-ink">{fillNamed(v.subject)}</p>}
          <p className="text-[13px] leading-5 font-medium whitespace-pre-line text-ink-2">{fillNamed(v.body)}</p>
        </div>
      )}
    </div>
  )
}
