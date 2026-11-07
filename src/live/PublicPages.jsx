// Batch 16 · Public pages (no sign-in) on the live API.
//   19   /q/:token  the customer's quotation link (GET /public/q/:token); viewing it is recorded for the advisor
//   QX1  the same link once the quotation is no longer live or in date (QT-20, with the advisor's name and mobile)
//   20   /r/:code   a referrer's link: the referral form (GET/POST /public/r/:code)
//   RX1  the same link once the code is revoked or the referrer disabled (REF-04)
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { api, useQuery } from '../api'
import { fmtMoney, initials } from '../api/format'
import { ErrorNote, Field } from './kit'

const SH = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.12)]'
const money = (v) => fmtMoney(v, { decimals: 2 })
const waLink = (mobile) => (mobile ? `https://wa.me/91${String(mobile).replace(/\D/g, '').slice(-10)}` : null)
const tel = (mobile) => (mobile ? `tel:+91${String(mobile).replace(/\D/g, '').slice(-10)}` : null)
const showMobile = (m) => { const d = String(m ?? '').replace(/\D/g, '').slice(-10); return d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : m }
// "DD-MM-YYYY" → "08 Nov 2026"
const longDate = (dmy) => {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dmy ?? '')) return dmy ?? ''
  const [d, m, y] = dmy.split('-')
  return new Date(Date.UTC(+y, +m - 1, +d, 12)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function Shell({ advisor, children }) {
  return (
    <div className="min-h-screen bg-[#f4f6fb] bg-[radial-gradient(ellipse_at_top_right,#f6d7e0_0%,transparent_45%)] px-4 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        {advisor && (
          <header className={`flex flex-wrap items-center gap-4 rounded-[28px] bg-white px-6 py-4 ${SH}`}>
            <span className="flex size-11 items-center justify-center rounded-full bg-pink-200 text-[14px] font-bold text-navy">{initials(advisor.name)}</span>
            <div className="flex min-w-0 flex-1 flex-col"><p className="text-[16px] font-bold text-ink">{advisor.name}</p>{advisor.businessName && advisor.businessName !== advisor.name && <p className="text-[12px] font-medium text-muted">{advisor.businessName}</p>}</div>
            {advisor.mobile && <a href={tel(advisor.mobile)} className="flex h-9 items-center gap-2 rounded-[18px] border border-line px-3.5 text-[13px] font-semibold text-ink"><Icon name="phone" size={15} />Call {showMobile(advisor.mobile)}</a>}
            {advisor.mobile && <a href={waLink(advisor.mobile)} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-2 rounded-[18px] bg-navy px-3.5 text-[13px] font-semibold text-white"><Icon name="chat" size={15} />WhatsApp</a>}
          </header>
        )}
        {children}
        <p className="text-[12px] font-medium text-muted">Shared through Bimayantra. Your advisor shares this page; it is not a customer account.</p>
      </div>
    </div>
  )
}

function Notice({ icon = 'clock', title, text }) {
  return (
    <div className={`mx-auto mt-20 flex w-full max-w-[560px] flex-col items-center gap-4 rounded-[32px] bg-white px-10 py-10 text-center ${SH}`}>
      <span className="flex size-20 items-center justify-center rounded-full bg-[#fbf1e1]"><Icon name={icon} size={28} className="text-[#8a5a12]" /></span>
      <p className="text-[26px] font-bold tracking-[-0.4px] text-ink">{title}</p>
      <p className="text-[14px] font-medium text-muted">{text}</p>
    </div>
  )
}

export function PublicQuotation() {
  const { token } = useParams()
  const q = useQuery(['public-quotation', token], () => api.public.quotation(token))
  if (q.error) return <Shell><Notice icon="alert" title="This link does not work" text={q.error.status === 404 ? 'Check that the whole link was copied, or ask your advisor to share the quotation again.' : q.error.message} /></Shell>
  if (!q.data) return <Shell><p className="mt-20 text-center text-[14px] font-medium text-muted">Opening your quotation…</p></Shell>
  const d = q.data
  if (!d.valid) return <Shell><Notice title="This quotation link has expired" text={d.message} /></Shell>
  const b = d.breakdown ?? {}
  const first = String(d.customer ?? '').split(' ')[0]
  const ridersTotal = b.ridersTotal ?? (b.riders ?? []).reduce((t, r) => t + (r.amount ?? 0), 0)
  return (
    <Shell advisor={d.advisor}>
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-[320px] flex-[1_1_640px] flex-col gap-5">
          <section className="flex flex-col gap-3 rounded-[32px] bg-linear-to-b from-[#f9d0db] to-[#f3b3c4] px-8 py-7">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-[12px] bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-[#b4323c]"><Icon name="quote" size={13} />Quotation</span>
              <span className="flex items-center gap-1 rounded-[12px] bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-ink"><Icon name="clock" size={13} />Valid until {longDate(d.validUntil)}</span>
            </div>
            <h1 className="text-[34px] font-bold tracking-[-0.7px] text-navy">Your quotation, {first}</h1>
            <p className="text-[14px] font-medium text-ink-2">{d.number} · R{d.revision}</p>
          </section>
          <section className={`flex flex-col gap-5 rounded-[32px] bg-white p-6 ${SH}`}>
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#fde4e8]"><Icon name="heart" size={22} className="text-[#b4323c]" /></span>
              <div className="flex flex-col"><p className="text-[20px] font-bold text-ink">{[d.insurer?.name, d.product?.name, d.product?.variantName].filter(Boolean).join(' ')}</p>
                {d.product?.uin && <p className="text-[12px] font-medium text-muted">UIN {d.product.uin}</p>}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[['users', 'Covers', (d.people ?? []).map((p) => p.name.split(' ')[0]).join(', ')], ['shield', 'Sum insured', fmtMoney(d.sumInsured)], ['calendar', 'Starts', longDate(d.startDate)]].map(([icon, k, v]) => (
                <div key={k} className="flex flex-col gap-1 rounded-[20px] bg-panel p-4"><Icon name={icon} size={18} className="text-ink" /><p className="mt-1 text-[12px] font-medium text-muted">{k}</p><p className="text-[15px] font-bold text-ink">{v}</p></div>
              ))}
            </div>
            {d.policyTerm && <p className="text-[13px] font-medium text-muted">Policy term: {d.policyTerm} year{d.policyTerm === 1 ? '' : 's'}</p>}
          </section>
          {d.disclaimer && <p className="text-[12px] leading-[18px] font-medium text-muted">{d.disclaimer}</p>}
        </div>
        <div className="flex min-w-[300px] flex-[1_1_380px] flex-col gap-5">
          <section className={`flex flex-col gap-3 rounded-[32px] bg-white p-6 ${SH}`}>
            <p className="text-[18px] font-bold text-ink">Premium</p>
            <Line k="Base premium" v={money(b.base)} />
            <Line k="Riders" v={money(ridersTotal)} />
            {!!b.discount && <Line k="Discount" v={`− ${money(b.discount)}`} />}
            <Line k={`GST${b.taxPercent != null ? ` ${b.taxPercent}%` : ''}`} v={money(b.tax)} />
            <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3"><span className="text-[15px] font-bold text-ink">Total</span><span className="text-[28px] font-bold text-navy">{money(b.final)}</span></div>
            {d.payment?.link && (
              <>
                <a href={d.payment.link} target="_blank" rel="noreferrer noopener" className="mt-2 flex h-[54px] items-center justify-center gap-2 rounded-[27px] bg-navy text-[15px] font-semibold text-white"><Icon name="arrow" size={16} />Pay on {d.payment.payOn} website</a>
                <p className="flex items-start gap-2 rounded-[16px] bg-[#e7f4ee] px-4 py-3 text-[12px] font-semibold text-[#127650]"><Icon name="lock" size={14} className="mt-px shrink-0" />Opens {d.payment.domain}. You pay the insurer directly, not Bimayantra.</p>
              </>
            )}
            {d.payment?.message && <p className="flex items-start gap-2 rounded-[16px] bg-[#e7f4ee] px-4 py-3 text-[13px] font-semibold text-[#127650]"><Icon name="check" size={14} className="mt-px shrink-0" />{d.payment.message}</p>}
          </section>
          <section className="flex flex-col gap-2 rounded-[28px] bg-white/70 p-6">
            <p className="text-[16px] font-bold text-ink">Questions?</p>
            <p className="text-[13px] font-medium text-muted">Reply to {d.advisor?.name?.split(' ')[0] ?? 'your advisor'} on WhatsApp or call. They can revise this quotation for you.</p>
          </section>
        </div>
      </div>
    </Shell>
  )
}

const Line = ({ k, v }) => <div className="flex justify-between text-[14px]"><span className="font-medium text-muted">{k}</span><span className="font-semibold text-ink">{v}</span></div>

/* ═════════════ 20 · Public referral form · RX1 link expired or revoked ═════════════ */
export function PublicReferral() {
  const { code } = useParams()
  const q = useQuery(['public-referral', code], () => api.public.referral(code))
  const [f, setF] = useState({ name: '', mobile: '', email: '', relation: '', interest: '', city: '', message: '', permission: false, website: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)
  if (q.error) return <Shell><Notice icon="alert" title="This link does not work" text={q.error.message} /></Shell>
  if (!q.data) return <Shell><p className="mt-20 text-center text-[14px] font-medium text-muted">Opening…</p></Shell>
  const d = q.data
  if (!d.valid) return <Shell><Notice icon="lock" title="This referral link is no longer active" text={d.message} /></Shell>
  if (done) return <Shell><Notice icon="check" title="Thank you" text={done} /></Shell>
  const fe = error?.fieldErrors ?? {}
  const submit = async () => {
    setBusy(true); setError(null)
    try {
      const r = await api.public.submitReferral(code, {
        name: f.name.trim(), mobile: f.mobile.replace(/\D/g, ''), email: f.email.trim() || null, relation: f.relation, interest: f.interest,
        city: f.city.trim() || null, message: f.message.trim() || null, permission: f.permission, ...(f.website ? { website: f.website } : {}),
      })
      setDone(r.meta?.message ?? 'Your details were sent.')
    } catch (e) { setError(e) } finally { setBusy(false) }
  }
  const ready = f.name.trim() && f.mobile.trim() && f.relation && f.interest && f.permission
  return (
    <Shell advisor={{ name: d.advisorName, businessName: d.businessName }}>
      <div className="flex flex-wrap items-start gap-8">
        <section className="flex min-w-[300px] flex-[1_1_380px] flex-col gap-3 rounded-[32px] bg-linear-to-b from-[#f9d0db] to-[#f3b3c4] px-8 py-7">
          <span className="w-fit rounded-[12px] bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-[#b4323c]">Referred by {d.referrerFirstName}</span>
          <h1 className="text-[32px] font-bold tracking-[-0.6px] text-navy">Get insurance advice from {d.advisorName}</h1>
          <p className="text-[14px] font-medium text-ink-2">{d.referrerFirstName} thinks {d.advisorName.split(' ')[0]} can help you. Leave your details and you will get a call or WhatsApp message.</p>
        </section>
        <section className={`flex min-w-[320px] flex-[1_1_600px] flex-col gap-4 rounded-[32px] bg-white p-7 ${SH}`}>
          <div className="flex flex-wrap gap-3">
            <Field label="Your name *" value={f.name} onChange={set('name')} error={fe.name} />
            <Field label="Mobile *" value={f.mobile} onChange={set('mobile')} error={fe.mobile} inputMode="tel" placeholder="10-digit number" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Field label="Email" type="email" value={f.email} onChange={set('email')} error={fe.email} />
            <Field label="City" value={f.city} onChange={set('city')} error={fe.city} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Field label={`How you know ${d.referrerFirstName} *`} type="select" value={f.relation} onChange={set('relation')} error={fe.relation} options={[{ value: '', label: 'Choose' }, ...(d.relations ?? []).map((r) => ({ value: r, label: r }))]} />
            <Field label="Insurance you are interested in *" type="select" value={f.interest} onChange={set('interest')} error={fe.interest} options={[{ value: '', label: 'Choose' }, ...(d.interests ?? []).map((r) => ({ value: r, label: r }))]} />
          </div>
          <Field label="Message" type="textarea" value={f.message} onChange={set('message')} error={fe.message} />
          {/* Invisible to people; bots fill it and the API quietly ignores the submission. */}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => set('website')(e.target.value)} className="absolute left-[-9999px] h-px w-px opacity-0" />
          <Field type="checkbox" label={d.permission} value={f.permission} onChange={set('permission')} />
          {fe.permission && <p className="text-[12px] font-semibold text-[#b4323c]">{fe.permission}</p>}
          <ErrorNote error={error} />
          <button type="button" disabled={busy || !ready} onClick={submit} className="flex h-[52px] items-center justify-center gap-2 rounded-[26px] bg-navy text-[15px] font-semibold text-white disabled:opacity-50"><Icon name="send" size={16} />{busy ? 'Sending…' : 'Send my details'}</button>
        </section>
      </div>
    </Shell>
  )
}
