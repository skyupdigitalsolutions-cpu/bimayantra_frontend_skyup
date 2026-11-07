// Figma 73:9826 · AP1 · Add product — Category
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, StepCard, StepFooter, PreviewCard, Btn, Field, TextInput, Note, Chip, R } from './_parts'
import { categories as initial, previewByStep } from '../../data/flow-add-product'

export default function Category() {
  const [cats, setCats] = useState(initial)
  const [sel, setSel] = useState('health')
  const [draft, setDraft] = useState('')
  const add = () => {
    const label = draft.trim()
    if (!label) return
    const key = label.toLowerCase()
    setCats((c) => [...c, { key, label, icon: 'box', bg: 'bg-[#eef1f5]' }])
    setSel(key)
    setDraft('')
  }
  const selected = cats.find((c) => c.key === sel)

  return (
    <Shell step={1} subtitle="Add a product the catalogue does not have" aside={<PreviewCard values={previewByStep.category} />}>
      <StepCard title="1 · Product category" subtitle="Decides which features SkyUp’s template asks for">
        <div className="flex items-start gap-3">
          {cats.map((c) => {
            const on = c.key === sel
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSel(c.key)}
                className={cx('flex min-w-0 flex-1 basis-0 flex-col items-center gap-2.5 rounded-[24px] px-3 py-5', c.bg, on && 'basis-[5px] border-[2.5px] border-blue')}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-ink">
                  <Icon name={c.icon} size={26} />
                </span>
                <span className="text-[15px] font-bold text-ink">{c.label}</span>
                {on && <Chip tone="blue" icon="check">Selected</Chip>}
              </button>
            )
          })}
        </div>

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
            <Field label="New category name *" className="flex-1">
              <TextInput tone="white" placeholder="e.g. Pet insurance" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
            </Field>
            <Btn icon="plus" onClick={add}>Add category</Btn>
          </div>
        </div>

        <Note icon="list">
          {selected?.key === 'health' ? 'Health template: 10 features, from room rent to network hospitals.' : `${selected?.label} template: standard features for this category.`}
        </Note>

        <StepFooter back={R.products} backLabel="Cancel" next={<Btn icon="arrow" to={R.company}>Next: Company</Btn>} />
      </StepCard>
    </Shell>
  )
}
