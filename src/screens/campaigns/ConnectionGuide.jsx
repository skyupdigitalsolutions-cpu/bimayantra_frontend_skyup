// /campaigns/guide · Campaigns — Connection guide (no Figma frame; built in the Campaigns design language)
// Long-form version with sources: docs/INTEGRATIONS.md
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { cx } from '../../components/ui'
import { connectionGuide, GUIDE_TAGS, guideCheckedOn } from '../../data/campaigns'
import { Icon, PageHead, PillTabs, Pill, Btn, CardHead, Box, cardCls } from './_parts'

const TABS = Object.values(connectionGuide).map((g) => ({ key: g.key, label: g.label }))

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  fallbackCopy(text)
  return Promise.resolve()
}
function fallbackCopy(text) {
  const t = document.createElement('textarea')
  t.value = text
  t.setAttribute('readonly', '')
  t.style.position = 'fixed'
  t.style.opacity = '0'
  document.body.appendChild(t)
  t.select()
  try { document.execCommand('copy') } catch { /* ignore */ }
  t.remove()
}

/** Read-only value with copy button; `secret` values are masked until revealed. */
function CopyField({ label, value, note, secret, code }) {
  const [copied, setCopied] = useState(false)
  const [shown, setShown] = useState(!secret)
  const copy = () => {
    copyText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const display = shown ? value : `${value.slice(0, 8)}${'•'.repeat(14)}`
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        {secret && <Pill tone="pink" icon="lock" className="h-[22px] px-2.5 text-[11px]">Secret</Pill>}
        <span className="flex-1" />
        {note && <span className="text-[11px] font-medium text-muted">{note}</span>}
      </div>
      <div className={cx('flex min-h-[50px] items-center gap-2 rounded-[16px] py-2 pr-2 pl-4', code ? 'bg-[#0e1f3b]' : 'bg-panel')}>
        <span className={cx('min-w-0 flex-1 text-[13px] leading-[18px] font-semibold break-all', code ? 'font-sans text-[#c9d6ea]' : 'text-ink')}>{display}</span>
        {secret && (
          <button
            type="button"
            aria-label={shown ? `Hide ${label}` : `Show ${label}`}
            onClick={() => setShown((s) => !s)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink hover:bg-tile"
          >
            <Icon name="eye" size={16} />
          </button>
        )}
        <Btn size="sm" variant={code ? 'pink' : 'outline'} icon={copied ? 'check' : 'link'} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Btn>
      </div>
    </div>
  )
}

function StepNo({ n }) {
  return (
    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">{n}</span>
  )
}

function NeedRow({ item, checked, onToggle }) {
  const tag = GUIDE_TAGS[item.tag]
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cx('flex w-full items-start gap-3 rounded-[16px] p-3 text-left', checked ? 'border border-[#c7ebda] bg-[#f5fbf8]' : 'bg-panel hover:bg-panel-2')}
    >
      <Box checked={checked} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] leading-4 font-bold text-ink">{item.name}</p>
          <Pill tone={tag.tone} icon={tag.icon} className="h-[22px] px-2.5 text-[11px]">{tag.label}</Pill>
        </div>
        <p className="text-[12px] leading-[16px] font-medium text-muted">{item.where}</p>
        {item.env && <p className="font-sans text-[11px] font-bold tracking-[0.2px] text-slate">{item.env}</p>}
      </div>
    </button>
  )
}

function Checklist({ g }) {
  const [done, setDone] = useState(() => g.needs.map(() => false))
  const count = done.filter(Boolean).length
  return (
    <div className={cx('flex flex-col gap-2.5 p-6', cardCls)}>
      <CardHead
        title="What you’ll need"
        sub={`${count} of ${g.needs.length} ready · tick as you collect them`}
        right={count > 0 && (
          <button type="button" onClick={() => setDone(g.needs.map(() => false))} className="text-[12px] font-bold text-[#1f5fd6] hover:underline">Reset</button>
        )}
      />
      {g.needs.map((n, i) => (
        <NeedRow key={n.name} item={n} checked={done[i]} onToggle={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))} />
      ))}
      <div className="mt-1 flex items-start gap-2.5 rounded-[14px] bg-[#fbf1e1] px-3.5 py-3 text-[12px] leading-[17px] font-semibold text-[#8a5a12]">
        <Icon name="alert" size={15} className="mt-px shrink-0" />
        <p>Anything marked Secret lives only in the API server’s .env (Railway variables). Per-advisor tokens are stored encrypted. None of them are ever sent to the browser.</p>
      </div>
    </div>
  )
}

export default function ConnectionGuide() {
  const [params, setParams] = useSearchParams()
  const tab = connectionGuide[params.get('tab')] ? params.get('tab') : 'meta'
  const g = connectionGuide[tab]
  const setTab = (k) => setParams(k === 'meta' ? {} : { tab: k }, { replace: true })
  let n = 0

  return (
    <AppLayout active="campaigns">
      <PageHead
        crumb="CAMPAIGNS  /  CONNECTION GUIDE"
        title="Connection guide"
        sub="What you need from Meta, Google and your website, and how each connection works."
        actions={
          <>
            <Btn icon="arrow" to="/campaigns" className="[&_svg]:rotate-180">Back to campaigns</Btn>
            <Btn variant="pink" icon={g.banner.icon} to={g.connectTo}>{g.connectLabel}</Btn>
          </>
        }
      />

      <div className="mt-[13px] flex items-center gap-3">
        <PillTabs items={TABS} value={tab} onChange={setTab} />
        <span className="flex-1" />
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
          <Icon name="check" size={13} />
          Checked against official docs · {guideCheckedOn}
        </span>
      </div>

      <div className="mt-3 flex h-[78px] items-center gap-3.5 rounded-[20px] px-[18px]" style={{ background: g.banner.bg }}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white" style={{ color: g.banner.iconColor }}>
          <Icon name={g.banner.icon} size={18} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[15px] font-bold text-ink">{g.banner.title}</p>
          <p className="text-[12px] font-medium text-ink-2">{g.banner.sub}</p>
        </div>
        {g.banner.stats.map(([k, v]) => (
          <div key={k} className="flex h-[50px] shrink-0 flex-col gap-px rounded-[14px] bg-white/80 px-3.5 py-2">
            <p className="text-[11px] font-semibold whitespace-nowrap text-muted">{k}</p>
            <p className="text-[14px] font-bold whitespace-nowrap text-ink">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-5">
        {/* Left: steps, endpoint, mapping */}
        <div className="flex w-[700px] shrink-0 flex-col gap-5">
          <div className={cx('flex flex-col gap-5 p-6', cardCls)}>
            <CardHead title="How to connect" sub="Follow the steps in order" />
            {g.phases.map((ph) => (
              <div key={ph.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <p className="text-[10px] leading-[13px] font-bold tracking-[0.6px] text-muted uppercase">{ph.title}</p>
                  <span className="h-px flex-1 bg-[#e8ecf3]" />
                  <Pill tone="blue" icon="users" className="h-[22px] px-2.5 text-[11px]">{ph.who}</Pill>
                </div>
                {ph.steps.map((s) => {
                  n += 1
                  return (
                    <div key={s.title} className="flex gap-3.5 rounded-[16px] bg-[#fafbfd] p-3.5">
                      <StepNo n={n} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="text-[14px] leading-[20px] font-bold text-ink">{s.title}</p>
                        <p className="text-[13px] leading-[19px] font-medium text-slate">{s.body}</p>
                        {s.code && (
                          <span className="mt-1 w-fit rounded-[10px] bg-panel px-2.5 py-1 font-sans text-[12px] font-bold text-ink">{s.code}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className={cx('flex flex-col gap-4 p-6', cardCls)}>
            <CardHead title="Webhook details" sub={tab === 'website' ? 'Use these on your site or give them to your developer' : `Paste these into ${g.label}`} />
            {g.fields.map((f) => <CopyField key={f.label} {...f} />)}
          </div>

          <div className={cx('flex flex-col gap-1.5 p-6', cardCls)}>
            <CardHead title="Field mapping" sub={`${g.label} field → lead field in Bimayantra · change it any time in Map fields`} />
            <div className="mt-2 flex flex-col gap-1 rounded-[18px] bg-panel p-2">
              <div className="flex h-[25px] items-start gap-3 px-2.5 pt-1.5 text-[10px] font-bold tracking-[0.6px] text-muted">
                <span className="w-[200px]">BIMAYANTRA LEAD FIELD</span>
                <span className="w-6" />
                <span>{g.label.toUpperCase()} FIELD</span>
              </div>
              {g.mapping.map(([to, from]) => (
                <div key={to} className="flex items-center gap-3 rounded-[12px] bg-white px-3 py-2.5">
                  <span className="w-[188px] shrink-0 text-[13px] font-bold text-ink">{to}</span>
                  <span className="flex w-6 shrink-0"><Icon name="arrow" size={15} className="rotate-180 text-muted" /></span>
                  <span className="min-w-0 flex-1 font-sans text-[13px] font-semibold text-ink-2">{from}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: checklist, testing, errors, docs */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Checklist key={tab} g={g} />

          <div className={cx('flex flex-col gap-2.5 p-6', cardCls)}>
            <CardHead title="Test it" />
            {g.tests.map(([t, d]) => (
              <div key={t} className="flex items-start gap-2.5">
                <span className="mt-px flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]">
                  <Icon name="check" size={13} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-bold text-ink">{t}</p>
                  <p className="text-[12px] leading-[17px] font-medium text-muted">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={cx('flex flex-col gap-2 p-6', cardCls)}>
            <CardHead title="If something goes wrong" />
            {g.errors.map(([t, d]) => (
              <div key={t} className="flex flex-col gap-0.5 rounded-[14px] bg-panel px-3.5 py-2.5">
                <p className="text-[13px] font-bold text-ink">{t}</p>
                <p className="text-[12px] leading-[17px] font-medium text-muted">{d}</p>
              </div>
            ))}
          </div>

          <div className={cx('flex flex-col gap-1 p-6', cardCls)}>
            <CardHead title="Official docs" sub="Opens in a new tab" />
            {g.docs.map(([t, url]) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex h-10 items-center gap-2.5 rounded-[14px] bg-panel px-3 text-[13px] font-semibold text-ink hover:bg-tile"
              >
                <Icon name="link" size={14} className="shrink-0 text-[#1f5fd6]" />
                <span className="min-w-0 flex-1 truncate">{t}</span>
                <Icon name="chev-right" size={14} className="shrink-0 text-muted" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
