// 06 · Best fit (Figma 9:1127) on the live API:
//   GET /customers/:id/best-fit/options?typeId=  → people (with DOB check) and sum-insured options on offer
//   POST /customers/:id/best-fit                  → ranked products with each score's reason
//   POST /customers/:id/best-fit/:rankingId/choose → logged, then a draft quotation is created for the customer
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { Modal, cx } from '../components/ui'
import { Header, HeadButton, Panel, Tick } from '../screens/catalogue/_parts'
import { api, useQuery, useDebounced } from '../api'
import { avatarClass, fmtMoney, initials } from '../api/format'
import { ErrorNote, useAct, inputCls } from './kit'

const PRIORITY_LABEL = { LOWEST_PREMIUM: 'Lowest premium', BEST_COVERAGE: 'Best coverage', CLAIM_RELIABILITY: 'Claim reliability', PRE_EXISTING: 'Pre-existing condition' }
const PART = [['budget', 'Budget fit'], ['roomRent', 'Room rent'], ['coPay', 'Co-pay'], ['waiting', 'Waiting period'], ['claimRatio', 'Claim settlement']]
const lakh = (n) => (n >= 10_000_000 ? `₹${n / 10_000_000} crore` : n >= 100_000 ? `₹${n / 100_000} lakh` : fmtMoney(n))

export default function LiveBestFit() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [cq, setCq] = useState('')
  const dcq = useDebounced(cq, 300)
  const hits = useQuery(['customers', 'pick', dcq], () => api.customers.list({ status: 'ACTIVE', search: dcq || undefined, limit: 8 }))
  const preset = useQuery(['customer', sp.get('customerId')], () => api.customers.get(sp.get('customerId')), { enabled: !!sp.get('customerId') })
  useEffect(() => { if (preset.data && !customer) setCustomer(preset.data) }, [preset.data]) // eslint-disable-line react-hooks/exhaustive-deps

  const types = useQuery('my-products:types', () => api.myProducts.types())
  const typeList = (types.data || []).filter((t) => !t.private) // Best fit scores SkyUp categories only (change #4)
  const [typeId, setTypeId] = useState('')
  const tid = typeId || typeList[0]?.id
  const opts = useQuery(['best-fit', customer?.id, tid], () => api.customers.bestFitOptions(customer.id, { typeId: tid }), { enabled: !!(customer && tid) })
  const [people, setPeople] = useState(null)
  const [si, setSi] = useState('')
  const [budget, setBudget] = useState(25000)
  const [priority, setPriority] = useState('BEST_COVERAGE')
  const [res, setRes] = useState(null)
  const [compare, setCompare] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const { act, busy, error } = useAct()

  // defaults when the options arrive: everyone with a date of birth, the middle sum insured
  useEffect(() => {
    if (!opts.data) return
    setPeople(opts.data.people.filter((p) => p.hasDob).map((p) => p.key))
    const o = opts.data.sumInsuredOptions
    setSi(o.length ? o[Math.floor(o.length / 2)] : '')
    setRes(null)
  }, [opts.data])

  const rank = () => act(() => api.customers.runBestFit(customer.id, { typeId: tid, people, budget: Number(budget), priority, sumInsured: Number(si) }), {
    quiet: true, onDone: (r) => { setRes(r.data); setCompare(r.data.results.slice(0, 2).map((x) => x.variantId)) },
  })
  const quote = (r) => act(async () => {
    await api.customers.chooseBestFit(customer.id, res.rankingId, { productId: r.productId, variantId: r.variantId })
    return api.quotations.create(customer.id)
  }, { invalidates: ['quotations'], success: 'Draft quotation created from Best fit.', onDone: (q) => q?.data?.id && navigate(`/quotations/${q.data.id}`) })

  const first = customer?.name?.split(' ')[0]
  const typeName = typeList.find((t) => t.id === tid)?.name
  const chosen = useMemo(() => (res?.results || []).filter((r) => compare.includes(r.variantId)), [res, compare])

  return (
    <AppLayout active="bestfit">
      <Header breadcrumb={'SELL  /  BEST FIT'} title="Best fit" subtitle="Ranks the products you can quote with fixed rules. Every score shows its reason."
        actions={<HeadButton variant="white" icon="compare" disabled={chosen.length < 2} onClick={() => setShowCompare(true)}>Compare selected</HeadButton>} />
      <div className="mt-6 flex items-start gap-6">
        {/* ── questions ── */}
        <Panel className="flex w-[475px] shrink-0 flex-col gap-5">
          <div><p className="text-[19px] font-bold text-ink">{first ? `What does ${first} need?` : 'Who is it for?'}</p><p className="text-[13px] font-medium text-muted">{[typeName, people && `${people.length} people`].filter(Boolean).join(' · ')}</p></div>

          <div className="relative flex flex-col gap-2">
            <span className="text-[14px] font-semibold text-ink">Customer</span>
            {customer ? (
              <div className="flex h-[58px] items-center gap-3 rounded-[18px] bg-panel px-4">
                <span className={cx('flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-navy', avatarClass(customer.name))}>{initials(customer.name)}</span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{customer.name} ({customer.number})</span>
                <button type="button" onClick={() => { setCustomer(null); setRes(null) }} aria-label="Change customer"><Icon name="x" size={16} className="text-muted" /></button>
              </div>
            ) : (
              <>
                <input value={cq} onChange={(e) => setCq(e.target.value)} placeholder="Search policy holder by name or mobile" className={inputCls} autoFocus />
                <div className="flex max-h-[260px] flex-col overflow-y-auto rounded-[16px] border border-line">
                  {(hits.data || []).map((c) => (
                    <button key={c.id} type="button" onClick={() => setCustomer(c)} className="flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-panel-2">
                      <span className={cx('flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-navy', avatarClass(c.name))}>{initials(c.name)}</span>
                      <span className="flex-1 text-[13px] font-semibold text-ink">{c.name}</span><span className="text-[12px] font-medium text-muted">{c.number}</span>
                    </button>
                  ))}
                  {hits.data && !hits.data.length && <p className="px-3.5 py-3 text-[13px] font-medium text-muted">No active policy holders found. Add one under Policy Holders first.</p>}
                </div>
              </>
            )}
          </div>

          {customer && (
            <>
              <label className="flex flex-col gap-2"><span className="text-[14px] font-semibold text-ink">Insurance type</span>
                <select value={tid ?? ''} onChange={(e) => setTypeId(e.target.value)} className={inputCls}>
                  {typeList.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {!typeList.length && <span className="text-[12px] font-medium text-[#b4323c]">No insurance types yet. SkyUp adds them in the catalogue.</span>}
              </label>

              <div className="flex flex-col gap-2"><span className="text-[14px] font-semibold text-ink">People to cover *</span>
                <div className="flex flex-wrap gap-2">
                  {(opts.data?.people || []).map((p) => {
                    const on = people?.includes(p.key)
                    return (
                      <button key={p.key} type="button" disabled={!p.hasDob} onClick={() => setPeople(on ? people.filter((k) => k !== p.key) : [...(people || []), p.key])}
                        className={cx('flex h-[42px] items-center gap-2 rounded-[21px] border px-4 text-[14px] font-semibold', !p.hasDob ? 'border-line text-faint' : on ? 'border-blue bg-blue-50 text-blue' : 'border-line bg-white text-muted')}>
                        {on && <Icon name="check" size={14} />}{p.name.split(' ')[0]}{p.hasDob ? (p.age != null ? ` · ${p.age}` : '') : ' · no DOB'}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="flex flex-col gap-2"><span className="text-[14px] font-semibold text-ink">Sum insured</span>
                <select value={si} onChange={(e) => setSi(e.target.value)} className={inputCls}>
                  {(opts.data?.sumInsuredOptions || []).map((n) => <option key={n} value={n}>{lakh(n)}</option>)}
                </select>
                {opts.data && !opts.data.sumInsuredOptions.length && <span className="text-[12px] font-medium text-[#b4323c]">No products of this type have a sum insured on offer yet.</span>}
              </label>

              <label className="flex flex-col gap-2"><span className="text-[14px] font-semibold text-ink">Yearly budget</span>
                <span className="flex h-[50px] items-center gap-2 rounded-[16px] bg-panel px-4"><span className="text-muted">₹</span><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none" /></span>
              </label>

              <div className="flex flex-col gap-2"><span className="text-[14px] font-semibold text-ink">What matters most *</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {(opts.data?.priorities || Object.keys(PRIORITY_LABEL)).map((k) => (
                    <button key={k} type="button" onClick={() => setPriority(k)} className={cx('h-[50px] rounded-[16px] px-4 text-left text-[14px] font-semibold', priority === k ? 'bg-navy text-white' : 'bg-panel text-ink')}>{PRIORITY_LABEL[k]}</button>
                  ))}
                </div>
              </div>
              <ErrorNote error={error} />
              <button type="button" disabled={busy || !people?.length || !si} onClick={rank} className="flex h-[58px] items-center justify-center gap-2 rounded-[29px] bg-navy text-[16px] font-semibold text-white disabled:opacity-60">
                <Icon name="sparkle" size={18} />{busy ? 'Ranking…' : 'Rank products'}
              </button>
            </>
          )}
        </Panel>

        {/* ── results ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {!res && (
            <Panel className="flex flex-col items-center gap-2 py-14 text-center">
              <Icon name="target" size={28} className="text-muted" />
              <p className="text-[15px] font-bold text-ink">Pick a customer and answer the questions</p>
              <p className="max-w-[460px] text-[13px] font-medium text-muted">Only products you can quote are ranked: active, with your agent code for the insurer, the sum insured on offer and a current price.</p>
            </Panel>
          )}
          {res && (
            <div className="flex items-center gap-3 rounded-[28px] bg-linear-to-r from-[#ede7fd] to-[#e2d9fb] px-7 py-5">
              <span className="flex size-12 items-center justify-center rounded-full bg-white"><Icon name="sparkle" size={20} className="text-violet" /></span>
              <div><p className="text-[15px] font-semibold text-ink">{res.results[0] ? `${res.results[0].insurer} ${res.results[0].name} ranks first for “${PRIORITY_LABEL[priority].toLowerCase()}”${res.results[1] ? `, ahead of ${res.results[1].name}` : ''}.` : res.message}</p>
                <p className="text-[13px] font-medium text-violet">{res.summary?.message ?? res.message}</p></div>
            </div>
          )}
          {(res?.results || []).map((r, i) => (
            <Panel key={r.variantId ?? r.productId} className={cx('flex flex-col gap-3', i === 0 && 'ring-1 ring-blue/30')}>
              <div className="flex items-center gap-4">
                <span className={cx('flex size-12 items-center justify-center rounded-full text-[16px] font-bold', i === 0 ? 'bg-navy text-white' : 'bg-panel text-ink')}>#{i + 1}</span>
                <div className="flex-1"><p className="text-[19px] font-bold text-ink">{r.insurer} {r.name}</p><p className="text-[13px] font-medium text-muted">Per year incl. GST</p></div>
                <p className="text-[26px] font-bold text-ink">{r.premium != null ? fmtMoney(r.premium) : 'At quotation'}</p>
                <span className={cx('rounded-[16px] px-3.5 py-2 text-[15px] font-bold', r.total >= 75 ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-blue-50 text-blue')}>Score {Math.round(r.total)}</span>
              </div>
              {r.coverage && <div className="flex items-center gap-2.5 rounded-[14px] bg-[#fbf1e1] px-4 py-3 text-[14px] font-semibold text-[#8a5a12]"><Icon name="alert" size={16} />{r.coverage.message}</div>}
              {!r.coverage && PART.map(([k, l], j) => (
                <div key={k} className="flex items-center gap-3 text-[13px]">
                  <span className="w-[190px] font-semibold text-ink">{l} <span className="text-[11px] font-medium text-muted">×{res.weights?.[j] ?? ''}%</span></span>
                  <span className="h-1.5 w-[340px] overflow-hidden rounded-full bg-panel"><span className={cx('block h-full rounded-full', r.parts[k].score >= 60 ? 'bg-[#1f5fd6]' : 'bg-[#9aa4b5]')} style={{ width: `${r.parts[k].score}%` }} /></span>
                  <span className="flex-1 truncate font-medium text-muted">{r.parts[k].reason}</span>
                  <span className="w-8 text-right font-bold text-ink">{r.parts[k].score}</span>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <button type="button" disabled={busy} onClick={() => quote(r)} className={cx('flex h-[44px] items-center gap-2 rounded-[22px] px-5 text-[14px] font-semibold', i === 0 ? 'bg-navy text-white' : 'border border-line bg-white text-ink')}><Icon name="quote" size={16} />Create quotation</button>
                <label className="flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-ink">
                  <Tick checked={compare.includes(r.variantId)} onChange={() => setCompare(compare.includes(r.variantId) ? compare.filter((x) => x !== r.variantId) : [...compare, r.variantId])} />Add to comparison
                </label>
              </div>
            </Panel>
          ))}
          {res && !res.results.length && <Panel><p className="text-[14px] font-semibold text-ink">{res.message}</p><p className="mt-1 text-[13px] font-medium text-muted">Check My insurers (agent codes), the insurance categories in your profile, and that the products have a current price.</p></Panel>}
        </div>
      </div>
      {showCompare && (
        <Modal onClose={() => setShowCompare(false)} width={Math.min(1100, 260 + chosen.length * 260)}>
          <p className="text-[21px] font-bold text-ink">Compare</p>
          <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `200px repeat(${chosen.length}, 1fr)` }}>
            <span />{chosen.map((r) => <p key={r.variantId} className="text-[14px] font-bold text-ink">{r.insurer} {r.name}</p>)}
            <span className="text-[13px] font-semibold text-muted">Premium</span>{chosen.map((r) => <p key={r.variantId} className="text-[14px] font-bold text-ink">{fmtMoney(r.premium)}</p>)}
            <span className="text-[13px] font-semibold text-muted">Score</span>{chosen.map((r) => <p key={r.variantId} className="text-[14px] font-bold text-ink">{Math.round(r.total)}</p>)}
            {PART.map(([k, l]) => [<span key={k} className="text-[13px] font-semibold text-muted">{l}</span>, ...chosen.map((r) => <p key={r.variantId + k} className="text-[13px] font-medium text-ink">{r.parts[k].reason}</p>)])}
          </div>
        </Modal>
      )}
    </AppLayout>
  )
}