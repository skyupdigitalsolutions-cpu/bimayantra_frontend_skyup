// Step bodies shared by the base frames and their "b/c" state frames (AP3/3b, AP4/4b, AP5/5b/5c).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import {
  Shell, StepCard, StepFooter, SourceViewer, AiBanner, AiLabel, ExtractedList, Btn, RoundBtn, Box, Field, TextInput, Note, Chip, Divider, R,
} from './_parts'
import {
  productForm, productExtracted, variantsExtracted, variants as initialVariants, coverTypes, pricingTypes, newVariantDraft,
  standardFeatures, aiFeatures, myFeatures as initialMine,
} from '../../data/flow-add-product'

const autoChip = <Chip tone="violet" icon="sparkle">Auto-filled from brochure</Chip>

/* ───────────── AP3 · Product ───────────── */

export function ProductStep({ back = R.brochure, overlay }) {
  return (
    <Shell step={4} subtitle="Health · Star Health" aside={<SourceViewer kind="product" />} overlay={overlay}>
      <StepCard title="4 · Product details" subtitle="As printed on the insurer’s brochure" chip={autoChip}>
        <AiBanner count="2 of 4 checked" bar="340px" />
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-[18px]">
          <Field label="Product name *"><TextInput defaultValue={productForm.name} /></Field>
          <Field label="IRDAI product UIN *" hint="Printed on every quotation"><TextInput defaultValue={productForm.uin} /></Field>
          <Field label="Product code"><TextInput defaultValue={productForm.code} /></Field>
          <Field label="Launch date *"><TextInput defaultValue={productForm.launch} trailing={<Icon name="calendar" size={18} className="text-muted" />} /></Field>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink">Brochure</p>
          <div className="flex items-center gap-3.5 rounded-[18px] border border-[#c7ebda] bg-[#f5fbf8] p-3.5">
            <span className="flex h-[52px] w-11 items-center justify-center rounded-[12px] bg-pink-100 text-[#b4325a]">
              <Icon name="folder" size={20} />
            </span>
            <div className="flex flex-1 flex-col gap-[3px]">
              <span className="text-[14px] font-bold text-ink">arogya-plus-brochure.pdf</span>
              <span className="text-[12px] font-medium text-muted">2.4 MB · 12 pages · uploaded at step 3</span>
            </div>
            <Chip tone="violet" icon="sparkle">Read by AI</Chip>
            <Btn variant="outline" size="sm" icon="eye">View</Btn>
            <Btn variant="ghost" size="sm" icon="upload" to={R.brochure}>Replace</Btn>
          </div>
          <div className="flex h-[60px] items-center gap-2.5 rounded-[16px] bg-panel px-3.5">
            <Icon name="upload" size={16} className="text-muted" />
            <span className="flex-1 text-[13px] font-semibold text-ink-2">Policy wording (optional)</span>
            <Btn variant="outline" size="sm">Upload</Btn>
          </div>
        </div>

        <Note icon="sparkle">We read the brochure for you. Check every value before you submit.</Note>
        <AiLabel />
        <ExtractedList rows={productExtracted} />
        <StepFooter back={back} mid="confirm" next={<Btn icon="arrow" to={R.variants}>Next: Variants</Btn>} />
      </StepCard>
    </Shell>
  )
}

/* ───────────── AP4 · Variants ───────────── */

function Pill({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'flex h-[34px] shrink-0 items-center gap-1.5 rounded-[18px] border pr-3.5 text-[13px] font-semibold whitespace-nowrap',
        on ? 'border-blue bg-blue-50 pl-2.5 text-blue' : 'border-line bg-white pl-3.5 text-muted',
      )}
    >
      {on && <Icon name="check" size={14} />}
      {children}
    </button>
  )
}

function Badge({ children }) {
  return <span className="rounded-[12px] bg-navy px-3 py-1.5 text-[13px] font-bold text-white">{children}</span>
}

function VariantCard({ v, onToggle, onRemove, onChange }) {
  const head = (
    <div className="flex h-8 items-center gap-3">
      <Badge>{v.name}</Badge>
      <span className="text-[13px] font-semibold text-ink-2">{v.cover}</span>
      <span className="flex-1" />
      <RoundBtn icon="edit" onClick={onToggle} aria-label="Edit variant" />
      <RoundBtn icon="x" color="text-muted" onClick={onRemove} aria-label="Remove variant" />
    </div>
  )
  if (!v.open) {
    return (
      <div className="flex flex-col gap-3.5 rounded-[22px] bg-panel p-[18px]">
        {head}
        <p className="text-[12px] font-medium text-muted">{v.summary ?? 'Sum insured, ages and pricing to be added.'}</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3.5 rounded-[22px] border border-[#c9daf8] bg-[#f3f7ff] p-[18px]">
      {head}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-ink">Cover type</span>
        {coverTypes.map((c) => <Pill key={c} on={v.cover === c} onClick={() => onChange({ cover: c })}>{c}</Pill>)}
      </div>
      <div className="flex gap-3">
        {(v.fields ?? []).map((f) => (
          <Field key={f.label} label={f.label} className="flex-1">
            <TextInput tone="white" defaultValue={f.value} trailing={f.select && <Icon name="chev-down" size={18} className="text-muted" />} />
          </Field>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-ink">Pricing</span>
        {pricingTypes.map((p) => <Pill key={p} on={v.pricing === p} onClick={() => onChange({ pricing: p })}>{p}</Pill>)}
      </div>
    </div>
  )
}

export function VariantsStep({ adding: addingInitial = true, overlay, tightBottom }) {
  const [list, setList] = useState(initialVariants)
  const [adding, setAdding] = useState(addingInitial)
  const [name, setName] = useState(newVariantDraft)
  const [cover, setCover] = useState(coverTypes[0])
  const update = (i, patch) => setList((l) => l.map((v, j) => (j === i ? { ...v, ...patch } : v)))
  const add = () => {
    if (!name.trim()) return
    setList((l) => [...l, {
      name: name.trim(), cover, open: true, pricing: pricingTypes[0],
      fields: [{ label: 'Sum insured from', value: '', select: true }, { label: 'Sum insured up to', value: '', select: true }, { label: 'Entry age', value: '' }],
    }])
    setName('')
    setAdding(false)
  }

  return (
    <Shell step={5} subtitle="Health · Star Health" aside={<SourceViewer kind="variants" />} overlay={overlay} tightBottom={tightBottom}>
      <StepCard title="5 · Variants" subtitle="Each variant can differ in cover type, sum insured and ages" chip={autoChip}>
        <AiBanner count="2 of 4 checked" bar="340px" />
        {list.map((v, i) => (
          <VariantCard key={v.name + i} v={v} onToggle={() => update(i, { open: !v.open })} onRemove={() => setList((l) => l.filter((_, j) => j !== i))} onChange={(p) => update(i, p)} />
        ))}

        {adding ? (
          <div className="flex flex-col gap-3 rounded-[20px] border border-dashed border-[#9db8ee] bg-[#f7f9ff] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-blue">
                <Icon name="plus" size={15} />
              </span>
              <p className="text-[14px] font-bold text-ink">Add a new variant</p>
            </div>
            <div className="flex items-end gap-3">
              <Field label="Variant name *" className="w-[287px]">
                <TextInput tone="white" focused value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
              </Field>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-[13px] font-semibold text-ink">Cover type</span>
                <div className="flex gap-1.5">
                  {coverTypes.map((c) => <Pill key={c} on={cover === c} onClick={() => setCover(c)}>{c}</Pill>)}
                </div>
              </div>
              <Btn icon="plus" onClick={add}>Add variant</Btn>
            </div>
            <p className="text-[12px] font-medium text-muted">Sum insured, ages and pricing open after you add it. Add as many variants as the product has.</p>
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex h-[46px] items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#c3ccd8] text-[13px] font-bold text-blue hover:bg-[#f7f9ff]">
            <Icon name="plus" size={16} />
            Add variant
          </button>
        )}

        <AiLabel />
        <ExtractedList rows={variantsExtracted} />
        <StepFooter back={R.product} mid="confirm" next={<Btn icon="arrow" to={R.features}>Next: Features</Btn>} />
      </StepCard>
    </Shell>
  )
}

/* ───────────── AP5 · Features ───────────── */

const META_COLOR = { High: 'text-violet', Medium: 'text-[#8a5a12]', Low: 'text-[#b4323c]' }

function Cell({ cell, placeholder }) {
  const [inc, val] = cell
  return (
    <div className="flex w-[140px] shrink-0 items-center gap-2">
      <span className={cx('flex size-[22px] shrink-0 items-center justify-center rounded-full', inc ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-chip text-faint')}>
        <Icon name={inc ? 'check' : 'x'} size={11} />
      </span>
      {(val || placeholder) && (
        <span className={cx('h-[27px] rounded-[10px] border border-line bg-white px-2.5 py-[5px] text-[12px] font-semibold whitespace-nowrap', val ? 'text-ink' : 'text-faint')}>
          {val || placeholder}
        </span>
      )}
    </div>
  )
}

function Section({ title, subtitle, right }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="text-[12px] font-medium text-muted">{subtitle}</p>
      </div>
      {right}
    </div>
  )
}

const ROW = 'flex items-center gap-3 rounded-[16px] border py-2.5 pr-2.5 pl-3'

export function FeaturesStep({ ticked: tickedInitial = [], corrected = false, adding = false, extraDividers = false, overlay }) {
  const navigate = useNavigate()
  const [ticked, setTicked] = useState(() => new Set(tickedInitial))
  const [mine, setMine] = useState(() => initialMine.map((m) => ({ ...m, on: true })))
  const [drafts, setDrafts] = useState(adding ? [{ id: 1, name: '' }] : [])
  const toggle = (n) => setTicked((s) => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x })
  const count = `${ticked.size} of ${aiFeatures.length}`

  const saveDraft = (d) => {
    if (!d.name.trim()) return
    setMine((m) => [...m, { name: d.name.trim(), classic: [false], plus: [false], on: true }])
    setDrafts((ds) => ds.filter((x) => x.id !== d.id))
  }

  return (
    <Shell step={6} subtitle="Health · Star Health" aside={<SourceViewer kind="features" />} overlay={overlay}>
      <StepCard
        title="6 · Features"
        subtitle="Standard features are included. Tick the AI suggestions this product offers, and add your own."
        chip={autoChip}
      >
        <AiBanner count={`${count} ticked`} bar="425px" />
        {extraDividers && <><Divider /><Divider /></>}

        <Section
          title="Included in every Health product"
          subtitle="Standard features for this category, added to the package automatically"
          right={<Chip tone="green" icon="lock">{standardFeatures.length} included</Chip>}
        />
        <div className="flex flex-wrap gap-2">
          {standardFeatures.map((f) => (
            <span key={f} className="flex h-[38px] items-center gap-2 rounded-[14px] border border-[#c7ebda] bg-[#f5fbf8] pr-3 pl-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]">
                <Icon name="check" size={11} />
              </span>
              <span className="text-[12px] font-semibold text-ink">{f}</span>
              <Icon name="lock" size={12} className="text-[#7fa894]" />
            </span>
          ))}
        </div>

        <Divider />
        <Section
          title="AI-suggested features"
          subtitle="From the brochure. Tick a box to add the feature to this product."
          right={<span className="text-[13px] font-bold text-violet">{count} selected</span>}
        />
        <div className="flex h-4 gap-3 pr-2.5 pl-3 text-[11px] font-bold tracking-[0.4px] text-muted">
          <span className="w-6" />
          <span className="w-[232px]">FEATURE</span>
          <span className="w-[140px]">CLASSIC</span>
          <span className="w-[140px]">PLUS</span>
        </div>

        {aiFeatures.map((f) => {
          const on = ticked.has(f.name)
          const fixed = corrected && !!f.corrected
          const plus = fixed ? [f.plus[0], f.corrected] : f.plus
          return (
            <div
              key={f.name}
              className={cx(ROW, fixed ? 'border-[#c7ebda] bg-[#f5fbf8]' : on ? 'border-[#c9daf8] bg-[#f5f9ff]' : 'border-line bg-white')}
            >
              <Box checked={on} onChange={() => toggle(f.name)} />
              <div className="flex w-[232px] shrink-0 flex-col gap-[3px]">
                <span className={cx('text-[13px] leading-4 font-bold', on ? 'text-ink' : 'text-ink-2')}>{f.name}</span>
                {fixed ? (
                  <span className="flex h-[14px] items-center gap-1 text-[11px] font-semibold text-[#127650]">
                    <Icon name="check" size={11} />
                    Corrected by you · {f.page}
                  </span>
                ) : (
                  <span className={cx('flex h-[14px] items-center gap-1 text-[11px] font-semibold', META_COLOR[f.conf])}>
                    <Icon name="sparkle" size={11} className="text-violet" />
                    AI suggestion · {f.conf} · {f.page}
                  </span>
                )}
              </div>
              <Cell cell={f.classic} />
              <Cell cell={plus} />
              <span className="flex-1" />
              {f.fix && !fixed && <Btn variant="outline" size="sm" icon="edit" to={R.featuresFix}>Fix</Btn>}
            </div>
          )
        })}

        <Divider />
        <Section title="Your features" subtitle="Things the brochure doesn’t list. Add as many as you need." />

        {mine.map((m, i) => (
          <div key={m.name + i} className={cx(ROW, 'border-[#c9daf8] bg-[#f5f9ff]')}>
            <Box checked={m.on} onChange={(v) => setMine((l) => l.map((x, j) => (j === i ? { ...x, on: v } : x)))} />
            <div className="flex w-[232px] shrink-0 flex-col gap-[3px]">
              <input
                defaultValue={m.name}
                className="h-8 rounded-[10px] border border-line bg-white px-2.5 text-[13px] font-semibold text-ink outline-none focus:border-2 focus:border-blue"
              />
              <span className="flex h-[14px] items-center gap-1 text-[11px] font-semibold text-blue">
                <Icon name="edit" size={11} />
                Added by you
              </span>
            </div>
            <Cell cell={m.classic} />
            <Cell cell={m.plus} />
            <span className="flex-1" />
            <RoundBtn icon="x" color="text-[#b4323c]" onClick={() => setMine((l) => l.filter((_, j) => j !== i))} aria-label="Remove feature" />
          </div>
        ))}

        {drafts.map((d) => (
          <div key={d.id} className={cx(ROW, 'border-[#c9daf8] bg-[#f5f9ff]')}>
            <Box checked />
            <div className="flex w-[232px] shrink-0 flex-col gap-[3px]">
              <input
                autoFocus={!adding}
                placeholder="Feature name"
                value={d.name}
                onChange={(e) => setDrafts((ds) => ds.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x)))}
                onKeyDown={(e) => e.key === 'Enter' && saveDraft(d)}
                className="h-[34px] rounded-[10px] border-2 border-blue bg-white px-2.5 text-[13px] font-semibold text-ink outline-none placeholder:text-faint"
              />
              <span className="flex h-[14px] items-center gap-1 text-[11px] font-semibold text-blue">
                <Icon name="edit" size={11} />
                Added by you
              </span>
            </div>
            <Cell cell={[false]} placeholder="Value" />
            <Cell cell={[false]} placeholder="Value" />
            <span className="w-px flex-1" />
            <Btn size="sm" icon="check" onClick={() => saveDraft(d)}>Save</Btn>
            <RoundBtn icon="x" color="text-[#b4323c]" onClick={() => setDrafts((ds) => ds.filter((x) => x.id !== d.id))} aria-label="Discard feature" />
          </div>
        ))}

        <button
          type="button"
          onClick={() => (adding ? setDrafts((ds) => [...ds, { id: Date.now(), name: '' }]) : navigate(R.featuresAdding))}
          className="flex h-[46px] shrink-0 items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#9db8ee] text-[13px] font-bold text-blue hover:bg-[#f7f9ff]"
        >
          <Icon name="plus" size={16} />
          Add feature
        </button>

        <StepFooter back={R.variants} mid="confirm" next={<Btn icon="arrow" to={R.review}>Next: Review</Btn>} />
      </StepCard>
    </Shell>
  )
}
