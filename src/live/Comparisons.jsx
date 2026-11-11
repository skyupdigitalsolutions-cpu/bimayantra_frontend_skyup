// CQ2–CQ9 Comparison wizard · C2 shared · C3 customer chose · CX1 expired (public) — on the live API.
// The Figma shows an 8-step wizard: Customer → Type → Insurance → Options → Details → Premiums → Recommend → Review
// The backend uses a single PUT /comparisons/:id to save the entire draft, so steps are local UI state.
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Stepper, cx } from '../components/ui'
import { Header, HeadButton, Panel, PanelHead, SmallButton, StatusChip, DataTable, IdCell, RowChevron } from '../screens/catalogue/_parts'
import { api, useQuery, useDebounced, invalidate } from '../api'
import { fmtDate, fmtDateTime, fmtMoney, istDay } from '../api/format'
import { ActionDialog, Field, ErrorNote, useAct, label, dmy, isoDay, inputCls } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { useToast } from '../components/LiveToast'
import { matchesQuery, useHeaderSearch } from '../screens/tasks/_filter'

const TONE = { DRAFT: 'neutral', READY: 'sky', SHARED: 'violet', PRODUCT_CHOSEN: 'green', EXPIRED: 'amber' }
// Figma CQ2–CQ9: 8-step stepper
const STEPS = ['Customer', 'Type', 'Insurance', 'Options', 'Details', 'Premiums', 'Recommend', 'Review']
const lakh = (n) => (n >= 10_000_000 ? `₹${n / 10_000_000} crore` : n >= 100_000 ? `₹${n / 100_000} lakh` : fmtMoney(n))

// Icon + colour for each insurance type name
const TYPE_META = {
  health: { icon: 'heart', bg: 'bg-[#fde8ec]' },
  motor: { icon: 'car', bg: 'bg-[#d9eafd]' },
  life: { icon: 'users', bg: 'bg-[#e9e3fc]' },
  term: { icon: 'umbrella', bg: 'bg-[#fde8c9]' },
  travel: { icon: 'plane', bg: 'bg-[#d4f1e7]' },
  home: { icon: 'box', bg: 'bg-[#fde8c9]' },
  personal: { icon: 'shield', bg: 'bg-[#e9e3fc]' },
}
function typeMeta(name) {
  const k = (name || '').toLowerCase()
  for (const [prefix, meta] of Object.entries(TYPE_META)) if (k.includes(prefix)) return meta
  return { icon: 'box', bg: 'bg-panel' }
}

const CARD = 'rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

/* ═════════════ list ═════════════ */
export function LiveComparisons() {
  const q = useQuery('comparisons', () => api.comparisons.list())
  const [pick, setPick] = useState(false)
  const [hq, clearQ] = useHeaderSearch()
  const rows = (q.data || []).filter((r) => matchesQuery(hq, r.number, label(r.status), r.customer?.name, r.customerName, (r.options || []).map((o) => [o.productName, o.insurer, o.name])))
  const columns = [
    { key: 'n', label: 'Comparison', width: 260, render: (r) => <IdCell initials="CQ" bg="bg-[#e9e3fc]" title={r.number ?? 'Draft'} sub={`${(r.options || []).length} products`} /> },
    { key: 'v', label: 'Valid till', width: 140, render: (r) => (r.validUntil ? fmtDate(isoDay(r.validUntil), { year: false }) : '—') },
    { key: 'views', label: 'Viewed', width: 100, render: (r) => `${r.viewed}×` },
    { key: 'u', label: 'Updated', width: 150, render: (r) => fmtDate(r.updatedAt, { year: false }) },
    { key: 's', label: 'Status', width: 150, render: (r) => <StatusChip tone={TONE[r.status]}>{label(r.status)}</StatusChip> },
    { key: 'go', label: '', width: 40, render: (_r, hot) => <RowChevron on={hot} /> },
  ]
  return (
    <AppLayout active="quotations">
      <Header breadcrumb={'SALES  /  COMPARISONS'} title="Comparisons" subtitle="Several products side by side in one PDF. The customer picks one; you turn it into a quotation." actions={<HeadButton icon="plus" onClick={() => setPick(true)}>New comparison</HeadButton>} />
      <DataTable className="mt-7 w-[1180px]" columns={columns} rows={rows} rowTo={(r) => `/comparisons/${r.id}`} empty={q.loading ? 'Loading…' : hq.trim() ? `No comparisons match "${hq.trim()}".` : 'No comparisons yet.'} />
      {hq.trim() && !rows.length && !q.loading && <button type="button" onClick={clearQ} className="mt-3 text-[13px] font-bold text-blue hover:underline">Clear search</button>}
      {pick && <PickCustomer onClose={() => setPick(false)} />}
    </AppLayout>
  )
}
function PickCustomer({ onClose }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const dq = useDebounced(q, 300)
  const hits = useQuery(['customers', 'pick', dq], () => api.customers.list({ status: 'ACTIVE', search: dq || undefined, limit: 8 }))
  const { act, busy, error } = useAct()
  const start = (c) => act(() => api.comparisons.create({ customerId: c.id }), { invalidates: ['comparisons'], quiet: true, success: 'Comparison started.', onDone: (r) => navigate(`/comparisons/${r.data.id}`) })
  return (
    <ActionDialog title="New comparison" body="Step 1 · who is it for?" error={error} onClose={onClose}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search policy holder" className={inputCls} autoFocus />
      {(hits.data || []).map((c) => <button key={c.id} type="button" disabled={busy} onClick={() => start(c)} className="rounded-[12px] px-3 py-2.5 text-left text-[13px] font-semibold text-ink hover:bg-panel-2">{c.name} <span className="text-muted">· {c.number}</span></button>)}
    </ActionDialog>
  )
}
export function LiveNewComparison() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const { toastError } = useToast()
  useEffect(() => {
    const cid = sp.get('customerId')
    if (!cid) { navigate('/comparisons', { replace: true }); return }
    api.comparisons.create({ customerId: cid }).then((r) => { invalidate('comparisons'); navigate(`/comparisons/${r.data.id}`, { replace: true }) }).catch((e) => { toastError(e); navigate('/comparisons', { replace: true }) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <LoadingPanel active="quotations" />
}

/* ═════════════ one comparison ═════════════ */
export function LiveComparison() {
  const { id } = useParams()
  const q = useQuery(['comparison', id], () => api.comparisons.get(id))
  if (q.error) return <ErrorPanel active="quotations" error={q.error} back="/comparisons" />
  if (!q.data) return <LoadingPanel active="quotations" />
  return q.data.status === 'DRAFT' ? <Editor key={q.data.version} c={q.data} /> : <Generated c={q.data} />
}

/* ═════════════ wizard editor (Figma CQ2–CQ8) ═════════════ */

function Editor({ c }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const customer = useQuery(['customer', c.customerId], () => api.customers.get(c.customerId))
  const types = useQuery('quotation-choices', () => api.quotations.choices({}))
  const [inp, setInp] = useState({ typeId: '', people: [], sumInsured: '', policyTerm: '', startDate: istDay(), answers: {}, ...(c.inputs || {}) })
  const [opts, setOpts] = useState(c.options || [])
  const [rec, setRec] = useState({ id: c.recommendedProductId ?? '', reason: c.recommendedReason ?? '' })
  const prods = useQuery(['products', 'type', inp.typeId], () => api.products.list({ typeId: inp.typeId }), { enabled: !!inp.typeId })
  const [preview, setPreview] = useState(null)
  const [ver, setVer] = useState(c.version)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const fe = error?.fieldErrors ?? {}
  const P = (prods.data || []).filter((p) => p.canQuote ?? p.quotable)
  const everyone = customer.data ? [{ key: `C:${customer.data.id}`, name: customer.data.name, rel: 'Self', dob: customer.data.dob }, ...(customer.data.family || []).filter((m) => m.status === 'ACTIVE').map((m) => ({ key: `F:${m.id}`, name: m.name, rel: m.relationship, dob: m.dob }))] : []

  // Wizard step (0-based). Customer (0) and Type (1) are already done when the editor opens.
  const [step, setStep] = useState(() => {
    if (!inp.typeId) return 2 // Insurance
    if (opts.length < 2) return 3 // Options
    if (!inp.people.length || !inp.sumInsured) return 4 // Details
    return 5 // Premiums
  })

  const save = async () => {
    const body = {
      version: ver,
      inputs: { ...(inp.typeId ? { typeId: inp.typeId } : {}), people: inp.people, ...(inp.sumInsured ? { sumInsured: Number(inp.sumInsured) } : {}), ...(inp.policyTerm ? { policyTerm: Number(inp.policyTerm) } : {}), ...(inp.startDate ? { startDate: dmy(isoDay(inp.startDate)) } : {}), answers: inp.answers || {} },
      options: opts.map((o) => ({ productId: o.productId, ...(o.manual?.netPremium ? { manual: { netPremium: Number(o.manual.netPremium), taxAmount: Number(o.manual.taxAmount || 0) } } : {}), ...(o.typedBasePremium ? { typedBasePremium: Number(o.typedBasePremium) } : {}) })),
      recommendedProductId: rec.id || null, recommendedReason: rec.reason || null,
    }
    const r = await api.comparisons.save(c.id, body)
    setVer(r.data.version)
    return r.data
  }
  const run = async (fn) => { setBusy(true); setError(null); try { await fn() } catch (e) { setError(e) } finally { setBusy(false) } }
  const doPreview = () => run(async () => { await save(); setPreview((await api.comparisons.preview(c.id, {})).data) })
  const doGenerate = () => run(async () => { await save(); const r = await api.comparisons.generate(c.id, {}); toast(r.meta?.message || 'Comparison generated.'); invalidate('comparison', 'comparisons'); navigate(`/comparisons/${c.id}`, { replace: true }) })

  const canNext = [
    true, true, !!inp.typeId, opts.length >= 2,
    !!(inp.people.length && inp.sumInsured && inp.policyTerm && inp.startDate),
    !!preview, !!rec.id, !!preview,
  ][step]

  const nextLabels = ['', '', 'Next: Options', 'Next: Details', 'Next: Premiums', 'Next: Recommend', 'Next: Review', '']

  const handleNext = () => {
    setError(null)
    // At step 5 (Premiums), save + preview before advancing
    if (step === 5 && !preview) { doPreview(); return }
    if (step < 7) setStep(step + 1)
  }

  // Summary values for the pink panel
  const typeName = (types.data?.types ?? []).find((t) => t.id === inp.typeId)?.name

  return (
    <AppLayout active="quotations">
      <Header back="/comparisons" breadcrumb={'QUOTATIONS  /  NEW COMPARISON'} title="New comparative quotation"
        titleExtra={<span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#127650]"><Icon name="check" size={13} />Draft saved</span>}
        subtitle={customer.data ? `${customer.data.name} · 2 to 3 options side by side` : '2 to 3 options side by side'} />
      <Stepper className="mt-4" steps={STEPS} current={step} />

      <div className="mt-5 flex items-start gap-5">
        {/* Main wizard card */}
        <div className={cx('flex min-w-0 flex-1 flex-col gap-5', CARD)}>

          {/* Step 2: Insurance type (CQ3) */}
          {step === 2 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Insurance type</p><p className="text-[12px] font-medium text-muted">All options must be the same type</p></div>
              {(types.data?.types ?? []).length > 0 && (
                <div className="flex flex-wrap items-start gap-3">
                  {(types.data?.types ?? []).map((t) => {
                    const m = typeMeta(t.name)
                    const on = inp.typeId === t.id
                    return (
                      <button key={t.id} type="button" onClick={() => { setInp({ ...inp, typeId: t.id }); setOpts([]); setPreview(null) }}
                        className={cx('flex flex-col items-center justify-center gap-2.5 rounded-[22px] p-4', m.bg, on ? 'h-[113px] w-[137px] border-[2.5px] border-blue' : 'h-[108px] w-[132px]')}>
                        <span className="flex size-12 items-center justify-center rounded-full bg-white/90"><Icon name={m.icon} size={22} className="text-ink" /></span>
                        <span className="text-[14px] font-bold text-ink">{t.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* Step 3: Options — pick 2–3 products (CQ4) */}
          {step === 3 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Options</p><p className="text-[12px] font-medium text-muted">Pick 2 to 3 products or variants. Insurers with an active agent code only.</p></div>
              <div className="flex flex-col gap-3">
                {P.map((p) => {
                  const on = opts.some((o) => o.productId === p.id)
                  return (
                    <button key={p.id} type="button" disabled={!on && opts.length >= 5}
                      onClick={() => { setOpts(on ? opts.filter((o) => o.productId !== p.id) : [...opts, { productId: p.id }]); setPreview(null) }}
                      className={cx('flex h-[72px] items-center gap-3.5 rounded-[20px] p-3.5 text-left', on ? 'bg-navy text-white' : 'bg-panel text-ink')}>
                      {on && <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white text-navy"><Icon name="check" size={14} /></span>}
                      {!on && <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white/50 text-muted"><Icon name="plus" size={14} /></span>}
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[14px] font-bold">{p.name}</span>
                        <span className={cx('text-[12px] font-medium', on ? 'text-white/70' : 'text-muted')}>{p.insurer}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              {prods.data && P.length < 2 && (
                <div className="flex items-center gap-3 rounded-[16px] border border-[#f1d6a6] bg-[#fdf6ea] px-4 py-3">
                  <p className="flex-1 text-[13px] font-semibold text-[#8a5a12]">{P.length === 0 ? 'No quotable products in this category.' : 'Only 1 product available — a comparison needs at least 2.'} Add agent codes for more insurers in My insurers.</p>
                  <Link to="/settings/insurers" className="shrink-0 rounded-[12px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-panel-2">My insurers</Link>
                </div>
              )}
            </>
          )}

          {/* Step 4: Details — people, sum insured, term, start (CQ5) */}
          {step === 4 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Details</p><p className="text-[12px] font-medium text-muted">Applies to every option. Same people and sum insured for all.</p></div>
              <div className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-ink">People to cover *</span>
                <div className="flex flex-wrap gap-2">{everyone.map((p) => { const on = inp.people.includes(p.key); return <button key={p.key} type="button" disabled={!p.dob} onClick={() => setInp({ ...inp, people: on ? inp.people.filter((k) => k !== p.key) : [...inp.people, p.key] })} className={cx('flex h-[38px] items-center gap-2 rounded-[19px] border px-3.5 text-[13px] font-semibold', !p.dob ? 'border-line text-faint' : on ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-muted')}>{on && <Icon name="check" size={13} />}{p.name} · {p.rel}{p.dob ? '' : ' · add DOB'}</button> })}</div>
              </div>
              <div className="flex gap-3">
                <Field label="Sum insured (₹) *" type="number" value={inp.sumInsured} onChange={(v) => setInp({ ...inp, sumInsured: v })} error={fe['inputs.sumInsured']} />
                <Field label="Policy term (years) *" type="number" value={inp.policyTerm} onChange={(v) => setInp({ ...inp, policyTerm: v })} />
                <Field label="Planned start date *" type="date" value={isoDay(inp.startDate)} onChange={(v) => setInp({ ...inp, startDate: v })} />
              </div>
            </>
          )}

          {/* Step 5: Premiums — enter base premium per option (CQ6) */}
          {step === 5 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Premiums</p><p className="text-[12px] font-medium text-muted">Enter the base premium from the insurer portal for each option.</p></div>
              {opts.map((o) => { const p = P.find((x) => x.id === o.productId); return (
                <div key={o.productId} className="flex flex-col gap-2 rounded-[20px] bg-panel p-4">
                  <p className="text-[14px] font-bold text-ink">{p?.insurer} · {p?.name ?? o.productId}</p>
                  <div className="flex items-end gap-3">
                    <Field label="Net premium (₹)" type="number" value={o.manual?.netPremium ?? ''} onChange={(v) => setOpts(opts.map((x) => (x.productId === o.productId ? { ...x, manual: { ...(x.manual || {}), netPremium: v } } : x)))} />
                    <Field label="GST (₹)" type="number" value={o.manual?.taxAmount ?? ''} onChange={(v) => setOpts(opts.map((x) => (x.productId === o.productId ? { ...x, manual: { ...(x.manual || {}), taxAmount: v } } : x)))} />
                  </div>
                </div>) })}
              <button type="button" disabled={busy || opts.length < 2 || !inp.people.length} onClick={doPreview}
                className="flex h-[46px] items-center gap-2 self-start rounded-[24px] bg-navy px-5 text-[14px] font-semibold text-white shadow-[0px_10px_10px_rgba(19,41,75,0.25)] disabled:opacity-50 disabled:shadow-none">
                <Icon name="refresh" size={16} />{busy ? 'Working…' : 'Work out premiums'}
              </button>
              {preview && <ComparisonTable preview={preview} />}
            </>
          )}

          {/* Step 6: Recommend (CQ7) */}
          {step === 6 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Recommend</p><p className="text-[12px] font-medium text-muted">Pick one and say why. The reason is printed on the comparison.</p></div>
              {(preview?.columns ?? []).filter((x) => !x.error).map((x) => {
                const on = rec.id === x.productId
                return (
                  <button key={x.productId} type="button" onClick={() => setRec({ ...rec, id: x.productId })}
                    className={cx('flex items-center gap-3.5 rounded-[20px] p-4 text-left', on ? 'border-2 border-blue bg-[#f3f7ff]' : 'border border-line bg-white hover:bg-panel-2')}>
                    <span className={cx('flex size-[22px] shrink-0 items-center justify-center rounded-full border bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-ink">{x.insurer} · {x.name}</span>
                      <span className="text-[12px] font-medium text-muted">{fmtMoney(x.premium)} / year</span>
                    </span>
                    {x.lowest && <span className="rounded-[14px] bg-[#e7f4ee] px-2.5 py-[5px] text-[12px] font-semibold text-[#127650]">Lowest</span>}
                  </button>
                )
              })}
              <Field label="Why you recommend this option *" type="textarea" value={rec.reason} onChange={(v) => setRec({ ...rec, reason: v })} error={fe.recommendedReason} />
            </>
          )}

          {/* Step 7: Review (CQ8) */}
          {step === 7 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Review and generate</p><p className="text-[12px] font-medium text-muted">Exactly what the customer will see.</p></div>
              {preview && <ComparisonTable preview={preview} recId={rec.id} />}
              {rec.reason && <p className="text-[13px] font-medium text-ink">Recommendation: {rec.reason}</p>}
            </>
          )}

          <ErrorNote error={error} />

          {/* Footer: Back + Continue/Generate */}
          <div className="flex items-center gap-3">
            <button type="button" disabled={step <= 2 || busy} onClick={() => { setError(null); setStep(step - 1) }}
              className="flex h-[48px] w-[140px] items-center justify-center rounded-[24px] border border-line text-[14px] font-semibold text-ink disabled:opacity-40">Back</button>
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted"><Icon name="check" size={16} className="text-[#127650]" />Draft saved</span>
            <span className="flex-1" />
            {step < 7 && (
              <button type="button" disabled={busy || !canNext} onClick={handleNext}
                className="flex h-[48px] items-center gap-2 rounded-[24px] bg-navy px-6 text-[14px] font-semibold text-white shadow-[0px_10px_10px_rgba(19,41,75,0.25)] disabled:opacity-50 disabled:shadow-none">
                <Icon name="arrow" size={18} />{busy ? 'Saving…' : nextLabels[step]}
              </button>
            )}
            {step === 7 && (
              <button type="button" disabled={busy || !preview} onClick={doGenerate}
                className="flex h-[48px] items-center gap-2 rounded-[24px] bg-navy px-6 text-[14px] font-semibold text-white shadow-[0px_10px_10px_rgba(19,41,75,0.25)] disabled:opacity-50 disabled:shadow-none">
                <Icon name="sparkle" size={16} />{busy ? 'Generating…' : 'Generate comparison'}
              </button>
            )}
          </div>
        </div>

        {/* Figma: pink "Your comparison" live summary */}
        <div className="w-[400px] shrink-0 rounded-[28px] bg-gradient-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_18px_rgba(232,137,156,0.25)]">
          <div className="flex items-start justify-between">
            <div><p className="text-[17px] font-bold text-ink">Your comparison</p><p className="text-[12px] font-medium text-muted">Same people and sum insured for every option</p></div>
            <span className="rounded-[14px] bg-[#fde8ec] px-3 py-[5px] text-[12px] font-semibold text-[#b4325a]">Draft</span>
          </div>
          <div className="mt-3.5 flex flex-col gap-2.5 rounded-[20px] bg-white/80 p-4">
            <SumRow k="Customer" v={customer.data?.name} />
            <SumRow k="Type" v="Comparative" />
            <SumRow k="Insurance" v={typeName} />
            <SumRow k="Options" v={opts.length ? `${opts.length} products` : null} />
            <SumRow k="People and cover" v={inp.people.length ? `${inp.people.length} people${inp.sumInsured ? ` · ${lakh(Number(inp.sumInsured))}` : ''}` : null} />
          </div>
          {opts.length > 0 && (
            <div className="mt-3.5 flex flex-col gap-2 rounded-[20px] bg-white p-4">
              <p className="text-[10px] font-bold tracking-[0.6px] text-muted">OPTIONS</p>
              {opts.map((o) => { const p = P.find((x) => x.id === o.productId); return (
                <div key={o.productId} className="flex items-center">
                  <span className="flex-1 text-[12px] font-semibold text-ink-2">{p?.insurer} · {p?.name ?? '?'}</span>
                  {rec.id === o.productId && <span className="rounded-[10px] bg-[#e7f4ee] px-2 py-0.5 text-[10px] font-bold text-[#127650]">Recommended</span>}
                </div>
              ) })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function SumRow({ k, v }) {
  return (
    <div className="flex items-center">
      <span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">{k}</span>
      <span className={cx('text-[13px] font-bold', v ? 'text-ink' : 'text-[#b98b96]')}>{v || '—'}</span>
    </div>
  )
}

function ComparisonTable({ preview, recId }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-line">
      <table className="w-full text-[13px]">
        <thead><tr><th className="w-[200px]" />{(preview.columns ?? []).map((x) => (
          <th key={x.productId} className="py-3 px-3 text-left align-top">
            <p className="font-bold text-ink">{x.insurer} · {x.name}</p>
            {x.error ? <p className="font-semibold text-[#b4323c]">{x.error.message}</p> : <p className="text-[16px] font-bold text-ink">{fmtMoney(x.premium)}{x.lowest && <span className="ml-1.5 rounded-[8px] bg-[#e7f4ee] px-1.5 text-[10px] text-[#127650]">Lowest</span>}</p>}
            {recId === x.productId && <span className="rounded-[8px] bg-[#f0ecfb] px-2 py-0.5 text-[11px] font-bold text-[#5b3fb8]">Recommended</span>}
            {x.coverage && <p className="text-[11px] font-semibold text-[#8a5a12]">{x.coverage.message}</p>}
          </th>
        ))}</tr></thead>
        <tbody>{(preview.rows ?? []).map((r) => (
          <tr key={r.label} className="border-t border-line">
            <td className="py-2.5 px-3 font-semibold text-muted">{r.label}</td>
            {r.values.map((v, i) => <td key={i} className="py-2.5 px-3 text-ink">{r.label === 'Sum insured' && v ? lakh(v) : String(v ?? '—')}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

/* ═════════════ generated / shared (unchanged) ═════════════ */

function Generated({ c }) {
  const navigate = useNavigate()
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  const s = c.snapshot || {}
  const cols = s.columns || []
  return (
    <AppLayout active="quotations">
      <Header back="/comparisons" breadcrumb={`SALES  /  COMPARISONS  /  ${c.number ?? ''}`} title={c.number ?? 'Comparison'} titleExtra={<StatusChip tone={TONE[c.status]}>{label(c.status)}</StatusChip>}
        subtitle={`Valid till ${c.validUntil ? fmtDate(isoDay(c.validUntil)) : '—'} · viewed ${c.viewed}×${c.sharedAt ? ` · shared ${fmtDateTime(c.sharedAt)}` : ''}`}
        actions={<>
          {c.pdfFileId && <HeadButton variant="white" icon="folder" onClick={() => window.open(api.files.url(c.pdfFileId), '_blank')}>PDF</HeadButton>}
          {['READY', 'SHARED'].includes(c.status) && <HeadButton variant="white" icon="send" onClick={() => setDlg('share')}>Share</HeadButton>}
          {['READY', 'SHARED', 'PRODUCT_CHOSEN'].includes(c.status) && <HeadButton icon="check" onClick={() => setDlg('choose')}>Customer chose</HeadButton>}
          {c.status === 'PRODUCT_CHOSEN' && <HeadButton icon="quote" disabled={busy} onClick={() => act(() => api.comparisons.createQuotation(c.id, {}), { invalidates: ['quotations', 'comparison'], onDone: (r) => r?.data?.id && navigate(`/quotations/${r.data.id}`) })}>Create quotation</HeadButton>}
        </>} />
      {c.status === 'EXPIRED' && <div className="mt-4"><ErrorNote error={{ message: 'This comparison has expired. Start a new one to re-price.' }} /></div>}
      <Panel className="mt-6 flex flex-col gap-3 overflow-x-auto">
        <table className="w-full text-[13px]"><thead><tr><th className="w-[200px]" />{cols.map((x) => <th key={x.productId} className="py-2 text-left align-top"><p className="font-bold text-ink">{x.insurer} · {x.name}</p><p className="text-[16px] font-bold text-ink">{fmtMoney(x.premium)}</p>{c.chosenProductId === x.productId && <StatusChip tone="green" icon="check">Chosen</StatusChip>}{s.recommendedProductId === x.productId && <StatusChip tone="violet">Recommended</StatusChip>}</th>)}</tr></thead>
          <tbody>{(s.rows || []).map((r) => <tr key={r.label} className="border-t border-line"><td className="py-2 pr-3 font-semibold text-muted">{r.label}</td>{r.values.map((v, i) => <td key={i} className="py-2 pr-3 text-ink">{String(v ?? '—')}</td>)}</tr>)}</tbody></table>
        {s.recommendedReason && <p className="text-[13px] font-medium text-ink">Recommendation: {s.recommendedReason}</p>}
      </Panel>
      {(c.linkedQuotationIds || []).length > 0 && <Panel className="mt-5 flex gap-2">{c.linkedQuotationIds.map((qid) => <SmallButton key={qid} variant="outline" icon="quote" to={`/quotations/${qid}`}>Open quotation</SmallButton>)}</Panel>}
      {dlg === 'share' && <ShareDialog c={c} onClose={() => setDlg(null)} />}
      {dlg === 'choose' && <ChooseDialog c={c} cols={cols} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}
function ShareDialog({ c, onClose }) {
  const [channel, setChannel] = useState('WHATSAPP')
  const { act, busy, error } = useAct()
  return (
    <ActionDialog title="Share comparison" icon="send" confirm="Share" busy={busy} error={error} onClose={onClose}
      onConfirm={() => act(() => api.comparisons.share(c.id, { channel }), { invalidates: ['comparison', 'comparisons'], quiet: true, onDone: (r) => { const url = r?.data?.url ?? r?.data?.link ?? r?.data?.whatsappUrl; if (url) window.open(url, '_blank', 'noopener'); onClose() } })}>
      <Field label="Share by" type="select" value={channel} onChange={setChannel} options={[{ value: 'WHATSAPP', label: 'WhatsApp' }, { value: 'EMAIL', label: 'Email' }, { value: 'LINK', label: 'Copy link' }, { value: 'DOWNLOAD', label: 'Download PDF' }]} />
      {['PRF-03', 'PRF-13'].includes(error?.messageId) && (
        <Link to="/settings" className="self-start rounded-[12px] border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-panel-2">Open My profile</Link>
      )}
    </ActionDialog>
  )
}
function ChooseDialog({ c, cols, onClose }) {
  const [pid, setPid] = useState(cols[0]?.productId ?? '')
  const { act, busy, error } = useAct()
  const col = cols.find((x) => x.productId === pid)
  return (
    <ActionDialog title="Which product did the customer choose?" confirm="Save choice" busy={busy} error={error} onClose={onClose}
      onConfirm={() => act(() => api.comparisons.choose(c.id, { version: c.version, productId: pid, variantId: col?.variantId ?? null }), { invalidates: ['comparison', 'comparisons'], onDone: onClose, quiet: true })}>
      <Field label="Product" type="select" value={pid} onChange={setPid} options={cols.map((x) => ({ value: x.productId, label: `${x.insurer} · ${x.name} · ${fmtMoney(x.premium)}` }))} />
    </ActionDialog>
  )
}

/* ═════════════ public /c/:token (no sign-in) ═════════════ */
export function PublicComparison() {
  const { token } = useParams()
  const q = useQuery(['public-comparison', token], () => api.public.comparison(token))
  const s = q.data
  return (
    <div className="min-h-screen bg-[#f4f6fb] px-6 py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-5">
        {q.loading && !s && <p className="text-[14px] font-medium text-muted">Loading…</p>}
        {(q.error || (s && s.valid === false)) && (
          <div className="flex flex-col items-center gap-3 rounded-[28px] bg-white p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#fbf1e1] text-[#8a5a12]"><Icon name="clock" size={24} /></span>
            <p className="text-[20px] font-bold text-ink">This comparison has expired</p>
            <p className="max-w-[460px] text-[14px] font-medium text-muted">{s?.message ?? q.error?.message ?? 'Ask your advisor for a fresh one.'}</p>
          </div>
        )}
        {s?.valid && (
          <>
            <div className="rounded-[28px] bg-rail p-7 text-white"><p className="text-[13px] text-[#c9d6ea]">Comparison {s.number ?? ''} · valid till {s.validUntil}</p><p className="text-[24px] font-bold">{s.customer?.name ? `For ${s.customer.name}` : 'Your options'}</p>{s.advisor?.name && <p className="text-[13px] text-[#c9d6ea]">From {s.advisor.name}{s.advisorMobile ? ` · ${s.advisorMobile}` : ''}</p>}</div>
            <div className="overflow-x-auto rounded-[28px] bg-white p-6">
              <table className="w-full text-[13px]"><thead><tr><th className="w-[200px]" />{(s.columns || []).map((x) => <th key={x.productId} className="py-2 text-left align-top"><p className="font-bold text-ink">{x.insurer} · {x.name}</p><p className="text-[18px] font-bold text-ink">{fmtMoney(x.premium)}</p>{s.recommendedProductId === x.productId && <span className="rounded-[8px] bg-[#f0ecfb] px-2 py-0.5 text-[11px] font-bold text-[#5b3fb8]">Recommended</span>}</th>)}</tr></thead>
                <tbody>{(s.rows || []).map((r) => <tr key={r.label} className="border-t border-line"><td className="py-2 pr-3 font-semibold text-muted">{r.label}</td>{r.values.map((v, i) => <td key={i} className="py-2 pr-3 text-ink">{String(v ?? '—')}</td>)}</tr>)}</tbody></table>
              {s.recommendedReason && <p className="mt-4 text-[13px] font-medium text-ink">{s.recommendedReason}</p>}
            </div>
            <p className="text-center text-[12px] font-medium text-muted">Premiums include GST. Talk to your advisor to go ahead with one of these.</p>
          </>
        )}
      </div>
    </div>
  )
}
