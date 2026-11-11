// AP1–AP7, OC1 · Add my product · PV1–PV2 · My price versions · 10b · Compare variants — on the live API.
//   /products/new            GET /my-products/types, /types/:id/template, /insurers · POST /my-products/types|insurers
//                            brochure: POST /files → POST /my-products/brochure-reading → GET (poll) → PUT decisions /
//                            accept-high → POST result (prefills the form) · POST /my-products
//   /products/:id/prices     GET /products/:id/prices, /prices/template · POST /prices/check, /prices, /prices/:pid/cancel
//   /products/:id/variants   GET /products/:id (variants with their own feature values)
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, Panel, PanelHead, SmallButton, StatusChip } from '../screens/catalogue/_parts'
import { api, useQuery } from '../api'
import { fmtDate, fmtMoney } from '../api/format'
import { ActionDialog, Field, ErrorNote, useAct, label, dmy, isoDay, inputCls } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { Stepper as FlowStepper, StepCard, StepFooter, PreviewCard, Btn, Chip, Note, TextInput, Field as FlowField } from '../screens/flow-add-product/_parts'
import { Dropdown } from '../components/pickers'
import { useToast } from '../components/LiveToast'
import ProductDetailsForm, { categoryKey, detailsBody, detailsFromData, missingRequired } from './ProductDetailsForm'

// Tile look for a category (Figma AP1): icon + pastel background, picked from the category's name.
const catLook = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('health')) return { icon: 'heart', bg: 'bg-[#fde8ec]' }
  if (n.includes('motor') || n.includes('car') || n.includes('wheeler') || n.includes('vehicle')) return { icon: 'car', bg: 'bg-[#d9eafd]' }
  if (n.includes('term')) return { icon: 'umbrella', bg: 'bg-[#fde8c9]' }
  if (n.includes('life')) return { icon: 'users', bg: 'bg-[#e9e3fc]' }
  if (n.includes('travel')) return { icon: 'plane', bg: 'bg-[#d4f1e7]' }
  if (n.includes('home') || n.includes('property') || n.includes('fire')) return { icon: 'shield', bg: 'bg-[#e3f3f7]' }
  if (n.includes('accident')) return { icon: 'alert', bg: 'bg-[#fbebec]' }
  return { icon: 'box', bg: 'bg-[#eef1f5]' }
}
// Template data types (backend types.model DATA_TYPES) that hold a number: typed as text, sent as a number when it is one.
const NUMERIC_TYPES = new Set(['Number', 'Amount in ₹', 'Percentage', 'Days', 'Months', 'Years'])
const UNIT_HINT = { 'Amount in ₹': '₹', Percentage: '%', Days: 'days', Months: 'months', Years: 'years' }
function toFeatureValue(f, dataType) {
  if (f.notStated || !NUMERIC_TYPES.has(dataType) || typeof f.value !== 'string') return f
  const n = Number(f.value.replace(/[₹,%\s]/g, ''))
  return Number.isFinite(n) && f.value.trim() !== '' ? { ...f, value: n } : f
}
const nums = (v) => String(v ?? '').split(',').map((x) => Number(x.trim().replace(/[₹,\s]/g, ''))).filter((n) => n > 0)

/* ═════════════ AP1–AP7 · Add my product ═════════════ */
export function LiveAddProduct() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const types = useQuery('my-products:types', () => api.myProducts.types())
  const [typeId, setTypeId] = useState('')
  const tpl = useQuery(['my-products:template', typeId], () => api.myProducts.typeTemplate(typeId), { enabled: !!typeId })
  // Step 2 lists only companies that sell the category chosen in step 1 (life insurers for Term Life, general for Home…)
  const insurers = useQuery(['my-products:insurers', typeId], () => api.myProducts.insurers(typeId ? { typeId } : undefined), { enabled: !!typeId })
  const [insurerId, setInsurerId] = useState('')
  const [code, setCode] = useState('')
  const [d, setD] = useState({ name: '', uin: '', launchDate: '', adultMin: 18, adultMax: 65, coversChildren: false, childMin: '', childMax: '', siOptions: '', siMin: '', siMax: '', policyTerms: '1', pricingMode: 'MANUAL_ENTRY', taxPercent: 18, gracePeriodDays: 30, nomineeRequired: true, brochureFileId: null, sourceLink: '' })
  const set = (k) => (v) => setD((s) => ({ ...s, [k]: v }))
  const [features, setFeatures] = useState({}) // key → { value, notStated }
  const [details, setDetails] = useState({}) // the category's own product details (Home: covers, perils…)
  const [variants, setVariants] = useState([{ name: 'Standard', coverType: 'INDIVIDUAL', sumInsuredMin: '', sumInsuredMax: '' }])
  const [ocrJobId, setOcrJobId] = useState(null)
  const [newCat, setNewCat] = useState('')
  const [newCo, setNewCo] = useState('')
  const { act, busy, error, fieldErrors: fe } = useAct()

  // brochure reading (AP2b–AP2d, OC1)
  const [job, setJob] = useState(null)
  const [reading, setReading] = useState(false)
  const [readErr, setReadErr] = useState(null)
  useEffect(() => {
    if (!job || !['QUEUED', 'RUNNING', 'PENDING', 'PROCESSING'].includes(job.status)) return undefined
    const t = setTimeout(async () => { try { setJob((await api.myProducts.reading(job.id)).data) } catch (e) { setReadErr(e) } }, 2500)
    return () => clearTimeout(t)
  }, [job])
  const [brochureName, setBrochureName] = useState('')
  const startReading = async (file) => {
    setReading(true); setReadErr(null)
    try {
      // The PDF is attached to the product first: it stays attached even when it cannot be read.
      const fileId = (await api.files.upload(file, 'BROCHURE')).data.id
      set('brochureFileId')(fileId)
      setBrochureName(file.name)
      if (canRead) setJob((await api.myProducts.startReading({ typeId, fileId })).data)
    } catch (e) {
      if (e?.messageId === 'OCR-07') return // reading switched off: attached, values typed by hand
      setReadErr(e)
    } finally { setReading(false) }
  }
  const removeBrochure = () => { set('brochureFileId')(null); setBrochureName(''); setJob(null); setReadErr(null) }
  const decide = async (row, decision, value) => {
    try { setJob((await api.myProducts.readingDecisions(job.id, { decisions: [{ section: row.section, key: row.key, decision, value: value ?? null }] })).data) } catch (e) { setReadErr(e) }
  }
  const useReading = async () => {
    try {
      const r = (await api.myProducts.readingResult(job.id, {})).data
      setOcrJobId(r.ocrJobId)
      const x = r.data || {}
      setD((s) => ({ ...s, ...Object.fromEntries(['name', 'uin', 'adultMin', 'adultMax', 'childMin', 'childMax', 'pricingMode', 'taxPercent', 'gracePeriodDays'].filter((k) => x[k] != null).map((k) => [k, x[k]])),
        launchDate: x.launchDate ? isoDay(x.launchDate) : s.launchDate, coversChildren: x.coversChildren ?? s.coversChildren,
        siOptions: x.sumInsured?.options?.join(', ') ?? s.siOptions, siMin: x.sumInsured?.min ?? s.siMin, siMax: x.sumInsured?.max ?? s.siMax, policyTerms: x.policyTerms?.join(', ') ?? s.policyTerms }))
      if (x.features) setFeatures(x.features)
      if (x.details) setDetails((cur) => ({ ...cur, ...detailsFromData(form, x.details) }))
      if (r.variants?.length) setVariants(r.variants.map((v) => ({ ...v, sumInsuredMin: v.sumInsuredMin ?? '', sumInsuredMax: v.sumInsuredMax ?? '' })))
      toast('Values from the brochure are filled in. Check each step.')
      setStep(3)
    } catch (e) { setReadErr(e) }
  }

  const body = () => ({
    insurerId, typeId, code: code.trim(), ...(ocrJobId ? { ocrJobId } : {}),
    data: {
      name: d.name || undefined, uin: d.uin || undefined, launchDate: d.launchDate ? dmy(d.launchDate) : undefined,
      // Entry ages only where the category has them (none for Motor or Home; no children for Term Life)
      ...(ages !== 'NONE' ? { adultMin: Number(d.adultMin), adultMax: Number(d.adultMax) } : {}),
      coversChildren: ages === 'ADULT_CHILD' && !!d.coversChildren,
      ...(ages === 'ADULT_CHILD' && d.coversChildren ? { childMin: Number(d.childMin), childMax: Number(d.childMax) } : {}),
      sumInsured: { ...(nums(d.siOptions).length ? { options: nums(d.siOptions) } : {}), ...(d.siMin ? { min: Number(d.siMin) } : {}), ...(d.siMax ? { max: Number(d.siMax) } : {}) },
      policyTerms: nums(d.policyTerms), pricingMode: d.pricingMode, taxPercent: Number(d.taxPercent), gracePeriodDays: Number(d.gracePeriodDays), nomineeRequired: !!d.nomineeRequired,
      ...(d.brochureFileId ? { brochureFileId: d.brochureFileId } : {}), ...(d.sourceLink ? { sourceLink: d.sourceLink } : {}),
      details: detailsBody(form, details),
      features: Object.fromEntries(Object.entries(features).filter(([, f]) => f && (f.notStated || (f.value !== '' && f.value != null))).map(([k, f]) => [k, toFeatureValue(f, feats.find((x) => x.key === k)?.dataType)])),
    },
    variants: variants.filter((v) => v.name.trim()).map((v) => ({ name: v.name.trim(), coverType: (form?.variantCoverTypes !== false && v.coverType) || undefined, ...(v.sumInsuredMin ? { sumInsuredMin: Number(v.sumInsuredMin) } : {}), ...(v.sumInsuredMax ? { sumInsuredMax: Number(v.sumInsuredMax) } : {}), ...(v.features ? { features: v.features } : {}) })),
  })
  const publish = () => act(() => api.myProducts.create(body()), { invalidates: ['products'], quiet: true, success: 'Product published in your account.', onDone: (r) => navigate(`/products/${r.data.id}`) })

  const T = (types.data || [])
  const I = (insurers.data || [])
  // A new category means a new company list: the earlier pick may not sell it.
  const pickType = (id) => { if (id !== typeId) { setInsurerId(''); setDetails({}); setFeatures({}) } setTypeId(id) }
  const typeName = T.find((t) => t.id === typeId)?.name
  const insName = I.find((t) => t.id === insurerId)?.name
  const canNext = [!!typeId, !!insurerId, true, !!code.trim() && !!d.name && !!d.uin && !detailsMissing.length, variants.some((v) => v.name.trim()), true, true][step]
  const feats = tpl.data?.features ?? []
  // The category's product form: which shared fields apply and what they are called, plus its own details.
  const form = tpl.data?.form ?? null
  const ages = form?.entryAges ?? 'ADULT_CHILD'
  const L = form?.labels ?? { sumInsured: 'Sum insured', policyTerms: 'Policy terms (years)', adultEntryAge: 'Adult entry age' }
  const canRead = tpl.data?.brochureReading !== false
  const detailsMissing = missingRequired(form, details)
  // A new category that means one already listed ("Health insurance" next to Health) is refused here and by the API.
  const sameCat = newCat.trim() ? T.find((t) => categoryKey(t.name) === categoryKey(newCat)) : null
  const groups = [...new Set(feats.map((f) => f.group || 'Features'))]
  const addCategory = () => {
    const name = newCat.trim()
    if (!name || busy || sameCat) return
    act(() => api.myProducts.createType({ name }), { invalidates: ['my-products'], onDone: (r) => { pickType(r.data.id); setNewCat('') } })
  }
  const namedVariants = variants.map((v) => v.name.trim()).filter(Boolean)
  const filledFeatures = Object.values(features).filter((f) => f && (f.notStated || (f.value !== '' && f.value != null))).length
  const preview = [
    typeName,
    insName,
    d.name,
    step >= 4 && namedVariants.length ? `${namedVariants.length} · ${namedVariants.join(', ')}` : null,
    step >= 5 && feats.length ? `${filledFeatures} of ${feats.length}` : null,
  ]

  return (
    <AppLayout active="products">
      <Header
        back="/products"
        breadcrumb={'PRODUCTS  /  ADD MY PRODUCT'}
        title="Add my product"
        titleExtra={<Chip tone="green" icon="check">Draft saved</Chip>}
        subtitle="Add a product the catalogue does not have"
        search={false}
        actions={<Btn variant="outline" icon="download" onClick={() => navigate('/products')}>Save and exit</Btn>}
      />
      <FlowStepper current={step + 1} />
      <div className="mt-[35px] mb-5 flex items-start gap-5">
        <div className="flex w-[760px] shrink-0 flex-col gap-5">
          {step === 0 && (
            <StepCard title="1 · Product category" subtitle="Decides which features SkyUp’s template asks for">
              {types.loading && !types.data && <p className="text-[13px] font-medium text-muted">Loading categories…</p>}
              {types.error && <ErrorNote error={types.error} />}
              {T.length > 0 && (
                <div className="grid grid-cols-5 items-start gap-3">
                  {T.map((t) => {
                    const on = typeId === t.id
                    const look = catLook(t.name)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => pickType(t.id)}
                        className={cx('relative flex min-w-0 flex-col items-center gap-2.5 rounded-[24px] border-[2.5px] px-3 py-5 transition', look.bg, on ? 'border-blue' : 'border-transparent hover:brightness-[0.98]')}
                      >
                        {t.private && <span className="absolute top-2.5 right-2.5 rounded-[10px] bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-muted">Mine</span>}
                        <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-ink">
                          <Icon name={look.icon} size={26} />
                        </span>
                        <span className="w-full truncate text-center text-[15px] font-bold text-ink" title={t.name}>{t.name}</span>
                        {on && <Chip tone="blue" icon="check">Selected</Chip>}
                      </button>
                    )
                  })}
                </div>
              )}
              {types.data && !T.length && <p className="text-[13px] font-medium text-muted">No categories yet. Add one below.</p>}

              <div className="flex flex-col gap-3 rounded-[18px] border border-[#c9daf8] bg-[#f7f9ff] p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-white text-blue">
                    <Icon name="plus" size={16} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-bold text-ink">Category not listed?</p>
                    <p className="text-[12px] font-medium text-muted">Create your own. It’s added only to your account, without a standard feature template.</p>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <FlowField label="New category name *" className="flex-1">
                    <TextInput tone="white" placeholder="e.g. Pet insurance" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
                  </FlowField>
                  <Btn icon="plus" disabled={!newCat.trim() || busy || !!sameCat} onClick={addCategory} className="disabled:cursor-not-allowed disabled:opacity-50">Add category</Btn>
                </div>
                {sameCat && (
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-[#8a5a12]">
                    <Icon name="alert" size={14} />“{sameCat.name}” is already a category.
                    <button type="button" className="underline" onClick={() => { pickType(sameCat.id); setNewCat('') }}>Choose {sameCat.name}</button>
                  </p>
                )}
                {fe.name && !sameCat && <p className="text-[12px] font-semibold text-[#b4323c]">{fe.name}</p>}
              </div>

              {typeId && (
                <Note icon="list">
                  {tpl.loading && !tpl.data
                    ? 'Loading the template…'
                    : feats.length
                      ? `${typeName} template: ${feats.length} feature${feats.length === 1 ? '' : 's'}${feats.length > 1 ? `, from ${feats[0].name.toLowerCase()} to ${feats[feats.length - 1].name.toLowerCase()}` : ''}.`
                      : `${typeName}: your own category, without a standard feature template.`}
                </Note>
              )}

              <StepFooter
                back="/products"
                backLabel="Cancel"
                next={<Btn icon="arrow" disabled={!canNext} onClick={() => setStep(1)} className="disabled:cursor-not-allowed disabled:opacity-50">Next: Company</Btn>}
              />
            </StepCard>
          )}
          {step === 1 && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Which company?" subtitle={`Insurers that sell ${typeName ?? 'this category'}, and companies you added yourself.`} />
              <Dropdown value={insurerId} onChange={setInsurerId} placeholder={insurers.loading && !insurers.data ? 'Loading companies…' : 'Choose a company'} options={I.map((i) => ({ value: i.id, label: `${i.name}${i.private ? ' (mine)' : ''}` }))} />
              {insurers.error && <ErrorNote error={insurers.error} />}
              {insurers.data && !I.length && <p className="text-[13px] font-medium text-muted">No companies sell {typeName} yet. Add one below.</p>}
              <div className="flex items-end gap-3"><Field label="Add a company" value={newCo} onChange={setNewCo} />
                <SmallButton variant="outline" icon="plus" className="mb-[7px]" disabled={!newCo.trim() || busy} onClick={() => act(() => api.myProducts.createInsurer({ name: newCo.trim() }), { invalidates: ['my-products'], onDone: (r) => { setInsurerId(r.data.id); setNewCo('') } })}>Add</SmallButton></div>
            </Panel>
          )}
          {step === 2 && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Brochure (optional)" subtitle={canRead ? 'Upload the PDF: it is attached to the product, and its values are read for you to check (Premium plan and trial).' : 'Attach the PDF to the product, so you and your customers can open it later.'} />
              {!d.brochureFileId && !job && (
                <label className="flex h-[64px] cursor-pointer items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed border-line text-[14px] font-semibold text-ink hover:bg-panel-2">
                  <Icon name="folder" size={18} />{reading ? 'Uploading…' : canRead ? 'Choose brochure PDF' : 'Attach brochure PDF'}<input type="file" accept=".pdf" className="hidden" disabled={reading} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) startReading(f) }} />
                </label>
              )}
              {d.brochureFileId && (
                <div className="flex items-center gap-3 rounded-[16px] bg-[#eefaf3] px-4 py-3">
                  <Icon name="check" size={16} className="text-[#127650]" />
                  <span className="flex-1 truncate text-[13px] font-semibold text-[#127650]">Brochure attached{brochureName ? `: ${brochureName}` : ''}</span>
                  <SmallButton variant="outline" onClick={() => window.open(api.files.url(d.brochureFileId), '_blank')}>Open</SmallButton>
                  <SmallButton variant="ghost" onClick={removeBrochure}>Remove</SmallButton>
                </div>
              )}
              {d.brochureFileId && !canRead && <p className="text-[12px] font-medium text-muted">Reading brochures automatically is not set up on this server, so type the values in the next steps.</p>}
              {readErr && <ErrorNote error={readErr} />}
              {job && ['QUEUED', 'RUNNING', 'PENDING', 'PROCESSING'].includes(job.status) && <p className="flex items-center gap-2 text-[13px] font-semibold text-blue"><span className="size-4 animate-spin rounded-full border-2 border-blue/30 border-t-blue" />Reading the brochure…</p>}
              {job?.status === 'FAILED' && (
                <div className="flex items-center gap-3 rounded-[16px] bg-[#fbebec] px-4 py-3 text-[13px] font-semibold text-[#b4323c]"><Icon name="alert" size={16} /><span className="flex-1">{job.error ?? 'The brochure could not be read.'} Enter the values yourself, or try again.</span>
                  <SmallButton variant="outline" onClick={async () => { try { setReadErr(null); setJob((await api.myProducts.readingRetry(job.id, {})).data) } catch (e) { setReadErr(e) } }}>Try again</SmallButton></div>
              )}
              {job && ['REVIEW_REQUIRED', 'REVIEWED'].includes(job.status) && (
                <>
                  <div className="flex items-center gap-2"><p className="flex-1 text-[13px] font-semibold text-ink">Check each value. Low confidence values are flagged.</p>
                    <SmallButton variant="outline" onClick={async () => { try { setReadErr(null); setJob((await api.myProducts.readingAcceptHigh(job.id, {})).data) } catch (e) { setReadErr(e) } }}>Accept all above {job.threshold}%</SmallButton></div>
                  {[...(job.details || []).map((r) => ({ ...r, section: 'DETAIL' })), ...(job.rows || []).map((r) => ({ ...r, section: 'FEATURE' })), ...(job.variants || []).map((r) => ({ ...r, section: 'VARIANT' }))].map((r) => (
                    <div key={`${r.section}${r.key}`} className={cx('flex items-center gap-3 rounded-[14px] px-3 py-2 text-[13px]', r.flagged ? 'bg-[#fbf1e1]' : 'bg-panel')}>
                      <span className="w-[200px] font-semibold text-ink">{r.label ?? r.key}</span>
                      <span className="flex-1 truncate font-medium text-ink">{r.editedValue ?? r.value ?? <span className="text-muted">Not found</span>}</span>
                      <span className="w-[54px] text-muted">{r.confidence != null ? `${Math.round(r.confidence)}%` : ''}{r.page ? ` p${r.page}` : ''}</span>
                      {r.decision ? <StatusChip tone="green">{label(r.decision)}</StatusChip> : (
                        <>
                          {r.value != null && <SmallButton variant="ghost" onClick={() => decide(r, 'ACCEPT')}>Accept</SmallButton>}
                          <SmallButton variant="ghost" onClick={() => { const v = window.prompt(`Correct value for ${r.label ?? r.key}`, r.value ?? ''); if (v !== null) decide(r, 'EDIT', v) }}>Fix</SmallButton>
                          <SmallButton variant="ghost" onClick={() => decide(r, 'NOT_STATED')}>Not stated</SmallButton>
                        </>
                      )}
                    </div>
                  ))}
                  <SmallButton variant="navy" icon="check" className="self-start" onClick={useReading}>Use these values</SmallButton>
                </>
              )}
              {!d.brochureFileId && <p className="text-[12px] font-medium text-muted">You can skip this step and type the values.</p>}
            </Panel>
          )}
          {step === 3 && (
            <Panel className="flex flex-col gap-4">
              <PanelHead title="Product" subtitle={form ? `${typeName}: the details a ${form.label.toLowerCase()} product needs.` : undefined} />
              <div className="flex gap-3"><Field label="Product code *" value={code} onChange={setCode} error={fe.code} hint="Your own short code, e.g. FS-01" /><Field label="Product name *" value={d.name} onChange={set('name')} error={(fe.name ?? fe['data.name'])} /></div>
              <div className="flex gap-3"><Field label="UIN *" value={d.uin} onChange={set('uin')} error={(fe.uin ?? fe['data.uin'])} /><Field label="Launch date" type="date" value={d.launchDate} onChange={set('launchDate')} error={(fe.launchDate ?? fe['data.launchDate'])} /></div>
              {ages !== 'NONE' && <div className="flex gap-3"><Field label={`${L.adultEntryAge} from`} type="number" value={d.adultMin} onChange={set('adultMin')} /><Field label="to" type="number" value={d.adultMax} onChange={set('adultMax')} error={(fe.adultMax ?? fe['data.adultMax'])} /></div>}
              {ages === 'ADULT_CHILD' && <Field type="checkbox" label="Covers children" value={d.coversChildren} onChange={set('coversChildren')} />}
              {ages === 'ADULT_CHILD' && d.coversChildren && <div className="flex gap-3"><Field label="Child age from" type="number" value={d.childMin} onChange={set('childMin')} /><Field label="to" type="number" value={d.childMax} onChange={set('childMax')} /></div>}
              <div className="flex gap-3"><Field label={`${L.sumInsured} options (₹, comma separated)`} value={d.siOptions} onChange={set('siOptions')} placeholder="500000, 1000000" error={(fe.sumInsured ?? fe['data.sumInsured'])} /><Field label="or range from" type="number" value={d.siMin} onChange={set('siMin')} /><Field label="to" type="number" value={d.siMax} onChange={set('siMax')} /></div>
              <div className="flex gap-3"><Field label={L.policyTerms} value={d.policyTerms} onChange={set('policyTerms')} placeholder="1, 2, 3" /><Field label="Tax %" type="number" value={d.taxPercent} onChange={set('taxPercent')} /><Field label="Grace period (days)" type="number" value={d.gracePeriodDays} onChange={set('gracePeriodDays')} /></div>
              {form && <ProductDetailsForm form={form} values={details} onChange={setDetails} errors={fe} />}
              {detailsMissing.length > 0 && <p className="text-[12px] font-semibold text-[#8a5a12]">Still needed for {form.label}: {detailsMissing.map((f) => f.label).join(', ')}.</p>}
              <Field label="How the premium is worked out" type="select" value={d.pricingMode} onChange={set('pricingMode')} options={[{ value: 'MANUAL_ENTRY', label: 'Typed from the insurer portal at each quotation' }, { value: 'RATE_TABLE', label: 'From my rate table (add a price version after publishing)' }]} />
              <Field type="checkbox" label="Nominee required" value={d.nomineeRequired} onChange={set('nomineeRequired')} />
              <Field label="Source link" value={d.sourceLink} onChange={set('sourceLink')} placeholder="https://" />
            </Panel>
          )}
          {step === 4 && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Variants" subtitle="Silver, Gold, Plus… Each can have its own sum-insured range." right={<SmallButton variant="outline" icon="plus" onClick={() => setVariants([...variants, { name: '', coverType: 'INDIVIDUAL', sumInsuredMin: '', sumInsuredMax: '' }])}>Add variant</SmallButton>} />
              {variants.map((v, i) => (
                <div key={i} className="flex items-end gap-3">
                  <Field label="Name *" value={v.name} onChange={(x) => setVariants(variants.map((y, j) => (j === i ? { ...y, name: x } : y)))} />
                  {form?.variantCoverTypes !== false && <Field label="Cover" type="select" value={v.coverType ?? ''} onChange={(x) => setVariants(variants.map((y, j) => (j === i ? { ...y, coverType: x } : y)))} options={[{ value: 'INDIVIDUAL', label: 'Individual' }, { value: 'FLOATER', label: 'Family floater' }]} />}
                  <Field label={`${L.sumInsured} from (₹)`} type="number" value={v.sumInsuredMin} onChange={(x) => setVariants(variants.map((y, j) => (j === i ? { ...y, sumInsuredMin: x } : y)))} />
                  <Field label="to (₹)" type="number" value={v.sumInsuredMax} onChange={(x) => setVariants(variants.map((y, j) => (j === i ? { ...y, sumInsuredMax: x } : y)))} />
                  {variants.length > 1 && <button type="button" aria-label="Remove" className="mb-3 text-muted" onClick={() => setVariants(variants.filter((_, j) => j !== i))}><Icon name="x" size={16} /></button>}
                </div>
              ))}
            </Panel>
          )}
          {step === 5 && (
            <Panel className="flex flex-col gap-4">
              <PanelHead title="Features" subtitle={tpl.data ? `${typeName} template v${tpl.data.template.number}. Leave blank if you don't know; tick "Not stated" when the brochure says nothing.` : tpl.error ? `${typeName}: the feature list could not be loaded.` : 'Loading the template…'} />
              {tpl.error && <div className="flex items-center gap-3"><ErrorNote error={tpl.error} /><SmallButton variant="outline" icon="refresh" onClick={tpl.refetch}>Try again</SmallButton></div>}
              {groups.map((g) => (
                <div key={g} className="flex flex-col gap-2">
                  <p className="text-[12px] font-bold tracking-wide text-muted uppercase">{g}</p>
                  {feats.filter((f) => (f.group || 'Features') === g).map((f) => {
                    const cur = features[f.key] ?? {}
                    const setF = (patch) => setFeatures({ ...features, [f.key]: { ...cur, ...patch } })
                    return (
                      <div key={f.key} className="flex items-center gap-3">
                        <span className="w-[260px] text-[13px] font-semibold text-ink">{f.name}{f.requiredToPublish ? ' *' : ''}</span>
                        {f.dataType === 'Yes/No'
                          ? <Dropdown className="flex-1" buttonClassName="h-[42px]" value={cur.value === true ? 'yes' : cur.value === false ? 'no' : ''} disabled={cur.notStated} onChange={(v) => setF({ value: v === '' ? null : v === 'yes' })} options={[['', '—'], ['yes', 'Yes'], ['no', 'No']]} />
                          : <input value={cur.value ?? ''} disabled={cur.notStated} inputMode={NUMERIC_TYPES.has(f.dataType) ? 'decimal' : undefined} onChange={(e) => setF({ value: e.target.value })} className={cx(inputCls, 'h-[42px] flex-1')} placeholder={f.help ?? UNIT_HINT[f.dataType] ?? ''} />}
                        <label className="flex items-center gap-1.5 text-[12px] font-semibold text-muted"><input type="checkbox" checked={!!cur.notStated} onChange={(e) => setF({ notStated: e.target.checked, value: e.target.checked ? null : cur.value })} />Not stated</label>
                      </div>
                    )
                  })}
                </div>
              ))}
              {tpl.data && !feats.length && <p className="text-[13px] font-medium text-muted">This category has no feature template.</p>}
            </Panel>
          )}
          {step === 6 && (
            <Panel className="flex flex-col gap-3">
              <PanelHead title="Review and publish" />
              {[['Category', typeName], ['Company', insName], ['Code', code], ['Name', d.name], ['UIN', d.uin], ...(ages !== 'NONE' ? [[L.adultEntryAge, `${d.adultMin}–${d.adultMax}`]] : []), ...(form?.fields?.length ? [[`${form.label} details`, `${Object.keys(detailsBody(form, details)).length} of ${form.fields.length} filled`]] : []), ['Brochure', d.brochureFileId ? 'Attached' : 'None'], [L.sumInsured, nums(d.siOptions).map((n) => fmtMoney(n)).join(', ') || (d.siMin ? `${fmtMoney(d.siMin)}–${fmtMoney(d.siMax)}` : '—')], ['Policy terms', d.policyTerms], ['Pricing', d.pricingMode === 'RATE_TABLE' ? 'Rate table' : 'Typed at quotation'], ['Variants', variants.map((v) => v.name).filter(Boolean).join(', ')], ['Features filled', `${Object.values(features).filter((f) => f && (f.notStated || (f.value !== '' && f.value != null))).length} of ${feats.length}`], ['From brochure', ocrJobId ? 'Yes' : 'No']].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[13px]"><span className="font-medium text-muted">{k}</span><span className="font-semibold text-ink">{v || '—'}</span></div>
              ))}
              <ErrorNote error={error} />
            </Panel>
          )}
          {step > 0 && <div className="flex justify-between">
            <SmallButton variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</SmallButton>
            {step < 6 ? <SmallButton variant="navy" icon="arrow" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 2 && !job && !d.brochureFileId ? 'Skip' : 'Next'}</SmallButton>
              : <SmallButton variant="navy" icon="check" disabled={busy} onClick={publish}>{busy ? 'Publishing…' : 'Publish product'}</SmallButton>}
          </div>}
        </div>
        <PreviewCard values={preview} />
      </div>
    </AppLayout>
  )
}

/* ═════════════ PV1 / PV2 · My price versions ═════════════ */
export function LivePriceVersions() {
  const { id } = useParams()
  const product = useQuery(['product', id], () => api.products.get(id))
  const list = useQuery(['product', id, 'prices'], () => api.products.prices(id))
  const tpl = useQuery(['product', id, 'price-template'], () => api.products.priceTemplate(id))
  const ref = useQuery(['product', id, 'price-ref'], () => api.products.referencePrices(id))
  const [add, setAdd] = useState(false)
  const { act, busy } = useAct()
  if (product.error) return <ErrorPanel active="products" error={product.error} back="/products" />
  if (!product.data) return <LoadingPanel active="products" />
  const p = product.data
  const download = () => {
    const blob = new Blob([tpl.data.csv], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${p.code}-rate-table.csv`; a.click()
  }
  return (
    <AppLayout active="products">
      <Header back={`/products/${id}`} breadcrumb={`CATALOGUE  /  PRODUCTS  /  ${(p.publishedVersion?.data?.name ?? p.code).toUpperCase()}  /  PRICES`} title="My price versions" subtitle="Your premiums for this product. A version applies from its date; older quotations keep the price they used."
        actions={<><HeadButton variant="white" icon="download" disabled={!tpl.data} onClick={download}>Rate table template</HeadButton><HeadButton icon="plus" onClick={() => setAdd(true)}>Add price version</HeadButton></>} />
      <div className="mt-6 flex items-start gap-6">
        <Panel className="flex w-[756px] flex-col gap-3">
          {(list.data || []).map((v) => (
            <div key={v.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px] first:border-0 first:pt-0">
              <span className="w-[60px] font-bold text-ink">{v.name}</span>
              <span className="flex-1 font-medium text-muted">From {fmtDate(isoDay(v.effectiveFrom))}{v.effectiveTo ? ` to ${fmtDate(isoDay(v.effectiveTo))}` : ''} · {v.rowCount} rows · tax {v.taxPercent}%{v.sourceNote ? ` · ${v.sourceNote}` : ''}</span>
              <StatusChip tone={v.status === 'CURRENT' ? 'green' : v.status === 'SCHEDULED' ? 'sky' : 'neutral'}>{label(v.status)}</StatusChip>
              {v.status === 'SCHEDULED' && <SmallButton variant="danger" disabled={busy} onClick={() => act(() => api.products.cancelPrice(id, v.id), { invalidates: ['product'] })}>Cancel</SmallButton>}
            </div>
          ))}
          {list.data && !list.data.length && <p className="text-[13px] font-medium text-muted">No price versions yet. Download the template, fill in base premiums, then add a version.</p>}
          {list.error && <ErrorNote error={list.error} />}
        </Panel>
        <Panel className="flex w-[400px] flex-col gap-2">
          <PanelHead title="Rate table columns" />
          {(tpl.data?.factors || []).map((f) => <p key={f.key} className="text-[13px] text-ink"><b>{f.key}</b> <span className="text-muted">· {f.name} · {(f.choices || []).slice(0, 6).join(', ')}</span></p>)}
          <p className="text-[13px] text-ink"><b>base_premium</b> <span className="text-muted">· before tax, in ₹</span></p>
          {ref.data?.length > 0 && <p className="mt-2 text-[12px] font-medium text-muted">SkyUp has {ref.data.length} reference price version{ref.data.length === 1 ? '' : 's'} for this product.</p>}
          <ErrorNote error={tpl.error} />
        </Panel>
      </div>
      {add && <AddPriceDialog id={id} addOns={p.publishedVersion?.data?.addOns ?? []} tax={p.publishedVersion?.data?.taxPercent ?? 18} onClose={() => setAdd(false)} />}
    </AppLayout>
  )
}
function AddPriceDialog({ id, addOns, tax, onClose }) {
  const [f, setF] = useState({ effectiveFrom: '', taxPercent: tax, csv: '', sourceNote: '' })
  const [riders, setRiders] = useState(Object.fromEntries(addOns.map((a) => [a.name, ''])))
  const [check, setCheck] = useState(null)
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const readFile = (file) => file.text().then((t) => { set('csv')(t); setCheck(null) })
  const runCheck = () => act(() => api.products.checkPrice(id, { csv: f.csv }), { quiet: true, success: 'Rate table checked.', onDone: (r) => setCheck(r.data) })
  const save = () => act(() => api.products.addPrice(id, { effectiveFrom: dmy(f.effectiveFrom), taxPercent: Number(f.taxPercent), csv: f.csv, sourceNote: f.sourceNote || undefined,
    riderPrices: Object.entries(riders).filter(([, v]) => v !== '').map(([name, value]) => ({ name, value: Number(value) })) }), { invalidates: ['product'], onDone: onClose, quiet: true })
  return (
    <ActionDialog title="Add price version" body="Upload the filled rate table (CSV). It is checked before saving." confirm="Save price version" busy={busy} error={error} disabled={!f.csv || !f.effectiveFrom} onConfirm={save} onClose={onClose} width={640}>
      <div className="flex gap-3"><Field label="Effective from *" type="date" value={f.effectiveFrom} onChange={set('effectiveFrom')} error={fe.effectiveFrom} /><Field label="Tax % *" type="number" value={f.taxPercent} onChange={set('taxPercent')} error={fe.taxPercent} /></div>
      <label className="flex h-[50px] cursor-pointer items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink"><Icon name={f.csv ? 'check' : 'folder'} size={16} />{f.csv ? `${f.csv.trim().split('\n').length - 1} rows loaded` : 'Choose rate table CSV'}<input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])} /></label>
      {fe.csv && <span className="text-[12px] font-medium text-[#b4323c]">{fe.csv}</span>}
      {f.csv && <SmallButton variant="outline" className="self-start" disabled={busy} onClick={runCheck}>Check rate table</SmallButton>}
      {check && <p className="text-[12px] font-semibold text-[#127650]">{check.message ?? `${check.rows ?? check.rowCount ?? ''} rows OK`}</p>}
      {addOns.length > 0 && <div className="grid grid-cols-2 gap-3">{addOns.map((a) => <Field key={a.name} label={`${a.name} (₹)`} type="number" value={riders[a.name]} onChange={(v) => setRiders({ ...riders, [a.name]: v })} />)}</div>}
      <Field label="Source note" value={f.sourceNote} onChange={set('sourceNote')} placeholder="e.g. Insurer rate card Nov 2026" />
    </ActionDialog>
  )
}

/* ═════════════ 10b · Compare variants ═════════════ */
export function LiveCompareVariants() {
  const { id } = useParams()
  const q = useQuery(['product', id], () => api.products.get(id))
  const rows = useMemo(() => q.data?.features ?? [], [q.data])
  if (q.error) return <ErrorPanel active="products" error={q.error} back="/products" />
  if (!q.data) return <LoadingPanel active="products" />
  const p = q.data
  const vs = p.variants ?? []
  const show = (v, key) => {
    const x = v.features?.[key] ?? p.publishedVersion?.data?.features?.[key]
    if (x == null) return '—'
    if (x.notStated) return 'Not stated'
    const val = typeof x === 'object' ? x.value : x
    return val === true ? 'Yes' : val === false ? 'No' : val == null ? '—' : String(val)
  }
  const differs = (key) => new Set(vs.map((v) => show(v, key))).size > 1
  return (
    <AppLayout active="products">
      <Header back={`/products/${id}`} breadcrumb={`CATALOGUE  /  PRODUCTS  /  ${(p.publishedVersion?.data?.name ?? p.code).toUpperCase()}`} title="Compare variants" subtitle="Rows that differ between variants are highlighted." actions={<HeadButton variant="white" icon="arrow" to={`/products/${id}`}>Back to product</HeadButton>} />
      <Panel className="mt-6 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead><tr><th className="w-[260px] py-2 text-left font-semibold text-muted">Feature</th>{vs.map((v) => <th key={v.id ?? v.name} className="py-2 text-left font-bold text-ink">{v.name}<div className="text-[11px] font-medium text-muted">{v.sumInsuredMin ? `${fmtMoney(v.sumInsuredMin)}–${fmtMoney(v.sumInsuredMax)}` : ''}</div></th>)}</tr></thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.key} className={cx('border-t border-line', differs(f.key) && 'bg-[#f3f7ff]')}>
                <td className="py-2.5 pr-3 font-semibold text-ink">{f.name ?? f.label ?? f.key}</td>
                {vs.map((v) => <td key={(v.id ?? v.name) + f.key} className="py-2.5 pr-3 text-ink">{show(v, f.key)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {vs.length < 2 && <p className="mt-3 text-[13px] font-medium text-muted">This product has a single variant.</p>}
      </Panel>
    </AppLayout>
  )
}