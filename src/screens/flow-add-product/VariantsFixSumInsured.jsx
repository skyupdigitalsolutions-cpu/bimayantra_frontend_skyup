// Figma 137:17794 · AP4b · Add product — Fix value (Plus sum insured)
import Icon from '../../components/Icon'
import { VariantsStep } from './_steps'
import { FixDrawer, Field, TextInput, R } from './_parts'
import { fixes } from '../../data/flow-add-product'

const chev = <Icon name="chev-down" size={18} className="text-muted" />

export default function VariantsFixSumInsured() {
  const f = fixes.variants
  return (
    <VariantsStep
      adding={false}
      tightBottom
      overlay={
        <FixDrawer kind="variants" cancelTo={R.variants} saveTo={R.variants}>
          <div className="flex gap-3">
            <Field label="From *" className="flex-1"><TextInput defaultValue={f.from} trailing={chev} /></Field>
            <Field label="Up to *" className="flex-1"><TextInput focused defaultValue={f.to} trailing={chev} /></Field>
          </div>
        </FixDrawer>
      }
    />
  )
}
