// F-02 · New quotation wizard on the live API (Q1–Q11). One page, ten steps, saved to the server after every step:
//   Customer → Type → Insurance → Insurer → Product → Details → Riders → Premium → Discount → Review → (Generated: opens the quotation).
// POST /quotations {customerId} starts the draft; PATCH /quotations/:id {version, step, inputs} saves a step and runs the
// step's checks; POST …/calculate prices it; POST …/generate freezes revision 1 and gives the QT number.
// Nothing is pre-filled: the lists come from GET /quotations/choices (what this advisor may quote today).
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Stepper, cx } from '../components/ui'
import { Header } from '../screens/catalogue/_parts'
import { api, invalidate, useDebounced, useQuery } from '../api'
import { fmtDate, fmtMoney } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { useToast } from '../components/LiveToast'
import { ErrorNote, Field, label } from './kit'
import { ErrorPanel, LoadingPanel } from './common'

// P-27: 10-step wizard matching the Figma stepper (Q1–Q10 + Generated)
const STEPS = ['Customer', 'Type', 'Insurance', 'Insurer', 'Product', 'Details', 'Riders', 'Premium', 'Discount', 'Review']
const CARD = 'rounded-[28px] bg-white p-7 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const DISCOUNT_PRESETS = [['', 'No preset'], ['LONG_TERM', 'Long-term discount'], ['FAMILY', 'Family discount'], ['OTHER', 'Other']]

const Choice = ({ on, onClick, title, sub, disabled }) => (
  <button type="button" disabled={disabled} onClick={onClick}
    className={cx('flex min-h-[64px] w-full items-center gap-3 rounded-[20px] border px-5 py-3 text-left transition', on ? 'border-navy bg-[#f1f4fa]' : 'border-line bg-white hover:bg-tile', disabled && 'opacity-50')}>
    <span className={cx('flex size-5 shrink-0 items-center justify-center rounded-full border', on ? 'border-navy bg-navy text-white' : 'border-line')}>{on && <Icon name="check" size={12} />}</span>
    <span className="flex min-w-0 flex-1 flex-col"><span className="text-[14px] font-bold text-ink">{title}</span>{sub && <span className="text-[12px] font-medium text-muted">{sub}</span>}</span>
  </button>
)

/** Figma Q2: big type card — Single quotation / Comparative quotation */
const TypeCard = ({ on, onClick, to, icon, iconBg, title, text }) => {
  const cls = cx(
    'flex min-w-0 flex-1 flex-col gap-3 rounded-[24px] p-5 text-left transition',
    on ? 'border-2 border-blue bg-[#f3f7ff]' : 'border border-line bg-white hover:bg-panel-2',
  )
  const inner = (
    <>
      <span className="flex w-full items-center">
        <span className={cx('flex size-12 items-center justify-center rounded-full', iconBg)}>
          <Icon name={icon} size={22} className="text-ink" />
        </span>
        <span className="flex-1" />
        <span className={cx('flex size-[22px] items-center justify-center rounded-full border', on ? 'border-[6px] border-navy bg-white' : 'border-[1.5px] border-line bg-white')} />
      </span>
      <span className="text-[16px] font-bold text-ink">{title}</span>
      <span className="text-[13px] leading-[20px] font-medium text-muted">{text}</span>
    </>
  )
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>
}

/** Figma Q3: insurance type tile with icon and coloured background */
const InsuranceTypeTile = ({ on, onClick, icon, title, sub, bg, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cx(
      'flex flex-col items-center justify-center gap-2.5 rounded-[24px] p-[18px] transition',
      bg,
      on ? 'h-[145px] w-[171px] shrink-0 border-[2.5px] border-blue' : 'h-[140px] min-w-0 flex-1',
      disabled ? 'cursor-not-allowed opacity-50' : !on && 'hover:brightness-[0.98]',
    )}
  >
    <span className="flex size-[52px] items-center justify-center rounded-full bg-white/80">
      <Icon name={icon} size={24} className="text-ink" />
    </span>
    <span className="text-[14px] font-bold whitespace-nowrap text-ink">{title}</span>
    {sub && <span className="text-[11px] font-medium whitespace-nowrap text-slate">{sub}</span>}
  </button>
)

// Icon + colour for each insurance type name
const TYPE_META = {
  health: { icon: 'heart', bg: 'bg-pink-100' },
  motor: { icon: 'car', bg: 'bg-blue-100' },
  life: { icon: 'users', bg: 'bg-violet-100' },
  term: { icon: 'umbrella', bg: 'bg-amber-100' },
  travel: { icon: 'plane', bg: 'bg-[#d4f1e7]' },
  home: { icon: 'box', bg: 'bg-[#fde8c9]' },
  personal: { icon: 'shield', bg: 'bg-[#e9e3fc]' },
}
function typeMeta(name) {
  const k = (name || '').toLowerCase()
  for (const [prefix, meta] of Object.entries(TYPE_META)) if (k.includes(prefix)) return meta
  return { icon: 'box', bg: 'bg-panel' }
}

/** Entry: /quotations/new?customerId=… starts a draft; /quotations/:id/edit resumes one. */
export default function LiveQuotationWizard({ mode = 'new' }) {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const existing = useQuery(['quotation', id], () => api.quotations.get(id), { enabled: mode === 'edit' })
  if (mode === 'edit' && existing.error) return <ErrorPanel active="quotations" error={existing.error} back="/quotations" />
  if (mode === 'edit' && !existing.data) return <LoadingPanel active="quotations" />
  if (mode === 'edit' && existing.data.status !== 'DRAFT') return <ErrorPanel active="quotations" error={{ message: 'Only a draft can be edited here. Open the quotation and choose Edit to make a new draft from it.' }} back={`/quotations/${id}`} />
  return <Wizard key={id ?? 'new'} initial={existing.data ?? null} presetCustomer={sp.get('customerId')} />
}

function Wizard({ initial, presetCustomer }) {
  const navigate = useNavigate()
  const { toast, toastError } = useToast()
  const { can } = useAuth()
  const [q, setQ] = useState(initial)
  const [customerId, setCustomerId] = useState(initial?.customerId ?? presetCustomer ?? null)
  const [inputs, setInputs] = useState(initial?.inputs ?? {})
  // Map the server's 1-based step to the 0-based 10-step UI. The backend stores the highest confirmed step (1–10).
  const [step, setStep] = useState(initial ? Math.max(0, Math.min(9, (initial.step ?? 2) - 1)) : presetCustomer ? 0 : 0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [quoteType, setQuoteType] = useState('single')
  const set = (patch) => setInputs((s) => ({ ...s, ...patch }))

  const customer = useQuery(['customer', customerId], () => api.customers.get(customerId), { enabled: !!customerId })
  const choices = useQuery(['quotation-choices', inputs.typeId ?? '', inputs.insurerId ?? ''], () => api.quotations.choices({ typeId: inputs.typeId, insurerId: inputs.insurerId }))
  const product = (choices.data?.products ?? []).find((p) => p.id === inputs.productId)
  const people = useMemo(() => (customer.data ? [
    { key: `C:${customer.data.id}`, name: customer.data.name, rel: 'Customer', age: customer.data.age },
    ...(customer.data.family ?? []).filter((m) => m.status === 'ACTIVE').map((m) => ({ key: `F:${m.id}`, name: m.name, rel: m.relationship, age: m.age })),
  ] : []), [customer.data])

  const fieldErrors = err?.fieldErrors ?? {}
  const run = async (fn) => {
    setBusy(true); setErr(null)
    try { return await fn() } catch (e) { setErr(e); return undefined } finally { setBusy(false) }
  }

  const keepVersion = (e, cur) => {
    const v = e?.details?.quotation?.version
    if (v != null) setQ((x) => ({ ...(x ?? cur), version: v, step: e.details.quotation.step ?? (x ?? cur).step }))
    return v
  }
  const save = async (cur, serverStep, body) => {
    try {
      const res = await api.quotations.saveStep(cur.id, { version: cur.version, step: serverStep, inputs: clean(body) })
      setQ(res.data)
      return res
    } catch (e) {
      keepVersion(e, cur)
      if (e?.code !== 'VERSION_CONFLICT') throw e
      const latest = (await api.quotations.get(cur.id)).data
      if (latest.status !== 'DRAFT') throw e
      try {
        const res = await api.quotations.saveStep(cur.id, { version: latest.version, step: serverStep, inputs: clean(body) })
        setQ(res.data)
        return res
      } catch (e2) { keepVersion(e2, latest); throw e2 }
    }
  }

  /**
   * Map UI step (0-based) to the backend step number (1-based, 1–10).
   * UI steps:  0=Customer 1=Type 2=Insurance 3=Insurer 4=Product 5=Details 6=Riders 7=Premium 8=Discount 9=Review
   * Backend:   1=Customer 2=Type 3=Insurance 4=Insurer 5=Product 6=Details 7=Riders 8=Premium 9=Discount 10=Review
   */
  const toBackendStep = (ui) => ui + 1

  /** Save the inputs for the step just completed, then advance. */
  const saveAndNext = (uiStep, extra = {}) => run(async () => {
    let cur = q
    if (!cur) { cur = (await api.quotations.create(customerId)).data; setQ(cur) }
    const body = { ...inputs, ...extra }
    const res = await save(cur, toBackendStep(uiStep), body)
    setInputs(res.data.inputs ?? body)
    invalidate('quotations')
    setStep(uiStep + 1)
  })

  const calculate = () => run(async () => {
    const res = await save(q, 8, inputs)
    const calc = await api.quotations.calculate(res.data.id)
    setQ(calc.data)
    return calc
  })

  const generate = () => run(async () => {
    const out = await api.quotations.generate(q.id)
    invalidate('quotations', 'quotation')
    toast(out.meta?.message)
    navigate(`/quotations/${q.id}`)
  })

  useEffect(() => () => invalidate('quotation'), [])

  // Entering the premium or review step prices the quotation with what is saved.
  useEffect(() => {
    if ((step === 7 || step === 9) && q?.id) calculate().catch(toastError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const b = q?.calc?.breakdown
  const ren = q?.renewal
  const header = ren
    ? <Header back="/renewals" breadcrumb={`RENEWALS  /  ${(customer.data?.name ?? '').toUpperCase()}  /  RENEWAL QUOTATION`} title={ren.mode === 'NEW_QUOTATION' ? 'New quotation for renewal' : 'Renewal quotation'}
        titleExtra={<span className="flex items-center gap-1 rounded-[14px] bg-[#e8f0fd] px-2.5 py-1 text-[12px] font-semibold text-[#1f5fd6]"><Icon name={ren.mode === 'NEW_QUOTATION' ? 'quote' : 'refresh'} size={13} />{ren.mode === 'NEW_QUOTATION' ? 'New quotation' : 'Same policy'}</span>}
        subtitle={customer.data ? `${customer.data.name} · ${customer.data.number}` : ''} />
    : <Header back="/quotations" breadcrumb="QUOTATIONS  /  NEW" title="New quotation"
        titleExtra={q ? <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#127650]"><Icon name="check" size={13} />Draft saved</span> : null}
        subtitle={customer.data ? customer.data.name : ''} />

  const canNext = [
    !!customerId, true, !!inputs.typeId, !!inputs.insurerId, !!inputs.productId,
    !!(inputs.people?.length && inputs.sumInsured && inputs.policyTerm && inputs.startDate),
    true, !!b, true, !!b,
  ][step]

  const nextLabels = ['Next: Type', 'Next: Insurance type', 'Next: Insurer', 'Next: Product', 'Next: Details', 'Next: Riders', 'Next: Premium', 'Next: Discount', 'Next: Review']

  const summaryRows = [
    ['Customer', customer.data?.name],
    ['Type', quoteType === 'single' ? 'Single quotation' : 'Comparative'],
    ['Insurance', (choices.data?.types ?? []).find((t) => t.id === inputs.typeId)?.name],
    ['Insurer', (choices.data?.insurers ?? []).find((i) => i.id === inputs.insurerId)?.name],
    ['Product', product?.name],
    ['People and cover', inputs.people?.length ? `${inputs.people.length} ${inputs.people.length === 1 ? 'person' : 'people'}${inputs.sumInsured ? ` · ${fmtMoney(inputs.sumInsured)}` : ''}` : null],
  ]

  const handleNext = () => {
    setErr(null)
    // Step 1 (Type): local-only, just advance
    if (step === 1) { setStep(2); return }
    // Step 7 (Premium): calculation already happened via useEffect, just advance
    if (step === 7) { setStep(8); return }
    // All other steps: save to backend then advance
    saveAndNext(step)
  }

  return (
    <AppLayout active="quotations">
      {header}
      {ren && (
        <div className="mt-4 flex items-center gap-4 rounded-[24px] bg-linear-to-r from-[#fde7d2] to-[#f9d6b5] px-5 py-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-white"><Icon name="refresh" size={18} className="text-ink" /></span>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[14px] font-bold text-ink">Renewal of the current policy{ren.portabilityRequested ? ' · portability requested' : ''}</p>
            <p className="text-[12px] font-medium text-[#8a5a12]">{ren.mode === 'SAME_POLICY' ? 'Same customer, product, people and sum insured. Withdrawn products are still allowed for renewals.' : 'A new product or insurer replaces the current policy when this is accepted.'}</p>
          </div>
          {ren.previousPremium != null && <span className="rounded-[14px] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-ink">Last year {fmtMoney(ren.previousPremium, { decimals: 2 })}{b ? ` · this year ${fmtMoney(b.final, { decimals: 2 })}` : ''}</span>}
        </div>
      )}
      <Stepper className="mt-4" steps={STEPS} current={step} />

      <div className="mt-5 flex items-start gap-5">
        {/* Main step card */}
        <div className={cx('flex min-w-0 flex-1 flex-col gap-5', CARD)}>
          {step === 0 && <CustomerStep customerId={customerId} onPick={(c) => { setCustomerId(c.id); setQ(null) }} locked={!!q} />}

          {step === 1 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Quotation type</p><p className="text-[12px] font-medium text-muted">Single, or 2 to 3 products side by side</p></div>
              <div className="flex items-start gap-4">
                <TypeCard on={quoteType === 'single'} onClick={() => setQuoteType('single')} icon="quote" iconBg="bg-amber-100" title="Single quotation" text="One product. Can carry the insurer's payment link." />
                <TypeCard on={quoteType === 'comparative'} to="/comparisons/new" icon="compare" iconBg="bg-[#d4f1e7]" title="Comparative quotation" text="2 to 3 products or variants side by side. No payment link." />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div><p className="text-[17px] font-bold text-ink">Insurance type</p><p className="text-[12px] font-medium text-muted">Only the categories on your licence</p></div>
              {choices.loading && !choices.data && <p className="text-[13px] font-medium text-muted">Loading…</p>}
              {choices.data?.types?.length > 0 && (
                <div className="flex flex-wrap items-start gap-3.5">
                  {choices.data.types.map((t) => {
                    const m = typeMeta(t.name)
                    return <InsuranceTypeTile key={t.id} on={inputs.typeId === t.id} onClick={() => set({ typeId: t.id, insurerId: undefined, productId: undefined })} icon={m.icon} title={t.name} bg={m.bg} />
                  })}
                </div>
              )}
              {!choices.loading && !(choices.data?.types ?? []).length && (
                <div className="flex items-center gap-3 rounded-[16px] border border-[#f1d6a6] bg-[#fdf6ea] px-4 py-3">
                  <p className="flex-1 text-[13px] font-semibold text-[#8a5a12]">No insurance type is open to you yet. Tick the insurance categories you are licensed for in My profile → Professional details, then come back.</p>
                  <Link to="/settings" className="shrink-0 rounded-[12px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-panel-2">Open My profile</Link>
                </div>
              )}
            </>
          )}

          {step === 3 && <ListStep title="Which insurer?" items={choices.data?.insurers} empty="No insurer with an active agent code yet. Add the insurers you sell for, with your agent code, in My insurers." emptyAction={{ label: 'Open My insurers', to: '/settings/insurers' }} value={inputs.insurerId} onPick={(i) => set({ insurerId: i.id, productId: undefined })} loading={choices.loading} />}
          {step === 4 && <ListStep title="Which product?" items={choices.data?.products} empty="No quotable product for this insurer and type." value={inputs.productId} onPick={(p) => set({ productId: p.id, riders: [], sumInsured: undefined, policyTerm: undefined })} loading={choices.loading} sub={(p) => label(p.pricingMode)} />}
          {step === 5 && <DetailsStep people={people} product={product} inputs={inputs} set={set} errors={fieldErrors} />}
          {step === 6 && <RidersStep product={product} inputs={inputs} set={set} />}
          {step === 7 && <PremiumStep b={b} product={product} inputs={inputs} set={set} busy={busy} onRecalc={calculate} errors={fieldErrors} />}
          {step === 8 && (can?.('quotations.pricing') ?? true) && <DiscountStep inputs={inputs} set={set} errors={fieldErrors} />}
          {step === 8 && can && !can('quotations.pricing') && <p className="text-[14px] font-medium text-muted">Price override and discount are the advisor's only. Continue to review.</p>}
          {step === 9 && <ReviewStep b={b} inputs={inputs} product={product} people={people} customer={customer.data} choices={choices.data} />}

          <ErrorNote error={err} />

          <div className="flex items-center gap-3">
            <button type="button" disabled={step === 0 || busy} onClick={() => { setErr(null); setStep(step - 1) }} className="flex h-[48px] w-[140px] items-center justify-center rounded-[24px] border border-line text-[14px] font-semibold text-ink disabled:opacity-40">Back</button>
            {q && <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted"><Icon name="check" size={16} className="text-muted" />Draft saved</span>}
            <span className="flex-1" />
            {step < 9 && (
              <button type="button" disabled={busy || !canNext} onClick={handleNext}
                className="flex h-[48px] items-center gap-2 rounded-[24px] bg-navy px-6 text-[14px] font-semibold text-white shadow-[0px_10px_10px_rgba(19,41,75,0.25)] disabled:opacity-50 disabled:shadow-none">
                <Icon name="arrow" size={18} />{busy ? 'Saving…' : nextLabels[step]}
              </button>
            )}
            {step === 9 && (
              <button type="button" disabled={busy || !b} onClick={generate}
                className="flex h-[48px] items-center gap-2 rounded-[24px] bg-navy px-6 text-[14px] font-semibold text-white shadow-[0px_10px_10px_rgba(19,41,75,0.25)] disabled:opacity-50 disabled:shadow-none">
                <Icon name="sparkle" size={16} />{busy ? 'Generating…' : 'Generate quotation'}
              </button>
            )}
          </div>
        </div>

        {/* Figma: pink "Your quotation" live summary */}
        <div className="w-[400px] shrink-0 rounded-[28px] bg-gradient-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_18px_rgba(232,137,156,0.25)]">
          <div className="flex items-start justify-between">
            <div><p className="text-[17px] font-bold text-ink">Your quotation</p><p className="text-[12px] font-medium text-muted">Builds up as you go</p></div>
            <span className="rounded-[14px] bg-[#fde8ec] px-3 py-[5px] text-[12px] font-semibold text-[#b4325a]">Draft</span>
          </div>
          <div className="mt-3.5 flex flex-col gap-3 rounded-[20px] bg-white/75 p-4">
            {summaryRows.map(([k, v]) => (
              <div key={k} className="flex items-center"><span className="flex-1 text-[12px] font-medium text-[#8b3a4c]">{k}</span><span className={cx('text-[13px] font-bold', v ? 'text-ink' : 'text-[#b98b96]')}>{v || '—'}</span></div>
            ))}
          </div>
          {b && (
            <div className="mt-3.5 flex flex-col gap-1 rounded-[20px] bg-white/75 p-4">
              <div className="flex items-center justify-between"><span className="text-[12px] font-medium text-[#8b3a4c]">Total payable</span><span className="text-[20px] font-bold text-ink">{fmtMoney(b.final, { decimals: 2 })}</span></div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function clean(i) {
  const out = {}
  for (const k of ['typeId', 'insurerId', 'productId', 'people', 'sumInsured', 'policyTerm', 'startDate', 'answers', 'riders', 'override', 'discount', 'manual', 'typedBasePremium']) {
    const v = i[k]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length && k !== 'riders')) continue
    out[k] = v
  }
  return out
}

function CustomerStep({ customerId, onPick, locked }) {
  const [text, setText] = useState('')
  const s = useDebounced(text, 300)
  const found = useQuery(['customers', 'quote-pick', s], () => api.customers.list({ search: s || undefined, status: 'ACTIVE', limit: 8 }))
  const chosen = useQuery(['customer', customerId], () => api.customers.get(customerId), { enabled: !!customerId })
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Customer</p><p className="text-[12px] font-medium text-muted">Only active customers can be quoted</p></div>
      {customerId && chosen.data
        ? <Choice on title={chosen.data.name} sub={`${chosen.data.number} · ${chosen.data.status === 'ACTIVE' ? 'Active' : 'Inactive'}`} />
        : <p className="text-[13px] font-medium text-muted">Search your policy holders. New people are added under Policy holders first.</p>}
      {!locked && (
        <>
          <Field label="Search customers" value={text} onChange={setText} placeholder="Name, phone or CU number" />
          <div className="flex flex-col gap-2">
            {(found.data ?? []).map((c) => <Choice key={c.id} on={c.id === customerId} onClick={() => onPick(c)} title={c.name} sub={`${c.number} · ${c.city ?? 'No city'}`} />)}
            {found.data && !found.data.length && <p className="text-[13px] font-medium text-muted">No active policy holder matches.</p>}
          </div>
          <Link to="/customers/new" className="flex items-center gap-2 self-start text-[13px] font-bold text-blue hover:underline">
            <Icon name="plus" size={16} strokeWidth={2} />Not here? Add a new customer
          </Link>
        </>
      )}
    </>
  )
}

function ListStep({ title, items, empty, emptyAction, value, onPick, loading, sub }) {
  return (
    <>
      <p className="text-[17px] font-bold text-ink">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {(items ?? []).map((i) => <Choice key={i.id} on={value === i.id} onClick={() => onPick(i)} title={i.name} sub={sub?.(i)} />)}
      </div>
      {!loading && !(items ?? []).length && (
        <div className="flex items-center gap-3 rounded-[16px] border border-[#f1d6a6] bg-[#fdf6ea] px-4 py-3">
          <p className="flex-1 text-[13px] font-semibold text-[#8a5a12]">{empty}</p>
          {emptyAction && <Link to={emptyAction.to} className="shrink-0 rounded-[12px] border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-panel-2">{emptyAction.label}</Link>}
        </div>
      )}
      {loading && !items && <p className="text-[13px] font-medium text-muted">Loading…</p>}
    </>
  )
}

const isYesNo = (t) => ['Yes/No', 'YES_NO', 'BOOLEAN'].includes(t)
const isNumeric = (t) => ['Number', 'Amount in ₹', 'Percentage', 'Days', 'Months', 'Years', 'NUMBER'].includes(t)

function DetailsStep({ people, product, inputs, set, errors }) {
  const si = product?.sumInsured ?? {}
  const siOptions = Array.isArray(si.options) ? si.options : null
  const terms = Array.isArray(product?.policyTerms) ? product.policyTerms : []
  const toggle = (k) => set({ people: inputs.people?.includes(k) ? inputs.people.filter((x) => x !== k) : [...(inputs.people ?? []), k] })
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Who is covered, and for how much?</p><p className="text-[12px] font-medium text-muted">Toggle people to cover, choose sum insured and policy term</p></div>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">People to insure *</span>
        {people.map((p) => <Choice key={p.key} on={inputs.people?.includes(p.key)} onClick={() => toggle(p.key)} title={p.name} sub={`${p.rel}${p.age != null ? ` · ${p.age} years` : ' · add date of birth for age-based pricing'}`} />)}
        {errors.people && <span className="text-[12px] font-semibold text-[#b4323c]">{errors.people}</span>}
      </div>
      <div className="flex gap-3">
        {siOptions
          ? <Field label="Sum insured *" type="select" value={inputs.sumInsured ?? ''} onChange={(v) => set({ sumInsured: v === '' ? undefined : Number(v) })} options={[{ value: '', label: 'Choose' }, ...siOptions.map((o) => ({ value: o, label: fmtMoney(o) }))]} error={errors.sumInsured} />
          : <Field label="Sum insured (₹) *" type="number" value={inputs.sumInsured ?? ''} onChange={(v) => set({ sumInsured: v === '' ? undefined : v })} error={errors.sumInsured} />}
        {terms.length
          ? <Field label="Policy term (years) *" type="select" value={inputs.policyTerm ?? ''} onChange={(v) => set({ policyTerm: v === '' ? undefined : Number(v) })} options={[{ value: '', label: 'Choose' }, ...terms.map((t) => ({ value: t, label: `${t} year${t === 1 ? '' : 's'}` }))]} error={errors.policyTerm} />
          : <Field label="Policy term (years) *" type="number" value={inputs.policyTerm ?? ''} onChange={(v) => set({ policyTerm: v === '' ? undefined : v })} error={errors.policyTerm} />}
        <Field label="Planned start date *" type="date" value={inputs.startDate ?? ''} onChange={(v) => set({ startDate: v || undefined })} error={errors.startDate} />
      </div>
      {(product?.questions ?? []).length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-ink">Questions for this insurance type</span>
          <div className="grid grid-cols-2 gap-3">
            {product.questions.map((qn) => {
              const v = inputs.answers?.[qn.key] ?? ''
              const put = (x) => set({ answers: { ...(inputs.answers ?? {}), [qn.key]: x } })
              return isYesNo(qn.dataType)
                ? <Field key={qn.key} label={`${qn.label}${qn.required ? ' *' : ''}`} type="select" value={v === '' ? '' : String(v)} onChange={(x) => put(x === '' ? '' : x === 'true')} options={[{ value: '', label: 'Choose' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]} error={errors[`answers.${qn.key}`]} />
                : <Field key={qn.key} label={`${qn.label}${qn.required ? ' *' : ''}`} type={isNumeric(qn.dataType) ? 'number' : 'text'} value={v} onChange={put} error={errors[`answers.${qn.key}`]} />
            })}
          </div>
        </div>
      )}
    </>
  )
}

function RidersStep({ product, inputs, set }) {
  const addOns = (product?.addOns ?? []).map((a) => (typeof a === 'string' ? { name: a } : a))
  const on = (n) => (inputs.riders ?? []).includes(n)
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Riders and add-ons</p><p className="text-[12px] font-medium text-muted">Tick the riders this product offers</p></div>
      {addOns.length
        ? <div className="grid grid-cols-2 gap-3">{addOns.map((a) => <Choice key={a.name} on={on(a.name)} title={a.name} sub={a.description} onClick={() => set({ riders: on(a.name) ? inputs.riders.filter((x) => x !== a.name) : [...(inputs.riders ?? []), a.name] })} />)}</div>
        : <p className="text-[13px] font-medium text-muted">This product has no riders. Continue.</p>}
    </>
  )
}

function PremiumStep({ b, product, inputs, set, busy, onRecalc, errors }) {
  const manual = product?.pricingMode === 'MANUAL_ENTRY'
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Premium</p><p className="text-[12px] font-medium text-muted">Calculated from the rate table. Order: base → riders → override → discount → GST.</p></div>
      {manual && (
        <div className="flex gap-3">
          <Field label="Net premium (₹) *" type="number" value={inputs.manual?.netPremium ?? ''} onChange={(v) => set({ manual: { ...(inputs.manual ?? {}), netPremium: v === '' ? undefined : v } })} error={errors['manual.netPremium']} />
          <Field label="Tax amount (₹)" type="number" value={inputs.manual?.taxAmount ?? ''} onChange={(v) => set({ manual: { ...(inputs.manual ?? {}), taxAmount: v === '' ? undefined : v } })} />
          <button type="button" onClick={onRecalc} disabled={busy} className="mt-[26px] h-[50px] rounded-[25px] bg-navy px-6 text-[13px] font-semibold text-white disabled:opacity-60">Calculate</button>
        </div>
      )}
      {b ? <Breakdown b={b} /> : <p className="text-[13px] font-medium text-muted">{busy ? 'Calculating…' : 'The premium appears here once it is calculated.'}</p>}
    </>
  )
}

export function Breakdown({ b }) {
  const rows = [
    ['Base premium', b.base],
    ...(b.riders ?? []).map((r) => [`Rider · ${r.name}`, r.amount]),
    ...(b.override !== null && b.override !== undefined ? [['Price override', b.override]] : []),
    ...(b.discount ? [['Discount', -b.discount]] : []),
    [`Tax${b.taxPercent != null ? ` (${b.taxPercent}%)` : ''}`, b.tax],
  ]
  return (
    <div className="flex flex-col gap-2 rounded-[20px] bg-panel p-5">
      {rows.map(([k, v]) => <div key={k} className="flex justify-between text-[14px] font-semibold text-ink"><span className="text-muted">{k}</span><span>{fmtMoney(v, { decimals: 2 })}</span></div>)}
      <div className="mt-1 flex justify-between border-t border-line pt-3 text-[18px] font-bold text-ink"><span>Total payable</span><span>{fmtMoney(b.final, { decimals: 2 })}</span></div>
    </div>
  )
}

function DiscountStep({ inputs, set, errors }) {
  const d = inputs.discount
  const o = inputs.override
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Discount or price override (optional)</p><p className="text-[12px] font-medium text-muted">A discount needs a reference. An override replaces the calculated premium and is recorded with its reason.</p></div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Discount type" type="select" value={d?.kind ?? ''} onChange={(v) => set({ discount: v ? { kind: v, value: d?.value ?? 0, reference: d?.reference ?? '', preset: d?.preset } : null })} options={[{ value: '', label: 'No discount' }, { value: 'AMOUNT', label: 'Amount (₹)' }, { value: 'PERCENT', label: 'Percent (%)' }]} />
        <Field label="Discount value" type="number" disabled={!d} value={d?.value ?? ''} onChange={(v) => set({ discount: { ...d, value: v === '' ? 0 : v } })} error={errors['discount.value'] ?? errors.discount} />
        <Field label="Reference *" disabled={!d} value={d?.reference ?? ''} onChange={(v) => set({ discount: { ...d, reference: v } })} placeholder="Why this discount" error={errors['discount.reference']} />
        <Field label="Preset" type="select" disabled={!d} value={d?.preset ?? ''} onChange={(v) => set({ discount: { ...d, preset: v || undefined } })} options={DISCOUNT_PRESETS.map(([v, l]) => ({ value: v, label: l }))} />
        <Field label="Override premium (₹)" type="number" value={o?.amount ?? ''} onChange={(v) => set({ override: v === '' ? null : { amount: v, reason: o?.reason ?? '' } })} error={errors['override.amount']} />
        <Field label="Override reason" disabled={!o} value={o?.reason ?? ''} onChange={(v) => set({ override: { ...o, reason: v } })} />
      </div>
    </>
  )
}

function ReviewStep({ b, inputs, product, people, customer, choices }) {
  const pick = (list, id) => list?.find((x) => x.id === id)?.name
  const rows = [
    ['Customer', customer?.name], ['Insurance type', pick(choices?.types, inputs.typeId)], ['Insurer', pick(choices?.insurers, inputs.insurerId)], ['Product', product?.name],
    ['Insured', people.filter((p) => inputs.people?.includes(p.key)).map((p) => p.name).join(', ')], ['Sum insured', fmtMoney(inputs.sumInsured)],
    ['Policy term', inputs.policyTerm ? `${inputs.policyTerm} year(s)` : '—'], ['Start date', fmtDate(inputs.startDate)], ['Riders', (inputs.riders ?? []).join(', ') || 'None'],
  ]
  return (
    <>
      <div><p className="text-[17px] font-bold text-ink">Review and generate</p><p className="text-[12px] font-medium text-muted">Every check runs again before the PDF is made.</p></div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">{rows.map(([k, v]) => <div key={k} className="flex flex-col"><span className="text-[12px] font-medium text-muted">{k}</span><span className="text-[14px] font-semibold text-ink">{v || '—'}</span></div>)}</div>
      {b ? <Breakdown b={b} /> : <p className="text-[13px] font-medium text-muted">Calculating…</p>}
      <p className="text-[12px] font-medium text-muted">Generating freezes this revision, gives it a quotation number and a PDF. You can share it next.</p>
    </>
  )
}
