// CQ2–CQ9 Comparison wizard · C2 shared · C3 customer chose · CX1 expired (public) — on the live API.
//   /comparisons              GET /comparisons
//   /comparisons/new          POST /comparisons {customerId}
//   /comparisons/:id          DRAFT → PUT (inputs, options, recommendation) · POST preview · POST generate
//                             READY/SHARED → POST share · POST choose · POST create-quotation
//   /c/:token (public)        GET /public/c/:token
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
// Figma CQ2–CQ9: 8-step stepper matching the comparison wizard
const STEPS = ['Customer', 'Type', 'Insurance', 'Options', 'Details', 'Premiums', 'Recommend', 'Review']
const lakh = (n) => (n >= 10_000_000 ? `₹${n / 10_000_000} crore` : n >= 100_000 ? `₹${n / 100_000} lakh` : fmtMoney(n))

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
      <DataTable className="mt-7 w-[1180px]" columns={columns} rows={rows} rowTo={(r) => `/comparisons/${r.id}`} empty={q.loading ? 'Loading…' : hq.trim() ? `No comparisons match “${hq.trim()}”.` : 'No comparisons yet.'} />
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
  // Steps: 0=Customer(done) 1=Type(done) 2=Insurance 3=Options 4=Details 5=Premiums 6=Recommend 7=Review
  const step = !inp.typeId ? 2 : opts.length < 2 ? 3 : !inp.people.length || !inp.sumInsured ? 4 : !preview ? 5 : !rec.id ? 6 : 7
  const siOptions = [...new Set(P.flatMap(() => []))]
  void siOptions
  return (
    <AppLayout active="quotations">
      <Header back="/comparisons" breadcrumb={'QUOTATIONS  /  NEW COMPARISON'} title="New comparative quotation"
        titleExtra={<span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#127650]"><Icon name="check" size={13} />Draft saved</span>}
        subtitle={customer.data ? `${customer.data.name} · 2 to 3 options side by side` : '2 to 3 options side by side'} />
      <Stepper className="mt-5" steps={STEPS} current={step} />
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Insurance type and details" subtitle="Same for every option in this comparison" />
            <Field label="Insurance type *" type="select" value={inp.typeId} onChange={(v) => { setInp({ ...inp, typeId: v }); setOpts([]); setPreview(null) }} options={[{ value: '', label: 'Choose' }, ...((types.data?.types) || []).map((t) => ({ value: t.id, label: t.name }))]} error={fe['inputs.typeId']} />
            <div className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-ink">People *</span>
              <div className="flex flex-wrap gap-2">{everyone.map((p) => { const on = inp.people.includes(p.key); return <button key={p.key} type="button" disabled={!p.dob} onClick={() => setInp({ ...inp, people: on ? inp.people.filter((k) => k !== p.key) : [...inp.people, p.key] })} className={cx('flex h-[38px] items-center gap-2 rounded-[19px] border px-3.5 text-[13px] font-semibold', !p.dob ? 'border-line text-faint' : on ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-muted')}>{on && <Icon name="check" size={13} />}{p.name} · {p.rel}{p.dob ? '' : ' · add DOB'}</button> })}</div>
            </div>
            <div className="flex gap-3"><Field label="Sum insured (₹) *" type="number" value={inp.sumInsured} onChange={(v) => setInp({ ...inp, sumInsured: v })} error={fe['inputs.sumInsured']} hint={inp.sumInsured ? lakh(Number(inp.sumInsured)) : ''} />
              <Field label="Policy term (years) *" type="number" value={inp.policyTerm} onChange={(v) => setInp({ ...inp, policyTerm: v })} />
              <Field label="Planned start *" type="date" value={isoDay(inp.startDate)} onChange={(v) => setInp({ ...inp, startDate: v })} /></div>
          </Panel>
          {inp.typeId && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Options" subtitle="Pick 2 to 3 products or variants. Insurers with an active agent code only." />
              <div className="grid grid-cols-2 gap-2">
                {P.map((p) => { const on = opts.some((o) => o.productId === p.id); return <button key={p.id} type="button" disabled={!on && opts.length >= 5} onClick={() => { setOpts(on ? opts.filter((o) => o.productId !== p.id) : [...opts, { productId: p.id }]); setPreview(null) }} className={cx('flex items-center gap-2 rounded-[14px] px-3.5 py-3 text-left text-[13px] font-semibold', on ? 'bg-navy text-white' : 'bg-panel text-ink')}>{on && <Icon name="check" size={14} />}<span className="flex-1">{p.insurer} · {p.name}</span></button> })}
              </div>
              {prods.data && P.length < 2 && (
                // A comparison needs 2 to 5 products the advisor can quote (agent code for the insurer): say why it cannot go on.
                <div className="flex items-center gap-3 rounded-[16px] border border-[#f1d6a6] bg-[#fdf6ea] px-4 py-3">
                  <p className="flex-1 text-[13px] font-semibold text-[#8a5a12]">
                    {P.length === 0 ? 'You cannot quote any product in this category yet.' : 'You can quote only 1 product in this category, and a comparison needs at least 2.'}
                    {' '}Add agent codes for more insurers in My insurers (use “Products in” to find the ones that sell it), or make a single quotation instead.
                  </p>
                  <Link to="/settings/insurers" className="shrink-0 rounded-[12px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-panel-2">Open My insurers</Link>
                </div>
              )}
              {P.length >= 2 && opts.length < 2 && <p className="text-[12px] font-semibold text-[#8a5a12]">Choose at least 2 products to compare.</p>}
              {opts.map((o) => { const p = P.find((x) => x.id === o.productId); return (
                <div key={o.productId} className="flex items-end gap-3 text-[13px]"><span className="mb-3 w-[260px] font-semibold text-ink">{p?.name ?? o.productId}</span>
                  <Field label="Net premium from portal (₹)" type="number" value={o.manual?.netPremium ?? ''} onChange={(v) => setOpts(opts.map((x) => (x.productId === o.productId ? { ...x, manual: { ...(x.manual || {}), netPremium: v } } : x)))} hint="Only for products priced at quotation" />
                  <Field label="GST (₹)" type="number" value={o.manual?.taxAmount ?? ''} onChange={(v) => setOpts(opts.map((x) => (x.productId === o.productId ? { ...x, manual: { ...(x.manual || {}), taxAmount: v } } : x)))} />
                </div>) })}
              <SmallButton variant="navy" icon="refresh" className="self-start" disabled={busy || opts.length < 2 || !inp.people.length} onClick={doPreview}>{busy ? 'Working…' : 'Work out premiums'}</SmallButton>
            </Panel>
          )}
          {preview && (
            <Panel className="flex flex-col gap-3 overflow-x-auto">
              <PanelHead title="Comparison" subtitle="As the customer will see it" />
              <table className="w-full text-[13px]"><thead><tr><th className="w-[200px]" />{preview.columns.map((x) => <th key={x.productId} className="py-2 text-left align-top"><p className="font-bold text-ink">{x.insurer} · {x.name}</p>{x.error ? <p className="font-semibold text-[#b4323c]">{x.error.message}</p> : <p className="text-[16px] font-bold text-ink">{fmtMoney(x.premium)}{x.lowest && <span className="ml-1.5 rounded-[8px] bg-[#e7f4ee] px-1.5 text-[10px] text-[#127650]">Lowest</span>}</p>}{x.coverage && <p className="text-[11px] font-semibold text-[#8a5a12]">{x.coverage.message}</p>}</th>)}</tr></thead>
                <tbody>{preview.rows.map((r) => <tr key={r.label} className="border-t border-line"><td className="py-2 pr-3 font-semibold text-muted">{r.label}</td>{r.values.map((v, i) => <td key={i} className="py-2 pr-3 text-ink">{r.label === 'Sum insured' && v ? lakh(v) : String(v ?? '—')}</td>)}</tr>)}</tbody></table>
            </Panel>
          )}
          {preview && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Recommend" subtitle="Pick one and say why. The reason is printed on the comparison." />
              <Field label="Recommended product" type="select" value={rec.id} onChange={(v) => setRec({ ...rec, id: v })} options={[{ value: '', label: 'No recommendation' }, ...preview.columns.filter((x) => !x.error).map((x) => ({ value: x.productId, label: `${x.insurer} · ${x.name}` }))]} />
              <Field label="Why" type="textarea" value={rec.reason} onChange={(v) => setRec({ ...rec, reason: v })} error={fe.recommendedReason} />
            </Panel>
          )}
          <ErrorNote error={error} />
        </div>
        {/* Figma: pink "Your comparison" live summary */}
        <div className="w-[400px] shrink-0 rounded-[28px] bg-gradient-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_18px_rgba(232,137,156,0.25)]">
          <div className="flex items-start justify-between">
            <div><p className="text-[17px] font-bold text-ink">Your comparison</p><p className="text-[12px] font-medium text-muted">Same people and sum insured for every option</p></div>
            <span className="rounded-[14px] bg-[#fde8ec] px-3 py-[5px] text-[12px] font-semibold text-[#b4325a]">Draft</span>
          </div>
          <div className="mt-3.5 flex flex-col gap-2.5 rounded-[20px] bg-white/75 p-4">
            <div className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">Customer</span><span className="text-[13px] font-bold text-ink">{customer.data?.name ?? '—'}</span></div>
            <div className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">Type</span><span className="text-[13px] font-bold text-ink">Comparative</span></div>
            <div className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">Insurance</span><span className={cx('text-[13px] font-bold', inp.typeId ? 'text-ink' : 'text-[#b98b96]')}>{(types.data?.types ?? []).find((t) => t.id === inp.typeId)?.name ?? '—'}</span></div>
            <div className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">Options</span><span className={cx('text-[13px] font-bold', opts.length ? 'text-ink' : 'text-[#b98b96]')}>{opts.length ? `${opts.length} products` : '—'}</span></div>
            <div className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">People and cover</span><span className={cx('text-[13px] font-bold', inp.people.length ? 'text-ink' : 'text-[#b98b96]')}>{inp.people.length ? `${inp.people.length} people${inp.sumInsured ? ` · ${lakh(Number(inp.sumInsured))}` : ''}` : '—'}</span></div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <SmallButton variant="outline" disabled={busy} onClick={() => run(async () => { await save(); toast('Draft saved.') })}>Save draft</SmallButton>
            <button type="button" disabled={!preview || busy} onClick={doGenerate} className="flex h-[50px] items-center justify-center gap-2 rounded-[25px] bg-navy text-[15px] font-semibold text-white disabled:opacity-50"><Icon name="sparkle" size={18} />{busy ? 'Working…' : 'Generate comparison'}</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

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
