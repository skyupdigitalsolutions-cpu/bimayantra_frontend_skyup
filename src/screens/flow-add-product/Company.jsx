// Figma 73:10040 · AP2 · Add product — Company
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, StepCard, StepFooter, PreviewCard, Btn, Field, TextInput, Chip, R } from './_parts'
import { insurerQuery, insurerResults, previewByStep } from '../../data/flow-add-product'
import { matches, NoMatches } from '../customer-tabs/_search'

export default function Company() {
  const [q, setQ] = useState(insurerQuery)
  const [list, setList] = useState(insurerResults)
  const [sel, setSel] = useState(insurerResults[0].name)
  const [draft, setDraft] = useState('')
  const term = q.trim().toLowerCase()
  // Name / type match, plus same-initial insurers as loose suggestions (as in the design: "Star" also offers Shriram)
  const results = list.filter((r) => !term || matches(term, r.name, r.meta) || r.initials.toLowerCase().startsWith(term.slice(0, 1)))
  const addNew = () => {
    const name = draft.trim()
    if (!name) return
    const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    setList((l) => [{ initials, name, meta: 'Added to your list', inList: true }, ...l])
    setSel(name)
    setQ(name)
    setDraft('')
  }

  return (
    <Shell step={2} subtitle="Health · Star Health" aside={<PreviewCard values={previewByStep.company} foot="Next: upload the brochure to fill the rest." />}>
      <StepCard title="2 · Insurance company" subtitle="Only insurers in the SkyUp catalogue">
        <Field label="Search the insurer library">
          <TextInput focused value={q} onChange={(e) => setQ(e.target.value)} leading={<Icon name="search" size={18} className="text-muted" />} />
        </Field>

        <div className="flex flex-col gap-0.5 rounded-[18px] border border-line bg-white p-2 shadow-[0px_14px_30px_-10px_rgba(19,41,75,0.1)]">
          <p className="px-2.5 py-1.5 text-[10px] leading-[13px] font-bold tracking-[0.4px] text-muted">IRDAI INSURER LIBRARY · {results.length} MATCHES</p>
          {!results.length && <NoMatches label={`No insurers match “${q.trim()}” — add it below`} onClear={() => setQ('')} />}
          {results.map((r) => {
            const on = r.name === sel
            return (
              <div key={r.name} onClick={() => setSel(r.name)} className={cx('flex cursor-pointer items-center gap-3 rounded-[12px] p-2.5', on ? 'bg-[#f3f7ff]' : 'hover:bg-panel-2')}>
                <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-panel text-[11px] font-bold text-ink">{r.initials}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="text-[13px] font-bold text-ink">{r.name}</span>
                  <span className="text-[11px] font-medium text-muted">{r.meta}</span>
                </div>
                {on ? (
                  <Chip tone="blue" icon="check">Selected</Chip>
                ) : (
                  <Btn variant="outline" size="sm" icon="plus" className="pr-3.5">Add from library</Btn>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] border border-[#c9daf8] bg-[#f7f9ff] p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-blue">
              <Icon name="plus" size={16} />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">Company not in the library?</p>
              <p className="text-[12px] font-medium text-muted">Type its name. It’s added only to your account.</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <Field label="New company name *" className="flex-1">
              <TextInput tone="white" placeholder="e.g. Galaxy Health Insurance Co. Ltd." value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNew()} />
            </Field>
            <Btn icon="plus" onClick={addNew}>Add company</Btn>
          </div>
        </div>

        <StepFooter back={R.category} next={<Btn icon="arrow" to={R.brochure}>Next: Brochure</Btn>} />
      </StepCard>
    </Shell>
  )
}
