// 10 Products library · 10c Product detail · 07L Quotations · Quotation detail · Proposals · Proposal detail — live API.
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, DataTable, StatusChip, RowChevron, IdCell, Panel, PanelHead, RingAvatar } from '../screens/catalogue/_parts'
import { matchesQuery, useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { api, useQuery } from '../api'
import { useAuth } from '../auth/AuthProvider'
import { avatarClass, fmtDate, fmtDateTime, fmtMoney, initials } from '../api/format'
import { ActionDialog, Field, useAct, label, dmy, ErrorNote } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { CancelProposalDialog } from './ProposalWizard'
import { PaymentActions, PaymentStateDialog } from './PaymentStates'
import { Breakdown } from './QuotationWizard'

/* ═════════════ 10 · Products library ═════════════ */
const TYPE_STYLE = { health: ['heart', 'bg-[#fde8ec]'], motor: ['car', 'bg-[#d9eafd]'], life: ['users', 'bg-[#e9e3fc]'], term: ['umbrella', 'bg-[#fde8c9]'], travel: ['plane', 'bg-[#d4f1e7]'] }
const styleOf = (type) => TYPE_STYLE[String(type || '').toLowerCase().split(' ')[0]] ?? ['box', 'bg-[#eef1f5]']
const quoteChip = (p) => (p.canQuote ? <StatusChip tone="green" icon="check">Can quote</StatusChip>
  : p.renewalOnly ? <StatusChip tone="rose" icon="x">Withdrawn</StatusChip>
    : p.agentCode === 'EXPIRED' ? <StatusChip tone="amber" icon="alert">Agent code expired</StatusChip>
      : p.agentCode !== 'ACTIVE' ? <StatusChip tone="amber" icon="alert">Add agent code</StatusChip>
        : <StatusChip tone="neutral">{label(p.status)}</StatusChip>)

export function LiveProducts() {
  const [source, setSource] = useState('VERIFIED')
  const [type, setType] = useState('all')
  const [q, clearQ] = useHeaderSearch()
  const list = useQuery('products', () => api.products.list())
  const all = list.data || []
  const types = [...new Set(all.map((p) => p.type).filter(Boolean))]
  const rows = all.filter((p) => p.kind === source && (type === 'all' || p.type === type) && matchesQuery(q, p.name, p.insurer, p.type, p.code))
  if (list.error && !list.data) return <ErrorPanel active="products" error={list.error} />
  return (
    <AppLayout active="products">
      <Header breadcrumb={'CATALOGUE  /  PRODUCTS'} title="Products" subtitle="Verified products from SkyUp and the ones you added yourself."
        actions={<><HeadButton variant="white" icon="compare" to="/products/feature-table">Feature table</HeadButton><HeadButton icon="plus" to="/products/new">Add my product</HeadButton></>} />
      <div className="mt-[13px] flex items-center gap-3">
        <SegTabs items={[{ key: 'VERIFIED', label: 'Verified by SkyUp', count: all.filter((p) => p.kind === 'VERIFIED').length }, { key: 'OWN', label: 'My products', count: all.filter((p) => p.kind === 'OWN').length }]} value={source} onChange={setSource} />
        <SegTabs items={[{ key: 'all', label: 'All' }, ...types.map((t) => ({ key: t, label: t }))]} value={type} onChange={setType} />
      </div>
      <div className="mt-6 flex flex-wrap gap-5">
        {rows.map((p) => {
          const [icon, bg] = styleOf(p.type)
          return (
            <div key={p.id} className="flex w-[380px] flex-col rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
              <div className={cx('flex h-[76px] items-center gap-3.5 rounded-t-[28px] px-5', bg)}>
                <span className="flex size-11 items-center justify-center rounded-[22px] bg-white/80"><Icon name={icon} size={20} className="text-ink" /></span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5"><p className="text-[12px] font-semibold text-slate">{p.insurer}</p><p className="truncate text-[17px] font-bold text-ink">{p.name}</p></div>
                <span className="rounded-[10px] bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink">{p.variantCount} variant{p.variantCount === 1 ? '' : 's'}</span>
              </div>
              <div className="flex flex-col gap-3 px-[18px] pt-3.5 pb-4">
                <div className="flex h-11 flex-col justify-center rounded-[14px] bg-panel px-3.5">
                  <span className="text-[10px] font-semibold text-muted">{p.type ?? 'Product'} · {p.code}</span>
                  <span className="truncate text-[13px] font-bold text-ink">{p.defaultVariant ?? 'Single variant'}</span>
                </div>
                <div className="flex h-[25px] items-center gap-2"><span className="text-[12px] font-medium text-muted">{p.variants?.slice(0, 3).join(' · ')}</span><span className="flex-1" />{quoteChip(p)}</div>
                <div className="flex gap-2">
                  <SmallButton variant="outline" to={`/products/${p.id}`} className="flex-1 justify-center px-3.5">Details</SmallButton>
                  <SmallButton variant={p.canQuote ? 'navy' : 'disabled'} icon="quote" to={p.canQuote ? `/quotations/new?productId=${p.id}` : undefined} className="flex-1 justify-center">New quotation</SmallButton>
                </div>
              </div>
            </div>
          )
        })}
        {rows.length === 0 && (
          <NoMatches className="w-[1180px] rounded-[28px] bg-white" text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'Nothing here'}
            sub={q.trim() ? `No products match “${q.trim()}”.` : source === 'OWN' ? 'You have not added your own products yet.' : 'No verified products in this category.'} onClear={q.trim() ? clearQ : undefined} />
        )}
      </div>
    </AppLayout>
  )
}

/* ═════════════ 10c · Product detail ═════════════ */
export function LiveProductDetail() {
  const { id } = useParams()
  const q = useQuery(['product', id], () => api.products.get(id))
  const comm = useQuery(['product', id, 'commercials'], () => api.products.commercials(id))
  const [variant, setVariant] = useState(0)
  const [dlg, setDlg] = useState(null)
  if (q.error) return <ErrorPanel active="products" error={q.error} back="/products" />
  if (!q.data) return <LoadingPanel active="products" />
  const p = q.data
  const d = p.publishedVersion?.data ?? {}
  const v = p.variants?.[variant]
  const featureValue = (key) => {
    const x = v?.features?.[key] ?? d.features?.[key]
    if (x == null) return '—'
    const val = typeof x === 'object' ? x.value : x
    return Array.isArray(val) ? val.join(', ') : val === true ? 'Yes' : val === false ? 'No' : String(val)
  }
  const facts = [
    ['UIN', d.uin], ['Launched', d.launchDate], ['Entry age', d.adultMin != null ? `${d.adultMin}–${d.adultMax} years` : null],
    ['Sum insured', Array.isArray(d.sumInsured?.options) ? d.sumInsured.options.map((n) => fmtMoney(n)).join(' · ') : null],
    ['Policy terms', Array.isArray(d.policyTerms) ? d.policyTerms.map((t) => `${t} yr`).join(', ') : null], ['Pricing', label(d.pricingMode)], ['Grace period', d.gracePeriodDays != null ? `${d.gracePeriodDays} days` : null],
  ].filter(([, x]) => x)
  return (
    <AppLayout active="products">
      <Header breadcrumb={`CATALOGUE  /  PRODUCTS  /  ${p.publishedVersion?.data?.name?.toUpperCase() ?? ''}`} title={d.name ?? p.code} titleExtra={<StatusChip tone={p.status === 'ACTIVE' ? 'green' : 'amber'}>{label(p.status)}</StatusChip>}
        subtitle={`${p.insurer ?? ''} · ${p.type ?? ''} · ${p.kind === 'OWN' ? 'My product' : 'Verified by SkyUp'}`}
        actions={<>
          {p.kind === 'VERIFIED' && <HeadButton variant="white" icon="edit" onClick={() => setDlg('correction')}>Suggest a correction</HeadButton>}
          <HeadButton icon="quote" to="/quotations/new">New quotation</HeadButton>
        </>} />
      {p.variants?.length > 1 && <SegTabs className="mt-[13px]" items={p.variants.map((x, i) => ({ key: i, label: x.name }))} value={variant} onChange={setVariant} />}
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Features" subtitle={v ? v.name : 'Published version'} />
            {(p.features || []).map((f) => (
              <div key={f.key} className="flex items-center gap-4 border-t border-line pt-3 first:border-0 first:pt-0">
                <p className="w-[260px] shrink-0 text-[13px] font-semibold text-muted">{f.name ?? f.label ?? f.key}</p>
                <p className="flex-1 text-[14px] font-semibold text-ink">{featureValue(f.key)}</p>
              </div>
            ))}
            {(p.customFeatures || []).map((f, i) => (
              <div key={`c${i}`} className="flex items-center gap-4 border-t border-line pt-3"><p className="w-[260px] shrink-0 text-[13px] font-semibold text-muted">{f.name ?? f.label}</p><p className="flex-1 text-[14px] font-semibold text-ink">{String(f.value ?? '—')}</p></div>
            ))}
            {!p.features?.length && !p.customFeatures?.length && <p className="text-[13px] font-medium text-muted">No features recorded.</p>}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Product facts" />
            {facts.map(([k, x]) => <div key={k} className="flex justify-between gap-3 text-[13px]"><span className="font-medium text-muted">{k}</span><span className="text-right font-semibold text-ink">{x}</span></div>)}
            {d.brochureFileId && <SmallButton variant="outline" icon="folder" className="self-start" onClick={() => window.open(api.files.url(d.brochureFileId), '_blank')}>Brochure</SmallButton>}
          </Panel>
          {comm.data !== undefined && !comm.error && (
            <Panel className="flex flex-col gap-2">
              <PanelHead title="My commercials" subtitle="Private to you" right={<SmallButton variant="ghost" icon="edit" onClick={() => setDlg('commercials')}>Edit</SmallButton>} />
              <p className="text-[13px] font-semibold text-ink">Commission: {comm.data?.commercials?.commissionPercent ?? comm.data?.commissionPercent ?? '—'}%</p>
              {(comm.data?.commercials?.notes ?? comm.data?.notes) && <p className="text-[12px] font-medium text-muted">{comm.data?.commercials?.notes ?? comm.data?.notes}</p>}
            </Panel>
          )}
          <Panel className="flex flex-col gap-2">
            <PanelHead title="My price versions" subtitle="Premiums you quote with" />
            <SmallButton variant="outline" icon="list" to={`/products/${p.id}/prices`}>Price versions</SmallButton>
            {p.variants?.length > 1 && <SmallButton variant="outline" icon="compare" to={`/products/${p.id}/variants`}>Compare variants</SmallButton>}
          </Panel>
        </div>
      </div>
      {dlg === 'commercials' && <CommercialsDialog id={p.id} cur={comm.data?.commercials ?? comm.data ?? {}} onClose={() => setDlg(null)} />}
      {dlg === 'correction' && <CorrectionDialog id={p.id} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

function CommercialsDialog({ id, cur, onClose }) {
  const [pct, setPct] = useState(cur.commissionPercent ?? '')
  const [notes, setNotes] = useState(cur.notes ?? '')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.products.saveCommercials(id, { commissionPercent: pct === '' ? null : Number(pct), notes: notes || null }), { invalidates: ['product'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="My commercials" body="Only you see this." confirm="Save" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Commission (%)" type="number" value={pct} onChange={setPct} error={fe.commissionPercent} />
      <Field label="Notes" type="textarea" value={notes} onChange={setNotes} />
    </ActionDialog>
  )
}

function CorrectionDialog({ id, onClose }) {
  const fields = useQuery(['product', id, 'correction-fields'], () => api.products.correctionFields(id))
  const opts = (fields.data || []).map((f) => ({ value: f.field ?? f.key, label: f.label ?? f.name ?? f.field ?? f.key }))
  const [f, setF] = useState({ field: '', proposedValue: '', reason: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.products.suggestCorrection(id, { field: f.field || opts[0]?.value, proposedValue: f.proposedValue, reason: f.reason }), { invalidates: ['product'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Suggest a correction" body="SkyUp checks it against the insurer's documents." confirm="Send to SkyUp" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Field *" type="select" value={f.field || opts[0]?.value} onChange={set('field')} options={opts} />
      <Field label="Correct value *" value={f.proposedValue} onChange={set('proposedValue')} error={fe.proposedValue} />
      <Field label="Reason *" type="textarea" value={f.reason} onChange={set('reason')} error={fe.reason} />
    </ActionDialog>
  )
}

/* ═════════════ 07L · Quotations ═════════════ */
const Q_TABS = [['all', 'All'], ['DRAFT', 'Draft'], ['READY', 'Ready'], ['SHARED', 'Shared'], ['ACCEPTED', 'Accepted'], ['REJECTED', 'Rejected'], ['EXPIRED', 'Expired'], ['CANCELLED', 'Cancelled']]
const Q_TONE = { DRAFT: 'neutral', READY: 'sky', SHARED: 'violet', ACCEPTED: 'green', REJECTED: 'rose', EXPIRED: 'amber', CANCELLED: 'neutral' }

export function LiveQuotations() {
  const [tab, setTab] = useState('all')
  const [hq, clearQ] = useHeaderSearch()
  const [page, setPage] = useState(1)
  const list = useQuery(['quotations', tab, hq.trim(), page], () => api.quotations.list({ status: tab === 'all' ? undefined : tab, search: hq.trim() || undefined, page, limit: 25 }))
  const meta = list.meta || {}
  const counts = meta.counts || {}
  const rows = (list.data || []).map((x) => ({ ...x, cname: x.customer?.name ?? '—' }))
  const columns = [
    { key: 'q', label: 'Quotation', width: 250, render: (r) => <IdCell initials={initials(r.cname)} bg={avatarClass(r.cname)} title={r.number ?? 'Draft'} sub={r.cname} /> },
    { key: 'product', label: 'Product', width: 260, render: (r) => <span className="truncate">{[r.insurerName, r.productName].filter(Boolean).join(' · ') || '—'}</span> },
    { key: 'premium', label: 'Premium', width: 120, render: (r) => fmtMoney(r.premium) },
    { key: 'valid', label: 'Valid till', width: 120, render: (r) => (r.validUntil ? fmtDate(r.validUntil, { year: false }) : '—') },
    { key: 'updated', label: 'Updated', width: 130, render: (r) => fmtDate(r.updatedAt, { year: false }) },
    { key: 'status', label: 'Status', width: 110, render: (r) => <StatusChip tone={Q_TONE[r.status]}>{label(r.status)}</StatusChip> },
    { key: 'go', label: '', width: 40, className: 'justify-end', render: (_r, hot) => <RowChevron on={hot} /> },
  ]
  if (list.error && !list.data) return <ErrorPanel active="quotations" error={list.error} />
  return (
    <AppLayout active="quotations">
      <Header breadcrumb={'SALES  /  QUOTATIONS'} title="Quotations" subtitle="Every quotation and its revisions. Share, accept, then take payment."
        actions={<><HeadButton variant="white" icon="compare" to="/comparisons">Comparisons</HeadButton><HeadButton icon="plus" to="/quotations/new">New quotation</HeadButton></>} />
      <SegTabs className="mt-[13px]" items={Q_TABS.map(([key, l]) => ({ key, label: l, count: key === 'all' ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[key] ?? 0 }))} value={tab} onChange={(k) => { setTab(k); setPage(1) }} />
      <DataTable className="mt-7 w-[1180px]" columns={columns} rows={rows} rowTo={(r) => `/quotations/${r.id}`}
        empty={list.loading ? 'Loading…' : hq.trim() ? `No quotations match “${hq.trim()}”.` : 'No quotations here yet.'} onClear={hq.trim() ? clearQ : undefined} />
      {(meta.pages ?? 1) > 1 && (
        <div className="mt-4 flex w-[1180px] items-center justify-end gap-2 text-[13px] font-medium text-muted">
          Page {page} of {meta.pages}
          <SmallButton variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</SmallButton>
          <SmallButton variant="outline" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>Next</SmallButton>
        </div>
      )}
    </AppLayout>
  )
}

/* ═════════════ Quotation detail ═════════════ */
const REJECT = ['Premium too high', 'Chose another insurer', 'Not interested now', 'Other']
const PAY_MODES = ['UPI', 'Net banking', 'Card', 'Cheque', 'Cash', 'Paid on insurer portal']

export function LiveQuotationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { flags } = useAuth()
  const q = useQuery(['quotation', id], () => api.quotations.get(id))
  const rev = q.data?.revisions?.at(-1)
  const snap = useQuery(['quotation', id, 'rev', rev?.revision], () => api.quotations.revision(id, rev.revision), { enabled: !!rev })
  const pays = useQuery(['quotation', id, 'payments'], () => api.quotations.payments(id), { enabled: !!rev })
  const [pay, setPay] = useState(null)
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  if (q.error) return <ErrorPanel active="quotations" error={q.error} back="/quotations" />
  if (!q.data) return <LoadingPanel active="quotations" />
  const x = q.data
  const s = snap.data || {}
  const b = s.breakdown || {}
  const inv = ['quotation', 'quotations', 'dashboard']
  const run = (fn, extra = {}) => act(fn, { invalidates: inv, ...extra })
  const paid = (pays.data || []).find((p) => p.status === 'PAID')
  // Same rules as the API (P-29 outcome, P-31 link, P-32 payment): accept/reject only once SHARED; a payment can be
  // recorded on SHARED (it accepts the quotation), ACCEPTED or EXPIRED; a link from READY on.
  const canAccept = x.status === 'SHARED' && !(flags?.quotation_accept_requires_payment && !paid)
  const canPay = ['SHARED', 'ACCEPTED', 'EXPIRED'].includes(x.status) && !paid
  const canLink = ['READY', 'SHARED', 'ACCEPTED'].includes(x.status) && !paid
  return (
    <AppLayout active="quotations">
      <Header breadcrumb={`SALES  /  QUOTATIONS  /  ${x.number ?? 'DRAFT'}`} title={`${x.number ?? 'Draft quotation'}${rev ? ` R${rev.revision}` : ''}`}
        titleExtra={<StatusChip tone={Q_TONE[x.status]}>{label(x.status)}</StatusChip>} subtitle={[s.customer?.name, s.insurer?.name, s.product?.name].filter(Boolean).join(' · ') || 'Not generated yet'}
        actions={<>
          {x.status === 'DRAFT' && <HeadButton icon="arrow" to={`/quotations/${x.id}/edit`}>Continue</HeadButton>}
          {['READY', 'SHARED'].includes(x.status) && <HeadButton variant="white" icon="send" onClick={() => setDlg('share')}>Share</HeadButton>}
          {canAccept && <HeadButton icon="check" onClick={() => run(() => api.quotations.accept(x.id, x.version))}>Mark accepted</HeadButton>}
          {canPay && <HeadButton icon="card" onClick={() => setDlg('pay')}>Record payment</HeadButton>}
          {x.status === 'ACCEPTED' && paid && <HeadButton icon="arrow" onClick={() => act(() => api.proposals.create({ quotationId: x.id }), { invalidates: ['proposals'], onDone: (r) => r?.data?.id && navigate(`/proposals/${r.data.id}/edit`) })}>Start proposal</HeadButton>}
        </>} />
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Premium" subtitle={s.calculationDate ? `Calculated ${s.calculationDate}` : ''} right={<p className="text-[24px] font-bold text-ink">{fmtMoney(b.final ?? rev?.final, { decimals: 2 })}</p>} />
            {b.final != null && <Breakdown b={b} />}
            {!rev && <p className="text-[13px] font-medium text-muted">This quotation has not been generated yet.</p>}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Insured people" />
            {(s.people || []).map((m, i) => (
              <div key={i} className="flex items-center gap-3"><RingAvatar initials={initials(m.name)} bg={avatarClass(m.name)} size={36} text={11} /><p className="text-[13px] font-semibold text-ink">{m.name}{m.relationship ? ` · ${m.relationship}` : ''}{m.age != null ? ` · ${m.age}` : ''}</p></div>
            ))}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Revisions" />
            {(x.revisions || []).slice().reverse().map((r) => (
              <div key={r.revision} className="flex items-center gap-3 text-[13px]">
                <span className="w-10 font-bold text-ink">R{r.revision}</span>
                <span className="flex-1 font-medium text-muted">{fmtDateTime(r.generatedAt)}{r.sharedAt ? ` · shared ${fmtDate(r.sharedAt, { year: false })}` : ''}{r.viewed ? ` · viewed ${r.viewed}×` : ''}</span>
                <span className="font-semibold text-ink">{fmtMoney(r.final, { decimals: 2 })}</span>
                <StatusChip tone={Q_TONE[r.status] ?? 'neutral'}>{label(r.status)}</StatusChip>
                {r.pdfFileId && <SmallButton variant="ghost" icon="folder" onClick={() => window.open(api.files.url(r.pdfFileId), '_blank')}>PDF</SmallButton>}
              </div>
            ))}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          {s.customer && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Customer" />
              <Link to={`/customers/${s.customer.id}`} className="flex items-center gap-3 rounded-[16px] bg-panel p-3"><RingAvatar initials={initials(s.customer.name)} bg={avatarClass(s.customer.name)} size={40} /><div className="flex-1"><p className="text-[14px] font-bold text-ink">{s.customer.name}</p><p className="text-[12px] text-muted">{s.customer.number}</p></div><Icon name="chev-right" size={16} className="text-muted" /></Link>
            </Panel>
          )}
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Payments" />
            {(pays.data || []).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-[13px]"><span className="font-medium text-muted">{p.mode ?? p.method ?? 'Payment'} · {fmtDate(p.paymentDate ?? p.createdAt, { year: false })}</span><span className="flex items-center gap-2 font-semibold text-ink">{fmtMoney(p.amount ?? p.portalAmount, { decimals: 2 })}<StatusChip tone={p.status === 'PAID' ? 'green' : p.status === 'FAILED' || p.status === 'REVERSED' ? 'rose' : 'amber'}>{label(p.status)}</StatusChip></span><PaymentActions payment={p} onOpen={setPay} /></div>
            ))}
            {!pays.data?.length && <p className="text-[13px] font-medium text-muted">No payments yet.</p>}
            {x.status === 'READY' && <p className="text-[13px] font-medium text-muted">Share the quotation first. Then you can record the customer’s answer and the payment.</p>}
            {canLink && <SmallButton variant="outline" icon="link" className="self-start" onClick={() => setDlg('link')}>Add payment link</SmallButton>}
          </Panel>
          <Panel className="flex flex-wrap gap-2">
            {['READY', 'SHARED'].includes(x.status) && <SmallButton variant="outline" icon="refresh" disabled={busy} onClick={() => run(() => api.quotations.revise(x.id, x.version))}>Revise</SmallButton>}
            {['READY', 'SHARED'].includes(x.status) && <SmallButton variant="outline" icon="edit" disabled={busy} onClick={() => run(() => api.quotations.edit(x.id, x.version))}>Edit</SmallButton>}
            {x.status === 'SHARED' && <SmallButton variant="danger" onClick={() => setDlg('reject')}>Mark rejected</SmallButton>}
            {!['CANCELLED', 'REJECTED', 'EXPIRED', 'DRAFT'].includes(x.status) && <SmallButton variant="danger" onClick={() => setDlg('cancel')}>Cancel</SmallButton>}
            {x.status === 'DRAFT' && <SmallButton variant="danger" disabled={busy} onClick={() => run(() => api.quotations.deleteDraft(x.id), { onDone: () => navigate('/quotations') })}>Delete draft</SmallButton>}
          </Panel>
        </div>
      </div>
      {dlg === 'share' && <ShareDialog x={x} onClose={() => setDlg(null)} />}
      {dlg === 'reject' && <RejectDialog x={x} onClose={() => setDlg(null)} />}
      {dlg === 'cancel' && <CancelQuoteDialog x={x} onClose={() => setDlg(null)} />}
      {dlg === 'pay' && <PaymentDialog x={x} premium={b.final ?? rev?.final} onClose={() => setDlg(null)} />}
      {pay && <PaymentStateDialog kind={pay.kind} payment={pay.payment} onClose={() => setPay(null)} />}
      {dlg === 'link' && <LinkDialog x={x} premium={b.final ?? rev?.final} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

function ShareDialog({ x, onClose }) {
  const [channel, setChannel] = useState('WHATSAPP')
  const { act, busy, error } = useAct()
  const save = () => act(() => api.quotations.share(x.id, channel), {
    invalidates: ['quotation', 'quotations'], quiet: true,
    onDone: (r) => { const url = r?.data?.url ?? r?.data?.link ?? r?.data?.whatsappUrl; if (url) window.open(url, '_blank', 'noopener'); onClose() },
  })
  return (
    <ActionDialog title="Share quotation" icon="send" confirm="Share" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Share by" type="select" value={channel} onChange={setChannel} options={[{ value: 'WHATSAPP', label: 'WhatsApp' }, { value: 'EMAIL', label: 'Email' }, { value: 'LINK', label: 'Copy link' }, { value: 'DOWNLOAD', label: 'Download PDF' }]} />
    </ActionDialog>
  )
}
function RejectDialog({ x, onClose }) {
  const [reason, setReason] = useState(REJECT[0])
  const [note, setNote] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.quotations.reject(x.id, { version: x.version, reason, note: note || null }), { invalidates: ['quotation', 'quotations'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Mark rejected" icon="x" tone="danger" confirm="Mark rejected" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Reason *" type="select" value={reason} onChange={setReason} options={REJECT} />
      <Field label={reason === 'Other' ? 'Note *' : 'Note'} type="textarea" value={note} onChange={setNote} error={fe.note} />
    </ActionDialog>
  )
}
function CancelQuoteDialog({ x, onClose }) {
  const [reason, setReason] = useState('')
  const { act, busy, error } = useAct()
  const save = () => act(() => api.quotations.cancel(x.id, { version: x.version, reason: reason || null }), { invalidates: ['quotation', 'quotations'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Cancel this quotation?" icon="x" tone="danger" confirm="Cancel quotation" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="Reason" value={reason} onChange={setReason} />
    </ActionDialog>
  )
}
function PaymentDialog({ x, premium, onClose }) {
  const [f, setF] = useState({ mode: PAY_MODES[0], amount: premium ?? '', paymentDate: '', reference: '', chequeNo: '', bank: '', chequeDate: '', declaration: false })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.quotations.recordPayment(x.id, {
    mode: f.mode, amount: Number(f.amount), paymentDate: dmy(f.paymentDate), reference: f.reference || null,
    cheque: f.mode === 'Cheque' ? { number: f.chequeNo, bank: f.bank, date: dmy(f.chequeDate) } : null, declaration: f.declaration,
  }), { invalidates: ['quotation', 'quotations'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Record payment" body="Record the premium the customer paid to the insurer." icon="card" confirm="Record payment" busy={busy} error={error} onConfirm={save} onClose={onClose} width={600}>
      <div className="flex gap-3">
        <Field label="Mode *" type="select" value={f.mode} onChange={set('mode')} options={PAY_MODES} />
        <Field label="Amount (₹) *" type="number" value={f.amount} onChange={set('amount')} error={fe.amount} />
        <Field label="Paid on *" type="date" value={f.paymentDate} onChange={set('paymentDate')} error={fe.paymentDate} />
      </div>
      {f.mode === 'Cheque' ? (
        <div className="flex gap-3">
          <Field label="Cheque no. *" value={f.chequeNo} onChange={set('chequeNo')} error={fe['cheque.number']} />
          <Field label="Bank *" value={f.bank} onChange={set('bank')} />
          <Field label="Cheque date *" type="date" value={f.chequeDate} onChange={set('chequeDate')} />
        </div>
      ) : <Field label="Reference / UTR" value={f.reference} onChange={set('reference')} error={fe.reference} />}
      <Field type="checkbox" label="I confirm the customer paid this amount to the insurer." value={f.declaration} onChange={set('declaration')} />
    </ActionDialog>
  )
}
function LinkDialog({ x, premium, onClose }) {
  const [f, setF] = useState({ method: 'Insurer payment link', link: '', portalAmount: premium ?? '', note: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.quotations.paymentLink(x.id, { method: f.method, link: f.link || null, portalAmount: Number(f.portalAmount), note: f.note || null }), { invalidates: ['quotation'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Add payment link" icon="link" confirm="Save" busy={busy} error={error} onConfirm={save} onClose={onClose}>
      <Field label="How will the customer pay? *" type="select" value={f.method} onChange={set('method')} options={['Insurer payment link', 'Paid at insurer branch or by cheque', 'Other insurer channel']} />
      {f.method === 'Insurer payment link' && <Field label="Link" value={f.link} onChange={set('link')} error={fe.link} placeholder="https://" />}
      <Field label="Amount on the insurer portal (₹) *" type="number" value={f.portalAmount} onChange={set('portalAmount')} error={fe.portalAmount} />
      <Field label="Note" value={f.note} onChange={set('note')} />
    </ActionDialog>
  )
}

/* ═════════════ Proposals ═════════════ */
const PR_TABS = [['all', 'All'], ['DRAFT', 'Draft'], ['SUBMITTED', 'Submitted'], ['DECLINED', 'Declined']]
const PR_TONE = { DRAFT: 'neutral', SUBMITTED: 'violet', DECLINED: 'rose', ISSUED: 'green', CANCELLED: 'neutral' }

export function LiveProposals() {
  const [tab, setTab] = useState('all')
  const [q, clearQ] = useHeaderSearch()
  const list = useQuery('proposals', () => api.proposals.list())
  const all = list.data || []
  const rows = all.filter((p) => (tab === 'all' || p.status === tab) && matchesQuery(q, p.number, p.customer?.name, p.productName, p.insurer, p.quotationNumber))
  const columns = [
    { key: 'p', label: 'Proposal', width: 250, render: (r) => <IdCell initials={initials(r.customer?.name)} bg={avatarClass(r.customer?.name)} title={r.number ?? 'Draft'} sub={r.customer?.name ?? '—'} /> },
    { key: 'product', label: 'Product', width: 260, render: (r) => <span className="truncate">{[r.insurer, r.productName].filter(Boolean).join(' · ')}</span> },
    { key: 'premium', label: 'Premium', width: 120, render: (r) => fmtMoney(r.premium) },
    { key: 'qt', label: 'Quotation', width: 170, render: (r) => `${r.quotationNumber ?? '—'} R${r.revision}` },
    { key: 'sub', label: 'Submitted', width: 110, render: (r) => (r.submittedAt ? fmtDate(r.submittedAt, { year: false }) : '—') },
    { key: 'status', label: 'Status', width: 110, render: (r) => <StatusChip tone={PR_TONE[r.status]}>{label(r.status)}</StatusChip> },
    { key: 'go', label: '', width: 40, className: 'justify-end', render: (_r, hot) => <RowChevron on={hot} /> },
  ]
  if (list.error && !list.data) return <ErrorPanel active="proposals" error={list.error} />
  return (
    <AppLayout active="proposals">
      <Header breadcrumb={'SALES  /  PROPOSALS'} title="Proposals" subtitle="Started from a paid quotation. Submit to the insurer, then record the policy." />
      <SegTabs className="mt-[13px]" items={PR_TABS.map(([key, l]) => ({ key, label: l, count: key === 'all' ? all.length : all.filter((p) => p.status === key).length }))} value={tab} onChange={setTab} />
      <DataTable className="mt-7 w-[1180px]" columns={columns} rows={rows} rowTo={(r) => `/proposals/${r.id}`}
        empty={list.loading ? 'Loading…' : q.trim() ? `No proposals match “${q.trim()}”.` : 'No proposals yet.'} onClear={q.trim() ? clearQ : undefined} />
    </AppLayout>
  )
}

export function LiveProposalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const q = useQuery(['proposal', id], () => api.proposals.get(id))
  const [dlg, setDlg] = useState(null)
  const { act, busy } = useAct()
  if (q.error) return <ErrorPanel active="proposals" error={q.error} back="/proposals" />
  if (!q.data) return <LoadingPanel active="proposals" />
  const p = q.data
  return (
    <AppLayout active="proposals">
      <Header breadcrumb={`SALES  /  PROPOSALS  /  ${p.number ?? 'DRAFT'}`} title={p.number ?? 'Draft proposal'} titleExtra={<StatusChip tone={PR_TONE[p.status]}>{label(p.status)}</StatusChip>}
        subtitle={`From quotation R${p.revision}`}
        actions={<>
          {p.status === 'DRAFT' && <HeadButton variant="white" icon="edit" to={`/proposals/${p.id}/edit`}>Members and declarations</HeadButton>}
          {p.status === 'DRAFT' && <HeadButton variant="white" icon="x" onClick={() => setDlg('cancel')}>Cancel proposal</HeadButton>}
          {p.status === 'DRAFT' && <HeadButton icon="send" onClick={() => act(() => api.proposals.submit(p.id, { version: p.version }), { invalidates: ['proposal', 'proposals', 'policies'] })} disabled={busy}>Submit to insurer</HeadButton>}
          {p.policyId && <HeadButton icon="shield" to={`/policies/${p.policyId}`}>Open policy</HeadButton>}
        </>} />
      {p.warning && <div className="mt-4 w-[756px]"><ErrorNote error={p.warning} /></div>}
      <div className="mt-6 flex items-start gap-6">
        <div className="flex w-[756px] flex-col gap-5">
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Members" subtitle={`${(p.members || []).length} insured`} />
            {(p.members || []).map((m, i) => <p key={i} className="text-[13px] font-semibold text-ink">{m.name}{m.relationship ? ` · ${m.relationship}` : ''}{m.heightCm ? ` · ${m.heightCm} cm` : ''}{m.weightKg ? ` · ${m.weightKg} kg` : ''}</p>)}
          </Panel>
          <Panel className="flex flex-col gap-3">
            <PanelHead title="Declarations" />
            {(p.declarations || []).map((d, i) => (
              <div key={i} className="flex flex-col gap-1"><p className="text-[13px] font-bold text-ink">{d.member ?? d.name ?? d.person ?? `Person ${i + 1}`}</p>
                {Object.entries(d.answers || {}).map(([k, a]) => <p key={k} className="text-[12px] font-medium text-muted">{k}: {a?.answer ? `Yes${a.condition ? ` — ${a.condition}` : ''}` : 'No'}</p>)}
              </div>
            ))}
          </Panel>
          <Panel className="flex flex-col gap-2">
            <PanelHead title="Nominees" />
            {(p.nominees || []).map((n, i) => <p key={i} className="text-[13px] font-semibold text-ink">{n.name} · {n.relationship} · {n.share}%</p>)}
            {!p.nominees?.length && <p className="text-[13px] font-medium text-muted">None yet.</p>}
          </Panel>
        </div>
        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-2">
            <PanelHead title="Quotation" />
            <SmallButton variant="outline" icon="quote" className="self-start" to={`/quotations/${p.quotationId}`}>Open quotation</SmallButton>
          </Panel>
          {p.status === 'SUBMITTED' && (
            <Panel className="flex flex-col gap-2">
              <PanelHead title="Insurer decision" subtitle={`Submitted ${fmtDate(p.submittedAt)}`} />
              {p.policyId && <SmallButton variant="navy" icon="check" className="self-start" onClick={() => navigate(`/policies/${p.policyId}/issue`)}>Record issued policy</SmallButton>}
              <SmallButton variant="danger" className="self-start" onClick={() => setDlg('decline')}>Insurer declined</SmallButton>
            </Panel>
          )}
          {p.declineReason && <Panel><PanelHead title="Declined" subtitle={p.declineReason} /></Panel>}
        </div>
      </div>
      {dlg === 'decline' && <DeclineDialog p={p} onClose={() => setDlg(null)} />}
      {dlg === 'cancel' && <CancelProposalDialog p={p} onClose={() => setDlg(null)} onDone={() => navigate('/proposals')} />}
    </AppLayout>
  )
}
function DeclineDialog({ p, onClose }) {
  const [reason, setReason] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.proposals.decline(p.id, { version: p.version, reason }), { invalidates: ['proposal', 'proposals', 'policies'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Insurer declined the proposal" icon="x" tone="danger" confirm="Record decline" busy={busy} error={error} disabled={!reason.trim()} onConfirm={save} onClose={onClose}>
      <Field label="Reason given by the insurer *" value={reason} onChange={setReason} error={fe.reason} />
    </ActionDialog>
  )
}